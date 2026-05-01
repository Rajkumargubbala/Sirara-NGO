const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpxvj0n9r',
  api_key: process.env.CLOUDINARY_API_KEY || '679361877478335',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'g3_33q66J6_73_6_63_33_6_63_33', // Placeholder
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sitatra',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
