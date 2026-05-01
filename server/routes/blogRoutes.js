const express = require('express');
const router = express.Router();
const { getPosts, getPostBySlug, createPost, updatePost, deletePost } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.get('/:slug', getPostBySlug);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
