import { useState } from 'react';

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Convenience methods
  const showSuccess = (title, message, options = {}) => {
    return addNotification({ type: 'success', title, message, ...options });
  };

  const showError = (title, message, options = {}) => {
    return addNotification({ type: 'error', title, message, duration: 8000, ...options });
  };

  const showWarning = (title, message, options = {}) => {
    return addNotification({ type: 'warning', title, message, ...options });
  };

  const showInfo = (title, message, options = {}) => {
    return addNotification({ type: 'info', title, message, ...options });
  };

  // Location confirmation dialog
  const showLocationConfirmation = (distance, latitude, longitude, accuracy, onUseActual, onUseCampus) => {
    const accuracyText = accuracy > 1000 ? ` (±${Math.round(accuracy)}m accuracy - possibly IP-based)` : ` (±${Math.round(accuracy)}m GPS accuracy)`;
    
    return addNotification({
      type: 'warning',
      title: 'Location Confirmation',
      message: `Detected location is ${Math.round(distance/1000)}km from AE-FUNAI campus${accuracyText}. Choose your starting location:`,
      duration: 0, // Don't auto-dismiss
      actions: [
        {
          label: 'Use Detected Location',
          primary: true,
          onClick: onUseActual
        },
        {
          label: 'Use Campus Location',
          onClick: onUseCampus
        }
      ]
    });
  };

  // Route error dialog
  const showRouteError = (error, onRetry) => {
    return addNotification({
      type: 'error',
      title: 'Routing Failed',
      message: `Google Maps routing failed: ${error}. Please check your internet connection and API configuration.`,
      duration: 0,
      actions: [
        {
          label: 'Retry',
          primary: true,
          onClick: onRetry
        },
        {
          label: 'Use Fallback Route',
          onClick: () => {} // Will just close
        }
      ]
    });
  };

  // Geolocation error dialog
  const showGeolocationError = (errorMessage, onRetry) => {
    return addNotification({
      type: 'error',
      title: 'Location Access Failed',
      message: `${errorMessage} Using Computer Science Department as default location.`,
      duration: 6000,
      actions: [
        {
          label: 'Retry Location',
          primary: true,
          onClick: onRetry
        }
      ]
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLocationConfirmation,
    showRouteError,
    showGeolocationError
  };
};
