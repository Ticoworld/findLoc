import React, { useState } from 'react';
import { FiNavigation, FiClock, FiMapPin, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const RouteInfo = ({ route, destination, onClearRoute }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!route || !destination) return null;

  return (
    <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FiNavigation className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Route to {destination.name}</h3>
              <p className="text-white/70 text-xs">A* optimal path</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isExpanded ? (
                <FiChevronUp className="w-4 h-4 text-white" />
              ) : (
                <FiChevronDown className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={onClearRoute}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <FiX className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Route Stats */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <FiNavigation className="w-4 h-4 text-blue-400" />
              <span className="text-white text-xs font-medium">Distance</span>
            </div>
            <p className="text-white text-lg font-bold mt-1">
              {route.distance < 1000 ? `${route.distance}m` : `${(route.distance / 1000).toFixed(1)}km`}
            </p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <FiClock className="w-4 h-4 text-green-400" />
              <span className="text-white text-xs font-medium">Time</span>
            </div>
            <p className="text-white text-lg font-bold mt-1">{route.duration} min</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <FiMapPin className="w-4 h-4 text-purple-400" />
            <span className="text-white text-xs font-medium">Waypoints</span>
          </div>
          <p className="text-white text-sm">{route.waypoints} stops along the route</p>
        </div>

        {/* Route Instructions */}
        {isExpanded && route.instructions && (
          <div className="bg-white/10 rounded-lg p-3">
            <h4 className="text-white text-xs font-medium mb-3 flex items-center">
              <FiNavigation className="w-4 h-4 mr-2" />
              Turn-by-turn directions
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {route.instructions.map((instruction, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-2 bg-white/5 rounded-lg"
                >
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-white text-xs leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Algorithm Info */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-xs font-medium">Optimized Route</p>
              <p className="text-white/70 text-xs">A* pathfinding algorithm</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">A*</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteInfo;
