const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const PageContent = require('./models/PageContent');

async function checkContent() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const initiatives = await PageContent.findOne({ page: 'initiatives' });
    if (initiatives) {
      console.log('Initiatives Content Found');
      // Just check if sections exists
      console.log('Sections keys:', Object.keys(initiatives.sections || {}));
    } else {
      console.log('Initiatives Content NOT FOUND');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkContent();
