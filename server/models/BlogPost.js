const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: "SITATRA Association" },
  category: { type: String, default: "News" },
  featuredImage: { type: String },
  publishedAt: { type: Date, default: Date.now },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
