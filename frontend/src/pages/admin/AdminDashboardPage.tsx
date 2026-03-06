import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminDashboardPage() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [user, isLoading, navigate]);

    if (isLoading || !user || user.role !== 'admin') {
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
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                    to="/admin/products"
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                >
                    <div className="text-5xl mb-4">📦</div>
                    <h2 className="text-2xl font-bold mb-2">Products</h2>
                    <p className="text-gray-600">Manage tyres, batteries & accessories</p>
                </Link>

                <Link
                    to="/admin/orders"
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                >
                    <div className="text-5xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold mb-2">Orders</h2>
                    <p className="text-gray-600">View and update order status</p>
                </Link>

                <Link
                    to="/admin/reviews"
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                >
                    <div className="text-5xl mb-4">⭐</div>
                    <h2 className="text-2xl font-bold mb-2">Reviews</h2>
                    <p className="text-gray-600">Moderate customer reviews</p>
                </Link>

                <Link
                    to="/admin/banners"
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                >
                    <div className="text-5xl mb-4">🖼️</div>
                    <h2 className="text-2xl font-bold mb-2">Banners</h2>
                    <p className="text-gray-600">Manage hero slider banners</p>
                </Link>

                <Link
                    to="/admin/brands"
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                >
                    <div className="text-5xl mb-4">🏷️</div>
                    <h2 className="text-2xl font-bold mb-2">Brands</h2>
                    <p className="text-gray-600">Manage product brands</p>
                </Link>

                <Link
                    to="/admin/shipping"
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                >
                    <div className="text-5xl mb-4">🚚</div>
                    <h2 className="text-2xl font-bold mb-2">Shipping Fees</h2>
                    <p className="text-gray-600">Configure district shipping rates</p>
                </Link>

                <Link
                    to="/admin/blog"
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                >
                    <div className="text-5xl mb-4">📝</div>
                    <h2 className="text-2xl font-bold mb-2">Blog Posts</h2>
                    <p className="text-gray-600">Manage blog content</p>
                </Link>
            </div>
        </div>
    );
}
