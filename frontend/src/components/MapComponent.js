import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ users, currentUser }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(mapCenter, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapInitialized(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapInitialized) return;

    const map = mapInstanceRef.current;
    const markers = markersRef.current;

    // Update markers for all users
    Object.entries(users).forEach(([userId, user]) => {
      if (!user.latitude || !user.longitude) return;

      const position = [user.latitude, user.longitude];
      
      if (markers[userId]) {
        // Update existing marker
        markers[userId].setLatLng(position);
        markers[userId].setPopupContent(createPopupContent(user, userId === currentUser));
      } else {
        // Create new marker
        const isCurrentUser = userId === currentUser;
        const markerOptions = isCurrentUser 
          ? { 
              icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })
            } 
          : {};

        const marker = L.marker(position, markerOptions).addTo(map);
        marker.bindPopup(createPopupContent(user, isCurrentUser));
        markers[userId] = marker;

        // Center map on current user's first location
        if (isCurrentUser && !mapCenter.some((coord, index) => Math.abs(coord - position[index]) < 0.001)) {
          map.setView(position, 15);
          setMapCenter(position);
        }
      }
    });

    // Remove markers for disconnected users
    Object.keys(markers).forEach(userId => {
      if (!users[userId]) {
        map.removeLayer(markers[userId]);
        delete markers[userId];
      }
    });

  }, [users, currentUser, mapInitialized]);

  const createPopupContent = (user, isCurrentUser) => {
    const name = user.name || `User ${user.id?.substring(0, 6)}`;
    const timestamp = user.timestamp ? new Date(user.timestamp).toLocaleTimeString() : 'Unknown';
    const accuracy = user.accuracy ? `${Math.round(user.accuracy)}m` : 'Unknown';
    
    return `
      <div style="text-align: center;">
        <strong>${isCurrentUser ? '🔵 You' : `👤 ${name}`}</strong><br/>
        <small>Last update: ${timestamp}</small><br/>
        <small>Accuracy: ${accuracy}</small>
      </div>
    `;
  };

  const centerMapOnUser = () => {
    if (currentUser && users[currentUser] && mapInstanceRef.current) {
      const user = users[currentUser];
      if (user.latitude && user.longitude) {
        mapInstanceRef.current.setView([user.latitude, user.longitude], 16);
      }
    }
  };

  return (
    <div className="relative h-full w-full">
      <div 
        ref={mapRef} 
        className="h-full w-full"
      />
      
      {/* Map controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button
          onClick={centerMapOnUser}
          className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-50 text-xs font-medium transition-colors"
          title="Center on my location"
        >
          📍 My Location
        </button>
      </div>

      {/* User count indicator */}
      <div className="absolute bottom-3 left-3 z-10 bg-white bg-opacity-90 px-3 py-2 rounded-md text-xs shadow-md">
        👥 {Object.keys(users).length} active user{Object.keys(users).length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default MapComponent;