const mongoose = require('mongoose');

const listeningHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  playedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  duration: {
    type: Number, // how long the user listened in seconds
    default: 0
  },
  completed: {
    type: Boolean, // did the user listen to the full song?
    default: false
  },
  source: {
    type: String, // 'playlist', 'album', 'search', 'radio', 'recommendation'
    enum: ['playlist', 'album', 'search', 'radio', 'recommendation', 'artist', 'library'],
    default: 'library'
  },
  context: {
    // ID of the playlist, album, etc. where the song was played from
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  device: {
    type: String,
    enum: ['web', 'mobile', 'desktop', 'tv'],
    default: 'web'
  },
  location: {
    country: String,
    city: String
  }
}, {
  timestamps: false
});

// Indexes for analytics queries
listeningHistorySchema.index({ user: 1, playedAt: -1 });
listeningHistorySchema.index({ song: 1, playedAt: -1 });
listeningHistorySchema.index({ playedAt: -1 });

// Compound index for user's recent history
listeningHistorySchema.index({ user: 1, song: 1, playedAt: -1 });

module.exports = mongoose.model('ListeningHistory', listeningHistorySchema);
