import React from 'react';
import { FiNavigation, FiMap, FiZap } from 'react-icons/fi';

const RouteMethodIndicator = ({ routeData, className = '' }) => {
  if (!routeData) return null;

  const getMethodInfo = () => {
    if (routeData.isCampusRoute) {
      return {
        icon: FiZap,
        text: 'Campus A*',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        description: 'Using shortcut-aware campus pathfinding'
      };
    } else if (routeData.method === 'Smart Campus Routing') {
      return {
        icon: FiNavigation,
        text: 'Campus Heuristic',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        description: 'Basic campus routing with waypoints'
      };
    } else {
      return {
        icon: FiMap,
        text: 'Google Maps',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        description: 'Google Maps walking directions'
      };
    }
  };

  const methodInfo = getMethodInfo();
  const IconComponent = methodInfo.icon;

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border ${methodInfo.bgColor} ${methodInfo.borderColor} ${className}`}>
      <IconComponent className={`w-4 h-4 ${methodInfo.color}`} />
      <span className={`text-sm font-medium ${methodInfo.color}`}>
        {methodInfo.text}
      </span>
      <div className="group relative">
        <div className="w-3 h-3 rounded-full bg-gray-300 cursor-help"></div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
          <div className="bg-gray-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
            {methodInfo.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMethodIndicator;
