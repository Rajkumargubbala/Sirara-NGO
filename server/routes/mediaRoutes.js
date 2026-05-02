const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// @desc    Upload an image
// @route   POST /api/media/upload
// @access  Private/Admin
router.post('/upload', protect, (req, res) => {
  upload.single('image')(req, res, (err) => {
    console.log('File received for upload:', req.file ? req.file.originalname : 'No file');
    if (err) {
      console.error('Cloudinary Upload Error:', err);
      return res.status(500).json({ 
        message: 'Cloudinary upload failed. Check your API credentials.',
        error: err.message 
      });
    }
    
    if (req.file) {
      res.json({
        url: req.file.path,
        id: req.file.filename,
      });
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  });
});

module.exports = router;
