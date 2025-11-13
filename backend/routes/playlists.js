const express = require('express');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new playlist
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, isPublic, coverImage } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }

    const playlist = new Playlist({
      name,
      description: description || '',
      owner: req.user._id,
      isPublic: isPublic !== undefined ? isPublic : true,
      coverImage: coverImage || null
    });

    await playlist.save();
    await playlist.populate('owner', 'name profilePicture');

    res.status(201).json({
      message: 'Playlist created successfully',
      playlist
    });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's playlists
router.get('/my-playlists', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id })
      .populate('owner', 'name profilePicture')
      .populate({
        path: 'songs.song',
        populate: {
          path: 'artist',
          select: 'name image'
        }
      })
      .sort({ createdAt: -1 });

    res.json(playlists);
  } catch (error) {
    console.error('Get user playlists error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all public playlists
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = { isPublic: true };
    if (search) {
      query.$text = { $search: search };
    }

    const playlists = await Playlist.find(query)
      .populate('owner', 'name profilePicture')
      .populate({
        path: 'songs.song',
        select: 'title coverImage',
        populate: {
          path: 'artist',
          select: 'name'
        }
      })
      .sort({ followers: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Playlist.countDocuments(query);

    res.json({
      playlists,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPlaylists: total
    });
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single playlist by ID
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('owner', 'name profilePicture')
      .populate('collaborators', 'name profilePicture')
      .populate({
        path: 'songs.song',
        populate: {
          path: 'artist album',
          select: 'name image title coverImage'
        }
      });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if playlist is private
    if (!playlist.isPublic && (!req.user || req.user._id.toString() !== playlist.owner._id.toString())) {
      return res.status(403).json({ error: 'This playlist is private' });
    }

    res.json(playlist);
  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add song to playlist
router.post('/:id/songs', auth, async (req, res) => {
  try {
    const { songId } = req.body;

    if (!songId) {
      return res.status(400).json({ error: 'Song ID is required' });
    }

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if user owns the playlist or is a collaborator
    const isOwner = playlist.owner.toString() === req.user._id.toString();
    const isCollaborator = playlist.collaborative && playlist.collaborators.some(
      id => id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ error: 'You do not have permission to modify this playlist' });
    }

    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Check if song is already in playlist
    const songExists = playlist.songs.some(item => item.song.toString() === songId);
    if (songExists) {
      return res.status(400).json({ error: 'Song already in playlist' });
    }

    // Add song to playlist
    playlist.songs.push({
      song: songId,
      addedAt: new Date()
    });

    await playlist.updateTotalDuration();
    await playlist.populate({
      path: 'songs.song',
      populate: {
        path: 'artist',
        select: 'name image'
      }
    });

    res.json({
      message: 'Song added to playlist',
      playlist
    });
  } catch (error) {
    console.error('Add song to playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove song from playlist
router.delete('/:id/songs/:songId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if user owns the playlist or is a collaborator
    const isOwner = playlist.owner.toString() === req.user._id.toString();
    const isCollaborator = playlist.collaborative && playlist.collaborators.some(
      id => id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ error: 'You do not have permission to modify this playlist' });
    }

    // Remove song
    playlist.songs = playlist.songs.filter(
      item => item.song.toString() !== req.params.songId
    );

    await playlist.updateTotalDuration();

    res.json({
      message: 'Song removed from playlist',
      playlist
    });
  } catch (error) {
    console.error('Remove song from playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update playlist
router.patch('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check ownership
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You do not have permission to modify this playlist' });
    }

    const updates = req.body;
    const allowedUpdates = ['name', 'description', 'isPublic', 'coverImage', 'collaborative'];
    const updateKeys = Object.keys(updates);

    const isValidOperation = updateKeys.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updateKeys.forEach(update => {
      playlist[update] = updates[update];
    });

    await playlist.save();
    await playlist.populate('owner', 'name profilePicture');

    res.json(playlist);
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete playlist
router.delete('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check ownership
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You do not have permission to delete this playlist' });
    }

    await playlist.deleteOne();

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reorder songs in playlist
router.put('/:id/reorder', auth, async (req, res) => {
  try {
    const { songIds } = req.body; // Array of song IDs in new order

    if (!Array.isArray(songIds)) {
      return res.status(400).json({ error: 'songIds must be an array' });
    }

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check ownership or collaboration
    const isOwner = playlist.owner.toString() === req.user._id.toString();
    const isCollaborator = playlist.collaborative && playlist.collaborators.some(
      id => id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ error: 'You do not have permission to modify this playlist' });
    }

    // Reorder songs
    const newSongs = songIds.map(songId => {
      const existingSong = playlist.songs.find(item => item.song.toString() === songId);
      return existingSong || { song: songId, addedAt: new Date() };
    });

    playlist.songs = newSongs;
    await playlist.save();

    res.json({
      message: 'Playlist reordered successfully',
      playlist
    });
  } catch (error) {
    console.error('Reorder playlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
