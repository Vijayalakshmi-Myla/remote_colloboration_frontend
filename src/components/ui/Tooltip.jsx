"use client";
import React, { createContext, useContext } from "react";

const TooltipContext = createContext({});

export function Tooltip({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

export function TooltipTrigger({ children, asChild }) {
  if (asChild) return children;
  return <span>{children}</span>;
}

export function TooltipContent({ children, side = "top" }) {
  const positions = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };
  return (
    <div
      className={`absolute ${positions[side]} bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50`}
    >
      {children}
    </div>
  );
}
