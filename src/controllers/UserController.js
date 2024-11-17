const bcrypt = require("bcrypt");
const validator = require("validator");
const UserModel = require("../models/UserModel");
const { generateToken } = require('../utils/GenerateToken');

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
        if(!validator.isStrongPassword(password)) return res.status(400).json({message: "Password must be at least 8 characters, with one uppercase letter, one lowercase letter, one number, and one special character."});

        // Hashing the password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new UserModel({username, password: hashedPassword, email});
        const savedUser = await newUser.save();

        
        // Create and send token
        const token = generateToken(savedUser._id);

        res.status(200).json({ 
            message: "User registered successfully", 
            user: savedUser._id, 
            token
        });

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


        res.status(200).json({ 
            message: 'Login successful', 
            user: user._id,
            token
        });
        

        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const createdRecipesController = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).populate('createdrecipes');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ createdrecipes: user.createdrecipes });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get created recipes' });
    }
};


const addToFavoritesController = async (req, res) => {
    const { recipeId, isFavorite } = req.body;

    try {
        const user = await UserModel.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (isFavorite) {
            if (!user.favoriterecipes.includes(recipeId)) {
                user.favoriterecipes.push(recipeId);
            }
        } else {
            user.favoriterecipes = user.favoriterecipes.filter(id => id.toString() !== recipeId);
        }

        await user.save();
        res.status(200).json({ success: true, favoriterecipes: user.favoriterecipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update favorite recipes' });
    }
}


const getAllFavoritesController = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).populate('favoriterecipes');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json( user.favoriterecipes );
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get favorite recipes' });
    }
};


module.exports = {
    loginUserController,
    registerUserController,
    addToFavoritesController,
    getAllFavoritesController,
    createdRecipesController
}