'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

export default function CartPage() {
    const { user, token } = useAuth();
    const { refreshCart } = useCart();
    const { showToast } = useToast();
    const router = useRouter();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['cart'],
        queryFn: () => api.getCart(token!),
        enabled: !!token,
    });

    const cart = data?.data;
    const items = cart?.items || [];

    const handleUpdateQuantity = async (productId: string, qty: number) => {
        try {
            await api.updateCart({ productId, qty }, token!);
            await refetch();
            await refreshCart();
            showToast('Cart updated', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to update cart', 'error');
        }
    };

    const handleRemoveItem = async (productId: string) => {
        try {
            await api.updateCart({ productId, qty: 0 }, token!);
            await refetch();
            await refreshCart();
            showToast('Item removed from cart', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to remove item', 'error');
        }
    };

    const calculateSubtotal = () => {
        return items.reduce((total: number, item: any) => total + item.priceSnapshot * item.qty, 0);
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
                    <p className="text-gray-600 mb-4">Please login to view your cart</p>
                    <Button onClick={() => router.push('/login')}>Login</Button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
                    <p className="text-gray-600 mb-4">Your cart is empty</p>
                    <Button onClick={() => router.push('/')}>Continue Shopping</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item: any) => (
                        <div key={item.productId._id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-4">
                            <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                                <Image
                                    src={item.imageSnapshot || '/placeholder.png'}
                                    alt={item.nameSnapshot}
                                    fill
                                    className="object-cover rounded"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">{item.nameSnapshot}</h3>
                                <p className="text-gray-600 mb-2">SKU: {item.productId.sku}</p>
                                <p className="text-primary-900 font-bold text-xl">
                                    {formatCurrency(item.priceSnapshot)}
                                </p>
                            </div>

                            <div className="flex flex-col justify-between items-end">
                                <button
                                    onClick={() => handleRemoveItem(item.productId._id)}
                                    className="text-red-600 hover:text-red-800 mb-4"
                                >
                                    Remove
                                </button>

                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.productId._id, Math.max(1, item.qty - 1))}
                                        className="px-3 py-1 hover:bg-gray-100"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-1 border-x border-gray-300">{item.qty}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.productId._id, item.qty + 1)}
                                        className="px-3 py-1 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="text-gray-600 mt-2">
                                    Total: {formatCurrency(item.priceSnapshot * item.qty)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                        <h2 className="text-2xl font-bold mb-6">Cart Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold">{formatCurrency(calculateSubtotal())}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary-900">{formatCurrency(calculateSubtotal())}</span>
                            </div>
                        </div>

                        <Button
                            onClick={() => router.push('/checkout')}
                            className="w-full"
                        >
                            Proceed to Checkout
                        </Button>

                        <button
                            onClick={() => router.push('/')}
                            className="w-full mt-4 text-primary-900 hover:underline"
                        >
                            ← Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
