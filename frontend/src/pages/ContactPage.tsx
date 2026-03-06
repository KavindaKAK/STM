import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';

type RatingBand = {
    key: string;
    label: string;
    value: number;
    icon: string;
    countColor: string;
    barColor: string;
};

const RATING_BANDS: RatingBand[] = [
    { key: 'love', label: 'love', value: 5, icon: '😍', countColor: '#fb7185', barColor: 'linear-gradient(90deg,#fb7185,#f97316)' },
    { key: 'like', label: 'like', value: 4, icon: '🙂', countColor: '#f472b6', barColor: 'linear-gradient(90deg,#f472b6,#ec4899)' },
    { key: 'ok', label: 'ok', value: 3, icon: '😐', countColor: '#fb7185', barColor: 'linear-gradient(90deg,#fb7185,#fda4af)' },
    { key: 'dislike', label: 'dislike', value: 2, icon: '☹', countColor: '#93c5fd', barColor: 'linear-gradient(90deg,#a5b4fc,#60a5fa)' },
    { key: 'hate', label: 'hate', value: 1, icon: '😣', countColor: '#60a5fa', barColor: 'linear-gradient(90deg,#93c5fd,#3b82f6)' },
];

export default function ContactPage() {
    const { user, token } = useAuth();
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const [selectedRating, setSelectedRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');

    const { data } = useQuery<any>({
        queryKey: ['contact-reviews'],
        queryFn: () => api.getReviews({ limit: 200 }),
    });

    const reviews: any[] = data?.data || [];
    const totalReviews = reviews.length || 0;
    const formatCount = (count: number) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return `${count}`;
    };

    const ratingMap = useMemo(() => {
        const map = new Map<number, number>();
        for (const band of RATING_BANDS) {
            map.set(band.value, 0);
        }

        for (const review of reviews) {
            const current = map.get(review.rating) || 0;
            map.set(review.rating, current + 1);
        }

        return map;
    }, [reviews]);

    const submitReview = useMutation({
        mutationFn: (payload: { rating: number; comment: string }) => api.submitReview(payload, token!),
        onSuccess: () => {
            showToast('Review submitted. It will be visible after admin approval.', 'success');
            setReviewComment('');
            setSelectedRating(5);
            queryClient.invalidateQueries({ queryKey: ['contact-reviews'] });
        },
        onError: (error: any) => {
            showToast(error.message || 'Failed to submit review', 'error');
        },
    });

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            showToast('Please login to submit a review', 'error');
            return;
        }

        if (reviewComment.trim().length < 10) {
            showToast('Review comment must be at least 10 characters', 'error');
            return;
        }

        submitReview.mutate({
            rating: selectedRating,
            comment: reviewComment.trim(),
        });
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-8 text-center text-4xl font-bold">Contact Us</h1>

                <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="rounded-xl border p-8 shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                        <h2 className="mb-6 text-2xl font-semibold">Get In Touch</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-2 font-semibold">Address</h3>
                                <p className="ml-1" style={{ color: 'var(--text-muted)' }}>
                                    Tyre Shop Beruwala<br />
                                    Beruwala, Sri Lanka
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-2 font-semibold">Phone</h3>
                                <p className="ml-1" style={{ color: 'var(--text-muted)' }}>
                                    <a href="tel:+94771234567" className="text-blue-600 hover:underline">
                                        +94 77 123 4567
                                    </a>
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-2 font-semibold">Email</h3>
                                <p className="ml-1" style={{ color: 'var(--text-muted)' }}>
                                    <a href="mailto:support@tyreshop.lk" className="text-blue-600 hover:underline">
                                        support@tyreshop.lk
                                    </a>
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-2 font-semibold">WhatsApp</h3>
                                <p className="ml-1" style={{ color: 'var(--text-muted)' }}>
                                    <a
                                        href="https://wa.me/94771234567"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Chat with us on WhatsApp
                                    </a>
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-2 font-semibold">Business Hours</h3>
                                <p className="ml-1" style={{ color: 'var(--text-muted)' }}>
                                    Monday - Saturday: 8:00 AM - 6:00 PM<br />
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border p-8 shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                        <h2 className="mb-6 text-2xl font-semibold">Send Us a Message</h2>

                        <form className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Name</label>
                                <input type="text" className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-soft-bg)' }} required />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Email</label>
                                <input type="email" className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-soft-bg)' }} required />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Phone</label>
                                <input type="tel" className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-soft-bg)' }} />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Message</label>
                                <textarea className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-soft-bg)' }} rows={5} required />
                            </div>

                            <button type="submit" className="w-full rounded-lg bg-primary-900 px-6 py-2 font-semibold text-white transition-colors hover:bg-primary-800">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                <section className="rounded-[18px] border border-[#2b3344] bg-[#0f131d] p-0 shadow-2xl">
                    <div className="border-b border-[#252c3b] py-3 text-center">
                        <h2 className="text-sm font-semibold tracking-[0.3em] text-[#9ca3af]">USER RATINGS</h2>
                    </div>
                    <div className="rounded-[18px] bg-gradient-to-r from-[#151922] via-[#1a202c] to-[#171d28] p-6">
                        <div className="mb-5 flex items-center gap-2 text-xl font-semibold text-[#d1d5db]">
                            <span className="text-xl text-rose-500">♥</span>
                            <span className="tracking-wide">RATING</span>
                        </div>

                        <div className="flex gap-6 overflow-x-auto pb-2">
                        {RATING_BANDS.map((band) => {
                            const count = ratingMap.get(band.value) || 0;
                            const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;

                            return (
                                <div key={band.key} className="min-w-[120px] flex-1 text-center">
                                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-[#596174] text-2xl leading-none text-[#6b7280]">
                                        {band.icon}
                                    </div>
                                    <p className="mb-2 text-2xl font-medium capitalize text-[#c7ceda]">{band.label}</p>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#646b7c]">
                                        <div className="h-full rounded-full" style={{ width: `${percentage}%`, background: band.barColor }} />
                                    </div>
                                    <p className="mt-2 text-lg font-semibold" style={{ color: band.countColor }}>
                                        {formatCount(count)}
                                    </p>
                                </div>
                            );
                        })}
                        </div>
                    </div>

                    <div className="m-6 mt-4 rounded-xl border border-[#2f3748] bg-[#121722] p-5">
                        <h3 className="mb-4 text-xl font-semibold">Add Your Review</h3>

                        {user ? (
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                                    {RATING_BANDS.map((band) => (
                                        <button
                                            key={band.key}
                                            type="button"
                                            onClick={() => setSelectedRating(band.value)}
                                            className={`rounded-lg border px-3 py-3 text-sm font-semibold transition-all ${selectedRating === band.value ? 'border-pink-500 bg-pink-500/10 text-pink-500' : 'hover:border-pink-400'}`}
                                            style={{ borderColor: selectedRating === band.value ? undefined : 'var(--border-color)' }}
                                        >
                                            {band.label}
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    rows={4}
                                    placeholder="Tell us about your experience (minimum 10 characters)"
                                    className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={submitReview.isPending}
                                    className="rounded-lg bg-primary-900 px-6 py-2 font-semibold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-3">
                                <p style={{ color: 'var(--text-muted)' }}>
                                    You must be logged in to add a review.
                                </p>
                                <Link to="/login" className="inline-block rounded-lg bg-primary-900 px-5 py-2 font-semibold text-white hover:bg-primary-800">
                                    Login to Add Review
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
