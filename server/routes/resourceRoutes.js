const express = require('express');
const router = express.Router();
const { 
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getTeam, createTeamMember, updateTeamMember, deleteTeamMember,
  getGallery, createGallery, updateGallery, deleteGallery
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

// Gallery
router.get('/gallery', getGallery);
router.post('/gallery', protect, createGallery);
router.put('/gallery/:id', protect, updateGallery);
router.delete('/gallery/:id', protect, deleteGallery);

module.exports = router;
