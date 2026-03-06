import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface AppleHeroProps {
    variant: 'dark' | 'light';
    title: string;
    subtitle: string;
    description: string;
    primaryCta: {
        text: string;
        href: string;
    };
    secondaryCta?: {
        text: string;
        href: string;
    };
    imageSrc?: string;
    imageAlt?: string;
    emoji?: string;
    animationComponent?: ReactNode;
}

export function AppleHero({
    variant,
    title,
    subtitle,
    description,
    primaryCta,
    secondaryCta,
    imageSrc,
    imageAlt,
    emoji,
    animationComponent
}: AppleHeroProps) {
    const isDark = variant === 'dark';

    return (
        <div className={`relative overflow-hidden ${isDark
                ? 'bg-gradient-to-br from-black via-gray-900 to-gray-800'
                : 'bg-gradient-to-br from-[#d6ebff] via-[#e8f4ff] to-[#f5f5f7]'
            }`}>
            <div className="container mx-auto px-4 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Subtitle */}
                    <p className={`text-lg md:text-xl font-semibold mb-4 tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        {subtitle}
                    </p>

                    {/* Main Title */}
                    <h1 className={`text-5xl md:text-7xl font-bold mb-6 tracking-tight ${isDark
                            ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
                            : 'text-gray-900'
                        }`}>
                        {title}
                    </h1>

                    {/* Description */}
                    <p className={`text-xl md:text-2xl mb-8 font-light ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        {description}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link
                            to={primaryCta.href}
                            className={`px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${isDark
                                    ? 'bg-[#0071e3] text-white hover:bg-[#0077ed]'
                                    : 'bg-[#0071e3] text-white hover:bg-[#0077ed]'
                                }`}
                        >
                            {primaryCta.text}
                        </Link>

                        {secondaryCta && (
                            <Link
                                to={secondaryCta.href}
                                className={`px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 ${isDark
                                        ? 'text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10'
                                        : 'text-[#0071e3] border-2 border-[#0071e3] hover:bg-[#0071e3]/10'
                                    }`}
                            >
                                {secondaryCta.text}
                            </Link>
                        )}
                    </div>

                    {/* Product Visual */}
                    <div className="relative aspect-[16/9] max-w-3xl mx-auto">
                        {animationComponent && (
                            <div className="w-full h-full flex items-center justify-center">
                                {animationComponent}
                            </div>
                        )}
                        {!animationComponent && emoji && !imageSrc && (
                            <div className="text-[200px] md:text-[300px] leading-none animate-float">
                                {emoji}
                            </div>
                        )}
                        {!animationComponent && imageSrc && (
                            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt || title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
