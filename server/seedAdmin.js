const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await Admin.findOne({ email: 'admin@sitatra.org' });
    
    if (adminExists) {
      adminExists.password = 'admin123';
      await adminExists.save();
      console.log('Admin password reset to admin123');
    } else {
      await Admin.create({
        name: 'SITATRA Admin',
        email: 'admin@sitatra.org',
        password: 'admin123'
      });
      console.log('Admin created: admin@sitatra.org / admin123');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
