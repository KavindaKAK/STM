import { AppleHero } from '@/components/home/AppleHero';
import { BrandScroller } from '@/components/home/BrandScroller';
import { BestSellers } from '@/components/home/BestSellers';
import { ReviewsPreview } from '@/components/home/ReviewsPreview';
import { CarBatteryAnimation } from '@/components/home/CarBatteryAnimation';
import { CarTyreAnimation } from '@/components/home/CarTyreAnimation';
import { Link } from 'react-router-dom';

const brandPalette = {
    lightBlue: '#77ADE0',
    deepBlue: '#225E93',
    red: '#EE1B2E',
};

const liquidBlendBackground = `linear-gradient(
    135deg,
    #8CCFFF 0%,
    #8CCFFF 33.33%,
    #1B6AA6 33.33%,
    #1B6AA6 66.66%,
    #F12737 66.66%,
    #F12737 100%
)`;

const categoryCards = [
    {
        title: 'Tyres',
        to: '/tyres',
        description: 'Premium tyres for all vehicle types',
        gradient: 'from-slate-100 via-white to-slate-200',
        ring: 'from-slate-300/70 to-slate-400/30',
        glow: 'bg-slate-200/70',
        iconType: 'tyre',
    },
    {
        title: 'Batteries',
        to: '/batteries',
        description: 'High-quality automotive batteries',
        gradient: 'from-zinc-100 via-white to-gray-200',
        ring: 'from-zinc-300/70 to-gray-400/30',
        glow: 'bg-zinc-200/70',
        iconType: 'battery',
    },
    {
        title: 'Accessories',
        to: '/accessories',
        description: 'Complete range of auto accessories',
        gradient: 'from-neutral-100 via-white to-stone-200',
        ring: 'from-neutral-300/70 to-stone-400/30',
        glow: 'bg-neutral-200/70',
        iconType: 'accessory',
    },
];

