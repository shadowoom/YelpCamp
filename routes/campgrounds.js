var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//====================================
//Campgrounds routes
//====================================

//index route - show all campgrounds
router.get("/", function(req, res){
   //get all campgrounds from db
   Campground.find({}, function(err, allCampgrounds){
      if(err) {
          console.log(err);
      }
      else{
          res.render("campgrounds/index", {campgrounds:allCampgrounds, page: 'campgrounds'});
      }
   });
});

//create route -add a new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {id: req.user._id, username: req.user.username};
    var newCampground = {name: name, image: image, description: desc, price: price, author:author};
     // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            req.flash("error", "Campground creation failed");
            console.log(err);
            res.redirect("back");
        } else {
            //redirect back to campgrounds page
            req.flash("success", "Campground successfully created");
            res.redirect("/campgrounds");
        }
    });
})

//new route - show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new");
});


//show route - shows more info about a particular campground
router.get("/:id", function(req, res){
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground not found.");
            return res.redirect("/campgrounds");
        }
        console.log(foundCampground);
        //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err && !foundCampground) {
            req.flash("error", "Campground not found.");
            return res.redirect("back");
        }
        else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Campground failed to update");
            res.redirect("back");
        }
        else if(!updatedCampground){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success", "Campground is updated successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           req.flash("error", "Campground failed to delete");
           res.redirect("/campgrounds");
       }
       else{
           req.flash("success", "Campground is deleted successfully");
           res.redirect("/campgrounds");
       }
   }); 
});

module.exports = router;