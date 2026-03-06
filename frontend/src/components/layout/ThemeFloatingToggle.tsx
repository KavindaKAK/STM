import { useTheme } from '@/contexts/ThemeContext';

export function ThemeFloatingToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 z-[70] h-14 w-28 overflow-hidden rounded-full border border-white/30 bg-[var(--theme-fab-bg)] p-1 text-[var(--theme-fab-text)] shadow-[0_12px_30px_var(--theme-fab-shadow)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_var(--theme-fab-shadow)] active:translate-y-0.5"
            style={{ transformStyle: 'preserve-3d' }}
        >
            <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.55),transparent_45%)]" />
            <span
                className={`absolute left-1 top-1 h-12 w-14 rounded-full transition-all duration-500 ${isDark ? 'bg-[linear-gradient(135deg,#3b82f6,#22d3ee)] shadow-[inset_0_1px_4px_rgba(255,255,255,0.5),0_10px_16px_rgba(34,211,238,0.4)]' : 'bg-[linear-gradient(135deg,#fbbf24,#f97316)] shadow-[inset_0_1px_4px_rgba(255,255,255,0.65),0_10px_16px_rgba(249,115,22,0.35)]'}`}
                style={{ transform: `${isDark ? 'translateX(3rem)' : 'translateX(0rem)'} translateZ(12px)` }}
            />
            <span className="relative z-10 flex h-full w-full items-center justify-between px-3 text-[11px] font-bold tracking-[0.18em]">
                <span className={`${isDark ? 'opacity-45' : 'opacity-100'} transition-opacity`}>LIGHT</span>
                <span className={`${isDark ? 'opacity-100' : 'opacity-45'} transition-opacity`}>DARK</span>
            </span>
        </button>
    );
}
