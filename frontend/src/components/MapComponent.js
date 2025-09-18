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

  // Initialize map ONCE
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initialCenter = [40.7128, -74.0060]; // use hardcoded value, not state
    const map = L.map(mapRef.current).setView(initialCenter, 13);

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
  }, []); // no warning now ✅

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInitialized) return;

    const map = mapInstanceRef.current;
    const markers = markersRef.current;

    Object.entries(users).forEach(([userId, user]) => {
      if (!user.latitude || !user.longitude) return;

      const position = [user.latitude, user.longitude];

      if (markers[userId]) {
        // Update marker
        markers[userId].setLatLng(position);
        markers[userId].setPopupContent(createPopupContent(user, userId === currentUser));
      } else {
        // New marker
        const isCurrentUser = userId === currentUser;
        const markerOptions = isCurrentUser
          ? {
              icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              }),
            }
          : {};

        const marker = L.marker(position, markerOptions).addTo(map);
        marker.bindPopup(createPopupContent(user, isCurrentUser));
        markers[userId] = marker;

        // Center map on current user first time
        if (
          isCurrentUser &&
          !mapCenter.some((coord, index) => Math.abs(coord - position[index]) < 0.001)
        ) {
          map.setView(position, 15);
          setMapCenter(position);
        }
      }
    });

    // Cleanup markers for disconnected users
    Object.keys(markers).forEach((userId) => {
      if (!users[userId]) {
        map.removeLayer(markers[userId]);
        delete markers[userId];
      }
    });
  }, [users, currentUser, mapInitialized, mapCenter]); // safe deps

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
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

      {/* Map controls */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}
      >
        <button
          onClick={centerMapOnUser}
          style={{
            padding: '8px 12px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          title="Center on my location"
        >
          📍 My Location
        </button>
      </div>

      {/* User count indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        👥 {Object.keys(users).length} active user
        {Object.keys(users).length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default MapComponent;
