const mongoose = require('mongoose');

const reportSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Annual', 'Financial'],
    },
    year: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
