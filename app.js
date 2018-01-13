var express               = require("express"),
    bodyParser            = require("body-parser"),
    methodOverride        = require("method-override"),
    mongoose              = require("mongoose"), 
    flash                 = require("connect-flash"), 
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    Campground            = require("./models/campground"),
    seedDB                = require("./seeds"),
    app                   = express();
 
//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");  
    

mongoose.connect("mongodb://localhost/yelp_camp_3");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database


//passport config
app.use(require("express-session")({
    secret: "YelpCamp Web Application",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//store use in res.locals
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//use router
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


//app listener - start server
app.listen(3000, "127.0.0.1", function(){
    console.log("Yelp Camp Server Has Started!")
});