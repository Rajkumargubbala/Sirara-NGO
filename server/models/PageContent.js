const mongoose = require('mongoose');

const sectionSchema = mongoose.Schema({
  title: String,
  subtitle: String,
  content: String,
  imageUrl: String,
  videoUrl: String,
  ctaText: String,
  ctaLink: String,
  additionalData: mongoose.Schema.Types.Mixed, // For any dynamic fields
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
      of: sectionSchema,
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
