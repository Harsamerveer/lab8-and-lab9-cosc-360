const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');

// Apply multer middleware to expect a single file named 'image'
router.post('/signup', upload.single('image'), authController.signup);
router.post('/login', authController.login);

module.exports = router;