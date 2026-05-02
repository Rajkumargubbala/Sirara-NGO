const express = require('express');
const router = express.Router();
const { 
  submitContact, 
  submitVolunteer, 
  getContactSubmissions, 
  getVolunteerApplications,
  getDonations,
  getNewsletterSubscriptions,
  submitNewsletter,
  submitDonation,
  updateSubmissionStatus,
  deleteSubmission
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { contactSchema, volunteerSchema, newsletterSchema } = require('../utils/schemas');

router.post('/contact', validate(contactSchema), submitContact);
router.post('/volunteer', validate(volunteerSchema), submitVolunteer);
router.post('/donate', submitDonation);
router.post('/newsletter', validate(newsletterSchema), submitNewsletter);
router.get('/contact', protect, getContactSubmissions);
router.get('/volunteer', protect, getVolunteerApplications);
router.get('/donations', protect, getDonations);
router.get('/newsletter', protect, getNewsletterSubscriptions);
router.patch('/:type/:id', protect, updateSubmissionStatus);
router.delete('/:type/:id', protect, deleteSubmission);

module.exports = router;
