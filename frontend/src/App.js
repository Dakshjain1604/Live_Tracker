import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import MapComponent from './components/MapComponent';
import UserPanel from './components/UserPanel';
import ConnectionStatus from './components/ConnectionStatus';
import './App.css';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      setIsConnected(true);
      setCurrentUser(newSocket.id);
      console.log('Connected to server:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    // Location tracking handlers
    newSocket.on('received-location', (data) => {
      const { id, latitude, longitude, accuracy, timestamp } = data;
      setUsers(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          id,
          latitude,
          longitude,
          accuracy,
          timestamp,
          lastUpdate: new Date()
        }
      }));
    });

    // User management handlers
    newSocket.on('user-count-updated', (data) => {
      setUserCount(data.count);
    });

    newSocket.on('user-disconnected', (userId) => {
      setUsers(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    });

    newSocket.on('user-identified', (data) => {
      setUsers(prev => ({
        ...prev,
        [data.id]: {
          ...prev[data.id],
          name: data.name
        }
      }));
    });

    // Error handling
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Request geolocation permission and start tracking
    startLocationTracking(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const startLocationTracking = (socket) => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          socket.emit('send-location', {
            latitude,
            longitude,
            accuracy,
            timestamp: new Date()
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleIdentifyUser = () => {
    if (userName.trim() && socket) {
      socket.emit('identify-user', { name: userName.trim() });
      setUsers(prev => ({
        ...prev,
        [currentUser]: {
          ...prev[currentUser],
          name: userName.trim()
        }
      }));
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans">
      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">🌍 Live Location Tracker</h1>
        <ConnectionStatus isConnected={isConnected} userCount={userCount} />
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <MapComponent users={users} currentUser={currentUser} />
        </div>
        
        <div className="w-80 min-w-80 bg-white border-l border-gray-200 shadow-lg">
          <UserPanel 
            users={users}
            currentUser={currentUser}
            userName={userName}
            setUserName={setUserName}
            onIdentifyUser={handleIdentifyUser}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
