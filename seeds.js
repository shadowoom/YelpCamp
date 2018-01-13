var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    
var data = [
    {
        name:"Nambwa Campsite", 
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQYIKT1qz9-7SLlkrjkwIzoSV9ejS975G-hTD2mSxYKKQGJMYm",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada feugiat varius. Vestibulum id lorem non massa pretium egestas. Aliquam erat volutpat. Phasellus aliquet varius mi, id lacinia nibh sodales in. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nam in hendrerit leo, a suscipit ipsum. Mauris in scelerisque turpis. Fusce nunc nisi, fringilla ac felis nec, rutrum mollis justo. Nunc ut velit quis urna ultricies vestibulum eget a dui. Nunc quis porta eros. Suspendisse vel blandit sapien, a pharetra tortor. Phasellus finibus metus et risus rhoncus dapibus."
    },
    {
        name:"NH STATE PARK CAMPGROUNDS", 
        image:"https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada feugiat varius. Vestibulum id lorem non massa pretium egestas. Aliquam erat volutpat. Phasellus aliquet varius mi, id lacinia nibh sodales in. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nam in hendrerit leo, a suscipit ipsum. Mauris in scelerisque turpis. Fusce nunc nisi, fringilla ac felis nec, rutrum mollis justo. Nunc ut velit quis urna ultricies vestibulum eget a dui. Nunc quis porta eros. Suspendisse vel blandit sapien, a pharetra tortor. Phasellus finibus metus et risus rhoncus dapibus."
    },
    {
        name:"Sutton Falls Camping Area", 
        image:"http://www.suttonfalls.com/communities/4/004/012/498/244//images/4628314067.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada feugiat varius. Vestibulum id lorem non massa pretium egestas. Aliquam erat volutpat. Phasellus aliquet varius mi, id lacinia nibh sodales in. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nam in hendrerit leo, a suscipit ipsum. Mauris in scelerisque turpis. Fusce nunc nisi, fringilla ac felis nec, rutrum mollis justo. Nunc ut velit quis urna ultricies vestibulum eget a dui. Nunc quis porta eros. Suspendisse vel blandit sapien, a pharetra tortor. Phasellus finibus metus et risus rhoncus dapibus."
    },
]
 
function seedDB(){
    //remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } 
        console.log("All campgrounds removed");
        //add new campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("added a campground.");
                    //create a comment
                    Comment.create({
                        text: "This place is great, but i wish there was internet",
                        author:"Homer"
                    }, function(err, comment){
                        if(err){
                            console.log(err)
                        }
                        else{
                            campground.comments.push(comment._id);
                            campground.save();
                            console.log("created a new comment");
                        }
                    });
                }
            });  
        });
    });
}

module.exports = seedDB;
