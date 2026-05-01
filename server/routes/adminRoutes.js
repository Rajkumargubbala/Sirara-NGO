const express = require('express');
const router = express.Router();
const { authAdmin, registerAdmin, logoutAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.post('/logout', logoutAdmin);
router.post('/register', registerAdmin);

module.exports = router;
