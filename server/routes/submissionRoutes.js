const express = require('express');
const router = express.Router();
const { 
  submitContact, 
  submitVolunteer, 
  getContactSubmissions, 
  getVolunteerApplications,
  submitNewsletter
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { contactSchema, volunteerSchema, newsletterSchema } = require('../utils/schemas');

router.post('/contact', validate(contactSchema), submitContact);
router.post('/volunteer', validate(volunteerSchema), submitVolunteer);
router.post('/newsletter', validate(newsletterSchema), submitNewsletter);
router.get('/contact', protect, getContactSubmissions);
router.get('/volunteer', protect, getVolunteerApplications);

module.exports = router;
