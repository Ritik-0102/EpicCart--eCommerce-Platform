const cloudinary = require('../config/cloudinary');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ 
        success: false, 
        message: 'Cloudinary configuration is missing on the server.' 
      });
    }

    // Wrap the upload_stream in a Promise
    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'epiccart/products',
            // Optional: specify allowed formats at the cloudinary level too
            allowed_formats: ['jpg', 'png', 'webp', 'jpeg']
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        // Pipe the multer memory buffer to Cloudinary
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadStream();

    res.status(200).json({
      success: true,
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height
      }
    });

  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    // If it's a multer error, it might be caught by error middleware, 
    // but we can also catch cloudinary specific errors here.
    res.status(500).json({ 
      success: false, 
      message: 'Image upload failed', 
      error: error.message || 'Unknown upload error' 
    });
  }
};

module.exports = {
  uploadImage
};

