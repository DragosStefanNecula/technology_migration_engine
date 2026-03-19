import { createPortal } from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { registerWindow, unregisterWindow } from "./floatingWindowRegistry";

export default function FloatingWindow({ open = true, title, children, onClose }) {
  const [internalOpen, setInternalOpen] = useState(open);

  const closeWindow = useRef(() => {
    setInternalOpen(false);
    onClose?.();
  }).current;

  useEffect(() => {
    if (internalOpen) {
      registerWindow(closeWindow);
    } else {
      unregisterWindow(closeWindow);
    }
  }, [internalOpen, closeWindow]);

  useEffect(() => {
    if (open) setInternalOpen(true);
    else setInternalOpen(false);
  }, [open]);

  if (!internalOpen) return null;

  let body, footer;

  React.Children.forEach(children, (child) => {
    if (!child) return;

    if (child.type === FloatingWindow.Body) {
      body = child.props.children;
    } else if (child.type === FloatingWindow.Footer) {
      footer = child.props.children;
    } else {
      body = body ? [body, child] : child;
    }
  });

  return createPortal(
    <div className="modal">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          fontWeight: "600",
        }}
      >
        <span>{title}</span>
        {onClose && (
          <button
            onClick={closeWindow}
            style={{
              background: "none",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        )}
      </div>

      <div style={{ padding: "18px" }}>{body}</div>

      {footer && (
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <Button onClick={closeWindow}>Cancel</Button>
          <div>{footer}</div>
        </div>
      )}
    </div>,
    document.body
  );
}

FloatingWindow.Body = ({ children }) => children;
FloatingWindow.Footer = ({ children }) => children;