export default function HomePage() {
    const renderCategoryIcon = (iconType: string) => {
        if (iconType === 'tyre') {
            return (
                <div className="relative h-12 w-12 logo-tyre-spin">
                    <div
                        className="absolute inset-0 rounded-full border-[6px] shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]"
                        style={{ borderColor: brandPalette.deepBlue, backgroundColor: `${brandPalette.lightBlue}33` }}
                    />
                    <div className="absolute inset-[9px] rounded-full bg-white/90 border-2" style={{ borderColor: `${brandPalette.lightBlue}AA` }} />
                    <div className="absolute inset-[22px] rounded-full" style={{ backgroundColor: brandPalette.red }} />
                    <div className="absolute left-1/2 top-[6px] h-[18px] w-[2px] -translate-x-1/2 rounded-full bg-slate-600/65" />
                    <div className="absolute left-1/2 bottom-[6px] h-[18px] w-[2px] -translate-x-1/2 rounded-full bg-slate-600/65" />
                    <div className="absolute top-1/2 left-[6px] h-[2px] w-[18px] -translate-y-1/2 rounded-full bg-slate-600/65" />
                    <div className="absolute top-1/2 right-[6px] h-[2px] w-[18px] -translate-y-1/2 rounded-full bg-slate-600/65" />
                </div>
            );
        }

        if (iconType === 'battery') {
            return (
                <div className="relative h-12 w-10">
                    <div className="absolute left-1/2 top-[-5px] h-[6px] w-4 -translate-x-1/2 rounded-t-md bg-slate-400/80" />
                    <div className="absolute inset-0 rounded-md border border-white/70 bg-white/45 backdrop-blur-md shadow-[inset_0_1px_8px_rgba(255,255,255,0.7)]" />
                    <div
                        className="absolute inset-[3px] rounded-[5px] overflow-hidden"
                        style={{
                            background: `linear-gradient(160deg, ${brandPalette.lightBlue}, ${brandPalette.deepBlue})`,
                        }}
                    >
                        <div className="logo-battery-charge absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-lime-300/80 to-transparent" />
                    </div>
                    <div className="absolute left-1/2 top-1/2 h-[2px] w-4 -translate-x-1/2 -translate-y-1/2 rounded bg-white" />
                    <div className="absolute left-1/2 top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded bg-white" />
                    <div className="absolute bottom-1 left-1/2 h-[3px] w-3 -translate-x-1/2 rounded-full" style={{ backgroundColor: brandPalette.red }} />
                </div>
            );
        }

        return (
            <div className="logo-accessory-float relative h-12 w-12">
                <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.14)]">
                    <path
                        d="M42 8a12 12 0 0 0 0 17l-20 20a8 8 0 1 0 5 5l20-20a12 12 0 0 0 17 0l-8-2-5-7 2-8a12 12 0 0 0-11-5z"
                        fill={brandPalette.deepBlue}
                    />
                    <circle cx="17" cy="47" r="5" fill={brandPalette.lightBlue} />
                    <circle cx="17" cy="47" r="2" fill={brandPalette.red} />
                </svg>
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <AppleHero
                    variant="dark"
                    subtitle="PREMIUM TYRES"
                    title="The new standard."
                    description="Inspired by the power of performance."
                    primaryCta={{
                        text: 'Shop Tyres',
                        href: '/tyres',
                    }}
                    secondaryCta={{
                        text: 'Learn more',
                        href: '/about',
                    }}
                    animationComponent={<CarTyreAnimation />}
                />

                <AppleHero
                    variant="light"
                    subtitle="BATTERIES"
                    title="Power unleashed."
                    description="Now supercharged by reliability."
                    primaryCta={{
                        text: 'Shop Batteries',
                        href: '/batteries',
                    }}
                    secondaryCta={{
                        text: 'Buy',
                        href: '/batteries',
                    }}
                    animationComponent={<CarBatteryAnimation />}
                />
            </div>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-6xl font-semibold text-gray-900 mb-4">
                        Complete automotive solutions.
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 font-light max-w-3xl mx-auto">
                        Premium tyres, batteries, and accessories delivered island-wide across Sri Lanka.
                    </p>
                </div>
            </section>

            <section className="relative py-20 bg-gradient-to-b from-[#eef1f4] via-[#e7eaee] to-[#edf0f3] overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_15%,rgba(255,255,255,0.9),transparent_38%),radial-gradient(circle_at_90%_80%,rgba(255,255,255,0.7),transparent_42%)]" />
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl md:text-4xl font-semibold text-slate-900">
                            AI-enhanced product discovery
                        </h3>
                        <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                            Explore smart categories with a modern liquid-glass interface.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categoryCards.map((card) => (
                            <Link
                                key={card.title}
                                to={card.to}
                                className="group relative rounded-[30px] border border-white/70 backdrop-blur-2xl shadow-[0_22px_48px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-18px_30px_rgba(15,23,42,0.16)] hover:shadow-[0_30px_65px_rgba(15,23,42,0.24),inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-18px_30px_rgba(15,23,42,0.2)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                                style={{ background: liquidBlendBackground }}
                            >
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className={`absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl ${card.glow} opacity-60`} />
                                    <div className="absolute inset-x-10 bottom-5 h-16 rounded-full bg-white/25 blur-2xl" />
                                    <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.16),rgba(255,255,255,0.02)_45%,rgba(255,255,255,0.12))]" />
                                    <div className="absolute inset-[1px] rounded-[28px] border border-white/45" />
                                </div>

                                <div className="relative p-10 md:p-12 text-center">
                                    <div className="mx-auto mb-7 h-24 w-24 relative">
                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${card.ring} shadow-inner`} />
                                        <div className="absolute inset-[7px] rounded-full bg-white/75 backdrop-blur-xl border border-white/80 flex items-center justify-center shadow-[inset_0_1px_10px_rgba(148,163,184,0.22)]">
                                            {renderCategoryIcon(card.iconType)}
                                        </div>
                                    </div>

                                    <h3 className="text-4xl font-semibold text-slate-900 mb-3">{card.title}</h3>
                                    <p className="text-slate-600 text-lg mb-8">{card.description}</p>

                                    <span className="inline-flex items-center justify-center px-7 py-3 rounded-full text-sm font-semibold text-slate-900 bg-white/70 border border-white/90 backdrop-blur-xl shadow-[0_6px_16px_rgba(30,41,59,0.14)] group-hover:bg-white/95 transition-all">
                                        Shop Now
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <BrandScroller />
            <BestSellers />
            <ReviewsPreview />

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center max-w-6xl mx-auto">
                        <div className="group">
                            <div className="text-sm mb-4 tracking-[0.18em] text-slate-500">DELIVERY</div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-900">Island-Wide Delivery</h4>
                            <p className="text-sm text-gray-600">We deliver to all 25 districts</p>
                        </div>
                        <div className="group">
                            <div className="text-sm mb-4 tracking-[0.18em] text-slate-500">QUALITY</div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-900">Quality Guaranteed</h4>
                            <p className="text-sm text-gray-600">100% authentic products</p>
                        </div>
                        <div className="group">
                            <div className="text-sm mb-4 tracking-[0.18em] text-slate-500">PAYMENT</div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-900">Cash on Delivery</h4>
                            <p className="text-sm text-gray-600">Pay safely when you receive</p>
                        </div>
                        <div className="group">
                            <div className="text-sm mb-4 tracking-[0.18em] text-slate-500">SUPPORT</div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-900">24/7 Support</h4>
                            <p className="text-sm text-gray-600">WhatsApp support available</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
