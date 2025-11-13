# 🎵 Music Streaming Platform

A comprehensive, Spotify-like music streaming application built with the MERN stack (MongoDB, Express, React, Node.js).

## 🏗️ Architecture Overview

This application implements a production-ready, scalable music streaming architecture similar to Spotify:

### **Backend Architecture**
- **Distributed File Storage**: Songs stored as files with metadata in MongoDB
- **Chunked HTTP Streaming**: Efficient audio delivery using HTTP range requests (206 Partial Content)
- **Multiple Specialized Databases**: Separate collections optimized for different data types
- **Analytics & Tracking**: Comprehensive listening history and user behavior tracking
- **Search & Discovery**: Full-text search across songs, artists, albums, and playlists

### **Key Features**
✅ User authentication & authorization (JWT)
✅ Song upload with metadata (MP3, WAV, OGG, M4A, FLAC)
✅ Real-time audio streaming with seek support
✅ Playlist management (create, edit, collaborative)
✅ Like/follow functionality
✅ Search with autocomplete
✅ Artist & album management
✅ Listening history tracking
✅ Responsive UI with Tailwind CSS
✅ Modern audio player component

## 📁 Project Structure

```
Music-Streaming/
├── backend/
│   ├── models/           # MongoDB schemas
│   │   ├── User.js       # User accounts & preferences
│   │   ├── Song.js       # Song metadata & analytics
│   │   ├── Artist.js     # Artist profiles
│   │   ├── Album.js      # Album information
│   │   ├── Playlist.js   # User playlists
│   │   └── ListeningHistory.js  # Analytics data
│   ├── routes/           # API endpoints
│   │   ├── auth.js       # Authentication
│   │   ├── songs.js      # Song management & streaming
│   │   ├── playlists.js  # Playlist operations
│   │   ├── artists.js    # Artist management
│   │   └── search.js     # Search functionality
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT verification
│   │   └── upload.js     # Multer file upload
│   ├── uploads/          # File storage
│   │   ├── songs/        # Audio files
│   │   └── images/       # Cover art
│   └── index.js          # Server entry point
│
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   │   ├── Navbar.jsx       # Navigation bar
    │   │   └── AudioPlayer.jsx  # Audio player
    │   ├── pages/        # Page components
    │   │   ├── Home.jsx
    │   │   ├── Browse.jsx
    │   │   ├── Library.jsx
    │   │   └── Playlists.jsx
    │   ├── context/      # React context
    │   │   └── AuthContext.jsx  # Auth state management
    │   ├── services/     # API services
    │   │   └── api.js    # Axios API client
    │   └── App.jsx       # Main application
    └── package.json
```

## 🗄️ Database Schema

### **User**
- Authentication (email, password with bcrypt)
- Subscription type (free, premium, family)
- Preferences (quality, language, explicit content)
- Liked songs & followed artists
- Profile information

### **Song**
- Metadata (title, artist, album, genre, duration)
- File information (URL, size, format, bitrate)
- Analytics (play count, likes)
- Audio features (tempo, key, mood, energy)
- Lyrics & release date

### **Artist**
- Profile (name, bio, image, genres)
- Verification status
- Analytics (monthly listeners, followers)
- Social media links

### **Playlist**
- Metadata (name, description, cover)
- Owner & collaborators
- Song list with timestamps
- Privacy settings
- Analytics

### **ListeningHistory**
- User & song references
- Play duration & completion
- Source & context
- Device & location
- Timestamp

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Music-Streaming
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start backend server
npm start
# Server runs on http://localhost:5000
```

3. **Setup Frontend**
```bash
cd frontend
npm install

# Create .env file (optional)
cp .env.example .env

# Start frontend dev server
npm run dev
# Frontend runs on http://localhost:5173
```

4. **Setup MongoDB**

Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in backend/.env
```

## 📡 API Documentation

### **Base URL**: `http://localhost:5000/api`

### Authentication
```
POST   /auth/register   - Register new user
POST   /auth/login      - User login
GET    /auth/me         - Get user profile (auth required)
PATCH  /auth/me         - Update profile (auth required)
```

