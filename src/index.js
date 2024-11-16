const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3001;


// Import Routes
const UserRoutes = require('./routes/UserRoutes');
const RecipeRoutes = require('./routes/RecipeRoutes');



// Create Server
const app = express();


// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));



// Routes
app.use('/users', UserRoutes);
app.use('/recipes', RecipeRoutes);


// Listen
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        app.listen( port, () => {
            console.log(`Server is running on port ${port}`)
        });
    })
    .catch((error)=>{
        console.log(error.message);
    });