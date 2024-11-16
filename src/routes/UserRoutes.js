// Require the necessary modules
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/AuthMiddleware');

// Require the controller functions
const { 
    loginUserController,
    registerUserController,
    addToFavoritesController,
    getAllFavoritesController
} = require('../controllers/UserController');


router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.post('/favorites', verifyToken, addToFavoritesController);
router.get('/favorites', verifyToken, getAllFavoritesController);


module.exports = router;