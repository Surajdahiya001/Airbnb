const Model = require("../models/listing.js");
const review = require("../models/review.js");



// CREATE REVIEW ROUTE --->

module.exports.createReview = async(req, res) =>{

    let listing = await Model.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.auther = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Thanks for Review !");
    res.redirect(`/login/${listing._id}`);
}

// DESTORY REVIEW ROUTE --->

module.exports.destoryReview = async(req, res) =>{

    let { id, reviewId } = req.params;
    await Model.findByIdAndUpdate(id, {$pull : { review : reviewId }});
    await review.findById(reviewId);
    req.flash("success", " Review Deleted !");
    res.redirect(`/login/${ id }`);
    }