const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Playlist = require('../models/Playlist');

const router = express.Router();

// Hardcoded admin credentials
const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'admin123';

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check hardcoded credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Generate JWT token for admin
    const token = jwt.sign(
      {
        username: ADMIN_USERNAME,
        role: 'admin',
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// Admin middleware to protect admin routes
const adminAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin || decoded.username !== ADMIN_USERNAME) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get dashboard statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [userCount, songCount, artistCount, playlistCount] = await Promise.all([
      User.countDocuments(),
      Song.countDocuments({ isActive: true }),
      Artist.countDocuments(),
      Playlist.countDocuments()
    ]);

    // Get recent users
    const recentUsers = await User.find()
      .select('username email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent songs
    const recentSongs = await Song.find({ isActive: true })
      .select('title artist duration createdAt')
      .populate('artist', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get total plays
    const songsWithPlays = await Song.find({ isActive: true }).select('playCount');
    const totalPlays = songsWithPlays.reduce((sum, song) => sum + (song.playCount || 0), 0);

    res.json({
      stats: {
        totalUsers: userCount,
        totalSongs: songCount,
        totalArtists: artistCount,
        totalPlaylists: playlistCount,
        totalPlays: totalPlays
      },
      recentUsers,
      recentSongs
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Get all users with pagination
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('username email createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get all songs with pagination
router.get('/songs', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const songs = await Song.find({ isActive: true })
      .select('title artist album duration playCount createdAt')
      .populate('artist', 'name')
      .populate('album', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Song.countDocuments({ isActive: true });

    res.json({
      songs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: 'Error fetching songs' });
  }
});

// Get all artists with pagination
router.get('/artists', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const artists = await Artist.find()
      .select('name bio isVerified createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Artist.countDocuments();

    res.json({
      artists,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ message: 'Error fetching artists' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Delete song
router.delete('/songs/:id', adminAuth, async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ message: 'Error deleting song' });
  }
});

// Verify/Unverify artist
router.patch('/artists/:id/verify', adminAuth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    artist.isVerified = !artist.isVerified;
    await artist.save();

    res.json({
      message: `Artist ${artist.isVerified ? 'verified' : 'unverified'} successfully`,
      artist
    });
  } catch (error) {
    console.error('Error verifying artist:', error);
    res.status(500).json({ message: 'Error verifying artist' });
  }
});

module.exports = router;
