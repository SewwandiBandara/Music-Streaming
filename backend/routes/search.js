const express = require('express');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');

const router = express.Router();

// Global search across songs, artists, albums, and playlists
router.get('/', async (req, res) => {
  try {
    const { q, type = 'all', limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchLimit = parseInt(limit);
    const results = {};

    // Search songs
    if (type === 'all' || type === 'song') {
      results.songs = await Song.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { genre: { $regex: q, $options: 'i' } }
        ],
        isActive: true
      })
        .populate('artist', 'name image verified')
        .populate('album', 'title coverImage')
        .limit(searchLimit)
        .sort({ playCount: -1 });
    }

    // Search artists
    if (type === 'all' || type === 'artist') {
      results.artists = await Artist.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { genres: { $regex: q, $options: 'i' } }
        ]
      })
        .limit(searchLimit)
        .sort({ monthlyListeners: -1, followers: -1 });
    }

    // Search albums
    if (type === 'all' || type === 'album') {
      results.albums = await Album.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { genre: { $regex: q, $options: 'i' } }
        ]
      })
        .populate('artist', 'name image')
        .limit(searchLimit)
        .sort({ releaseDate: -1 });
    }

    // Search playlists
    if (type === 'all' || type === 'playlist') {
      results.playlists = await Playlist.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ],
        isPublic: true
      })
        .populate('owner', 'name profilePicture')
        .limit(searchLimit)
        .sort({ followers: -1 });
    }

    res.json({
      query: q,
      results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error during search' });
  }
});

// Search suggestions/autocomplete
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const [songs, artists] = await Promise.all([
      Song.find({
        title: { $regex: `^${q}`, $options: 'i' },
        isActive: true
      })
        .select('title')
        .limit(5),

      Artist.find({
        name: { $regex: `^${q}`, $options: 'i' }
      })
        .select('name')
        .limit(5)
    ]);

    const suggestions = [
      ...songs.map(s => ({ type: 'song', text: s.title })),
      ...artists.map(a => ({ type: 'artist', text: a.name }))
    ].slice(0, 10);

    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
