// Multer configuration for file upload

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./CloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recipes',
    format: async () => 'webp',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Only image files are allowed!'), false); // Reject non-image files
        }
    },
});

module.exports = upload;
