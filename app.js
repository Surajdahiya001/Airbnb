const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Model = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErr = require("./utils/ExpressErr.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

main()
.then(() => {
    console.log("database connected")})
.catch((err) => {
    console.log(err)});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');}

app.listen(8080,()=>{

    console.log("server working");
})


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded ({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs",ejsMate);

app.get("/",(req,res)=>{

    res.send("this is root");
})


// functon of handling review validation

const validateListing = (req, res, next) =>{

    let {error} = listingSchema.validate(req.body);
console.log(error);

    if(error){
 
     throw new ExpressErr(404, error);
    } else{

        next();
    }
}

// functon of handling review validation 

const validateReview = (req, res, next) =>{

    let {error} = reviewSchema.validate(req.body);

    if(error){
 
     throw new ExpressErr(404, error);
    } else{

        next();
    }
}

app.get("/login",wrapAsync(async(req,res)=>
{
const alldatas = await Model.find({});

res.render("listing.ejs", { alldatas });
}))


app.get("/login/new",(req,res)=>{
res.render("form.ejs");
})

// create route


app.post("/login", validateListing, wrapAsync(async (req,res)=>
{
  
    // const {title,description,location,country,price} = req.body;
    let alldata  =  new Model(req.body.data);


// console.log(alldata);
   await alldata.save();
res.redirect("/login");
}))


// update route 

app.get("/login/:id/edit", validateListing, wrapAsync(async (req,res)=>{

    const {id} = req.params;
const data = await Model.findById(id);
    res.render("edit.ejs", { data });
}))

// edit

app.put("/login/:id", validateListing, wrapAsync(async(req,res)=>{
    const {id} = req.params;
   await   Model.findByIdAndUpdate(id, { ...req.body.data})
   res.redirect(`/login/${ id}`);
}))

// delete route

app.delete("/login/:id", wrapAsync(async(req,res)=>{

    const {id} = req.params;
  await  Model.findByIdAndDelete(id);
res.redirect("/login");
}))


// review rout 

app.post("/login/:id/reviews", validateReview,  wrapAsync(async(req, res) =>{

    let listing = await Model.findById(req.params.id);
    let newReview = new review(req.body.review);
    // console.log(newReview);
    listing.review.push(newReview);
    
    await newReview.save();
    await listing.save();
    
res.redirect(`/login/${listing._id}`);
}))



// reviews delete route 

app.delete("/login/:id/reviews/:reviewId",validateReview, wrapAsync(async(req, res) =>{

let { id, reviewId } = req.params;


await Model.findByIdAndUpdate(id, {$pull : { review : reviewId }});
await review.findById(reviewId);

res.redirect(`/login/${ id }`);

}))

//show route
app.get("/login/:id", wrapAsync(async (req,res)=>{

const {id} = req.params;
const data = await Model.findById(id).populate("review");

// console.log(data);
res.render("show.ejs",{data});
}))


app.all("*", (req,res, next) =>{

    next( new ExpressErr(404, "Page Not Found !"));
})


// custom error 

app.use((err, req, res, next) =>{

 let { statusCode =500, message = "Somthing Went Worng !"} = err;

 res.status(statusCode).render("error.ejs", { message });
// res.status(statusCode).send(message);
})