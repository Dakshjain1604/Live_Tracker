import React from 'react';

const ConnectionStatus = ({ isConnected, userCount }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      fontSize: '14px'
    }}>
      {/* Connection Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '20px',
        backgroundColor: isConnected ? '#e8f5e8' : '#ffebee',
        border: `1px solid ${isConnected ? '#4caf50' : '#f44336'}`
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isConnected ? '#4caf50' : '#f44336',
          animation: isConnected ? 'pulse 2s infinite' : 'none'
        }} />
        <span style={{ 
          color: isConnected ? '#2e7d32' : '#c62828',
          fontWeight: '500'
        }}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* User Count */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '20px',
        backgroundColor: '#f3e5f5',
        border: '1px solid #9c27b0'
      }}>
        <span style={{ fontSize: '16px' }}>👥</span>
        <span style={{ 
          color: '#7b1fa2',
          fontWeight: '500'
        }}>
          {userCount} user{userCount !== 1 ? 's' : ''} online
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;