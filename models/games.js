//import
var mongoose=require("mongoose");

//schema
var schemaGames=mongoose.Schema({
                                    email:{ type: String},
                                    title:{ type: String },
                                    location:{ type: String },
                                    description:{ type: String },
                                    time:{ type: Date },
                                    game:{ type: String },
                                    state:{ type: String },
                                    joins:[{type: String, unique: true}]
                                });
//joined:{ type: mongoose.Schema.Types.ObjectId, ref: 'profile'}
//model
var Games=mongoose.model("Games",schemaGames);

module.exports=Games;