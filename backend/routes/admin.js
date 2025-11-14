const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Playlist = require('../models/Playlist');

const router = express.Router();

// Hardcoded admin credentials
const ADMIN_EMAIL = 'Admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check hardcoded credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Generate JWT token for admin
    const token = jwt.sign(
      {
        email: ADMIN_EMAIL,
        role: 'admin',
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        email: ADMIN_EMAIL,
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

    if (!decoded.isAdmin || decoded.email !== ADMIN_EMAIL) {
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

    // Get subscription breakdown
    const freeUsers = await User.countDocuments({ 'subscription.type': 'free' });
    const premiumUsers = await User.countDocuments({ 'subscription.type': 'premium' });
    const familyUsers = await User.countDocuments({ 'subscription.type': 'family' });

    // Get active/inactive users
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // Get recent users
    const recentUsers = await User.find()
      .select('username email subscription createdAt isActive isVerified')
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
        totalPlays: totalPlays,
        subscriptions: {
          free: freeUsers,
          premium: premiumUsers,
          family: familyUsers
        },
        activeUsers,
        verifiedUsers
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
      .select('username name email subscription createdAt isActive isVerified')
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

// Get single user details
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('likedSongs', 'title artist')
      .populate('followedArtists', 'name')
      .populate('playlists', 'name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

// Update user subscription
router.patch('/users/:id/subscription', adminAuth, async (req, res) => {
  try {
    const { type, endDate, autoRenew } = req.body;

    if (!['free', 'premium', 'family'].includes(type)) {
      return res.status(400).json({ message: 'Invalid subscription type' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.subscription = {
      type,
      startDate: user.subscription.startDate || new Date(),
      endDate: endDate || null,
      autoRenew: autoRenew !== undefined ? autoRenew : false
    };

    await user.save();

    res.json({
      message: 'Subscription updated successfully',
      user: {
        id: user._id,
        username: user.username,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Error updating subscription' });
  }
});

// Update user preferences
router.patch('/users/:id/preferences', adminAuth, async (req, res) => {
  try {
    const { language, audioQuality, explicitContent, autoplay, downloadQuality } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (language) user.preferences.language = language;
    if (audioQuality) user.preferences.audioQuality = audioQuality;
    if (explicitContent !== undefined) user.preferences.explicitContent = explicitContent;
    if (autoplay !== undefined) user.preferences.autoplay = autoplay;
    if (downloadQuality) user.preferences.downloadQuality = downloadQuality;

    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Error updating preferences' });
  }
});

// Update user profile
router.patch('/users/:id/profile', adminAuth, async (req, res) => {
  try {
    const { name, email, username } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    if (name) user.name = name;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Toggle user active status
router.patch('/users/:id/toggle-active', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Toggle user verified status
router.patch('/users/:id/toggle-verified', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({
      message: `User ${user.isVerified ? 'verified' : 'unverified'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Error toggling verification:', error);
    res.status(500).json({ message: 'Error updating verification status' });
  }
});

// Get user's liked songs
router.get('/users/:id/liked-songs', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'likedSongs',
        populate: { path: 'artist', select: 'name' }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username,
      likedSongs: user.likedSongs
    });
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    res.status(500).json({ message: 'Error fetching liked songs' });
  }
});

// Get user's followed artists
router.get('/users/:id/followed-artists', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followedArtists', 'name bio image isVerified');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username,
      followedArtists: user.followedArtists
    });
  } catch (error) {
    console.error('Error fetching followed artists:', error);
    res.status(500).json({ message: 'Error fetching followed artists' });
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
