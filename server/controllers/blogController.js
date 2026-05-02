const BlogPost = require('../models/BlogPost');

const getPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ publishedAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let post;
    
    // Check if it's a valid MongoDB ID first
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      post = await BlogPost.findById(slug);
    }
    
    // If not found by ID, try finding by slug
    if (!post) {
      post = await BlogPost.findOne({ slug });
    }

    if (post) res.json(post);
    else res.status(404).json({ message: 'Post not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPosts, getPostBySlug, createPost, updatePost, deletePost };
