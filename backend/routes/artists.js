const express = require('express');
const Artist = require('../models/Artist');
const Song = require('../models/Song');
const Album = require('../models/Album');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new artist
router.post('/', auth, async (req, res) => {
  try {
    const { name, bio, image, genres, socialLinks } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Artist name is required' });
    }

    const artist = new Artist({
      name,
      bio: bio || '',
      image: image || null,
      genres: genres || [],
      socialLinks: socialLinks || {}
    });

    await artist.save();

    res.status(201).json({
      message: 'Artist created successfully',
      artist
    });
  } catch (error) {
    console.error('Create artist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all artists with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, genre } = req.query;

    const query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (genre) {
      query.genres = genre;
    }

    const artists = await Artist.find(query)
      .sort({ monthlyListeners: -1, followers: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Artist.countDocuments(query);

    res.json({
      artists,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalArtists: total
    });
  } catch (error) {
    console.error('Get artists error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single artist by ID
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Get artist's top songs
    const topSongs = await Song.find({ artist: req.params.id, isActive: true })
      .sort({ playCount: -1 })
      .limit(10)
      .populate('album', 'title coverImage');

    // Get artist's albums
    const albums = await Album.find({ artist: req.params.id })
      .sort({ releaseDate: -1 })
      .limit(20);

    res.json({
      artist,
      topSongs,
      albums
    });
  } catch (error) {
    console.error('Get artist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get artist's songs
router.get('/:id/songs', async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'playCount' } = req.query;

    const songs = await Song.find({ artist: req.params.id, isActive: true })
      .populate('album', 'title coverImage')
      .sort({ [sortBy]: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Song.countDocuments({ artist: req.params.id, isActive: true });

    res.json({
      songs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalSongs: total
    });
  } catch (error) {
    console.error('Get artist songs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Follow/unfollow artist
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const user = req.user;
    const artistIndex = user.followedArtists.indexOf(artist._id);

    if (artistIndex > -1) {
      // Unfollow
      user.followedArtists.splice(artistIndex, 1);
      artist.followers = Math.max(0, artist.followers - 1);
    } else {
      // Follow
      user.followedArtists.push(artist._id);
      artist.followers += 1;
    }

    await user.save();
    await artist.save();

    res.json({
      following: artistIndex === -1,
      followers: artist.followers
    });
  } catch (error) {
    console.error('Follow artist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update artist
router.patch('/:id', auth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const updates = req.body;
    const allowedUpdates = ['name', 'bio', 'image', 'genres', 'socialLinks', 'verified'];
    const updateKeys = Object.keys(updates);

    const isValidOperation = updateKeys.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updateKeys.forEach(update => {
      artist[update] = updates[update];
    });

    await artist.save();
    res.json(artist);
  } catch (error) {
    console.error('Update artist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
