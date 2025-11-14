const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songs: [{
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  coverImage: {
    type: String,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  collaborative: {
    type: Boolean,
    default: false
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: Number, // in seconds
    default: 0
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
  shares: {
    type: Number,
    default: 0
  },
  // Privacy settings
  privacySettings: {
    isPublic: {
      type: Boolean,
      default: true
    },
    allowDownload: {
      type: Boolean,
      default: false
    },
    allowComments: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
playlistSchema.index({ name: 'text', description: 'text' });
playlistSchema.index({ owner: 1, createdAt: -1 });

// Calculate total duration when songs are added/removed
playlistSchema.methods.updateTotalDuration = async function() {
  await this.populate('songs.song');
  this.totalDuration = this.songs.reduce((total, item) => {
    return total + (item.song?.duration || 0);
  }, 0);
  return await this.save();
};

module.exports = mongoose.model('Playlist', playlistSchema);
