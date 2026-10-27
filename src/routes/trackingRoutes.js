const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// Log a user interaction with a course
router.post('/track', async (req, res) => {
    try {
        const { studentId, courseId, actionType } = req.body;
        
        if (!studentId || !courseId || !actionType) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        student.interactionHistory.push({
            courseId,
            actionType,
            timestamp: new Date()
        });

        await student.save();
        res.status(200).json({ message: "Interaction tracked successfully" });
    } catch (error) {
        console.error("Tracking Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update AI Profile (Interests, Skills, Role)
router.put('/profile/:id', async (req, res) => {
    try {
        const { learningInterests, desiredRole, currentSkills } = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id, 
            { $set: { learningInterests, desiredRole, currentSkills } },
            { new: true }
        );
        
        if (!student) return res.status(404).json({ message: "Student not found" });
        
        res.status(200).json({ message: "Profile updated successfully", student });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
