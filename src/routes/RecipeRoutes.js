// Require the necessary modules
const express = require('express');
const router = express.Router();

// Require the controller functions
const {getAllRecipes, getOneRecipe, addRecipe, editRecipe} = require('../controllers/RecipeController');


router.get('/', getAllRecipes);
router.post('/', addRecipe);
router.get('/:id', getOneRecipe);
router.patch('/:id', editRecipe);


module.exports = router;