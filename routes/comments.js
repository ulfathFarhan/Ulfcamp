var express  = require("express");
var router   = express.Router({mergeParams :true});
var Camp     =require("../models/campground");
var Comment = require("../models/comment");	
var middleware = require("../middleware"); 
	
/***************/ 
// COMMENTS ROUTE
/***************/ 

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
	Camp.findById(req.params.id,function(err,campground){
		if(err){
			req.flash("error","Something went wrong");
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:campground});
		}
	});
	
});
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
	Camp.findById(req.params.id,function(err,campground){
		if(err){
			req.flash("error","Something went wrong");
			console.log(err);
			res.redirect("/campgrounds")
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong");
					console.log(err);
				}else{
					console.log(comment);
					//add username and id to the comment
					comment.author.id  = req.user._id;
					comment.author.username =req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully addded your comment");
					res.redirect("/campgrounds/"+campground._id);
				}		   
		  })
		}
	});
		
});


//edit Comments
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if (err){
			req.flash("error","Something went wrong");
			res.redirect("back");
		}else{
			res.render("comments/edit",{campground_id:req.params.id , comment:foundComment });
		}
	});

});


//Update Comments
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComments){
		if (err){
			req.flash("error","Something went wrong");
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});

});


//Destroy Comments
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndDelete(req.params.comment_id,function(err){
		if (err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted successfully");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
	
});


//checking ownership
// function checkCommentOwnership(req,res,next){
// 		//does the user logged in
// 		if(req.isAuthenticated()){
// 				Comment.findById(req.params.comment_id,function(err,foundComment){
// 					if(err){
// 						res.redirect("back");
// 					}else{
// 						//does he owned this campgrounds
// 						if(foundComment.author.id.equals(req.user._id)){
// 							next();
// 						}else{
// 							res.redirect("back");
// 						}
// 					}

// 		});
// 		}else{
// 			res.redirect("back");
// 		}

	
// }

//middleware
// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

module.exports =router;
