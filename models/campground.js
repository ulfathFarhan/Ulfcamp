//schema/mongoose/model config
var mongoose = require("mongoose");
var campGroundSchema = new mongoose.Schema({
	name:String,
	image:String,
	price :String,
	description :String,
	author :{
		id :{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"	
	},
		username : String
	},
	comments:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Comment"
	}]
});
module.exports =  mongoose.model("Camp",campGroundSchema);