import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

export function HeroSlider() {
    const { data } = useQuery({
        queryKey: ['banners'],
        queryFn: api.getBanners,
    });

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const banners = data?.data || [];

    if (banners.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {banners.map((banner: any) => (
                        <div key={banner._id} className="flex-[0_0_100%] min-w-0">
                            <Link to={banner.linkUrl || '#'} className="block relative aspect-[21/9] md:aspect-[21/6]">
                                <img
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                                    <div className="container mx-auto px-4">
                                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                            {banner.title}
                                        </h2>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}}
                </div>
            </div>

            {banners.length > 1 && (
                <>
                    <button
                        onClick={scrollPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg"
                    >
                        ←
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg"
                    >
                        →
                    </button>
                </>
            )}
        </div>
    );
}
