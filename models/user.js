const mongoose=require('mongoose');
var Schema=mongoose.Schema
var userschema=new Schema ({
    ID:Number,
    Nom:{
        type:String
    },
    Prenom:{
        type:String
    },
    Address:{type:String},
    Mail: {type:String},
    Telephone:{ type:Number}


});
module.exports=mongoose.model('users',userschema)