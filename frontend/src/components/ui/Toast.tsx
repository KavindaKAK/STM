import { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    return <ToastContext.Provider value={{ showToast, toasts }}>{children}</ToastContext.Provider>;
}

export function Toaster() {
    const context = useContext(ToastContext);
    if (!context) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {context.toasts.map(toast => (
                <div
                    key={toast.id}
                    className={cn(
                        'px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-in',
                        {
                            'bg-green-600': toast.type === 'success',
                            'bg-red-600': toast.type === 'error',
                            'bg-blue-600': toast.type === 'info',
                        }
                    )}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
}

export function useToast(): ToastContextType {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
