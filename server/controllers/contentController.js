const PageContent = require('../models/PageContent');

// @desc    Get page content by slug
// @route   GET /api/content/:slug
// @access  Public
const getPageContent = async (req, res) => {
  try {
    const content = await PageContent.findOne({ page: req.params.slug });
    if (content) {
      res.json(content);
    } else {
      res.status(404).json({ message: 'Page content not found' });
    }
  } catch (error) {
    console.error(`Error fetching content for ${req.params.slug}:`, error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message,
      stack: error.stack 
    });
  }
};

// @desc    Update or create page content
// @route   POST /api/content/:slug
// @access  Private/Admin
const updatePageContent = async (req, res) => {
  try {
    const { sections, meta } = req.body;
    const page = req.params.slug;

    let content = await PageContent.findOne({ page });

    if (content) {
      if (sections) {
        content.set('sections', sections);
        content.markModified('sections');
      }
      if (meta) {
        content.meta = meta;
      }
      await content.save();
    } else {
      content = await PageContent.create({
        page,
        sections,
        meta,
      });
    }

    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Patch specific sections of page content
// @route   PATCH /api/content/:slug
// @access  Private/Admin
const patchPageContent = async (req, res) => {
  try {
    const { sections } = req.body;
    const page = req.params.slug;

    const content = await PageContent.findOne({ page });

    if (content) {
      // Merge sections
      content.sections = new Map([...content.sections, ...new Map(Object.entries(sections))]);
      await content.save();
      res.json(content);
    } else {
      res.status(404).json({ message: 'Page content not found' });
    }
  } catch (error) {
    console.error('Error patching content:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete page content
// @route   DELETE /api/content/:slug
// @access  Private/Admin
const deletePageContent = async (req, res) => {
  try {
    const result = await PageContent.findOneAndDelete({ page: req.params.slug });
    if (result) {
      res.json({ message: 'Page content deleted' });
    } else {
      res.status(404).json({ message: 'Page content not found' });
    }
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPageContent,
  updatePageContent,
  patchPageContent,
  deletePageContent,
};
