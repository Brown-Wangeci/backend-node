// Require the necessary modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

// Require the controller functions
const { loginUserController, registerUserController} = require('../controllers/UserController');


router.get('/', (req, res)=>{});
router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.get('/set-cookies', (req, res)=>{});
router.get('/read-cookies', (req, res)=>{});


module.exports = router;