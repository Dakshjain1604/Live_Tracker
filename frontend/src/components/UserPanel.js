import React from 'react';

const UserPanel = ({ users, currentUser, userName, setUserName, onIdentifyUser }) => {
  const usersList = Object.values(users).sort((a, b) => {
    // Sort current user first, then by name, then by connection time
    if (a.id === currentUser) return -1;
    if (b.id === currentUser) return 1;
    if (a.name && !b.name) return -1;
    if (!a.name && b.name) return 1;
    return (a.name || a.id).localeCompare(b.name || b.id);
  });

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const lastUpdate = new Date(timestamp);
    const diffMs = now - lastUpdate;
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    return `${Math.floor(diffSecs / 3600)}h ago`;
  };

  const getLocationString = (user) => {
    if (!user.latitude || !user.longitude) return 'Location unknown';
    return `${user.latitude.toFixed(4)}, ${user.longitude.toFixed(4)}`;
  };

  const currentUserData = users[currentUser];
  const isUserIdentified = currentUserData?.name;

  return (
    <div className="p-5 bg-gray-50 h-full overflow-y-auto">
      <h3 className="mt-0 mb-5 text-gray-800 text-lg font-semibold">
        🧑‍🤝‍🧑 Connected Users ({usersList.length})
      </h3>

      {/* User Identification Section */}
      {!isUserIdentified && (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-5">
          <h4 className="m-0 mb-3 text-blue-700 font-semibold">
            👋 Identify Yourself
          </h4>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && onIdentifyUser()}
            />
            <button
              onClick={onIdentifyUser}
              disabled={!userName.trim()}
              className={`px-4 py-2 text-white border-none rounded-md text-sm font-medium transition-colors ${
                userName.trim() 
                  ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Set Name
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="flex flex-col gap-3">
        {usersList.map((user) => {
          const isCurrentUserCard = user.id === currentUser;
          const hasLocation = user.latitude && user.longitude;
          
          return (
            <div
              key={user.id}
              className={`rounded-lg p-3 shadow-sm border-2 ${
                isCurrentUserCard 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
                  hasLocation ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <strong className="text-gray-800">
                  {isCurrentUserCard ? '🔵 ' : '👤 '}
                  {user.name || `User ${user.id?.substring(0, 6)}`}
                  {isCurrentUserCard && ' (You)'}
                </strong>
              </div>
              
              <div className="text-xs text-gray-600 leading-relaxed space-y-1">
                <div>
                  📍 {getLocationString(user)}
                </div>
                {user.accuracy && (
                  <div>
                    🎯 Accuracy: ~{Math.round(user.accuracy)}m
                  </div>
                )}
                <div>
                  🕒 Last update: {formatLastUpdate(user.timestamp)}
                </div>
                <div className="text-gray-500 text-xs">
                  ID: {user.id?.substring(0, 8)}...
                </div>
              </div>
            </div>
          );
        })}

        {usersList.length === 0 && (
          <div className="text-center py-10 px-5 text-gray-600 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl mb-3">🔍</div>
            <div className="mb-2">No users connected</div>
            <div className="text-xs text-gray-500">
              Share the link to track locations together!
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      {usersList.length > 0 && (
        <div className="mt-5 p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">
          <div className="mb-1">
            📊 Active users: {usersList.filter(u => u.latitude && u.longitude).length}
          </div>
          <div>
            📱 Total connections: {usersList.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPanel;