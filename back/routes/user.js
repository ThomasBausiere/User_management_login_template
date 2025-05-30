const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const usersCtrl = require('../controllers/CRUD_User');
const auth = require('../middlewares/auth')


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/',  usersCtrl.createUser);

router.get('/', auth, usersCtrl.getAllUsers);
router.get('/:id', auth, usersCtrl.getOneUser);
router.get('/check-username/:username', auth, usersCtrl.checkUsername);
router.get('/check-email/:email', auth, usersCtrl.checkEmail);
router.put('/:id', auth, usersCtrl.modifyUser);
router.delete('/:id', auth, usersCtrl.deleteUser);



module.exports = router;