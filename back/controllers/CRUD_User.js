const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = (req, res, next) => {
  const userObject = req.body;

  // Suppression des champs inutiles
  delete userObject._id;
  delete userObject._userId;

  // Hashage du mot de passe avant de créer l'utilisateur
  bcrypt.hash(userObject.password, 10)  // Le "10" correspond au nombre de "salt rounds" (niveau de sécurité)
    .then(hash => {
      const user = new User({
        ...userObject,
        password: hash,  // On remplace le mot de passe en clair par le hash
        userId: req.auth ? req.auth.userId : null  // Vérification si req.auth existe
      });

      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// Modification d'un utilisateur existant
exports.modifyUser = (req, res, next) => {
  const userObject = req.file ? { ...JSON.parse(req.body.user) } : { ...req.body };
  
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      User.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

// Suppression d'un utilisateur
exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};

// Récupération d'un utilisateur par son ID
exports.getOneUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
};

// Récupération de tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({ error }));
};
