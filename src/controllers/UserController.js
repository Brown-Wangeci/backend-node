const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");


const registerUserController = async (req, res) => {
    const { username, password, ...rest} = req.body;
    
    try {

        // Confirm there is no existing user with the same username
        const user = await UserModel.findOne({username});
        if(user) return res.status(400).json({message: "User already exists!!"});


        // Hashing the password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new UserModel({username, password: hashedPassword, ...rest});
        await newUser.save();

        res.json({message: "User created successfully"});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Confirm the user exists
        const user = await UserModel.findOne({email})
        if(!user) return res.status(400).json({message: "User does not exist"});

        // Confirm the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid credentials"});

        // Create and send token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        res.cookie('access_token', token, {
            httpOnly: true,
            // secure: true,
            // sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24,
        })


        // res.status(200).json({ message: 'Login successful' });
        res.status(200).json({token, user: {id: user._id, username: user.username}});

        
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    loginUserController,
    registerUserController
}