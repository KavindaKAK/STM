'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { useToast } from '@/components/ui/Toast';

export default function AdminReviewsPage() {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [statusFilter, setStatusFilter] = useState('pending');
    const [page, setPage] = useState(1);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-reviews', statusFilter, page],
        queryFn: () => api.getAdminReviews(token!, { status: statusFilter || undefined, page, limit: 20 }),
        enabled: !!token,
    });

    const reviews = data?.data || [];
    const pagination = data?.pagination || {};

    const handleApprovalToggle = async (reviewId: string, nextApproved: boolean) => {
        try {
            await api.updateReviewStatus(reviewId, { isApproved: nextApproved }, token!);
            showToast(nextApproved ? 'Review approved' : 'Review moved to pending', 'success');
            refetch();
        } catch (error: any) {
            showToast(error.message || 'Failed to update review', 'error');
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Delete this review permanently?')) return;

        try {
            await api.deleteReview(reviewId, token!);
            showToast('Review deleted', 'success');
            refetch();
        } catch (error: any) {
            showToast(error.message || 'Failed to delete review', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Manage Reviews</h1>

            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">All Reviews</option>
                    <option value="pending">Pending Approval</option>
                    <option value="approved">Approved</option>
                </select>
            </div>

            <div className="space-y-4">
                {reviews.map((review: any) => (
                    <div key={review._id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">
                                    <strong>User:</strong> {review.userId?.name || 'Unknown'} ({review.userId?.email || 'N/A'})
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Product:</strong> {review.productId?.name || 'General'} {review.productId?.sku ? `(${review.productId.sku})` : ''}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Date:</strong> {new Date(review.createdAt).toLocaleString()}
                                </p>
                                <p className="text-sm">
                                    <strong>Rating:</strong> {review.rating}/5
                                </p>
                                <p className="text-gray-800">{review.comment}</p>
                                <p>
                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {review.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleApprovalToggle(review._id, !review.isApproved)}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium ${review.isApproved ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                >
                                    {review.isApproved ? 'Mark Pending' : 'Approve'}
                                </button>
                                <button
                                    onClick={() => handleDelete(review._id)}
                                    className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {reviews.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
                    No reviews found for this filter.
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>Page {page} of {pagination.totalPages}</span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= pagination.totalPages}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
