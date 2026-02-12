import { AppleHero } from '@/components/home/AppleHero';
import { BrandScroller } from '@/components/home/BrandScroller';
import { BestSellers } from '@/components/home/BestSellers';
import { ReviewsPreview } from '@/components/home/ReviewsPreview';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Apple-Style Split Hero Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Dark Hero - Premium Tyres */}
                <AppleHero
                    variant="dark"
                    subtitle="PREMIUM TYRES"
                    title="The new standard."
                    description="Inspired by the power of performance."
                    primaryCta={{
                        text: "Shop Tyres",
                        href: "/tyres"
                    }}
                    secondaryCta={{
                        text: "Learn more",
                        href: "/about"
                    }}
                    emoji="🛞"
                />

                {/* Light Hero - Batteries */}
                <AppleHero
                    variant="light"
                    subtitle="BATTERIES"
                    title="Power unleashed."
                    description="Now supercharged by reliability."
                    primaryCta={{
                        text: "Shop Batteries",
                        href: "/batteries"
                    }}
                    secondaryCta={{
                        text: "Buy",
                        href: "/batteries"
                    }}
                    emoji="🔋"
                />
            </div>

            {/* Headline Section */}
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

            {/* Quick Category Links - Modern Apple Cards */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Link
                            href="/tyres"
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="p-12 text-center">
                                <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-500">🛞</div>
                                <h3 className="text-3xl font-semibold text-gray-900 mb-3">Tyres</h3>
                                <p className="text-gray-600 text-lg mb-6">
                                    Premium tyres for all vehicle types
                                </p>
                                <span className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-semibold group-hover:bg-gray-800 transition-colors">
                                    Shop Now →
                                </span>
                            </div>
                        </Link>

                        <Link
                            href="/batteries"
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="p-12 text-center">
                                <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-500">🔋</div>
                                <h3 className="text-3xl font-semibold text-gray-900 mb-3">Batteries</h3>
                                <p className="text-gray-600 text-lg mb-6">
                                    High-quality automotive batteries
                                </p>
                                <span className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-semibold group-hover:bg-gray-800 transition-colors">
                                    Shop Now →
                                </span>
                            </div>
                        </Link>

                        <Link
                            href="/accessories"
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="p-12 text-center">
                                <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-500">🔧</div>
                                <h3 className="text-3xl font-semibold text-gray-900 mb-3">Accessories</h3>
                                <p className="text-gray-600 text-lg mb-6">
                                    Complete range of auto accessories
                                </p>
                                <span className="inline-block px-6 py-3 bg-black text-white rounded-full text-sm font-semibold group-hover:bg-gray-800 transition-colors">
                                    Shop Now →
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Brand Scroller */}
            <BrandScroller />

            {/* Best Sellers */}
            <BestSellers />

            {/* Reviews Preview */}
            <ReviewsPreview />

            {/* Features - Apple Style Minimalism */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center max-w-6xl mx-auto">
                        <div className="group">
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🚚</div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-900">Island-Wide Delivery</h4>
                            <p className="text-sm text-gray-600">
                                We deliver to all 25 districts
                            </p>
                        </div>
                        <div className="group">
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">✅</div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-900">Quality Guaranteed</h4>
                            <p className="text-sm text-gray-600">
                                100% authentic products
                            </p>
                        </div>
                        <div className="group">
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💳</div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-900">Cash on Delivery</h4>
                            <p className="text-sm text-gray-600">
                                Pay safely when you receive
                            </p>
                        </div>
                        <div className="group">
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💬</div>
                            <h4 className="font-semibold text-lg mb-2 text-gray-900">24/7 Support</h4>
                            <p className="text-sm text-gray-600">
                                WhatsApp support available
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
