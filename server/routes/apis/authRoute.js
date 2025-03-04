const express = require('express');
const { registerUser, loginUser } = require('../../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', registerUser); // Register user
router.post('/login', loginUser);       // Login user

module.exports = router;
