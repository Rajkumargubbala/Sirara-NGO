const { ContactSubmission, VolunteerApplication, NewsletterSubscription, Donation } = require('../models/Submission');

// @desc    Submit contact form
// @route   POST /api/submissions/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    console.log('Received contact submission:', req.body);
    const submission = await ContactSubmission.create(req.body);
    res.status(201).json(submission);
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
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
// @desc    Submit donation
// @route   POST /api/submissions/donate
// @access  Public
const submitDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all donations
// @route   GET /api/submissions/donations
// @access  Private/Admin
const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// @desc    Get all newsletter subscriptions
// @route   GET /api/submissions/newsletter
// @access  Private/Admin
const getNewsletterSubscriptions = async (req, res) => {
  try {
    const subscriptions = await NewsletterSubscription.find().sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update submission status
// @route   PATCH /api/submissions/:type/:id
// @access  Private/Admin
const updateSubmissionStatus = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;
    
    let submission;
    if (type === 'contact') {
      submission = await ContactSubmission.findByIdAndUpdate(id, { status }, { new: true });
    } else if (type === 'donations') {
      submission = await Donation.findByIdAndUpdate(id, { status }, { new: true });
    } else if (type === 'newsletter') {
      submission = await NewsletterSubscription.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      submission = await VolunteerApplication.findByIdAndUpdate(id, { status }, { new: true });
    }

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:type/:id
// @access  Private/Admin
const deleteSubmission = async (req, res) => {
  try {
    const { type, id } = req.params;
    
    let result;
    if (type === 'contact') {
      result = await ContactSubmission.findByIdAndDelete(id);
    } else if (type === 'donations') {
      result = await Donation.findByIdAndDelete(id);
    } else if (type === 'newsletter') {
      result = await NewsletterSubscription.findByIdAndDelete(id);
    } else {
      result = await VolunteerApplication.findByIdAndDelete(id);
    }

    if (!result) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitContact,
  submitVolunteer,
  submitDonation,
  submitNewsletter,
  getContactSubmissions,
  getVolunteerApplications,
  getDonations,
  getNewsletterSubscriptions,
  updateSubmissionStatus,
  deleteSubmission,
};
