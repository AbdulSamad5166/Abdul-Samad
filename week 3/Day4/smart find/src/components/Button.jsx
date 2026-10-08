export default function Button({
  children,
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  title,
}) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}
