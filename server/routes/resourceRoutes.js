const express = require('express');
const router = express.Router();
const { 
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getTeam, createTeamMember, updateTeamMember, deleteTeamMember 
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

// Testimonials
router.get('/testimonials', getTestimonials);
router.post('/testimonials', protect, createTestimonial);
router.put('/testimonials/:id', protect, updateTestimonial);
router.delete('/testimonials/:id', protect, deleteTestimonial);

// Team
router.get('/team', getTeam);
router.post('/team', protect, createTeamMember);
router.put('/team/:id', protect, updateTeamMember);
router.delete('/team/:id', protect, deleteTeamMember);

module.exports = router;
