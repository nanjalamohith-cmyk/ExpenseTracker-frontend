import React, { useEffect } from 'react';

/**
 * Toast notification component that auto-dismisses after 3 seconds.
 * Supports 'success', 'error', and 'info' variants.
 */
const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification || !notification.message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification || !notification.message) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <div
      className={`notification-toast ${notification.type}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="notification-icon">
        {isSuccess && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
        {isError && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )}
        {!isSuccess && !isError && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        )}
      </div>

      <div className="notification-content">
        <p className="notification-message">{notification.message}</p>
      </div>

      <button
        type="button"
        className="notification-close-btn"
        onClick={onClose}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;
