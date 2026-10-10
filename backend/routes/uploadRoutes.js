const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to only allow specific image types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// Protect and admin middlewares ensure only admins can upload
router.post('/', protect, admin, upload.single('image'), uploadImage);

module.exports = router;

