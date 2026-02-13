
const bcrypt = require("bcrypt")
const Review = require("../models/review")

// =========createhandlers=============
exports.createReview = async (req, res) => {
    

    try {
        const {
            reviewid,
            //   studentid,
            //   courseid,
            //   rating,
            //   review_text,
            //   created_at
        } = req.body
       
        const review = await Review(
            {
                reviewid,
                //   studentid,
                //   courseid,
                //   rating,
                //   review_text,
                //   created_at

            })
        await review.save()


        res.status(201).send("Review saved successfully");
    } catch (error) {
        res.status(500).send("Error saving user");
    }
}
// =========gethandlers=============
exports.findReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).send("Review not found");
        }

        res.status(200).json(review);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


//======== update handler===============
exports.updateReview = async (req, res) => {
    try {
        const updatedreview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedreview) {
            return res.status(404).send("Review not found");
        }

        res.status(200).json({
            message: "Review updated successfully",
            data: updatedreview
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};




// ===========delete handler=================
exports.deleteReview = async (req, res) => {
    try {
        const deletedreview = await Review.findByIdAndDelete(req.params.id);

        if (!deletedreview) {
            return res.status(404).send("Review not found");
        }

        res.status(200).send("Review deleted successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

