import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductCard } from '@/components/products/ProductCard';
import { useEffect, useState } from 'react';

export function BestSellers() {
    const { data } = useQuery({
        queryKey: ['bestSellers'],
        queryFn: () => api.getProducts({ sort: 'salesCount', limit: 12 }),
    });

    const [isPaused, setIsPaused] = useState(false);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        dragFree: true,
    });

    const products = data?.data || [];

    useEffect(() => {
        if (!emblaApi || isPaused || products.length < 2) {
            return;
        }

        const interval = window.setInterval(() => {
            emblaApi.scrollNext();
        }, 2800);

        return () => window.clearInterval(interval);
    }, [emblaApi, isPaused, products.length]);

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Best Sellers</h2>
                <div
                    className="overflow-hidden"
                    ref={emblaRef}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="flex gap-6">
                        {products.map((product: any) => (
                            <div key={product._id} className="flex-[0_0_280px]">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-center text-gray-600 mt-4 text-sm">
                    👈 Drag to scroll through our best-selling products
                </p>
            </div>
        </section>
    );
}
