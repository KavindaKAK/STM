'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 shadow-sm border-b border-gray-200/50">
            {/* Top Bar - Minimal Apple Style */}
            <div className="bg-[#1d1d1f] text-white py-2">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-xs md:text-sm">
                        <div className="flex items-center space-x-6">
                            <span className="flex items-center space-x-2">
                                <span>📧</span>
                                <span className="hidden md:inline">support@sithuruwana.lk</span>
                            </span>
                            <span className="flex items-center space-x-2">
                                <span>📱</span>
                                <span>+94 77 123 4567</span>
                            </span>
                        </div>
                        <div>
                            {user ? (
                                <span className="text-gray-300">Welcome, {user.name}</span>
                            ) : (
                                <Link href="/login" className="hover:text-gray-300 transition-colors">
                                    Login / Register
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header - Minimal */}
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="bg-gradient-to-br from-primary-100 via-white to-primary-50 p-3 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all group-hover:scale-105 border border-white/40 backdrop-blur-sm">
                            <span className="text-4xl">🛞</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                                Sithuruwana
                            </span>
                            <span className="text-sm font-medium text-primary-600 -mt-1">Tyre Mart</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Apple Minimal */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <Link href="/tyres" className="px-3 py-2 text-sm text-gray-800 hover:text-black font-normal transition-colors">
                            Tyres
                        </Link>
                        <Link href="/batteries" className="px-3 py-2 text-sm text-gray-800 hover:text-black font-normal transition-colors">
                            Batteries
                        </Link>
                        <Link href="/accessories" className="px-3 py-2 text-sm text-gray-800 hover:text-black font-normal transition-colors">
                            Accessories
                        </Link>
                        <Link href="/about" className="px-3 py-2 text-sm text-gray-800 hover:text-black font-normal transition-colors">
                            About
                        </Link>
                        <Link href="/contact" className="px-3 py-2 text-sm text-gray-800 hover:text-black font-normal transition-colors">
                            Contact
                        </Link>
                    </nav>

                    {/* Search Bar - Apple Minimal */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm transition-all"
                        />
                        <button
                            type="submit"
                            className="ml-2 text-gray-600 hover:text-black px-3 py-2 transition-colors text-xl"
                        >
                            🔍
                        </button>
                    </form>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Account */}
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-900 px-3 py-2 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-all">
                                    <span>👤</span>
                                    <span className="hidden md:inline">{user.name}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <Link href="/dashboard" className="block px-4 py-3 hover:bg-white/60 rounded-t-xl transition-all">
                                        Dashboard
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin" className="block px-4 py-3 hover:bg-white/60 transition-all">
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-3 hover:bg-red-50/60 text-red-600 rounded-b-xl transition-all"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="text-gray-700 hover:text-primary-900 px-3 py-2 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-all">
                                <span className="flex items-center space-x-2">
                                    <span>👤</span>
                                    <span className="hidden md:inline">Account</span>
                                </span>
                            </Link>
                        )}

                        {/* Cart */}
                        <Link href="/cart" className="relative text-gray-700 hover:text-primary-900 px-3 py-2 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-all">
                            <span className="text-2xl">🛒</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-gray-700 px-3 py-2 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-all text-xl"
                        >
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Glassmorphism */}
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-4 pb-4 space-y-2 bg-white/60 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/40">
                        <Link href="/tyres" className="block py-2 px-4 text-gray-700 hover:text-primary-900 rounded-lg hover:bg-white/70 transition-all">
                            Tyres
                        </Link>
                        <Link href="/batteries" className="block py-2 px-4 text-gray-700 hover:text-primary-900 rounded-lg hover:bg-white/70 transition-all">
                            Batteries
                        </Link>
                        <Link href="/accessories" className="block py-2 px-4 text-gray-700 hover:text-primary-900 rounded-lg hover:bg-white/70 transition-all">
                            Accessories
                        </Link>
                        <Link href="/about" className="block py-2 px-4 text-gray-700 hover:text-primary-900 rounded-lg hover:bg-white/70 transition-all">
                            About
                        </Link>
                        <Link href="/contact" className="block py-2 px-4 text-gray-700 hover:text-primary-900 rounded-lg hover:bg-white/70 transition-all">
                            Contact
                        </Link>
                        <form onSubmit={handleSearch} className="flex mt-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button type="submit" className="bg-gradient-to-r from-primary-900 to-primary-800 text-white px-4 py-2 rounded-r-xl hover:from-primary-800 hover:to-primary-700 transition-all">
                                🔍
                            </button>
                        </form>
                    </nav>
                )}
            </div>
        </header>
    );
}
