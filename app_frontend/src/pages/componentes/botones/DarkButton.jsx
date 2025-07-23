
import React from "react";
import "./darkbutton.css"; 

const DarkButton = ({
  children,
  variant = "primary", // 'primary' o 'secondary' o 'danger'
  onClick,
  type = "button",
  icon = null,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      type={type}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default DarkButton;
