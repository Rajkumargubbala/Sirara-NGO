const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is too short"),
  message: z.string().min(3, "Message is too short"),
});

const volunteerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is too short"),
  areaOfInterest: z.string().min(1, "Please select an area of interest"),
  motivation: z.string().min(5, "Please provide more detail about your motivation"),
});

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

module.exports = {
  contactSchema,
  volunteerSchema,
  newsletterSchema
};
