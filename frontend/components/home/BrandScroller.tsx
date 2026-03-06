import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import useEmblaCarousel from 'embla-carousel-react';

export function BrandScroller() {
    const { data } = useQuery({
        queryKey: ['brands'],
        queryFn: api.getBrands,
    });

    const [emblaRef] = useEmblaCarousel({
        loop: false,
        align: 'start',
        dragFree: true,
    });

    const brands = data?.data || [];

    if (brands.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Our Brands</h2>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-8">
                        {brands.map((brand: any) => (
                            <div
                                key={brand._id}
                                className="flex-[0_0_200px] flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={brand.logoUrl}
                                    alt={brand.name}
                                    className="object-contain"
                                    style={{ maxWidth: '150px', maxHeight: '50px' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-center text-gray-600 mt-4 text-sm">
                    👈 Drag to scroll through our premium brands
                </p>
            </div>
        </section>
    );
}
