import React, { useState, useEffect, useCallback } from 'react';
import { FiX, FiAlertTriangle, FiCheckCircle, FiInfo, FiAlertCircle } from 'react-icons/fi';

const NotificationSystem = ({ notifications, onRemove }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-md">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

const Notification = ({ notification, onRemove }) => {
  const { id, type, title, message, duration = 5000, actions } = notification;
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(id);
    }, 300);
  }, [id, onRemove]);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 50);

    // Auto-remove after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleRemove]);

  const getTypeStyles = () => {
    const styles = {
      success: {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
        icon: FiCheckCircle,
        iconColor: 'text-green-100',
        border: 'border-green-400/20'
      },
      error: {
        bg: 'bg-gradient-to-r from-red-500 to-rose-600',
        icon: FiAlertCircle,
        iconColor: 'text-red-100',
        border: 'border-red-400/20'
      },
      warning: {
        bg: 'bg-gradient-to-r from-orange-500 to-amber-600',
        icon: FiAlertTriangle,
        iconColor: 'text-orange-100',
        border: 'border-orange-400/20'
      },
      info: {
        bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
        icon: FiInfo,
        iconColor: 'text-blue-100',
        border: 'border-blue-400/20'
      }
    };
    return styles[type] || styles.info;
  };

  const typeStyle = getTypeStyles();
  const IconComponent = typeStyle.icon;

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isExiting ? 'scale-95' : 'scale-100'}
      `}
    >
      <div className={`
        ${typeStyle.bg} backdrop-blur-lg border ${typeStyle.border}
        rounded-xl shadow-2xl overflow-hidden max-w-md
        hover:shadow-3xl transition-shadow duration-200
      `}>
        {/* Header */}
        <div className="p-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className={`p-2 rounded-lg bg-white/20 ${typeStyle.iconColor}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white mb-1">
                  {title}
                </h3>
                <p className="text-xs text-white/90 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleRemove}
              className="ml-3 p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <FiX className="w-4 h-4 text-white/70 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="px-4 pb-4 pt-0">
            <div className="flex space-x-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    if (action.closeOnClick !== false) {
                      handleRemove();
                    }
                  }}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${action.primary 
                      ? 'bg-white text-gray-900 hover:bg-white/90' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress bar for auto-dismiss */}
        {duration > 0 && (
          <div className="h-1 bg-white/20">
            <div 
              className="h-full bg-white/60 transition-all ease-linear"
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSystem;

// Add CSS for the progress bar animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shrink {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }
  `;
  document.head.appendChild(style);
}
