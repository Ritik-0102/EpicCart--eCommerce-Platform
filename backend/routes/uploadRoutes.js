// File upload routing: manages image uploads for product catalog media
const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure Multer to buffer files in memory before uploading to Cloudinary
const storage = multer.memoryStorage();

// File filter to restrict uploads to safe image MIME types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
  }
};

// Set 5MB size limit to prevent server memory exhaustion
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// Protect and admin middlewares ensure only authenticated administrators can upload product media
router.post('/', protect, admin, upload.single('image'), uploadImage);

module.exports = router;
