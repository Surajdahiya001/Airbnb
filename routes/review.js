const express = require("express");
router = express.Router({mergeParams : true});
const Model = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErr = require("../utils/ExpressErr.js");
const { reviewSchema } = require("../schema.js");
const review = require("../models/review.js");
const { Loggedin,validateReview } = require("../middleware/middleware.js");


const ReviewController = require("../controllers/review.js");


// CREATE REVIEW ROUTE ---> 

router.post("/",Loggedin, validateReview ,  wrapAsync(ReviewController.createReview));

// DELETE REVIEW ROUTE --->  

router.delete("/:reviewId",Loggedin, wrapAsync(ReviewController.destoryReview));



module.exports = router;