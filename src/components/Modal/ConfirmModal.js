import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'confirm', // 'confirm', 'success', 'error', 'info', 'warning'
  confirmText = 'OK', 
  cancelText = 'Cancel',
  confirmButtonClass = '',
  showIcon = true
}) => {
  if (!isOpen) return null;

  const icons = {
    confirm: <AlertCircle size={48} className="modal-icon warning" />,
    warning: <AlertCircle size={48} className="modal-icon warning" />,
    success: <CheckCircle size={48} className="modal-icon success" />,
    error: <XCircle size={48} className="modal-icon error" />,
    info: <Info size={48} className="modal-icon info" />
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        {showIcon && (
          <div className="confirm-modal-icon">
            {icons[type]}
          </div>
        )}
        {title && <h2 className="confirm-modal-title">{title}</h2>}
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className={`btn-confirm ${confirmButtonClass}`} 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
