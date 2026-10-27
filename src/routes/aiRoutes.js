const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// The URL of the Python AI Microservice
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Proxy /api/ai/recommend
router.post('/recommend', async (req, res) => {
    try {
        const response = await fetch(`${AI_SERVICE_URL}/api/ai/recommend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("AI Service Error:", error.message);
        // Fallback mock data if Python service is offline
        res.status(200).json({ 
            status: "success", 
            fallback: true,
            recommendations: [
                { id: "c101", title: "Machine Learning A-Z: AI, Python & R", category: "Data Science", matchScore: 92, reason: "Highly recommended fallback course based on your profile." },
                { id: "c102", title: "Complete Web Developer Bootcamp", category: "Web Development", matchScore: 88, reason: "Great foundational match." }
            ]
        });
    }
});

// Proxy /api/ai/chat
router.post('/chat', async (req, res) => {
    try {
        const userMsg = req.body.message ? req.body.message.toLowerCase() : "";

        // 1. Fetch ALL active courses to provide as Knowledge Context (RAG) to the AI
        const courses = await Course.find({}).select('_id courseName fees duration Level skills description totalSeats mode location modules category subcategory');
        
        let contextString = "";
        if (courses && courses.length > 0) {
            contextString = courses.map(c => {
                const modulesText = c.modules && c.modules.length > 0 ? c.modules.map(m => m.title).join(", ") : "None";
                return `Course ID: ${c._id}, Course Name: ${c.courseName}, Category: ${c.category || 'General'}, Subcategory: ${c.subcategory || 'General'}, Fee: ₹${c.fees || 'N/A'}, Duration: ${c.duration || 'N/A'}, Level: ${c.Level || 'All Levels'}, Skills Taught: ${(c.skills || []).join(', ')}, Description: ${c.description || 'N/A'}, Seats: ${c.totalSeats || 'N/A'}, Mode: ${c.mode || 'Online'}, Location: ${c.location || 'Online'}, Modules: ${modulesText}`;
            }).join("\n---\n");
        }

        // Attach DB context to the request body destined for the Python AI
        const payload = {
            message: req.body.message,
            context: contextString,
            profile: req.body.context === "general" ? null : req.body.context
        };

        const response = await fetch(`${AI_SERVICE_URL}/api/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("AI Chat Error:", error.message);
        const userMsg = req.body.message ? req.body.message.toLowerCase() : "";
        let response_msg = "I can help you find the best courses and map out your learning journey. Ask me about a specific course!";
        
        // Advanced offline dynamic fallback using the fetched Node.js DB courses
        try {
            // Include ALL requested fields in the query
            const courses = await Course.find({}).select('courseName fees duration Level skills description totalSeats mode location modules category subcategory');
            let foundMatch = false;

            // Helper to normalize strings for better matching (removes punctuation, spaces if needed)
            const normalize = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : "";
            const userMsgNormalized = normalize(userMsg);

            // --- NEW: MULTI-COURSE FILTERING LOGIC ---
            // Regex to match exact words to prevent 'it' from triggering on 'is it'
            const isItQuery = /\b(it|information technology|tech|technology)\b/i.test(userMsg);
            const isListQuery = ["which", "list", "what courses", "all courses", "show me", "list all"].some(w => userMsg.includes(w)) || userMsg.includes("medical") || userMsg.includes("business") || userMsg.includes("training") || isItQuery;
            
            if (isListQuery || userMsgNormalized.includes("online") || userMsgNormalized.includes("offline") || userMsg.includes("location") || userMsg.includes("fee")) {
                let matchedCourses = [];
                let responseGenerated = "";
                
                // ONLINE / OFFLINE FILTER
                if (userMsgNormalized.includes("online") || userMsgNormalized.includes("offline")) {
                    const targetMode = userMsgNormalized.includes("online") ? "online" : "offline";
                    for (let c of courses) {
                        if (c.mode && c.mode.toLowerCase() === targetMode) {
                            matchedCourses.push(c.courseName);
                        }
                    }
                    if (matchedCourses.length > 0) {
                        responseGenerated = `Here are the courses available in ${targetMode.charAt(0).toUpperCase() + targetMode.slice(1)} mode:\n\n- ` + matchedCourses.join("\n- ");
                    }
                }
                
                // CATEGORY FILTER OR GENERAL LIST ALL
                else if (/medic|doctor|mbbs|biology/i.test(userMsg) || /busines|managem|mba/i.test(userMsg) || /traini|teachi|educat/i.test(userMsg) || isItQuery || isListQuery) {
                    
                    let targetCategory = null;
                    if (isItQuery) targetCategory = "IT";
                    else if (/medic|doctor|mbbs|biology/i.test(userMsg)) targetCategory = "Medical";
                    else if (/busines|managem|mba/i.test(userMsg)) targetCategory = "Business";
                    else if (/traini|teachi|educat/i.test(userMsg)) targetCategory = "Training";

                    if (targetCategory) {
                        for (let c of courses) {
                            const searchStr = `${c.courseName} ${c.description || ""} ${c.skills ? c.skills.join(" ") : ""} ${c.category || ""} ${c.subcategory || ""}`.toLowerCase();
                            // Check target string within combined meta context
                            const targetLower = targetCategory.toLowerCase();
                            
                            // For IT, ensure it only triggers on exact boundary or if category is strictly "IT"
                            let isMatch = false;
                            if (targetLower === "it") {
                                if (/\b(it|technology|tech)\b/i.test(searchStr)) {
                                     isMatch = true;
                                }
                            } else if (searchStr.includes(targetLower)) {
                                isMatch = true;
                            }
                            
                            if (isMatch) {
                                // Check for dual inquiries (Category + Property)
                                if (userMsg.includes("duration") || userMsg.includes("time") || userMsg.includes("long")) {
                                    matchedCourses.push(`${c.courseName} (Duration: ${c.duration || 'N/A'})`);
                                } else if (userMsg.includes("fee") || userMsg.includes("cost") || userMsg.includes("price")) {
                                    matchedCourses.push(`${c.courseName} (Fee: ₹${c.fees || 'N/A'})`);
                                } else {
                                    matchedCourses.push(c.courseName);
                                }
                            }
                        }
                        
                        if (matchedCourses.length > 0) {
                            // Deduplicate array
                            matchedCourses = [...new Set(matchedCourses)];
                            responseGenerated = `Here are the ${targetCategory} related courses we offer:\n\n- ` + matchedCourses.join("\n- ");
                        } else {
                            responseGenerated = `We currently do not have any specialized ${targetCategory} courses available.`;
                        }
                    } else {
                        // Generic List All Courses
                        for (let c of courses) {
                            if (c.courseName) {
                                if (userMsg.includes("duration") || userMsg.includes("time") || userMsg.includes("long")) {
                                    matchedCourses.push(`${c.courseName} (Duration: ${c.duration || 'N/A'})`);
                                } else if (userMsg.includes("fee") || userMsg.includes("cost") || userMsg.includes("price")) {
                                    matchedCourses.push(`${c.courseName} (Fee: ₹${c.fees || 'N/A'})`);
                                } else {
                                    matchedCourses.push(c.courseName);
                                }
                            }
                        }
                        
                        if (matchedCourses.length > 0) {
                            matchedCourses = [...new Set(matchedCourses)];
                            responseGenerated = "Here are all the courses currently available on our platform:\n\n- " + matchedCourses.slice(0, 30).join("\n- ");
                        } else {
                            responseGenerated = "We currently don't have any courses listed.";
                        }
                    }
                }
                
                // LOCATION FILTER
                else if (userMsg.includes("location") || userMsg.includes("in ")) {
                    const stopWords = ["the", "a", "an", "located", "situated", "based"];
                    const words = userMsg.split(" ").filter(w => !stopWords.includes(w));
                    
                    let locTarget = null;
                    const inIdx = words.indexOf("in");
                    if (inIdx !== -1 && inIdx + 1 < words.length) {
                        locTarget = words[inIdx + 1];
                    }
                    if (locTarget) {
                        for (let c of courses) {
                            if (c.location && c.location.toLowerCase().includes(locTarget.toLowerCase())) {
                                matchedCourses.push(c.courseName);
                            }
                        }
                        if (matchedCourses.length > 0) {
                            responseGenerated = `Here are the courses available in **${locTarget.charAt(0).toUpperCase() + locTarget.slice(1)}**:\n\n- ` + matchedCourses.join("\n- ");
                        }
                    }
                }
                
                // FEE FILTER
                else if (userMsg.includes("fee") || userMsg.includes("cost") || userMsg.includes("price")) {
                    for (let c of courses) {
                        if (c.courseName && c.fees) {
                            matchedCourses.push(`${c.courseName} (Fee: ₹${c.fees})`);
                        } else if (c.courseName) {
                            matchedCourses.push(`${c.courseName} (Fee: N/A)`);
                        }
                    }
                    if (matchedCourses.length > 0) {
                         responseGenerated = "Here are the fees for our courses:\n\n- " + matchedCourses.join("\n- ");
                    }
                }
                
                if (responseGenerated) {
                    return res.status(200).json({ status: "success", fallback: true, response: responseGenerated });
                }
            }
            // --- END MULTI-COURSE FILTERING logic ---

            for (let c of courses) {
                if (c.courseName) {
                    const courseNormalized = normalize(c.courseName);
                    const nameParts = c.courseName.toLowerCase().split(/\s+/).filter(w => w.length > 3);
                    
                    // Match if exact normalized name is found, or if any significant key word is found in userMsg
                    // This creates tolerance for small spelling mistakes (typing "bpharm" or "b tech")
                    let isMatch = userMsgNormalized.includes(courseNormalized) || userMsg.includes(c.courseName.toLowerCase());
                    
                    if (!isMatch && nameParts.length > 0) {
                        // Fuzzy check: if user message includes a key identifying word of the course
                        isMatch = nameParts.some(word => userMsg.includes(word));
                    }
                    
                    // Specific Acronym Check for missing dots and spaces
                    if (!isMatch && courseNormalized.length >= 3) {
                       if (courseNormalized.includes("tech") || courseNormalized.includes("com")) {
                           if (userMsgNormalized.includes(courseNormalized)) {
                               isMatch = true;
                           }
                       }
                    }
                    
                    if (!isMatch) {
                        const acronyms = ["btech", "mtech", "bcom", "mcom", "bca", "mca", "bba", "mba", "mbbs"];
                        for (let acronym of acronyms) {
                            if (courseNormalized.includes(acronym) && userMsgNormalized.includes(acronym)) {
                                isMatch = true;
                                break;
                            }
                        }
                    }
                    
                    if (isMatch) {
                        foundMatch = true;
                        
                        if (userMsg.includes("fee") || userMsg.includes("price") || userMsg.includes("cost")) {
                            response_msg = `The fee for the '${c.courseName}' course is ₹${c.fees || 'N/A'}.`;
                        } else if (userMsg.includes("duration") || userMsg.includes("long") || userMsg.includes("time")) {
                            response_msg = `The duration of the '${c.courseName}' course is ${c.duration || 'N/A'}.`;
                        } else if (userMsg.includes("level") || userMsg.includes("hard")) {
                            response_msg = `The '${c.courseName}' course is designed for the ${c.Level || 'All Levels'} level.`;
                        } else if (userMsg.includes("skill") || userMsg.includes("learn")) {
                             response_msg = `In the '${c.courseName}' course, you will learn: ${(c.skills || []).join(', ')}.`;
                        } else if (userMsg.includes("seat") || userMsg.includes("capacity")) {
                             response_msg = `The total seat capacity for the '${c.courseName}' course is ${c.totalSeats || 'not specified'}.`;
                        } else if (userMsg.includes("mode") || userMsg.includes("online") || userMsg.includes("offline")) {
                             response_msg = `The '${c.courseName}' course is conducted in ${c.mode || 'Online'} mode.`;
                        } else if (userMsg.includes("location") || userMsg.includes("where")) {
                             response_msg = `The location for the '${c.courseName}' course is ${c.location || 'Online'}.`;
                        } else if (userMsg.includes("module") || userMsg.includes("syllabus") || userMsg.includes("topics")) {
                             if (c.modules && c.modules.length > 0) {
                                 const moduleNames = c.modules.map(m => m.title).join(", ");
                                 response_msg = `The '${c.courseName}' course includes the following modules: ${moduleNames}.`;
                             } else {
                                 response_msg = `There are no specific modules listed for the '${c.courseName}' course yet.`;
                             }
                        } else if (userMsg.includes("register") || userMsg.includes("enroll") || userMsg.includes("enquire") || userMsg.includes("apply") || userMsg.includes("join")) {
                             response_msg = `To register or enquire about the '${c.courseName}' course, please visit this link: /enquiry/${c._id}`;
                        } else {
                             response_msg = `Here is what I found about '${c.courseName}': ${c.description || 'No description available.'}`;
                        }
                        break;
                    }
                }
            }

            if (!foundMatch) {
                if (userMsg.includes("hi") || userMsg.includes("hello") || userMsg.includes("hey")) {
                    response_msg = "Hello there! I am your AI learning assistant. Ask me about the fee or duration of any specific course!";
                } else if (userMsg.includes("mbbs") || userMsg.includes("medical") || userMsg.includes("doctor")) {
                    response_msg = "If you're interested in the medical field or MBBS, we have specialized pre-med courses available. What details would you like to know?";
                }
            }
        } catch (dbError) {
             console.error("Offline DB Error:", dbError.message);
        }

        res.status(200).json({ status: "success", fallback: true, response: response_msg });
    }
});

// Proxy /api/ai/skill-gap
router.post('/skill-gap', async (req, res) => {
    try {
        const response = await fetch(`${AI_SERVICE_URL}/api/ai/skill-gap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("AI Skill Gap Error:", error.message);
        res.status(200).json({ 
            status: "success", 
            fallback: true,
            target_role: req.body.role || "Target Role",
            current_skills: req.body.skills || "",
            missing_skills: ["Advanced Frameworks (Mock gap)", "Database Optimization (Mock gap)"],
            recommended_courses: [1, 2]
        });
    }
});

module.exports = router;
