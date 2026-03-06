import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { DISTRICTS } from '@/types';

export default function CheckoutPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [shippingAddress, setShippingAddress] = useState({
        line1: '',
        line2: '',
        city: '',
        district: '',
        postalCode: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: cartData } = useQuery({
        queryKey: ['cart'],
        queryFn: () => api.getCart(token!),
        enabled: !!token,
    });

    const { data: shippingFeesData } = useQuery({
        queryKey: ['shipping-fees'],
        queryFn: api.getShippingFees,
    });

    const cart = cartData?.data;
    const items = cart?.items || [];
    const shippingFees = shippingFeesData?.data || [];

    const calculateSubtotal = () => {
        return items.reduce((total: number, item: any) => total + item.priceSnapshot * item.qty, 0);
    };

    const getShippingFee = () => {
        if (!shippingAddress.district) return 0;
        const fee = shippingFees.find((f: any) => f.district === shippingAddress.district);
        return fee?.feeLkr || 0;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + getShippingFee();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shippingAddress.district) {
            showToast('Please select a district', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const response: any = await api.checkout({
                shippingAddress,
                paymentMethod,
            }, token!);

            showToast('Order placed successfully!', 'success');
            navigate(`/dashboard/orders`);
        } catch (error: any) {
            showToast(error.message || 'Failed to place order', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Your cart is empty</p>
                    <Button onClick={() => navigate('/')}>Continue Shopping</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Name" value={user.name} disabled />
                                <Input label="Email" value={user.email} disabled />
                                <Input label="Phone" value={user.phone} disabled />
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                            <div className="space-y-4">
                                <Input
                                    label="Address Line 1"
                                    value={shippingAddress.line1}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                                    required
                                    placeholder="123 Main Street"
                                />
                                <Input
                                    label="Address Line 2 (Optional)"
                                    value={shippingAddress.line2}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
                                    placeholder="Apartment, suite, etc."
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="City"
                                        value={shippingAddress.city}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        required
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            District *
                                        </label>
                                        <select
                                            value={shippingAddress.district}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            required
                                        >
                                            <option value="">Select District</option>
                                            {DISTRICTS.map((district) => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <Input
                                    label="Postal Code"
                                    value={shippingAddress.postalCode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                    required
                                    placeholder="10400"
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-primary-900"
                                    />
                                    <span className="font-medium">Cash on Delivery (COD)</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-not-allowed opacity-50">
                                    <input
                                        type="radio"
                                        value="card"
                                        disabled
                                        className="w-4 h-4"
                                    />
                                    <span>Card Payment (Coming Soon)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {items.map((item: any) => (
                                    <div key={item.productId._id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.nameSnapshot} × {item.qty}
                                        </span>
                                        <span>{formatCurrency(item.priceSnapshot * item.qty)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">{formatCurrency(calculateSubtotal())}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold">{formatCurrency(getShippingFee())}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-900">{formatCurrency(calculateTotal())}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full mt-6"
                                isLoading={isSubmitting}
                            >
                                Place Order
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
