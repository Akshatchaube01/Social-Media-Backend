const mongoose=require("mongoose");

const storySchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.TypeId.ObjectId,
        ref:"Users",
        required:true
    },
    text:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:String,
        required:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Story=mongoose.model("Story",storySchema);

module.exports=Story;