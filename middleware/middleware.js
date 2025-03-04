const ExpressErr = require("../utils/ExpressErr.js");
const { listingSchema , reviewSchema} = require("../schema.js");

module.exports.Loggedin = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirecturl = req.originalUrl;
        req.flash("error", "You need to LoggedIn first   !");
        return res.redirect("/logedin");
    }
    next();
}

module.exports.saveredirecturl = (req,res,next)=>{

    if(req.session.redirecturl){

        res.locals.redirecturl = req.session.redirecturl;
    }
next();
}


// functon of handling new listing validation

module.exports.validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);
    console.log(error);

    if (error) {

        throw new ExpressErr(404, error);
    } else {

        next();
    }
}

// functon of handling review validation 

module.exports.validateReview = (req, res, next) =>{

    let {error} = reviewSchema.validate(req.body);

    if(error){
 
     throw new ExpressErr(404, error);
    } else{

        next();
    }
}

