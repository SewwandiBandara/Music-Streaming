const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const songsDir = path.join(uploadsDir, 'songs');
const imagesDir = path.join(uploadsDir, 'images');

[uploadsDir, songsDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for songs
const songStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, songsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'song-' + uniqueSuffix + ext);
  }
});

// Storage configuration for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

// File filter for audio files
const audioFileFilter = (req, file, cb) => {
  const allowedTypes = /mp3|wav|ogg|m4a|flac/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed (mp3, wav, ogg, m4a, flac)'));
  }
};

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer for song uploads
const uploadSong = multer({
  storage: songStorage,
  fileFilter: audioFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Configure multer for image uploads
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Combined upload for songs with cover
const uploadSongWithCover = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'song') {
        cb(null, songsDir);
      } else if (file.fieldname === 'cover') {
        cb(null, imagesDir);
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const prefix = file.fieldname === 'song' ? 'song-' : 'image-';
      cb(null, prefix + uniqueSuffix + ext);
    }
  }),
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'song') {
      audioFileFilter(req, file, cb);
    } else if (file.fieldname === 'cover') {
      imageFileFilter(req, file, cb);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

module.exports = {
  uploadSong: uploadSong.single('song'),
  uploadImage: uploadImage.single('image'),
  uploadSongWithCover: uploadSongWithCover.fields([
    { name: 'song', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ])
};
