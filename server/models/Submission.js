const mongoose = require('mongoose');

const contactSubmissionSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'unread' }, // unread, read, archived
  },
  { timestamps: true }
);

const volunteerApplicationSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    areaOfInterest: String,
    motivation: String,
    status: { type: String, default: 'pending' }, // pending, reviewed, accepted, rejected
  },
  { timestamps: true }
);

const NewsletterSubscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const donationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    amount: { type: Number },
    status: { type: String, default: 'pending' }, // pending, completed, failed
  },
  { timestamps: true }
);

const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);
const VolunteerApplication = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
const NewsletterSubscription = mongoose.model('NewsletterSubscription', NewsletterSubscriptionSchema);
const Donation = mongoose.model('Donation', donationSchema);

module.exports = { 
  ContactSubmission, 
  VolunteerApplication, 
  NewsletterSubscription,
  Donation 
};
