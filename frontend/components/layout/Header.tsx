import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#111827] shadow-sm border-b border-gray-700/50">
            {/* Top Bar - Minimal Apple Style */}
            <div className="bg-[#111827] text-white py-2">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-xs md:text-sm">
                        <div className="flex items-center space-x-6">
                            <span className="flex items-center space-x-2">
                                <span>E-mail📧:-</span>
                                <span className="hidden md:inline">sithuruwana.tyremart@gmail.com</span>
                            </span>
                            <span className="flex items-center space-x-2">
                                <span>📱</span>
                                <span>+94 77 644 1425</span>
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
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="rounded-2xl shadow-lg group-hover:shadow-2xl transition-all group-hover:scale-105 border border-white/40 backdrop-blur-sm overflow-hidden bg-white">
                            <img
                                src="https://res.cloudinary.com/dyisuan5k/image/upload/v1770894035/stm_iuoote.jpg"
                                alt="Sithuruwana Tyre Mart logo"
                                className="h-16 w-16 object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-white">
                                Sithuruwana
                            </span>
                            <span className="text-sm font-medium text-blue-400 -mt-1">Tyre Mart</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Apple Minimal */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <Link to="/tyres" className="px-3 py-2 text-sm text-white/90 hover:text-white font-normal transition-colors">
                            Tyres
                        </Link>
                        <Link to="/batteries" className="px-3 py-2 text-sm text-white/90 hover:text-white font-normal transition-colors">
                            Batteries
                        </Link>
                        <Link to="/accessories" className="px-3 py-2 text-sm text-white/90 hover:text-white font-normal transition-colors">
                            Accessories
                        </Link>
                        <Link to="/about" className="px-3 py-2 text-sm text-white/90 hover:text-white font-normal transition-colors">
                            About
                        </Link>
                        <Link to="/contact" className="px-3 py-2 text-sm text-white/90 hover:text-white font-normal transition-colors">
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
                            className="flex-1 px-4 py-2 bg-gray-700 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm placeholder-gray-400 transition-all"
                        />
                        <button
                            type="submit"
                            className="ml-2 text-white/80 hover:text-white px-3 py-2 transition-colors text-xl"
                        >
                            🔍
                        </button>
                    </form>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Account */}
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all">
                                    <span>👤</span>
                                    <span className="hidden md:inline">{user.name}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-[#1f2937]/95 backdrop-blur-xl border border-gray-600/40 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <Link to="/dashboard" className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-t-xl transition-all">
                                        Dashboard
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="block px-4 py-3 text-white/90 hover:bg-white/10 transition-all">
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-3 hover:bg-red-600/20 text-red-400 rounded-b-xl transition-all"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all">
                                <span className="flex items-center space-x-2">
                                    <span>👤</span>
                                    <span className="hidden md:inline">Account</span>
                                </span>
                            </Link>
                        )}

                        {/* Cart */}
                        <Link to="/cart" className="relative text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all">
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
                            className="md:hidden text-white/90 px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all text-xl"
                        >
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Glassmorphism */}
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-4 pb-4 space-y-2 bg-[#1f2937]/95 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-gray-600/40">
                        <Link href="/tyres" className="block py-2 px-4 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            Tyres
                        </Link>
                        <Link href="/batteries" className="block py-2 px-4 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            Batteries
                        </Link>
                        <Link href="/accessories" className="block py-2 px-4 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            Actoories
                        </Link>
                        <Link href="/about" className="block py-2 px-4 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            Abto
                        </Link>
                        <Link href="/contact" className="block py-2 px-4 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all">
                            Cotot
                        </Link>
                        <form onSubmit={handleSearch} className="flex mt-4">
                            <ito
                                type="text"
                                placeholder="Search..."
                              tolue={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-2 bg-gray-700 backdrop-blur-md border border-gray-600 rounded-l-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-xl hover:bg-blue-700 transition-all">
                                🔍
                            </button>
                        </form>
                    </nav>
                )}
            </div>
        </header>
    );
}

