if (process.env.NODE_ENV != "production") {

    require("dotenv").config();

}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Model = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErr = require("./utils/ExpressErr.js");
// const review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const user = require("./models/user.js");



const loginroute = require("./routes/login.js");
const reviewroute = require("./routes/review.js");
const userroute = require("./routes/user.js");
// const { cookie } = require("express/lib/response.js");

// MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("database connected")
    })
    .catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.listen(8080, () => {

    console.log("server working");
})


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);


const store = MongoStore.create({

    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }

}

store.on(("error"), ()=>{

    console.log("ERROR IN MONGO SESSION STORE", err);
})






app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/login", loginroute);
app.use("/login/:id/reviews", reviewroute);
app.use("/", userroute);

app.all("*", (req, res, next) => {

    next(new ExpressErr(404, "Page Not Found !"));
})


// custom error 

app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Somthing Went Worng !" } = err;

    res.status(statusCode).render("error.ejs", { message });

})