import { ReactNode, useEffect, useState } from 'react';

interface InitialSplashGateProps {
    children: ReactNode;
}

export function InitialSplashGate({ children }: InitialSplashGateProps) {
    const [phase, setPhase] = useState<'show' | 'fade' | 'done'>('show');

    useEffect(() => {
        const fadeTimer = window.setTimeout(() => setPhase('fade'), 1700);
        const doneTimer = window.setTimeout(() => setPhase('done'), 2200);

        return () => {
            window.clearTimeout(fadeTimer);
            window.clearTimeout(doneTimer);
        };
    }, []);

    if (phase === 'done') {
        return <>{children}</>;
    }

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${phase === 'fade' ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="relative w-[170px] h-[170px] md:w-[220px] md:h-[220px]">
                <img
                    src="https://res.cloudinary.com/dyisuan5k/image/upload/v1770894035/stm_iuoote.jpg"
                    alt="STM logo"
                    className="object-contain splash-logo-blink w-full h-full"
                />
            </div>

            <style jsx>{`
                .splash-logo-blink {
                    animation: logo-blink 1.1s ease-in-out infinite;
                }
                @keyframes logo-blink {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.35;
                    }
                }
            `}</style>
        </div>
    );
}
