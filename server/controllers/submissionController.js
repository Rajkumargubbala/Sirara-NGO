const { ContactSubmission, VolunteerApplication, NewsletterSubscription } = require('../models/Submission');

// @desc    Submit contact form
// @route   POST /api/submissions/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const submission = await ContactSubmission.create(req.body);
    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Submit volunteer application
// @route   POST /api/submissions/volunteer
// @access  Public
const submitVolunteer = async (req, res) => {
  try {
    const application = await VolunteerApplication.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/submissions/contact
// @access  Private/Admin
const getContactSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all volunteer applications
// @route   GET /api/submissions/volunteer
// @access  Private/Admin
const getVolunteerApplications = async (req, res) => {
  try {
    const applications = await VolunteerApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit newsletter subscription
// @route   POST /api/submissions/newsletter
// @access  Public
const submitNewsletter = async (req, res) => {
  try {
    const subscription = await NewsletterSubscription.create(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  submitContact,
  submitVolunteer,
  submitNewsletter,
  getContactSubmissions,
  getVolunteerApplications,
};
