const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await Admin.findOne({ email: 'admin@sitara.org' });
    
    if (adminExists) {
      adminExists.password = 'admin123';
      await adminExists.save();
      console.log('Admin password reset to admin123');
    } else {
      await Admin.create({
        name: 'Sitara Admin',
        email: 'admin@sitara.org',
        password: 'admin123'
      });
      console.log('Admin created: admin@sitara.org / admin123');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
