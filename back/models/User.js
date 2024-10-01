const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

userSchema.plugin(uniqueValidator);

// Export du modèle User
module.exports = mongoose.model('User', userSchema);
