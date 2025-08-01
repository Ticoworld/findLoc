import React, { useState, useEffect } from 'react';
import { FiClock, FiMapPin, FiNavigation, FiTrendingUp, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const RoutePlanningPanel = ({ routeData, selectedDestination, onRouteOptimize }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [routeAnalytics, setRouteAnalytics] = useState(null);

  // Calculate route analytics
  useEffect(() => {
    if (routeData) {
      const analytics = {
        efficiency: Math.round((1000 / Math.max(routeData.distance, 1)) * 100),
        walkingPace: routeData.duration > 0 ? Math.round(routeData.distance / routeData.duration) : 0,
        complexity: routeData.instructions?.length || 1,
        terrainDifficulty: routeData.distance > 500 ? 'Moderate' : 'Easy'
      };
      setRouteAnalytics(analytics);
    }
  }, [routeData]);

  if (!routeData || !selectedDestination) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="text-center text-white/70">
          <FiMapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Route Selected</h3>
          <p className="text-sm">Search for a destination to see route planning</p>
        </div>
      </div>
    );
  }

  const getRouteQuality = () => {
    if (!routeAnalytics) return { status: 'unknown', color: 'gray' };
    
    const efficiency = routeAnalytics.efficiency;
    if (efficiency >= 80) return { status: 'excellent', color: 'green', label: 'Optimal Route' };
    if (efficiency >= 60) return { status: 'good', color: 'blue', label: 'Good Route' };
    if (efficiency >= 40) return { status: 'fair', color: 'yellow', label: 'Fair Route' };
    return { status: 'poor', color: 'red', label: 'Long Route' };
  };

  const quality = getRouteQuality();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FiNavigation className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              <h3 className="text-lg font-bold">Route to {selectedDestination.name}</h3>
              <p className="text-sm text-white/70">A* Pathfinding Algorithm</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-${quality.color}-100 text-${quality.color}-800`}>
              <FiCheckCircle className="w-3 h-3 mr-1" />
              {quality.label}
            </div>
            <div className="text-white/70 text-xs mt-1">
              {isExpanded ? 'Click to collapse' : 'Click for details'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{routeData.distance}m</div>
            <div className="text-xs text-white/70">Distance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{routeData.duration} min</div>
            <div className="text-xs text-white/70">Walk Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{routeData.waypoints || 2}</div>
            <div className="text-xs text-white/70">Waypoints</div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-white/20 p-6 space-y-6">
          {/* Route Analytics */}
          {routeAnalytics && (
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <FiTrendingUp className="w-4 h-4 mr-2" />
                Route Analytics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white font-semibold">Efficiency Score</div>
                  <div className="text-2xl font-bold text-blue-400">{routeAnalytics.efficiency}%</div>
                  <div className="text-xs text-white/70">Route optimization</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white font-semibold">Walking Pace</div>
                  <div className="text-2xl font-bold text-green-400">{routeAnalytics.walkingPace}m/min</div>
                  <div className="text-xs text-white/70">Average speed</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white font-semibold">Route Complexity</div>
                  <div className="text-2xl font-bold text-purple-400">{routeAnalytics.complexity}</div>
                  <div className="text-xs text-white/70">Number of turns</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white font-semibold">Terrain</div>
                  <div className="text-lg font-bold text-orange-400">{routeAnalytics.terrainDifficulty}</div>
                  <div className="text-xs text-white/70">Difficulty level</div>
                </div>
              </div>
            </div>
          )}

          {/* Route Instructions */}
          {routeData.instructions && routeData.instructions.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <FiMapPin className="w-4 h-4 mr-2" />
                Turn-by-Turn Directions
              </h4>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {routeData.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white/5 rounded-lg p-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="text-white text-sm">{instruction}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Route Optimization Options */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <FiTrendingUp className="w-4 h-4 mr-2" />
              Optimization Options
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onRouteOptimize && onRouteOptimize('fastest')}
                className="flex items-center justify-center space-x-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg p-3 text-green-300 transition-colors"
              >
                <FiClock className="w-4 h-4" />
                <span className="text-sm font-medium">Fastest Route</span>
              </button>
              <button
                onClick={() => onRouteOptimize && onRouteOptimize('shortest')}
                className="flex items-center justify-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg p-3 text-blue-300 transition-colors"
              >
                <FiMapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Shortest Path</span>
              </button>
            </div>
          </div>

          {/* Route Quality Indicators */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Route Quality Indicators</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Algorithm Used</span>
                <span className="text-white font-medium">A* Pathfinding</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Data Source</span>
                <span className="text-white font-medium">Google Maps API</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Real-time Updates</span>
                <span className="text-green-400 font-medium flex items-center">
                  <FiCheckCircle className="w-3 h-3 mr-1" />
                  Active
                </span>
              </div>
              {routeData.isEstimate && (
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Route Type</span>
                  <span className="text-yellow-400 font-medium flex items-center">
                    <FiAlertCircle className="w-3 h-3 mr-1" />
                    Estimated
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePlanningPanel;
