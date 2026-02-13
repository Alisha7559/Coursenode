const express=require("express")
const router=express.Router();
const reviewcontroller=require("../controllers/reviewcontroller")

// =================================
//          CREATE STUDENT
// =================================
router.post('/review',reviewcontroller.createReview)


// =================================
//          READ STUDENT
// =================================
router.get('/getreview/:id',reviewcontroller.findReview)


// =================================
//         UPDATE STUDENT
// =================================
router.put('/updatereview/:id',reviewcontroller.updateReview)


// =================================
//          DELETE STUDENT
// =================================
router.delete('/deletereview/:id',reviewcontroller.deleteReview)
module.exports =router