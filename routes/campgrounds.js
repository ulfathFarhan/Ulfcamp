var express = require("express");
var router = express.Router();
var Camp = require("../models/campground");
var middleware = require("../middleware"); 
//Index
router.get("/campgrounds",function(req,res){
     Camp.find({},function(err,allCampgrounds){
		 if(err){
			 console.log("wrong");
		 }else{
			 	res.render("campgrounds/campgrounds",{campgrounds :allCampgrounds,page:"campgrounds"});
		 }
	 });

});

//Create
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
	var name =req.body.name;
	var image =req.body.image;
	var description =req.body.description;
	var price =req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	};
	var newCampgrounds ={name:name,image:image,description:description,author:author,price:price};
	Camp.create(newCampgrounds,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			req.flash("Success","Campground added Successfull");
			res.redirect("/campgrounds");
		}
	});
});

//New
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
	
});

//Show
router.get("/campgrounds/:id",function(req,res){
	Camp.findById(req.params.id).populate("comments").exec(function(err,foundCampGround){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campGround:foundCampGround});
		}
	});
	});


//edit campgrounds
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Camp.findById(req.params.id,function(err,foundCampGround){
		  res.render("campgrounds/edit",{campground:foundCampGround});	
	});
});


//updates campgrounds

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){

	Camp.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});


//Destroy campgrounds

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
Camp.findByIdAndDelete(req.params.id,function(err){
	if(err){
		res.redirect("/campgrounds");
	}else{
		res.redirect("/campgrounds");
	}
});
});


//middleware
// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }


//checking ownership
// function checkCampgroundOwnership(req,res,next){
// 		//does the user logged in
// 		if(req.isAuthenticated()){
// 				Camp.findById(req.params.id,function(err,foundCampGround){
// 					if(err){
// 						res.redirect("back");
// 					}else{
// 						//does he owned this campgrounds
// 						if(foundCampGround.author.id.equals(req.user._id)){
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



module.exports =router;