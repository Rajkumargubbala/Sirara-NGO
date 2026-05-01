const Testimonial = require('../models/Testimonial');
const TeamMember = require('../models/TeamMember');

const getResources = (Model) => async (req, res) => {
  try {
    const data = await Model.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createResource = (Model) => async (req, res) => {
  try {
    const data = await Model.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateResource = (Model) => async (req, res) => {
  try {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteResource = (Model) => async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTestimonials: getResources(Testimonial),
  createTestimonial: createResource(Testimonial),
  updateTestimonial: updateResource(Testimonial),
  deleteTestimonial: deleteResource(Testimonial),
  getTeam: getResources(TeamMember),
  createTeamMember: createResource(TeamMember),
  updateTeamMember: updateResource(TeamMember),
  deleteTeamMember: deleteResource(TeamMember),
};
