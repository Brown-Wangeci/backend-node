const bcrypt = require("bcrypt");
const validator = require("validator");
const UserModel = require("../models/UserModel");
const generateToken = require('../utils/GenerateToken')

// Max age of the cookie
const maxAge = 3 * 24 * 60 * 60 * 1000;


const registerUserController = async (req, res) => {
    const { username, password, email} = req.body;
    
    try {

        // Confirm there is no existing user with the same username
        const user = await UserModel.findOne({username});
        if(user) return res.status(400).json({message: "Username already in Use"});
        
        
        // Confirm there is no existing user with the same email
        const emailExists = await UserModel.findOne({email});
        if(emailExists) return res.status(400).json({message: "Email already in use"});

        // Validate email
        if(!validator.isEmail(email)) return res.status(400).json({message: "Invalid email"});

        // Validate password
        if(!validator.isStrongPassword(password)) return res.status(400).json({message: "Password should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character."});

        // Hashing the password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new UserModel({username, password: hashedPassword, email});
        const savedUser = await newUser.save();

        
        // Create and send token
        const token = generateToken(savedUser._id);
        
        
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: maxAge
        });
        

        res.status(200).json({message: "User registered successfully", user: savedUser._id});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    
    try {

        if(!email || !password) return res.status(400).json({message: "Please fill in all fields"});

        // Find the user by email
        const user = await UserModel.findOne({email})
        if(!user) return res.status(400).json({message: "Invalid credentials"});

        // Confirm the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid credentials"});

        // Create and send token
        const token = generateToken(user._id);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: maxAge
        });


        res.status(200).json({message: 'Login successful', user: user._id});

        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {
    loginUserController,
    registerUserController
}