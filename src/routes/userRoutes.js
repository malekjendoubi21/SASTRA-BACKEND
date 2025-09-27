const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// Routes protégées (admin seulement)
router.post('/', auth, adminOnly, createUser);
//router.get('/', auth, adminOnly, getUsers);
router.get('/',  getUsers);

router.get('/:id', auth, adminOnly, getUserById);
router.put('/:id', auth, adminOnly, updateUser);
router.delete('/:id', auth, adminOnly, deleteUser);

module.exports = router;
