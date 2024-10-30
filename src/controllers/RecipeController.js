const RecipeModel = require('../models/RecipeModel');

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
    try {
        const createdRecipe = new RecipeModel(recipe);
        await createdRecipe.save();
        res.status(201).json(createdRecipe);
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



module.exports = {getAllRecipes, getOneRecipe, addRecipe, editRecipe};