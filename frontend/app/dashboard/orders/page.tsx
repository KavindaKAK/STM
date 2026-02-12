'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';

export default function OrdersPage() {
    const { token } = useAuth();

    const { data, isLoading } = useQuery({
        queryKey: ['my-orders'],
        queryFn: () => api.getMyOrders(token!),
        enabled: !!token,
    });

    const orders = data?.data || [];

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
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-600 text-lg">No orders yet</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: any) => (
                        <div key={order._id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">Order ID: {order._id.slice(-8).toUpperCase()}</h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="border-t pt-4">
                                <div className="space-y-2">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.nameSnapshot} × {item.qty}
                                            </span>
                                            <span>{formatCurrency(item.priceSnapshot * item.qty)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t mt-4 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Items Total</span>
                                        <span>{formatCurrency(order.pricing.itemsTotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping ({order.district})</span>
                                        <span>{formatCurrency(order.pricing.shippingFee)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Grand Total</span>
                                        <span className="text-primary-900">{formatCurrency(order.pricing.grandTotal)}</span>
                                    </div>
                                </div>

                                <div className="border-t mt-4 pt-4 text-sm text-gray-600">
                                    <p>
                                        <strong>Shipping Address:</strong> {order.shippingAddress.line1},{' '}
                                        {order.shippingAddress.city}, {order.district}
                                    </p>
                                    <p>
                                        <strong>Payment:</strong> {order.payment.method.toUpperCase()} -{' '}
                                        {order.payment.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
