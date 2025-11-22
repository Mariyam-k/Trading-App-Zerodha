const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
       lowercase: true,
        trim: true
    },
    password: { // We will store the HASHED password here
        type: String,
        required: true
    },
   
});

module.exports = mongoose.model('User', userSchema);