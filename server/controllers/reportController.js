const Report = require('../models/Report');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({}).sort({ year: -1, createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a report
// @route   POST /api/reports
// @access  Private/Admin
const createReport = async (req, res) => {
  try {
    const { title, type, year, fileUrl, publicId } = req.body;
    const report = await Report.create({
      title,
      type,
      year,
      fileUrl,
      publicId,
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (report) {
      await report.deleteOne();
      res.json({ message: 'Report removed' });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReports,
  createReport,
  deleteReport,
};
