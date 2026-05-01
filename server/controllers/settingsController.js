const SiteSettings = require('../models/SiteSettings');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await SiteSettings.create({
        navbarLinks: [
          { name: "Home", href: "/", order: 1 },
          { name: "About", href: "/about", order: 2 },
          { name: "Initiatives", href: "/initiatives", order: 3 },
          { name: "Testimonials", href: "/testimonials", order: 4 },
          { name: "Gallery", href: "/gallery", order: 5 },
          { name: "Blog", href: "/blog", order: 6 },
          { name: "Contact", href: "/contact", order: 7 },
        ]
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (settings) {
      Object.assign(settings, req.body);
      await settings.save();
    } else {
      settings = await SiteSettings.create(req.body);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
