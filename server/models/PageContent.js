const mongoose = require('mongoose');

const sectionSchema = mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  content: String,
  imageUrl: String,
  videoUrl: String,
  ctaText: String,
  ctaLink: String,
  points: [String],
  statValue: String,
  statLabel: String,
  btn1Text: String,
  btn1Link: String,
  btn2Text: String,
  btn2Link: String,
  items: [mongoose.Schema.Types.Mixed], // For arrays like stats or features
  additionalData: mongoose.Schema.Types.Mixed, // For any other dynamic fields
});

const pageContentSchema = mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true, // home, about, contact, etc.
    },
    sections: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    meta: {
      title: String,
      description: String,
      keywords: String,
    },
  },
  {
    timestamps: true,
  }
);

const PageContent = mongoose.model('PageContent', pageContentSchema);

module.exports = PageContent;
