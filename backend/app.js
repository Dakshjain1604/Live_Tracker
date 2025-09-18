require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socketio(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Store connected users
const connectedUsers = new Map();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        users: connectedUsers.size,
        timestamp: new Date().toISOString(),
        message: 'Live tracking backend is running'
    });
});

app.get('/api/users', (req, res) => {
    const users = Array.from(connectedUsers.values()).map(user => ({
        id: user.id,
        name: user.name || null,
        hasLocation: !!(user.lastLocation?.latitude && user.lastLocation?.longitude),
        lastUpdate: user.lastUpdate || null,
        joinedAt: user.joinedAt
    }));
    
    res.json({
        users,
        count: users.length
    });
});

app.get('/api/users/count', (req, res) => {
    res.json({ count: connectedUsers.size });
});

// API endpoint to get connected users count
app.get('/api/users/count', (req, res) => {
    res.json({ count: connectedUsers.size });
});

// Socket.IO connection handling
io.on('connection', function(socket) {
    console.log(`User connected: ${socket.id}`);
    
    // Initialize user data
    const userData = {
        id: socket.id,
        joinedAt: new Date(),
        lastLocation: null,
        isActive: true
    };
    
    connectedUsers.set(socket.id, userData);
    
    // Send current user count to all clients
    io.emit('user-count-updated', { count: connectedUsers.size });
    
    // Handle location updates
    socket.on('send-location', function(data) {
        try {
            const { latitude, longitude, accuracy, timestamp } = data;
            
            // Validate location data
            if (!latitude || !longitude || 
                latitude < -90 || latitude > 90 || 
                longitude < -180 || longitude > 180) {
                socket.emit('error', { message: 'Invalid location data' });
                return;
            }
            
            // Update user location
            const user = connectedUsers.get(socket.id);
            if (user) {
                user.lastLocation = {
                    latitude,
                    longitude,
                    accuracy: accuracy || null,
                    timestamp: timestamp || new Date()
                };
                user.lastUpdate = new Date();
            }
            
            // Broadcast location to all clients
            io.emit('received-location', {
                id: socket.id,
                latitude,
                longitude,
                accuracy,
                timestamp: timestamp || new Date()
            });
            
        } catch (error) {
            console.error('Error handling location update:', error);
            socket.emit('error', { message: 'Error processing location data' });
        }
    });
    
    // Handle user identification
    socket.on('identify-user', function(data) {
        const user = connectedUsers.get(socket.id);
        if (user && data.name) {
            user.name = data.name;
            io.emit('user-identified', {
                id: socket.id,
                name: data.name
            });
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', function() {
        console.log(`User disconnected: ${socket.id}`);
        connectedUsers.delete(socket.id);
        
        // Notify all clients about disconnection and updated count
        io.emit('user-disconnected', socket.id);
        io.emit('user-count-updated', { count: connectedUsers.size });
    });
    
    // Handle errors
    socket.on('error', (error) => {
        console.error(`Socket error for ${socket.id}:`, error);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Express error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Live tracking backend server running on port ${PORT}`);
    console.log(`🌐 Backend API available at http://localhost:${PORT}/api`);
    console.log(`🔗 Socket.IO server ready for connections`);
});
 
