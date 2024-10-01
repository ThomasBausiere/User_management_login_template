const express =require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user')

mongoose.connect('mongodb+srv://M4Z:zP3de2q3qK9zL9NF@cluster0.9b85g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !')); 

const app = express();

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

app.use('/api/users', userRoutes);

module.exports = app;