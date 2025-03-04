const User = require("../models/user.js");


// SIGNUP FORM ROUTE --->

module.exports.signUpForm = (req, res) => {

    res.render("./users/signup");
}

// SIGNUP POST ROUTE --->

module.exports.signUpPost = async (req, res) => {

    try {
        let { username, email, password } = req.body;
        const newuser = new User({ username, email });
        const registeruser = await User.register(newuser, password);
        req.login(registeruser, (e) => {

            if (e) {
                return next(e);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/login");
        })
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("./users/signup");
    }
}

// LOGIN FORM ROUTE --->

module.exports.loginForm = (req, res) => {

    res.render("./users/logedin.ejs");
}

// LOGIN POST ROUTE --->

module.exports.loginPost = async (req, res) => {

    req.flash("success", "Welcome back to Wanderlust");
    let saveurl = res.locals.redirecturl || "/login";
    res.redirect(saveurl);
}

// LOGOUT  ROUTE --->

module.exports.logout = (req, res, next) => {

    req.logout((e) => {

        if (e) {
            return next(e);
        }

        req.flash("success", "You Successfully LogedOut !");
        res.redirect("/login");
    })
}