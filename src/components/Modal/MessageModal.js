import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import './MessageModal.css';

/**
 * MessageModal - Common modal for success, error, warning, and info messages
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Called when modal is closed
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {function} onConfirm - Optional confirm callback
 * @param {string} confirmText - Optional confirm button text (default: 'OK')
 */
const MessageModal = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  onConfirm,
  confirmText = 'OK'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={48} className="message-icon success" />;
      case 'error':
        return <XCircle size={48} className="message-icon error" />;
      case 'warning':
        return <AlertCircle size={48} className="message-icon warning" />;
      case 'info':
      default:
        return <Info size={48} className="message-icon info" />;
    }
  };

  return (
    <div className="message-modal-overlay" onClick={onClose}>
      <div className="message-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="message-modal-body">
          {getIcon()}
          {title && <h3 className="message-modal-title">{title}</h3>}
          <p className="message-modal-message">{message}</p>
        </div>
        <div className="message-modal-footer">
          <button
            onClick={handleConfirm}
            className={`message-modal-button ${type}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
