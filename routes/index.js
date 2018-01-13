var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var User       = require("../models/user");
var passport   = require("passport");

//Root Route
router.get("/", function(req, res){
   res.render("landing"); 
});

//====================================
//Authentication routes
//====================================

//show sign up form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handling user sign up
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // req.flash("error", err.message);
            // return res.redirect('/register');
            console.log(err);
            return res.render("register", {error: err.message});
        }
        //authentication local strategy
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.username);
           res.redirect("/campgrounds");
        });
    });
});

// LOGIN ROUTES
//render login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res){
});

//logout
router.get("/logout", function(req, res){
    //remove user data in the session
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

module.exports = router;
