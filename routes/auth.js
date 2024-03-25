const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcrypt=require("bcrypt"); //used to encrypt passwords 
const jwt=require("jsonwebtoken");


// REGISTER
router.post("/register", async (req, res) => {
    try {
        const {password,username,email}=req.body
        const existingUser=await User.findOne({ $or:[{username},{email}] })
        if(existingUser){
            res.status(400).json("Username or email already present ! ");
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hashSync(password,salt);
        const newUser= new User({...req.body,password:hashedPassword})
        const savedUser= await newUser.save();
        res.status(201).json(savedUser);
        // const newUser = new User({
        //     username: req.body.username,
        //     email: req.body.email,
        //     password: req.body.password,
        //     fullName: req.body.fullName,
        //     bio: req.body.bio
        // });

        // const savedUser = await newUser.save();
        // res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

// LOGIN 
router.post("/login", async (req, res) => {
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
        // console.log(token);
        // res.status(200).json(user);
    }
    catch(error){
        res.status(500).json(error);
    }
});

// LOGOUT 
router.post("/logout",async (req, res) => {
    try{
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).json("user logged out successfully !!");
        
    }
    catch(error){
        res.status(401).json(error);
    }
});

// FETCH CURRENT USER
router.get("/current-user", (req, res) => {
    // Your logic to fetch the current user
});

module.exports = router;
