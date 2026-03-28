import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotification } from '../store/slices/notificationSlice';
import { FiCheck, FiX, FiInfo, FiAlertCircle } from 'react-icons/fi';

export default function Toast() {
  const dispatch = useDispatch();
  const { message, type, show } = useSelector(state => state.notification);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => dispatch(hideNotification()), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, message]);

  if (!show) return null;

  const config = {
    success: { icon: FiCheck,       bg: 'rgba(201,169,110,0.15)', border: '#c9a96e',       color: '#c9a96e' },
    error:   { icon: FiAlertCircle, bg: 'rgba(180,60,60,0.15)',   border: '#e8a09a',       color: '#e8a09a' },
    info:    { icon: FiInfo,        bg: 'rgba(100,150,200,0.15)', border: 'rgba(100,150,200,0.6)', color: '#90b8d8' },
    warning: { icon: FiAlertCircle, bg: 'rgba(200,150,50,0.15)', border: 'rgba(200,150,50,0.6)',  color: '#d4a853' },
  };

  const { icon: Icon, bg, border, color } = config[type] || config.info;

  return (
    <div
      key={message}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        background: '#111009',
        border: `1px solid ${border}`,
        backdropFilter: 'blur(12px)',
        minWidth: '280px',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '32px', height: '32px',
        borderRadius: '50%',
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={14} style={{ color }} />
      </div>

      {/* Message */}
      <p style={{
        flex: 1,
        fontSize: '12px',
        letterSpacing: '0.05em',
        color: '#faf8f4',
        fontFamily: 'Montserrat, sans-serif',
        margin: 0,
      }}>
        {message}
      </p>

      {/* Close */}
      <button
        onClick={() => dispatch(hideNotification())}
        style={{ color: '#7a6e5f', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
      >
        <FiX size={14} />
      </button>

      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0,
        height: '2px',
        background: border,
        animation: 'progress 3s linear forwards',
        width: '100%',
      }} />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}