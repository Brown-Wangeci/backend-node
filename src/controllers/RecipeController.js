const RecipeModel = require('../models/RecipeModel');
const UserModel = require('../models/UserModel');
const multer = require('multer');
const path = require('path');


// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Save with a unique timestamp
    },
});

const upload = multer({ storage: storage }).single('image'); // Single file upload (for image)












const getAllRecipes = async (req, res) => {
    try {
        const recipes = await RecipeModel.find({});
        res.status(200).json(recipes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
    }
};
const getOneRecipe = async (req, res) => {
    const recipeId = req.params.id;
    try {
        const recipe = await RecipeModel.findById(recipeId).populate('creator','username'); 
        res.status(200).json(recipe);
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
    }
};
// const addRecipe = async (req, res) => {
//     const recipe = req.body;
//     recipe.creator = req.userId;
//     const userId = req.userId;

//     try {
//         const createdRecipe = new RecipeModel(recipe);
//         const savedRecipe = await createdRecipe.save();
//         const user = await UserModel.findById(userId);
//         user.createdrecipes.push(savedRecipe._id);
//         await user.save();

//         res.status(201).json(savedRecipe);

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json(error.message);
//     }
// };


const editRecipe = async (req, res) => {
    const recipe = req.body;
    const recipeId = req.params.id;
    try {
        const updatedRecipe = await RecipeModel.findByIdAndUpdate(recipeId, recipe, {new: true});
        res.status(200).json(updatedRecipe);
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
    }
};



const addMultipleRecipes = async (req, res) => {
    const recipes = req.body;
    try {
        recipes.forEach(async recipe => {
            recipe.creator = req.userId;
            const createdRecipe = new RecipeModel(recipe);
            const savedRecipe = await createdRecipe.save();
            const user = await UserModel.findById(req.userId);
            user.createdrecipes.push(savedRecipe._id);
            await user.save();
        });
        res.status(201).json({message: 'Recipes added successfully'});
    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
    }
};














// Modified addRecipe function to handle form data
const addRecipe = async (req, res) => {
    // Handle file upload via multer
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error during file upload:', err);
        return res.status(500).json({ message: 'Error during file upload', error: err });
      }
  
      // Get recipe data from the body
      const { name, ingredients, instructions, category, method, cuisine, diet, course, note, mealtime, cookingtime, serving, budget, preptime } = req.body;
  
      // Handle uploaded file (image)
      const image = req.file ? req.file.path : null; // Store the file path if uploaded
  
      // Create the recipe object
      const recipe = {
        name,
        ingredients: JSON.parse(ingredients), // Ingredients are sent as JSON string from frontend
        instructions: JSON.parse(instructions), // Instructions are sent as JSON string from frontend
        category,
        method,
        cuisine,
        diet,
        course,
        note,
        mealtime,
        cookingtime,
        serving,
        budget,
        preptime,
        image, // Save the image path
      };
  
      recipe.creator = req.userId; // Assign the creator of the recipe
      const userId = req.userId;
  
      try {
        // Create a new recipe and save it
        const createdRecipe = new RecipeModel(recipe);
        const savedRecipe = await createdRecipe.save();
  
        // Update the user's created recipes list
        const user = await UserModel.findById(userId);
        user.createdrecipes.push(savedRecipe._id);
        await user.save();
  
        // Send the saved recipe back as a response
        res.status(201).json(savedRecipe);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error saving recipe', error: error.message });
      }
    });
  };














module.exports = {getAllRecipes, getOneRecipe, addRecipe, editRecipe, addMultipleRecipes};