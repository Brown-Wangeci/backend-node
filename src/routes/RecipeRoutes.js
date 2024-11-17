// Require the necessary modules
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/AuthMiddleware');


// Require the controller functions
const { 
    getAllRecipes,
    getOneRecipe,
    addRecipe,
    editRecipe,
    addMultipleRecipes
} = require('../controllers/RecipeController');


router.get('/', getAllRecipes);
router.post('/', verifyToken, addRecipe);
router.get('/:id', getOneRecipe);
router.patch('/:id', verifyToken, editRecipe);
router.post('/bulk', verifyToken, addMultipleRecipes);


module.exports = router;