import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AlertContext = createContext({ show: () => {} });

export const useAlert = () => useContext(AlertContext);

const AlertProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState({ title: '', message: '', type: 'info' });

  const show = useCallback((message, options = {}) => {
    const title = options.title || (options.type === 'error' ? 'Error' : options.type === 'success' ? 'Success' : 'Notice');
    setContent({ title, message, type: options.type || 'info' });
    setOpen(true);
  }, []);

  const value = { show };

  return (
    <AlertContext.Provider value={value}>
      {children}
      {/* Override native alert to route through this provider */}
      <AlertOverride onShow={show} />
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{content.title}</h2>
              <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ margin: 0, color: content.type === 'error' ? '#991b1b' : '#374151' }}>{content.message}</p>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>For faster response, contact via WhatsApp</div>
                <a
                  href={`https://wa.me/919894351011?text=${encodeURIComponent("I’m interested in this property — please provide a quicker response.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#10b981',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 700,
                    padding: '10px 16px',
                    borderRadius: 10,
                    boxShadow: '0 6px 18px rgba(16,185,129,.2)'
                  }}
                >
                  <span role="img" aria-label="whatsapp">💬</span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;

// Small helper component to override window.alert once at the app root
const AlertOverride = ({ onShow }) => {
  useEffect(() => {
    const original = window.alert;
    window.alert = (msg) => {
      try {
        const text = typeof msg === 'string' ? msg : JSON.stringify(msg);
        onShow(text, { type: 'info', title: 'Notice' });
      } catch {
        onShow(String(msg), { type: 'info', title: 'Notice' });
      }
    };
    return () => {
      window.alert = original;
    };
  }, [onShow]);
  return null;
};
