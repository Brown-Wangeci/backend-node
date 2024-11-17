const RecipeModel = require('../models/RecipeModel');
const UserModel = require('../models/UserModel');

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
const addRecipe = async (req, res) => {
    const recipe = req.body;
    recipe.creator = req.userId;
    const userId = req.userId;

    try {
        const createdRecipe = new RecipeModel(recipe);
        const savedRecipe = await createdRecipe.save();
        const user = await UserModel.findById(userId);
        user.createdrecipes.push(savedRecipe._id);
        await user.save();

        res.status(201).json(savedRecipe);

    } catch (error) {
        console.error(error.message);
        res.status(500).json(error.message);
    }
};


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



module.exports = {getAllRecipes, getOneRecipe, addRecipe, editRecipe, addMultipleRecipes};