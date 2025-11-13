# Music Streaming Backend API

A comprehensive music streaming backend built with Node.js, Express, and MongoDB.

## Architecture Overview

This backend implements a Spotify-like architecture with:

- **Distributed File Storage**: Songs stored as files with metadata in MongoDB
- **Chunked Streaming**: HTTP range requests for efficient audio streaming
- **Multiple Specialized Databases**: Separate collections for songs, users, playlists, artists, albums, and listening history
- **JWT Authentication**: Secure user authentication with JSON Web Tokens
- **Search & Recommendations**: Full-text search with analytics-ready data structure

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile (requires auth)
- `PATCH /me` - Update user profile (requires auth)
- `POST /logout` - Logout user (requires auth)

### Songs (`/api/songs`)
- `POST /upload` - Upload new song with cover (requires auth, multipart/form-data)
- `GET /stream/:id` - Stream song with chunked transfer (requires auth)
- `GET /` - Get all songs (pagination, filters, search)
- `GET /:id` - Get single song details
- `GET /trending/top` - Get trending/popular songs
- `POST /:id/like` - Like/unlike a song (requires auth)
- `PATCH /:id` - Update song metadata (requires auth)
- `DELETE /:id` - Delete song (requires auth)

### Playlists (`/api/playlists`)
- `POST /` - Create new playlist (requires auth)
- `GET /my-playlists` - Get user's playlists (requires auth)
- `GET /` - Get all public playlists (pagination, search)
- `GET /:id` - Get single playlist details
- `POST /:id/songs` - Add song to playlist (requires auth)
- `DELETE /:id/songs/:songId` - Remove song from playlist (requires auth)
- `PATCH /:id` - Update playlist (requires auth)
- `DELETE /:id` - Delete playlist (requires auth)
- `PUT /:id/reorder` - Reorder songs in playlist (requires auth)

### Artists (`/api/artists`)
- `POST /` - Create new artist (requires auth)
- `GET /` - Get all artists (pagination, search, filters)
- `GET /:id` - Get artist details with top songs and albums
- `GET /:id/songs` - Get all songs by artist (pagination)
- `POST /:id/follow` - Follow/unfollow artist (requires auth)
- `PATCH /:id` - Update artist (requires auth)

### Search (`/api/search`)
- `GET /` - Global search (songs, artists, albums, playlists)
- `GET /suggestions` - Get search suggestions/autocomplete

## Database Models

### User
- Personal info (name, email, password)
- Subscription type (free, premium, family)
- Preferences (language, audio quality, explicit content)
- Liked songs and followed artists
- Timestamps and last login

### Song
- Metadata (title, artist, album, genre, duration)
- File information (URL, size, format, bitrate)
- Analytics (play count, likes)
- Audio features (tempo, key, mood, energy)
- Release date and explicit flag

### Artist
- Profile (name, bio, image, genres)
- Verification status
- Analytics (monthly listeners, followers)
- Social media links

### Album
- Basic info (title, artist, cover, release date)
- Type (album, single, EP, compilation)
- Duration and total tracks
- Label and description

### Playlist
- Metadata (name, description, cover)
- Owner and collaborators
- Song list with timestamps
- Privacy settings (public/private)
- Analytics (followers, duration)

### ListeningHistory
- User and song reference
- Play duration and completion status
- Source and context
- Device and location tracking
- Timestamp

## Audio Streaming

Songs are streamed using HTTP range requests (206 Partial Content):
- Supports seek/skip functionality
- Efficient bandwidth usage
- Automatic play count tracking
- Listening history recording

## File Storage

```
backend/
  uploads/
    songs/          # Audio files (MP3, WAV, OGG, M4A, FLAC)
    images/         # Cover art and profile pictures
```

## Environment Variables

Create a `.env` file:
```
MONGO_URI=mongodb://localhost:27017/music-streaming
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

## Installation

```bash
cd backend
npm install
npm start
```

## Features Implemented

✅ User authentication & authorization
✅ Song upload with metadata
✅ Chunked audio streaming
✅ Playlist management
✅ Like/follow functionality
✅ Search with autocomplete
✅ Listening history tracking
✅ Artist & album management
✅ Collaborative playlists
✅ Analytics tracking

## Future Enhancements

- CDN integration for global distribution
- Recommendation engine using ML
- Social features (sharing, comments)
- Podcast support
- Lyrics synchronization
- Audio normalization
- Multiple audio quality levels
- Caching layer (Redis)
- Rate limiting
- Token blacklisting
- Real-time notifications (Socket.io)
