import { createPortal } from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import "#src/frontend/components/base/FloatingWindow.css";
import Button from "#src/frontend/components/base/Button";
import { registerWindow, unregisterWindow } from "#src/frontend/components/base/floatingWindowRegistry";

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
            <div className="modal__header">
                <span>{title}</span>
                {onClose && (
                    <button className="modal__close" onClick={closeWindow}>
                        ✕
                    </button>
                )}
            </div>

            <div className="modal__body">{body}</div>

            {footer && (
                <div className="modal__footer">
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
