const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser  = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();


// Import Routes
const UserRoutes = require('./routes/UserRoutes');
const RecipeRoutes = require('./routes/RecipeRoutes');



// Create Server
const app = express();


// Middlewares
app.use(cors({
    origin: 'https://cosyrecipes.netlify.app',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());



// Routes
app.use('/users', UserRoutes);
app.use('/recipes', RecipeRoutes);


// Listen
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        app.listen( process.env.PORT || 3001, ()=>{console.log('Server Listening....')});
    })
    .catch((error)=>{
        console.log(error.message);
    });