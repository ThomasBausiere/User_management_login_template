const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.signup = (req, res, next) => {
    // Vérifie si le nom d'utilisateur ou l'email sont déjà utilisés
    User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] })
      .then(existingUser => {
        if (existingUser) {
          if (existingUser.username === req.body.username) {
            return res.status(400).json({ message: 'Nom d\'utilisateur déjà utilisé.' });
          }
          if (existingUser.email === req.body.email) {
            return res.status(400).json({ message: 'Email déjà utilisé.' });
          }
        } else {
          // Si l'utilisateur n'existe pas, on continue avec le hashage du mot de passe et la création
          bcrypt.hash(req.body.password, 10)
            .then(hash => {
              const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
                createdAt: req.body.createdAt
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

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // Envoie du token au front-end
                    return res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id, username:user.username},
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
