import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function AdminOrdersPage() {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-orders', statusFilter, page],
        queryFn: () => api.getAdminOrders(token!, { status: statusFilter || undefined, page, limit: 20 }),
        enabled: !!token,
    });

    const orders = data?.data || [];
    const pagination = data?.pagination || {};

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            await api.updateOrderStatus(orderId, { status: newStatus }, token!);
            refetch();
            showToast('Order status updated', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to update status', 'error');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

            {/* Filter */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">All Statuses</option>
                    <option value="new">New</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {orders.map((order: any) => (
                    <div key={order._id} className="bg-white rounded-lg shadow p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-600">Order ID</p>
                                <p className="font-semibold">{order._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Customer</p>
                                <p className="font-semibold">{order.customerSnapshot.name}</p>
                                <p className="text-sm text-gray-500">{order.customerSnapshot.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="font-semibold text-primary-900">{formatCurrency(order.pricing.grandTotal)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                    className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${getStatusColor(order.status)}`}
                                >
                                    <option value="new">New</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Items:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                {order.items.map((item: any, idx: number) => (
                                    <li key={idx}>
                                        {item.nameSnapshot} × {item.qty} - {formatCurrency(item.priceSnapshot * item.qty)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">Page {page} of {pagination.totalPages}</span>
                    <button
                        onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                        disabled={page >= pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
