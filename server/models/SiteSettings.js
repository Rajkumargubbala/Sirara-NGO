const mongoose = require('mongoose');

const navLinkSchema = mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const siteSettingsSchema = mongoose.Schema(
  {
    logo: String,
    favicon: String,
    siteName: { type: String, default: 'Sitara Association' },
    contactInfo: {
      address: String,
      phone: String,
      email: String,
      whatsapp: String,
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },
    navbarLinks: [navLinkSchema],
    globalSeo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
    },
    theme: {
      primaryColor: String,
      secondaryColor: String,
      darkModeEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

module.exports = SiteSettings;
