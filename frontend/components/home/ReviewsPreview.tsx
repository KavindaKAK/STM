'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import Link from 'next/link';

export function ReviewsPreview() {
    const { data } = useQuery({
        queryKey: ['reviews-preview'],
        queryFn: () => api.getReviews({ limit: 6 }),
    });

    const reviews = data?.data || [];

    if (reviews.length === 0) {
        return null;
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Customer Reviews</h2>
                    <Link href="/reviews" className="text-primary-900 hover:underline">
                        View All Reviews →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review: any) => (
                        <div key={review._id} className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-3">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700 mb-3 line-clamp-4">{review.comment}</p>
                            <p className="text-sm font-medium text-gray-900">
                                — {review.userId?.name || 'Anonymous'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
