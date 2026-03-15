export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  icon,
}) {
  const sizes = {
    sm: { padding: '0.5rem 1.5rem', fontSize: '10px' },
    md: { padding: '0.75rem 2rem', fontSize: '11px' },
    lg: { padding: '1rem 2.5rem', fontSize: '12px' },
  };

  const variants = {
    primary: {
      background: disabled ? 'rgba(201,169,110,0.4)' : '#c9a96e',
      color: '#0a0806',
      border: 'none',
    },
    outline: {
      background: 'transparent',
      color: '#c9a96e',
      border: '1px solid rgba(201,169,110,0.4)',
    },
    ghost: {
      background: 'transparent',
      color: '#7a6e5f',
      border: 'none',
    },
    danger: {
      background: 'transparent',
      color: '#c96e6e',
      border: '1px solid rgba(201,110,110,0.3)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...sizes[size],
        ...variants[variant],
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: variant === 'primary' ? 600 : 400,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'all 0.3s ease',
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.8'; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1'; }}
    >
      {icon && icon}
      {children}
    </button>
  );
}