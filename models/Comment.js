const mongoose=require("mongoose");

const commentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.TypeId.ObjectId,
        ref:"Users",
        required:true
    },
    post:{
        type:mongoose.Schema.typeId.ObjectId,
        ref:"Posts",
        required:true
    },
    text:{
        type:String,
        
    }
},{timestamp:true})