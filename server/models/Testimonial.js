const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  content: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, default: 5 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
