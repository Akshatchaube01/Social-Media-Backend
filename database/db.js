const mongoose=require("mongoose");

const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected successfully !")
    }
    catch(error){
        console.log("Databse is not found !",error);
    }
}

module.exports=connectDB;
