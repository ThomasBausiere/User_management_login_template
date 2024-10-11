const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = (req, res, next) => {
  const userObject = req.body;
  delete userObject._id;
  delete userObject._userId;

  // Vérification si le nom d'utilisateur ou l'email existent déjà
  User.findOne({ $or: [{ username: userObject.username }, { email: userObject.email }] })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.username === userObject.username) {
          return res.status(400).json({ message: 'Nom d\'utilisateur déjà utilisé.' });
        }
        if (existingUser.email === userObject.email) {
          return res.status(400).json({ message: 'Email déjà utilisé.' });
        }
      } else {
        // Si tout est bon, on procède au hashage et à la création de l'utilisateur
        bcrypt.hash(userObject.password, 10)
          .then(hash => {
            const user = new User({
              ...userObject,
              password: hash,
              userId: req.auth ? req.auth.userId : null
            });
            user.save()
              .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès !' }))
              .catch(error => res.status(400).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));
      }
    })
    .catch(error => res.status(500).json({ error }));
};

// Modification d'un utilisateur existant
exports.modifyUser = (req, res, next) => {
  const userObject = req.file ? { ...JSON.parse(req.body.user) } : { ...req.body };

  // Vérifie si le nom d'utilisateur ou l'email sont déjà utilisés par un autre utilisateur
  User.findOne({ _id: { $ne: req.params.id }, $or: [{ username: userObject.username }, { email: userObject.email }] })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: 'Nom d’utilisateur ou email déjà utilisé.' });
      }

      // Si tout est bon, on procède à la mise à jour
      User.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
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

// Vérification de la disponibilité du nom d'utilisateur
exports.checkUsername = (req, res, next) => {
  const { username } = req.params;
  const userId = req.auth.userId; // Utilisation de l'ID utilisateur décodé depuis le token

  User.findOne({ username: username, _id: { $ne: userId } })  // Exclut l'utilisateur actuel
    .then(user => {
      if (user) {
        return res.status(200).json({ available: false }); // Nom d'utilisateur déjà pris par quelqu'un d'autre
      } else {
        return res.status(200).json({ available: true });  // Nom d'utilisateur disponible
      }
    })
    .catch(error => res.status(500).json({ error }));
};

// Vérification de la disponibilité de l'email
exports.checkEmail = (req, res, next) => {
  const { email } = req.params;
  const userId = req.auth.userId; // Utilisation de l'ID utilisateur décodé depuis le token

  User.findOne({ email: email, _id: { $ne: userId } })  // Exclut l'utilisateur actuel
    .then(user => {
      if (user) {
        return res.status(200).json({ available: false }); // Email déjà utilisé par quelqu'un d'autre
      } else {
        return res.status(200).json({ available: true });  // Email disponible
      }
    })
    .catch(error => res.status(500).json({ error }));
};
