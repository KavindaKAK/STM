'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') {
            setThemeState(savedTheme);
            return;
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setThemeState('dark');
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const value = useMemo(
        () => ({
            theme,
            setTheme: (nextTheme: Theme) => setThemeState(nextTheme),
            toggleTheme: () => setThemeState((current) => (current === 'dark' ? 'light' : 'dark')),
        }),
        [theme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
