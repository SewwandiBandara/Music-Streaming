const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
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
  coverImage: {
    type: String,
    default: null
  },
  releaseDate: {
    type: Date,
    required: true
  },
  genre: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['album', 'single', 'ep', 'compilation'],
    default: 'album'
  },
  totalTracks: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  label: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
albumSchema.index({ title: 'text', genre: 'text' });

module.exports = mongoose.model('Album', albumSchema);
