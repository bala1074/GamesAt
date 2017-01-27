//import
var mongoose=require("mongoose");

//schema
var schemaMyGames=mongoose.Schema({
                                    email:{ type: String, unique: true },
                                    cricket:{ type: Number, default: 0},
                                    badminton:{ type: Number, default: 0},
                                    tabletennis:{ type: Number, default: 0},
                                    chess:{ type: Number, default: 0},
                                    bowling:{ type: Number, default: 0},
                                    gokarting:{ type: Number, default: 0},
                                    basketball:{ type: Number, default: 0}
                                });

//model
var MyGames=mongoose.model("MyGames",schemaMyGames);

module.exports=MyGames;