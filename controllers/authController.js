const User=require("../models/User");
const bcrypt=require("bcrypt");
const jwt= require("jsonwebtoken");
const express = require('express');

const registerController = async (req, res) => {
    try {
        const { password, username, email } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json("Username or email already present!");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hashSync(password, salt);
            const newUser = new User({ ...req.body, password: hashedPassword });
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

// const registerController= async(req,res)=>{
//     try {
//         const {password,username,email}=req.body
//         const existingUser=await User.findOne({ $or:[{username},{email}] })
//         if(existingUser){
//             res.status(400).json("Username or email already present ! ");
//         }

//         const salt=await bcrypt.genSalt(10);
//         const hashedPassword=await bcrypt.hashSync(password,salt);
//         const newUser= new User({...req.body,password:hashedPassword})
//         const savedUser= await newUser.save();
//         res.status(201).json(savedUser);
//         // const newUser = new User({
//         //     username: req.body.username,
//         //     email: req.body.email,
//         //     password: req.body.password,
//         //     fullName: req.body.fullName,
//         //     bio: req.body.bio
//         // });

//         // const savedUser = await newUser.save();
//         // res.status(201).json(savedUser);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// }

const loginController=async(req,res)=>{
    console.log("login entered");
    try{
        let user;
        if(req.body.email){
            user=await User.findOne({email:req.body.email});
        }
        else{
            user=await User.findOne({username:req.body.username});
        }
        
        if(!user){
            return res.status(404).json("User not found");
        }

        const match = await bcrypt.compare(req.body.password,user.password);

        if(!match){
            return res.status(401).json("Wrong credentials !")
        }

        const {password,...data}=user._doc
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
        res.cookie("token",token).status(200).json(data);

        // const token=jwt.sign({_id:user._id},"cdanckadn",{expiresIn:"3d"})
        console.log(token);
        // res.status(200).json(user);
    }
    catch(error){
        res.status(500).json(error);
    }
}

const logoutController=async(req,res)=>{
    try{
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).json("user logged out successfully !!");
    }
    catch(error){
        res.status(401).json(error);
    }
}

const refetchUserController=async(req,res)=>{
    const token=req.cookies.token;
    console.log("refetch wala " + req.cookies.token);
    jwt.verify(token,process.env.JWT_SECRET,{},async(err,data)=>{
        if(err){
            res.status(404).json(err);
        }
        else{
            try{
                const id=data._id;
                const user=await User.findOne({_id:id});
                res.status(200).json(user);
            }
            catch(error){
                res.status(500).json(error);
            }
        }
    });
}

module.exports={registerController,loginController,logoutController,refetchUserController};