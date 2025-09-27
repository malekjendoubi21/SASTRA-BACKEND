const express = require('express');
const router = express.Router();
const {
    login,
    register,
    profile,
    forgotPasswordCode,
    resetPasswordWithCode,
    updatePassword,
    updateProfile
} = require('../controllers/AuthController');

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password-code', forgotPasswordCode);
router.post('/reset-password', resetPasswordWithCode);
router.put('/update-password', verifyToken, updatePassword);
router.put('/update-profile', verifyToken, updateProfile);
router.get('/profile', verifyToken, profile);

module.exports = router;
