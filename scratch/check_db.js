const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const serverPath = 'c:/Users/Raj Kumar/Desktop/Sirara/server';
dotenv.config({ path: path.join(serverPath, '.env') });

const PageContent = require(path.join(serverPath, 'models/PageContent'));

async function checkContent() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const initiatives = await PageContent.findOne({ page: 'initiatives' });
    if (initiatives) {
      console.log('Initiatives Content Found:');
      console.log(JSON.stringify(initiatives, null, 2));
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
