const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  socialLinks: {
    twitter: String,
    linkedin: String,
    instagram: String,
  },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
