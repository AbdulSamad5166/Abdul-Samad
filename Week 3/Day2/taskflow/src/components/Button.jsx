import "./Button.css";

function Button({ children, type = "button", variant = "primary", onClick }) {
  return (
    <button type={type} className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;