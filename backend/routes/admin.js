const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Playlist = require('../models/Playlist');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'audioFile') {
      cb(null, path.join(__dirname, '../uploads/songs'));
    } else if (file.fieldname === 'coverImage') {
      cb(null, path.join(__dirname, '../uploads/covers'));
    } else if (file.fieldname === 'artistImage') {
      cb(null, path.join(__dirname, '../uploads/artists'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'audioFile') {
      if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
      } else {
        cb(new Error('Only audio files are allowed for song upload'));
      }
    } else if (file.fieldname === 'coverImage' || file.fieldname === 'artistImage') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    } else {
      cb(null, true);
    }
  }
});

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

// Add new song with file upload
router.post('/songs', adminAuth, upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      title,
      artistId,
      albumId,
      genre,
      duration,
      releaseDate,
      lyrics,
      explicit,
      bitrate,
      // Audio features
      tempo,
      key,
      mood,
      energy,
      danceability
    } = req.body;

    // Validate required fields
    if (!title || !artistId || !genre || !duration || !releaseDate) {
      return res.status(400).json({
        message: 'Missing required fields: title, artistId, genre, duration, releaseDate'
      });
    }

    // Check if audio file was uploaded
    if (!req.files || !req.files.audioFile || !req.files.audioFile[0]) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    // Check if artist exists
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const audioFile = req.files.audioFile[0];
    const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;

    // Get file extension to determine format
    const format = path.extname(audioFile.originalname).slice(1).toLowerCase();

    // Create song object
    const songData = {
      title,
      artist: artistId,
      album: albumId || null,
      genre,
      duration: parseInt(duration),
      releaseDate: new Date(releaseDate),
      fileUrl: `/uploads/songs/${audioFile.filename}`,
      fileName: audioFile.filename,
      fileSize: audioFile.size,
      format: format,
      bitrate: bitrate ? parseInt(bitrate) : 320,
      coverImage: coverImage ? `/uploads/covers/${coverImage.filename}` : null,
      lyrics: lyrics || '',
      explicit: explicit === 'true' || explicit === true,
      features: {
        tempo: tempo ? parseFloat(tempo) : undefined,
        key: key || undefined,
        mood: mood || undefined,
        energy: energy ? parseFloat(energy) : undefined,
        danceability: danceability ? parseFloat(danceability) : undefined
      }
    };

    const song = new Song(songData);
    await song.save();

    // Populate artist info before sending response
    await song.populate('artist', 'name');

    res.status(201).json({
      message: 'Song uploaded successfully',
      song
    });
  } catch (error) {
    console.error('Error uploading song:', error);
    res.status(500).json({
      message: 'Error uploading song',
      error: error.message
    });
  }
});

// Get all artists (for dropdown in add song form)
router.get('/artists/list', adminAuth, async (req, res) => {
  try {
    const artists = await Artist.find().select('name _id').sort({ name: 1 });
    res.json({ artists });
  } catch (error) {
    console.error('Error fetching artists list:', error);
    res.status(500).json({ message: 'Error fetching artists' });
  }
});

// Add new artist with image upload
router.post('/artists', adminAuth, upload.fields([
  { name: 'artistImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      name,
      bio,
      genres,
      monthlyListeners,
      followers,
      instagram,
      twitter,
      facebook,
      website
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        message: 'Artist name is required'
      });
    }

    // Check if artist already exists
    const existingArtist = await Artist.findOne({ name });
    if (existingArtist) {
      return res.status(400).json({ message: 'Artist with this name already exists' });
    }

    const artistImage = req.files && req.files.artistImage ? req.files.artistImage[0] : null;

    // Parse genres if it's a string (from form data)
    let genresArray = [];
    if (genres) {
      if (typeof genres === 'string') {
        genresArray = genres.split(',').map(g => g.trim()).filter(g => g);
      } else if (Array.isArray(genres)) {
        genresArray = genres;
      }
    }

    // Create artist object
    const artistData = {
      name,
      bio: bio || '',
      image: artistImage ? `/uploads/artists/${artistImage.filename}` : null,
      genres: genresArray,
      monthlyListeners: monthlyListeners ? parseInt(monthlyListeners) : 0,
      followers: followers ? parseInt(followers) : 0,
      socialLinks: {
        instagram: instagram || '',
        twitter: twitter || '',
        facebook: facebook || '',
        website: website || ''
      }
    };

    const artist = new Artist(artistData);
    await artist.save();

    res.status(201).json({
      message: 'Artist created successfully',
      artist
    });
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).json({
      message: 'Error creating artist',
      error: error.message
    });
  }
});

// Update artist
router.patch('/artists/:id', adminAuth, upload.fields([
  { name: 'artistImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      name,
      bio,
      genres,
      monthlyListeners,
      followers,
      instagram,
      twitter,
      facebook,
      website
    } = req.body;

    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Update fields if provided
    if (name) artist.name = name;
    if (bio !== undefined) artist.bio = bio;

    // Parse genres if provided
    if (genres !== undefined) {
      if (typeof genres === 'string') {
        artist.genres = genres.split(',').map(g => g.trim()).filter(g => g);
      } else if (Array.isArray(genres)) {
        artist.genres = genres;
      }
    }

    if (monthlyListeners !== undefined) artist.monthlyListeners = parseInt(monthlyListeners);
    if (followers !== undefined) artist.followers = parseInt(followers);

    // Update image if uploaded
    const artistImage = req.files && req.files.artistImage ? req.files.artistImage[0] : null;
    if (artistImage) {
      artist.image = `/uploads/artists/${artistImage.filename}`;
    }

    // Update social links
    if (instagram !== undefined) artist.socialLinks.instagram = instagram;
    if (twitter !== undefined) artist.socialLinks.twitter = twitter;
    if (facebook !== undefined) artist.socialLinks.facebook = facebook;
    if (website !== undefined) artist.socialLinks.website = website;

    await artist.save();

    res.json({
      message: 'Artist updated successfully',
      artist
    });
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({
      message: 'Error updating artist',
      error: error.message
    });
  }
});

