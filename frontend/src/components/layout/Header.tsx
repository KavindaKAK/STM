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
        <header className="sticky top-0 z-50 border-b border-[var(--header-border)] bg-[var(--header-bg)] text-[var(--header-text)] backdrop-blur-xl shadow-sm">
            <div className="bg-[var(--header-bg)] py-2">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-end text-xs md:text-sm">
                        <div className="ml-auto flex items-center gap-3">
                            <span className="text-[var(--header-muted)]">Welcome, {user ? user.name : 'Guest'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="overflow-hidden rounded-2xl border border-white/40 bg-white shadow-lg transition-all group-hover:scale-105 group-hover:shadow-2xl">
                            <img
                                src="https://res.cloudinary.com/dyisuan5k/image/upload/v1770894035/stm_iuoote.jpg"
                                alt="Sithuruwana Tyre Mart logo"
                                className="h-14 w-14 object-cover md:h-16 md:w-16"
                            />
                        </div>
                        <div className="hidden flex-col sm:flex">
                            <span className="text-xl font-bold md:text-2xl">
                                Sithuruwana
                            </span>
                            <span className="text-xs font-medium text-sky-400 md:text-sm">Tyre Mart</span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-1">
                        <Link to="/tyres" className="px-3 py-2 text-sm opacity-90 hover:opacity-100 transition-colors">Tyres</Link>
                        <Link to="/batteries" className="px-3 py-2 text-sm opacity-90 hover:opacity-100 transition-colors">Batteries</Link>
                        <Link to="/accessories" className="px-3 py-2 text-sm opacity-90 hover:opacity-100 transition-colors">Accessories</Link>
                        <Link to="/about" className="px-3 py-2 text-sm opacity-90 hover:opacity-100 transition-colors">About</Link>
                        <Link to="/contact" className="px-3 py-2 text-sm opacity-90 hover:opacity-100 transition-colors">Contact</Link>
                    </nav>

                    <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 rounded-lg border border-[var(--header-border)] bg-[var(--header-input-bg)] px-4 py-2 text-sm text-[var(--header-text)] placeholder-[var(--header-muted)] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="ml-2 rounded-lg px-3 py-2 text-sm opacity-80 transition-colors hover:opacity-100"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 rounded-lg px-3 py-2 transition-all hover:bg-white/10">
                                    <span className="hidden md:inline">{user.name}</span>
                                    <span className="inline md:hidden">Account</span>
                                </button>
                                <div className="invisible absolute right-0 mt-2 w-48 rounded-xl border border-[var(--header-border)] bg-[var(--header-menu-bg)] opacity-0 shadow-2xl transition-all group-hover:visible group-hover:opacity-100">
                                    <Link to="/dashboard" className="block rounded-t-xl px-4 py-3 hover:bg-white/10 transition-all">
                                        Dashboard
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="block px-4 py-3 hover:bg-white/10 transition-all">
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="w-full rounded-b-xl px-4 py-3 text-left text-red-300 transition-all hover:bg-red-600/20"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="rounded-lg px-3 py-2 transition-all hover:bg-white/10">
                                Account
                            </Link>
                        )}

                        <Link to="/cart" className="relative rounded-lg px-3 py-2 transition-all hover:bg-white/10">
                            Cart
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg px-3 py-2 text-sm transition-all hover:bg-white/10 md:hidden"
                        >
                            {mobileMenuOpen ? 'Close' : 'Menu'}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <nav className="mt-4 space-y-2 rounded-xl border border-[var(--header-border)] bg-[var(--header-menu-bg)] p-4 pb-4 shadow-lg md:hidden">
                        <Link to="/tyres" className="block rounded-lg px-4 py-2 opacity-90 transition-all hover:bg-white/10 hover:opacity-100">Tyres</Link>
                        <Link to="/batteries" className="block rounded-lg px-4 py-2 opacity-90 transition-all hover:bg-white/10 hover:opacity-100">Batteries</Link>
                        <Link to="/accessories" className="block rounded-lg px-4 py-2 opacity-90 transition-all hover:bg-white/10 hover:opacity-100">Accessories</Link>
                        <Link to="/about" className="block rounded-lg px-4 py-2 opacity-90 transition-all hover:bg-white/10 hover:opacity-100">About</Link>
                        <Link to="/contact" className="block rounded-lg px-4 py-2 opacity-90 transition-all hover:bg-white/10 hover:opacity-100">Contact</Link>
                        <form onSubmit={handleSearch} className="mt-4 flex">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 rounded-l-xl border border-[var(--header-border)] bg-[var(--header-input-bg)] px-4 py-2 text-[var(--header-text)] placeholder-[var(--header-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="rounded-r-xl bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700">
                                Go
                            </button>
                        </form>
                    </nav>
                )}
            </div>
        </header>
    );
}