### Songs
```
POST   /songs/upload    - Upload song (auth, multipart/form-data)
GET    /songs/stream/:id - Stream song (auth, supports range requests)
GET    /songs           - Get all songs (pagination, filters)
GET    /songs/:id       - Get song details
GET    /songs/trending/top - Get trending songs
POST   /songs/:id/like  - Like/unlike song (auth)
```

### Playlists
```
POST   /playlists       - Create playlist (auth)
GET    /playlists/my-playlists - Get user playlists (auth)
GET    /playlists       - Get public playlists
GET    /playlists/:id   - Get playlist details
POST   /playlists/:id/songs - Add song to playlist (auth)
DELETE /playlists/:id/songs/:songId - Remove song (auth)
```

### Artists
```
GET    /artists         - Get all artists (pagination, search)
GET    /artists/:id     - Get artist details + top songs
GET    /artists/:id/songs - Get all songs by artist
POST   /artists/:id/follow - Follow/unfollow artist (auth)
```

### Search
```
GET    /search?q=query  - Global search (songs, artists, albums, playlists)
GET    /search/suggestions?q=query - Autocomplete suggestions
```

## 🎨 Frontend Features

### UI Components
- **Navbar**: Responsive navigation with search, auth buttons
- **Audio Player**: Full-featured player with:
  - Play/pause, next/previous
  - Seek bar with time display
  - Volume control with mute
  - Current song display
  - Keyboard shortcuts (coming soon)

### Pages
- **Home**: Welcome page with feature highlights
- **Browse**: Genre exploration and trending songs
- **Library**: User's saved songs and albums
- **Playlists**: Playlist management interface

### State Management
- **AuthContext**: Global authentication state
- **Audio State**: Current song, playlist, playback control

## 🔧 Technologies Used

### Backend
- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin support

### Frontend
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Howler.js** - (Optional) Advanced audio

## 🎯 Key Implementation Details

### Audio Streaming
Songs are streamed using **HTTP range requests** (RFC 7233):
- Client sends `Range: bytes=0-` header
- Server responds with `206 Partial Content`
- Supports seek/skip functionality
- Minimal bandwidth usage
- Automatic buffering

### File Storage
```
backend/uploads/
  songs/    - song-{timestamp}-{random}.mp3
  images/   - image-{timestamp}-{random}.jpg
```

### Authentication Flow
1. User registers/logs in
2. Server generates JWT token
3. Token stored in localStorage
4. Token sent in `Authorization: Bearer {token}` header
5. Server verifies token for protected routes

### Search Implementation
- MongoDB text indexes on relevant fields
- Regex-based partial matching
- Multi-collection search (songs, artists, albums, playlists)
- Autocomplete suggestions

## 📊 Analytics & Tracking

- **Play Count**: Incremented on each stream
- **Listening History**: Track what users listen to
- **User Preferences**: Audio quality, explicit content
- **Popular Content**: Trending songs and artists
- **Recommendation Data**: Audio features (tempo, mood, energy)

## 🔮 Future Enhancements

- [ ] **CDN Integration** - Global content delivery
- [ ] **Recommendation Engine** - ML-based suggestions
- [ ] **Social Features** - Comments, sharing, following
- [ ] **Podcast Support** - Episodes and series
- [ ] **Lyrics Sync** - Time-synced lyrics display
- [ ] **Audio Quality Selection** - Multiple bitrates
- [ ] **Offline Mode** - Download for offline listening
- [ ] **Caching Layer** - Redis for performance
- [ ] **Rate Limiting** - API protection
- [ ] **Real-time Features** - Socket.io notifications
- [ ] **Admin Dashboard** - Content management
- [ ] **Payment Integration** - Subscription handling
- [ ] **Mobile App** - React Native

## 🤝 Contributing

This is a educational/demo project. Feel free to fork and modify!

## 📝 License

This project is open source and available under the MIT License.

## 🎓 Learning Resources

This project demonstrates:
- REST API design
- File upload & streaming
- Authentication & authorization
- Database modeling
- React state management
- Modern UI development
- Real-world application architecture

## 🐛 Known Issues

- No audio transcoding (files must be in web-compatible formats)
- No CDN integration (files served from local server)
- Basic recommendation system (no ML)
- No real-time features (polling only)

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for learning and demonstration purposes**
