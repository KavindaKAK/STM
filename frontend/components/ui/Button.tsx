import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl backdrop-blur-sm transform hover:scale-105',
                {
                    'bg-gradient-to-r from-primary-900 to-primary-800 text-white hover:from-primary-800 hover:to-primary-700 focus:ring-primary-500': variant === 'primary',
                    'bg-white/60 backdrop-blur-lg text-gray-900 hover:bg-white/80 border border-white/40 focus:ring-gray-400': variant === 'secondary',
                    'border-2 border-primary-900 bg-white/40 backdrop-blur-md text-primary-900 hover:bg-primary-50/70 focus:ring-primary-500': variant === 'outline',
                    'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500': variant === 'danger',
                    'px-3 py-1.5 text-sm': size === 'sm',
                    'px-4 py-2 text-base': size === 'md',
                    'px-6 py-3 text-lg': size === 'lg',
                },
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading...
                </div>
            ) : (
                children
            )}
        </button>
    );
}
