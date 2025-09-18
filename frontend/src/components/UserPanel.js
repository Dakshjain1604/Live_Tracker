import React from 'react';
import { User, MapPin, Clock, Target, Users, Wifi, WifiOff, Zap, Activity, Radio } from 'lucide-react';

const UserPanel = ({ users, currentUser, userName, setUserName, onIdentifyUser }) => {
  const usersList = Object.values(users).sort((a, b) => {
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
  const activeUsers = usersList.filter((u) => u.latitude && u.longitude).length;

  const getAvatar = (name, id) => {
    const initials = name
      ? name.charAt(0).toUpperCase()
      : (id || '?').substring(0, 1).toUpperCase();
    return initials;
  };

  const getStatusInfo = (user) => {
    const hasLocation = user.latitude && user.longitude;
    if (!hasLocation) return { 
      color: 'text-slate-400', 
      bg: 'bg-slate-800', 
      status: 'Offline', 
      icon: WifiOff,
      glowColor: 'shadow-slate-500/20'
    };
    
    const now = new Date();
    const lastUpdate = new Date(user.timestamp);
    const diffMs = now - lastUpdate;
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return { 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/20', 
      status: 'Live', 
      icon: Zap,
      glowColor: 'shadow-emerald-500/30'
    };
    if (diffSecs < 300) return { 
      color: 'text-cyan-400', 
      bg: 'bg-cyan-500/20', 
      status: 'Active', 
      icon: Activity,
      glowColor: 'shadow-cyan-500/30'
    };
    return { 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/20', 
      status: 'Away', 
      icon: Radio,
      glowColor: 'shadow-amber-500/30'
    };
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden relative">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-500/30 to-purple-600/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-full filter blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Header with Enhanced Styling */}
      <div className="relative z-10 p-6 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40 group-hover:shadow-purple-500/60 transition-all duration-500">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full border-2 border-gray-900 shadow-lg shadow-emerald-500/50 animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Live Tracker
              </h2>
              <p className="text-gray-300 text-sm font-medium flex items-center space-x-2">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                  {activeUsers} online
                </span>
                <span className="text-gray-500">•</span>
                <span>{usersList.length} connected</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-full shadow-lg shadow-emerald-500/20">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full"></div>
            </div>
            <span className="text-emerald-300 text-sm font-bold tracking-wider">LIVE</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 h-full overflow-y-auto">
        {/* Enhanced User Identification Section */}
        {!isUserIdentified && (
          <div className="mb-8 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/40">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Join the Network</h3>
                <p className="text-gray-300 text-sm">Set your identity to appear on the live map</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your display name"
                className="flex-1 px-5 py-4 bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && onIdentifyUser()}
              />
              <button
                onClick={onIdentifyUser}
                disabled={!userName.trim()}
                className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                  userName.trim()
                    ? 'bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-500 hover:from-purple-600 hover:via-violet-600 hover:to-cyan-600 text-white transform hover:scale-105 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60'
                    : 'bg-gray-600/50 text-gray-400 cursor-not-allowed backdrop-blur-xl'
                }`}
              >
                Connect
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Users List */}
        <div className="space-y-5">
          {usersList.map((user, index) => {
            const isCurrentUserCard = user.id === currentUser;
            const statusInfo = getStatusInfo(user);

            return (
              <div
                key={user.id}
                className={`relative p-6 rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group ${
                  isCurrentUserCard
                    ? 'bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 border-emerald-500/30 shadow-xl shadow-emerald-500/20'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'
                } ${statusInfo.glowColor}`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {isCurrentUserCard && (
                  <div className="absolute -top-3 -right-3 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-500/50 animate-pulse">
                    YOU
                  </div>
                )}

                <div className="flex items-start space-x-5">
                  {/* Enhanced Avatar */}
                  <div className="relative group">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-2xl transition-all duration-300 group-hover:scale-110 ${
                        isCurrentUserCard
                          ? 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 shadow-emerald-500/40'
                          : 'bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 shadow-purple-500/40'
                      }`}
                    >
                      {getAvatar(user.name, user.id)}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${statusInfo.bg} border-3 border-gray-900 rounded-xl flex items-center justify-center shadow-lg ${statusInfo.glowColor}`}>
                      <statusInfo.icon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
                    </div>
                  </div>

                  {/* Enhanced User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <h4 className="text-xl font-bold text-white truncate">
                        {user.name || `User ${user.id?.substring(0, 6)}`}
                      </h4>
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusInfo.bg} ${statusInfo.color} border border-current/20 shadow-lg`}>
                        {statusInfo.status}
                      </span>
                    </div>

                    {/* Enhanced Details */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-200 text-sm group-hover:text-white transition-colors">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="truncate font-mono bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                          {getLocationString(user)}
                        </span>
                      </div>

                      {user.accuracy && (
                        <div className="flex items-center space-x-3 text-gray-200 text-sm group-hover:text-white transition-colors">
                          <div className="w-8 h-8 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                            <Target className="w-4 h-4 text-cyan-400" />
                          </div>
                          <span className="bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                            ±{Math.round(user.accuracy)}m precision
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-3 text-gray-200 text-sm group-hover:text-white transition-colors">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                          <Clock className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                          {formatLastUpdate(user.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-gray-400 text-xs">
                        <div className="w-3 h-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full shadow-sm"></div>
                        <span className="font-mono bg-black/10 px-2 py-1 rounded-md">
                          ID: {user.id?.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Enhanced Empty State */}
          {usersList.length === 0 && (
            <div className="text-center py-20 px-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/20">
                <Users className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Waiting for Connections</h3>
              <p className="text-gray-300 mb-8 text-lg">Share your tracking link to see others in real-time</p>
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-purple-500/20 backdrop-blur-xl border border-purple-500/30 text-purple-300 rounded-2xl text-sm font-bold shadow-lg shadow-purple-500/20">
                <div className="relative">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-purple-400 rounded-full"></div>
                </div>
                <span>Scanning for users...</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Statistics */}
        {usersList.length > 0 && (
          <div className="mt-10 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 text-center">Network Statistics</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
                  {activeUsers}
                </div>
                <div className="text-gray-300 text-sm font-medium">Active Now</div>
                <div className="w-full bg-emerald-500/20 rounded-full h-2 mt-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-green-400 h-2 rounded-full transition-all duration-1000"
                    style={{width: `${(activeUsers / Math.max(usersList.length, 1)) * 100}%`}}
                  ></div>
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {usersList.length}
                </div>
                <div className="text-gray-300 text-sm font-medium">Connected</div>
                <div className="w-full bg-cyan-500/20 rounded-full h-2 mt-3">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full w-full transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UserPanel;