import React from 'react';

const ConnectionStatus = ({ isConnected, userCount }) => {
  return (
    <div className="flex items-center gap-5 text-sm">
      {/* Connection Status */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${
        isConnected 
          ? 'bg-green-100 border-green-400 text-green-800' 
          : 'bg-red-100 border-red-400 text-red-800'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          isConnected 
            ? 'bg-green-500 animate-pulse-slow' 
            : 'bg-red-500'
        }`} />
        <span className="font-medium">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* User Count */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-purple-100 border border-purple-400 text-purple-800">
        <span className="text-base">👥</span>
        <span className="font-medium">
          {userCount} user{userCount !== 1 ? 's' : ''} online
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;