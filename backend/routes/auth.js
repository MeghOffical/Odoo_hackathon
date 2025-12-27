const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.get('/users', authMiddleware, authorize('admin', 'manager'), authController.getAllUsers);

module.exports = router;
