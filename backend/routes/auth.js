const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Validate input
    if (!username || !name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Create new user with default subscription
    const user = new User({
      username,
      name,
      email,
      password,
      subscription: {
        type: 'free',
        startDate: new Date(),
        endDate: null,
        autoRenew: false
      }
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        subscription: user.subscription.type,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        subscription: user.subscription.type,
        profilePicture: user.profilePicture,
        preferences: user.preferences,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('likedSongs', 'title artist coverImage')
      .populate('followedArtists', 'name image');

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.patch('/me', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'preferences', 'profilePicture'];
    const updateKeys = Object.keys(updates);

    const isValidOperation = updateKeys.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updateKeys.forEach(update => {
      if (update === 'preferences') {
        req.user.preferences = { ...req.user.preferences, ...updates.preferences };
      } else {
        req.user[update] = updates[update];
      }
    });

    await req.user.save();
    res.json(req.user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout (client-side token removal, optional server-side blacklist)
router.post('/logout', auth, async (req, res) => {
  try {
    // In a production app, you might want to implement token blacklisting here
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
