const express = require("express");
router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveredirecturl } = require("../middleware/middleware.js");

const UserController = require("../controllers/user.js");


// SIGNUP FORM ROUTE --->

router.get("/signup", UserController.signUpForm);

// SIGNUP POST ROUTE --->

router.post("/signup", wrapAsync(UserController.signUpPost));

// LOGIN FORM ROUTE --->

router.get("/logedin", UserController.loginForm);

// LOGIN POST ROUTE --->

router.post("/logedin", saveredirecturl, passport.authenticate("local", { failureRedirect: "/logedin", failureFlash: true }), UserController.loginPost);

// LOGOUT ROUTE --->

router.get("/logout", UserController.logout);




module.exports = router;