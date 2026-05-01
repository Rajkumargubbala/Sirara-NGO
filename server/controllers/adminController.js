const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const authAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for:', email);

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    const token = generateToken(admin._id);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Private (Only an existing admin can create another, but for initial setup we can make it public)
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400).json({ message: 'Admin already exists' });
    return;
  }

  const admin = await Admin.create({
    name,
    email,
    password,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid admin data' });
  }
};

// @desc    Logout admin & clear cookie
// @route   POST /api/admin/logout
// @access  Private
const logoutAdmin = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  authAdmin,
  registerAdmin,
  logoutAdmin,
};
