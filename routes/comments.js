var express    = require("express");
var router     = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");


//====================================
//Comment routes
//====================================

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } 
       else{
           res.render("comments/new", {campground:foundCampground});
       }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
    //look up campground with id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
             //create new comment
             Comment.create(req.body.comment, function(err, newComment){
                 if(err){
                     req.flash("error", "Comment creation failed");
                     console.log(err);
                 }
                 else{
                     //add username and id to comment
                     newComment.author.id = req.user._id;
                     newComment.author.username = req.user.username;
                     //save comment
                     newComment.save();
                     foundCampground.comments.push(newComment._id);
                     foundCampground.save();
                     var redirectUrl = "/campgrounds/" + foundCampground._id;
                     req.flash("success", "Successfully added comment");
                     res.redirect(redirectUrl);
                 }
             });
        }
    })
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err || !foundComment){
          req.flash("error", "Comment not found.");
          res.redirect("back");
      } else {
          res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});  
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership,  function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
           req.flash("error", "Comment failed to update");
          res.redirect("back");
      } 
      else if(!updatedComment){
         req.flash("error", "Comment not found.");
        return res.redirect("back"); 
      }
      else{
            req.flash("success", "Comment successfully updated");
            res.redirect("/campgrounds/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           req.flash("error", "Comment failed to delete");
           res.redirect("back");
       } else {
            req.flash("success", "Comment deleted successfully");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

module.exports = router;