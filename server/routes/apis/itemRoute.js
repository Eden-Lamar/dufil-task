const express = require('express');
const { createItem, getItems } = require('../../controllers/itemController');
const { protect } = require('../../middlewares/authMiddleware');

const router = express.Router();

// Protected Routes
router.post('/', protect, createItem); // Create a new item for the logged in user
router.get('/', protect, getItems); // Get all items for the logged in user

module.exports = router;
