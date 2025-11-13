const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    default: null
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  // File storage information
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number, // in bytes
    required: true
  },
  format: {
    type: String, // mp3, wav, ogg, etc.
    required: true
  },
  bitrate: {
    type: Number, // in kbps
    default: 320
  },
  coverImage: {
    type: String,
    default: null
  },
  lyrics: {
    type: String,
    default: ''
  },
  explicit: {
    type: Boolean,
    default: false
  },
  // Analytics
  playCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  // Audio features (for recommendations)
  features: {
    tempo: Number, // BPM
    key: String, // Musical key
    mood: String, // happy, sad, energetic, calm, etc.
    energy: Number, // 0-100
    danceability: Number // 0-100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better search performance
songSchema.index({ title: 'text', genre: 'text' });
songSchema.index({ artist: 1, createdAt: -1 });
songSchema.index({ genre: 1, playCount: -1 });

// Method to increment play count
songSchema.methods.incrementPlayCount = async function() {
  this.playCount += 1;
  return await this.save();
};

module.exports = mongoose.model('Song', songSchema);
