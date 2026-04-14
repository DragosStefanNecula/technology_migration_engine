import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import '#src/frontend/components/base/Toast.css';

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        clearTimeout(timers.current[id]);
        delete timers.current[id];
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'success') => {
        const id = ++idCounter;
        setToasts(prev => [...prev, { id, message, type }]);
        timers.current[id] = setTimeout(() => dismiss(id), 3000);
    }, [dismiss]);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            {createPortal(
                <div className="toast-container">
                    {toasts.map(t => (
                        <div
                            key={t.id}
                            className={`toast toast--${t.type}`}
                            onClick={() => dismiss(t.id)}
                        >
                            {t.message}
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
