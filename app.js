var express               = require("express");
var app                   = express();
var bodyPaser             = require("body-parser");
var mongoose              = require("mongoose");
var methodOverride        = require ("method-override");
var Camp                  = require("./models/campground");
var Comment               = require("./models/comment");
var User                  = require("./models/user");
var seedDb                = require ("./seed");
var passport              = require ("passport");
var localStrategy         = require ("passport-local");
var flash                 = require("connect-flash");
// seedDb();//see the database

var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require ("./routes/comments"),
	indexRoutes      = require("./routes/index");


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"IM a Muslim",
	resave :false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use (methodOverride("_method"));
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//flash
app.use(flash());
// mongoose.connect("mongodb://localhost:27017/ulf_camp" ,{ useNewUrlParser: true , useUnifiedTopology: true });
 mongoose.connect("mongodb+srv://ulfath_farhan:Nabiha@2008@cluster0.ypv5j.mongodb.net/UlfCamp?retryWrites=true&w=majority",{ useNewUrlParser: true , useUnifiedTopology: true });

//App config
app.use(bodyPaser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use( function (req,res,next){
	res.locals.currentUser =req.user;//check a user already logged in or not ans retireve his name
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);



// Camp.create(
// 	{
// 	name:"Thinesh Peek",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSjWckFjfgt7mAqHClkxujqq2XVJLQvUwkzuhCk2tY2tB3lMneE&usqp=CAU",description:"One of the major camping sites in Uttaranchal, Kaudiyala attracts adventure seekers from all around the globe. The place is also a kind of stopover en-route the Kedarnath trek. Many pilgrims and visitors camp at Kaudiyala at the lower base of Himalayas. It is located at an altitude of 480 meters and is based on the banks of the holy river Ganga. Therefore, treat your eyes with the scenic beauty and camp in an ideal way."
// 	}
// 	,function(err,camp){
// 		if (err){
// 			console.log(err);
// 		}else{
// 			console.log(camp);
// 		}
// 	});



app.listen(process.env.PORT||4000,process.env.IP,function(){
	
	console.log("UlfCamp has started!!!");
});