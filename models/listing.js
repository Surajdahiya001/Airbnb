const mongoose = require('mongoose');
const review = require('./review');
// const User = require('./user');
const { ref, string } = require('joi');
const Schema = mongoose.Schema;


const listingSchema = new Schema({

    title: String,
    description: String,


    image: {
        filename: String,
        url: String,

        // set: (v) => v === "" ? "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60S" : v,
    },

    price: Number,
    location: String,
    country: String,

    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    owner: {

        type: Schema.Types.ObjectId,
        ref: "User",
    },

    category : {
        type: String,
        enum : ["Trending", "Rooms", "City", "Mountain", "Castle", "Pools", "Camping", "Farms", "Arctic", "Boats", "Lakes", "New" ],
    },

}


);


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const listing = mongoose.model("listing", listingSchema);


module.exports = listing;


