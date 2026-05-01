const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// @desc    Upload an image
// @route   POST /api/media/upload
// @access  Private/Admin
router.post('/upload', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      url: req.file.path,
      id: req.file.filename,
    });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

module.exports = router;
