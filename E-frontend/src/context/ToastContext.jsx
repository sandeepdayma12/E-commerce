import { createContext, useState } from "react";

export const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = (msg) => {
        setToast(msg);

        // Auto hide in 2 seconds
        setTimeout(() => setToast(null), 2000);
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
