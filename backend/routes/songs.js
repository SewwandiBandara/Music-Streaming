const express = require('express');
const fs = require('fs');
const path = require('path');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const ListeningHistory = require('../models/ListeningHistory');
const auth = require('../middleware/auth');
const { uploadSongWithCover } = require('../middleware/upload');

const router = express.Router();

// Upload a new song
router.post('/upload', auth, uploadSongWithCover, async (req, res) => {
  try {
    if (!req.files || !req.files.song) {
      return res.status(400).json({ error: 'No song file uploaded' });
    }

    const songFile = req.files.song[0];
    const coverFile = req.files.cover ? req.files.cover[0] : null;

    const {
      title,
      artistId,
      albumId,
      duration,
      genre,
      releaseDate,
      lyrics,
      explicit,
      tempo,
      key,
      mood
    } = req.body;

    // Validate required fields
    if (!title || !artistId || !duration || !genre || !releaseDate) {
      // Clean up uploaded files
      fs.unlinkSync(songFile.path);
      if (coverFile) fs.unlinkSync(coverFile.path);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify artist exists
    const artist = await Artist.findById(artistId);
    if (!artist) {
      fs.unlinkSync(songFile.path);
      if (coverFile) fs.unlinkSync(coverFile.path);
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Create song document
    const song = new Song({
      title,
      artist: artistId,
      album: albumId || null,
      duration: parseInt(duration),
      genre,
      releaseDate: new Date(releaseDate),
      fileUrl: `/uploads/songs/${songFile.filename}`,
      fileName: songFile.filename,
      fileSize: songFile.size,
      format: path.extname(songFile.originalname).substring(1),
      coverImage: coverFile ? `/uploads/images/${coverFile.filename}` : null,
      lyrics: lyrics || '',
      explicit: explicit === 'true',
      features: {
        tempo: tempo ? parseInt(tempo) : null,
        key: key || null,
        mood: mood || null
      }
    });

    await song.save();

    // Populate artist info
    await song.populate('artist', 'name image');

    res.status(201).json({
      message: 'Song uploaded successfully',
      song
    });
  } catch (error) {
    // Clean up files if there's an error
    if (req.files) {
      if (req.files.song) fs.unlinkSync(req.files.song[0].path);
      if (req.files.cover) fs.unlinkSync(req.files.cover[0].path);
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// Stream a song (chunked streaming)
router.get('/stream/:id', auth, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const songPath = path.join(__dirname, '..', song.fileUrl);

    // Check if file exists
    if (!fs.existsSync(songPath)) {
      return res.status(404).json({ error: 'Song file not found' });
    }

    const stat = fs.statSync(songPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Partial content (streaming)
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(songPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Full content
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(200, head);
      fs.createReadStream(songPath).pipe(res);
    }

    // Increment play count (async, don't wait)
    song.incrementPlayCount().catch(err => console.error('Error incrementing play count:', err));

    // Record listening history
    const history = new ListeningHistory({
      user: req.user._id,
      song: song._id,
      playedAt: new Date()
    });
    history.save().catch(err => console.error('Error saving history:', err));

  } catch (error) {
    console.error('Streaming error:', error);
    res.status(500).json({ error: 'Server error during streaming' });
  }
});

// Get all songs with pagination and filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      genre,
      artist,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };

    if (genre) query.genre = genre;
    if (artist) query.artist = artist;
    if (search) {
      query.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const songs = await Song.find(query)
      .populate('artist', 'name image verified')
      .populate('album', 'title coverImage')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Song.countDocuments(query);

    res.json({
      songs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalSongs: total
    });
  } catch (error) {
    console.error('Get songs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('artist', 'name bio image genres verified')
      .populate('album', 'title coverImage releaseDate');

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json(song);
  } catch (error) {
    console.error('Get song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get popular/trending songs
router.get('/trending/top', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const songs = await Song.find({ isActive: true })
      .populate('artist', 'name image verified')
      .populate('album', 'title coverImage')
      .sort({ playCount: -1 })
      .limit(parseInt(limit));

    res.json(songs);
  } catch (error) {
    console.error('Get trending songs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like a song
router.post('/:id/like', auth, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const user = req.user;
    const songIndex = user.likedSongs.indexOf(song._id);

    if (songIndex > -1) {
      // Unlike
      user.likedSongs.splice(songIndex, 1);
      song.likes = Math.max(0, song.likes - 1);
    } else {
      // Like
      user.likedSongs.push(song._id);
      song.likes += 1;
    }

    await user.save();
    await song.save();

    res.json({
      liked: songIndex === -1,
      likes: song.likes
    });
  } catch (error) {
    console.error('Like song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update song metadata
router.patch('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const updates = req.body;
    const allowedUpdates = ['title', 'genre', 'lyrics', 'explicit', 'features'];
    const updateKeys = Object.keys(updates);

    const isValidOperation = updateKeys.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updateKeys.forEach(update => {
      if (update === 'features') {
        song.features = { ...song.features, ...updates.features };
      } else {
        song[update] = updates[update];
      }
    });

    await song.save();
    await song.populate('artist', 'name image');

    res.json(song);
  } catch (error) {
    console.error('Update song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete song
router.delete('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    // Soft delete - just mark as inactive
    song.isActive = false;
    await song.save();

    // Or hard delete - uncomment below
    // const songPath = path.join(__dirname, '..', song.fileUrl);
    // if (fs.existsSync(songPath)) {
    //   fs.unlinkSync(songPath);
    // }
    // await song.remove();

    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Delete song error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
