'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
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
            <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                    href="/dashboard/orders"
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                >
                    <div className="text-5xl mb-4">📦</div>
                    <h2 className="text-2xl font-bold mb-2">My Orders</h2>
                    <p className="text-gray-600">View and track your orders</p>
                </Link>

                <Link
                    href="/dashboard/addresses"
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                >
                    <div className="text-5xl mb-4">📍</div>
                    <h2 className="text-2xl font-bold mb-2">Addresses</h2>
                    <p className="text-gray-600">Manage delivery addresses</p>
                </Link>

                <Link
                    href="/dashboard/wishlist"
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                >
                    <div className="text-5xl mb-4">♥</div>
                    <h2 className="text-2xl font-bold mb-2">Wishlist</h2>
                    <p className="text-gray-600">View saved items</p>
                </Link>

                <Link
                    href="/dashboard/profile"
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                >
                    <div className="text-5xl mb-4">👤</div>
                    <h2 className="text-2xl font-bold mb-2">Profile</h2>
                    <p className="text-gray-600">Update your information</p>
                </Link>

                {user.role === 'admin' && (
                    <Link
                        href="/admin"
                        className="bg-primary-900 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8"
                    >
                        <div className="text-5xl mb-4">⚙️</div>
                        <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
                        <p className="text-gray-200">Manage the store</p>
                    </Link>
                )}
            </div>
        </div>
    );
}
