const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Vérifier que le token est présent dans le header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentification échouée, token manquant.' });
    }

    // Décoder le token avec la clé secrète
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    // Attacher l'userId au req pour les prochaines middlewares/routes
    req.auth = { userId };
    
    next(); // Passer au middleware suivant
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré.', error });
  }
};
