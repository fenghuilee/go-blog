import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import './Toast.css';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const toastIdRef = useRef(0);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = toastIdRef.current++;
        const newToast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
        return id;
    }, [removeToast]);

    const success = (msg, duration) => showToast(msg, 'success', duration);
    const error = (msg, duration) => showToast(msg, 'error', duration);
    const info = (msg, duration) => showToast(msg, 'info', duration);
    const warning = (msg, duration) => showToast(msg, 'warning', duration);

    return (
        <ToastContext.Provider value={{ showToast, removeToast, success, error, info, warning }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast-item toast-${toast.type} slide-in`}>
                        <div className="toast-icon">
                            {toast.type === 'success' && '✅'}
                            {toast.type === 'error' && '❌'}
                            {toast.type === 'info' && 'ℹ️'}
                            {toast.type === 'warning' && '⚠️'}
                        </div>
                        <div className="toast-message">{toast.message}</div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