// Delete artist
router.delete('/artists/:id', adminAuth, async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Note: You might want to handle related songs here
    res.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ message: 'Error deleting artist' });
  }
});

// ============ PLAYLIST MANAGEMENT ROUTES ============

// Get all playlists with filters
router.get('/playlists', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, owner } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (owner) {
      query.owner = owner;
    }

    const playlists = await Playlist.find(query)
      .populate('owner', 'username email')
      .populate('collaborators', 'username email')
      .populate({
        path: 'songs.song',
        select: 'title artist duration',
        populate: {
          path: 'artist',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Playlist.countDocuments(query);

    res.json({
      playlists,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPlaylists: total
    });
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ message: 'Error fetching playlists' });
  }
});

// Get single playlist by ID
router.get('/playlists/:id', adminAuth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('owner', 'username email')
      .populate('collaborators', 'username email')
      .populate({
        path: 'songs.song',
        select: 'title artist album duration genre coverImage',
        populate: {
          path: 'artist',
          select: 'name'
        }
      });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json(playlist);
  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({ message: 'Error fetching playlist' });
  }
});

// Create playlist (admin creates playlist for a user)
router.post('/playlists', adminAuth, upload.single('coverImage'), async (req, res) => {
  try {
    const {
      name,
      description,
      owner,
      isPublic,
      collaborative,
      collaborators,
      songs,
      allowDownload,
      allowComments
    } = req.body;

    if (!name || !owner) {
      return res.status(400).json({ message: 'Name and owner are required' });
    }

    // Check if owner exists
    const ownerUser = await User.findById(owner);
    if (!ownerUser) {
      return res.status(404).json({ message: 'Owner user not found' });
    }

    const playlistData = {
      name,
      description: description || '',
      owner,
      isPublic: isPublic !== undefined ? isPublic === 'true' : true,
      collaborative: collaborative === 'true',
      coverImage: req.file ? `/uploads/covers/${req.file.filename}` : null,
      privacySettings: {
        isPublic: isPublic !== undefined ? isPublic === 'true' : true,
        allowDownload: allowDownload === 'true',
        allowComments: allowComments !== undefined ? allowComments === 'true' : true
      }
    };

    // Parse collaborators if provided
    if (collaborators) {
      try {
        playlistData.collaborators = JSON.parse(collaborators);
      } catch (e) {
        playlistData.collaborators = [];
      }
    }

    // Parse songs if provided
    if (songs) {
      try {
        const parsedSongs = JSON.parse(songs);
        playlistData.songs = parsedSongs.map(songId => ({
          song: songId,
          addedAt: new Date()
        }));
      } catch (e) {
        playlistData.songs = [];
      }
    }

    const playlist = new Playlist(playlistData);
    await playlist.save();

    // Populate for response
    await playlist.populate([
      { path: 'owner', select: 'username email' },
      { path: 'collaborators', select: 'username email' },
      { path: 'songs.song', select: 'title artist duration' }
    ]);

    // Update total duration if songs were added
    if (playlist.songs.length > 0) {
      await playlist.updateTotalDuration();
    }

    res.status(201).json({
      message: 'Playlist created successfully',
      playlist
    });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ message: 'Error creating playlist' });
  }
});

// Update playlist
router.patch('/playlists/:id', adminAuth, upload.single('coverImage'), async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    const {
      name,
      description,
      isPublic,
      collaborative,
      collaborators,
      songs,
      allowDownload,
      allowComments
    } = req.body;

    // Update fields
    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) {
      playlist.isPublic = isPublic === 'true';
      playlist.privacySettings.isPublic = isPublic === 'true';
    }
    if (collaborative !== undefined) playlist.collaborative = collaborative === 'true';
    if (req.file) playlist.coverImage = `/uploads/covers/${req.file.filename}`;

    // Update privacy settings
    if (allowDownload !== undefined) playlist.privacySettings.allowDownload = allowDownload === 'true';
    if (allowComments !== undefined) playlist.privacySettings.allowComments = allowComments === 'true';

    // Update collaborators if provided
    if (collaborators) {
      try {
        playlist.collaborators = JSON.parse(collaborators);
      } catch (e) {
        // Keep existing collaborators if parsing fails
      }
    }

    // Update songs if provided
    if (songs) {
      try {
        const parsedSongs = JSON.parse(songs);
        playlist.songs = parsedSongs.map(songId => ({
          song: songId,
          addedAt: new Date()
        }));
        // Update total duration
        await playlist.updateTotalDuration();
      } catch (e) {
        // Keep existing songs if parsing fails
      }
    }

    await playlist.save();

    // Populate for response
    await playlist.populate([
      { path: 'owner', select: 'username email' },
      { path: 'collaborators', select: 'username email' },
      { path: 'songs.song', select: 'title artist duration' }
    ]);

    res.json({
      message: 'Playlist updated successfully',
      playlist
    });
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ message: 'Error updating playlist' });
  }
});

// Delete playlist
router.delete('/playlists/:id', adminAuth, async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Error deleting playlist' });
  }
});

module.exports = router;
