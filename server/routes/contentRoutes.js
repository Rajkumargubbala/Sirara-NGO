const express = require('express');
const router = express.Router();
const { getPageContent, updatePageContent, patchPageContent, deletePageContent } = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:slug', getPageContent);
router.post('/:slug', protect, updatePageContent);
router.patch('/:slug', protect, patchPageContent);
router.delete('/:slug', protect, deletePageContent);

module.exports = router;
