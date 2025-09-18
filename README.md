# 🌍 Live Location Tracker

A real-time location tracking application built with React frontend and Node.js backend using Socket.IO for real-time communication.

## 📁 Project Structure

```
live tracking/
├── backend/                 # Node.js Express + Socket.IO server
│   ├── app.js              # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env               # Backend environment variables
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main React app
│   │   └── App.css        # Updated with Tailwind
│   ├── package.json       # Frontend dependencies (includes Tailwind CSS)
│   └── .env              # Frontend environment variables
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm start
   ```
   The React app will run on `http://localhost:3000`

## 🔧 Features

### ✅ Implemented
- ✨ **Modern React UI** with Tailwind CSS
- 🗺️ **Interactive Leaflet Maps** with real-time location updates
- 🔄 **Real-time Communication** using Socket.IO
- 👥 **Multi-user Support** with user identification
- 📍 **Live Location Tracking** with accuracy indicators
- 🎯 **Map Controls** (center on user location)
- 📊 **User Statistics** (connected users, active locations)
- 🎨 **Responsive Design** for mobile and desktop
- 🔒 **CORS Configuration** for secure communication
- ⚡ **Optimized Performance** with React hooks

### 🎨 UI Components
- **MapComponent**: Interactive map with user markers
- **UserPanel**: List of connected users with location info
- **ConnectionStatus**: Real-time connection indicator
- **Modern Tailwind Styling**: Clean, responsive design

### 🔧 Technical Stack
- **Frontend**: React, Tailwind CSS, Leaflet, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO, CORS
- **Real-time**: WebSocket connections via Socket.IO
- **Maps**: OpenStreetMap tiles via Leaflet

## 📱 Usage

1. Open the application in multiple browser tabs/windows
2. Allow location access when prompted
3. Optionally set your name for identification
4. See real-time locations of all connected users on the map
5. Click "My Location" to center the map on your position

## 🔐 Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_SOCKET_URL=http://localhost:3001
BROWSER=none
SKIP_PREFLIGHT_CHECK=true
```

## 🛠️ Development

### Backend API Endpoints
- `GET /api/health` - Server health check
- `GET /api/users` - List connected users
- `GET /api/users/count` - Get user count

### Socket.IO Events
- `send-location` - Client sends location update
- `received-location` - Server broadcasts location to all clients
- `identify-user` - Client sets display name
- `user-count-updated` - Server broadcasts user count changes
- `user-disconnected` - User leaves the session

## 📦 Build for Production

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Production Backend:**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

## 🎯 Next Steps / Ideas

- 📈 Location history and trails
- 🏠 Geofencing and location alerts  
- 💬 Chat functionality between users
- 📊 Analytics dashboard
- 🔐 User authentication
- 💾 Database integration for persistence
- 🌙 Dark mode theme
- 📧 Share location via link/email

---

**Note**: Make sure to run both backend and frontend servers simultaneously for the application to work properly.