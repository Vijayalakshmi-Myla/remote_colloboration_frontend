"use client";
import React from "react";

export function Button({ children, onClick, disabled, variant = "default", size = "base", className }) {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
  };
  const sizes = {
    base: "px-3 py-1.5 text-sm",
    icon: "p-2",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
