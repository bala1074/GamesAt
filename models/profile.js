// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var profileSchema = mongoose.Schema({
    email        : String,
    name         : String,
    nickname     : { type: String, default: "Nickname" },
    mobile       : { type:String, default:""},
    gender       : { type:String, default: "M"}
});

//model
var ProfileModel=mongoose.model("Profile",profileSchema);

module.exports=ProfileModel;