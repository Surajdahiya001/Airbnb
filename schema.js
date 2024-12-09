const Joi = require('joi');


module.exports.listingSchema = Joi.object({

    listing: Joi.object({

        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("", null),
        country : Joi.string().required(),
        

    }).required(),
})


module.exports.reviewSchema = Joi.object({

    review : Joi.object({
 
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),

    }).required(),
})

// // And change the schema.js 
// const Joi = require('joi');

// // Joi Schema for Listing Validation
// module.exports.listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         image: Joi.string().allow("", null), // Allows an empty string or null for the image field
//         country: Joi.string().required(),
//     }).required(),
// });

// // Joi Schema for Review Validation
// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required().min(1).max(5),
//         comment: Joi.string().required(), // Fixed case from 'Comment' to 'comment' to match typical usage
//     }).required(), // Added missing parentheses for `.required()`
// });
