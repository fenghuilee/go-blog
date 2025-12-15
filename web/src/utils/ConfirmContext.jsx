import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import './ConfirmModal.css';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState({
        message: '',
        title: '确认',
        confirmText: '确定',
        cancelText: '取消',
        type: 'warning' // warning, info, danger
    });

    // Store resolve function of the Promise
    const resolveRef = useRef(null);

    const confirm = useCallback((message, config = {}) => {
        setOptions({
            message,
            title: config.title || '确认',
            confirmText: config.confirmText || '确定',
            cancelText: config.cancelText || '取消',
            type: config.type || 'warning'
        });
        setIsOpen(true);

        return new Promise((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        if (resolveRef.current) {
            resolveRef.current(true);
            resolveRef.current = null;
        }
    }, []);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        if (resolveRef.current) {
            resolveRef.current(false);
            resolveRef.current = null;
        }
    }, []);

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            {isOpen && (
                <div className="confirm-modal-overlay">
                    <div className={`confirm-modal confirm-${options.type}`}>
                        <div className="confirm-header">
                            <h3>{options.title}</h3>
                        </div>
                        <div className="confirm-body">
                            <p>{options.message}</p>
                        </div>
                        <div className="confirm-footer">
                            <button className="btn-cancel" onClick={handleCancel}>
                                {options.cancelText}
                            </button>
                            <button className="btn-confirm" onClick={handleConfirm}>
                                {options.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
};
