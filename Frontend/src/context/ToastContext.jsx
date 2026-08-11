import { createContext, useState, useRef, useEffect } from "react";

export const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const showToast = (msg) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setToast(msg);

        timeoutRef.current = setTimeout(() => {
            setToast(null);
            timeoutRef.current = null;
        }, 2000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {toast && (
                <div className="toast-message">
                    <span>✔</span>
                    {toast}
                </div>
            )}

        </ToastContext.Provider>
    );
}
