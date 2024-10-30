const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[ true, 'Please enter a recipe name.' ]
    },
    ingredients: [
        { type: String, required: true }
    ],
    instructions: [
        { type: String, required: true }
    ],
    category: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    diet: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    mealtime: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    cookingtime: {
        type: Number,
        required: true
    },
    serving: {
        type: Number,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    preptime: {
        type: Number,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
    
},{timestamps: true});

const RecipeModel = mongoose.model('Recipe', RecipeSchema);
module.exports = RecipeModel;