var Camp= require("../models/campground");
var Comment	=require("../models/comment");
	
//all meddilewares ae here
var middleObj ={};

middleObj.checkCampgroundOwnership =function(req,res,next){
		//does the user logged in
		if(req.isAuthenticated()){
				Camp.findById(req.params.id,function(err,foundCampGround){
					if(err){
						res.redirect("back");
					}else{
						   if (!foundCampGround) {//if some one tampered with same amount of id in the url
							req.flash("error", "Item not found.");
							return res.redirect("back");
                }
						//does he owned this campgrounds
						if(foundCampGround.author.id.equals(req.user._id)){
							next();
						}else{
							res.redirect("back");
						}
					}

		});
		}else{
			res.redirect("back");
		}

	
}



middleObj.checkCommentOwnership= function(req,res,next){
		//does the user logged in
		if(req.isAuthenticated()){
				Comment.findById(req.params.comment_id,function(err,foundComment){
					if(err){
						res.redirect("back");
					}else{
						   if (!foundComment) {
							req.flash("error", "Item not found.");
							return res.redirect("back");
                }
						//does he owned this campgrounds
						if(foundComment.author.id.equals(req.user._id)){
							next();
						}else{
							res.redirect("back");
						}
					}

		});
		}else{
			res.redirect("back");
		}

	
}



middleObj.isLoggedIn =function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","login first");
	res.redirect("/login");
}



module.exports= middleObj  