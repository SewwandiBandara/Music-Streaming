const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  genres: [{
    type: String,
    trim: true
  }],
  verified: {
    type: Boolean,
    default: false
  },
  monthlyListeners: {
    type: Number,
    default: 0
  },
  followers: {
    type: Number,
    default: 0
  },
  socialLinks: {
    instagram: String,
    twitter: String,
    facebook: String,
    website: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
artistSchema.index({ name: 'text', genres: 'text' });

module.exports = mongoose.model('Artist', artistSchema);
