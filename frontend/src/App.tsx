import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster, ToastProvider } from '@/components/ui/Toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InitialSplashGate } from '@/components/layout/InitialSplashGate';
import { ThemeFloatingToggle } from '@/components/layout/ThemeFloatingToggle';

// Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import TyresPage from '@/pages/TyresPage';
import BatteriesPage from '@/pages/BatteriesPage';
import AccessoriesPage from '@/pages/AccessoriesPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ProductDetailsPage from '@/pages/products/ProductDetailsPage';
import OrdersPage from '@/pages/dashboard/OrdersPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminBrandsPage from '@/pages/admin/AdminBrandsPage';
import AdminReviewsPage from '@/pages/admin/AdminReviewsPage';
import AdminShippingFeesPage from '@/pages/admin/AdminShippingFeesPage';
import NewProductPage from '@/pages/admin/NewProductPage';

function App() {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <CartProvider>
                        <ToastProvider>
                            <InitialSplashGate>
                                <div className="flex min-h-screen flex-col">
                                    <Header />
                                    <main className="flex-1 min-h-0">
                                        <Routes>
                                        {/* Public Pages */}
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/about" element={<AboutPage />} />
                                        <Route path="/contact" element={<ContactPage />} />
                                        <Route path="/tyres" element={<TyresPage />} />
                                        <Route path="/batteries" element={<BatteriesPage />} />
                                        <Route path="/accessories" element={<AccessoriesPage />} />
                                        <Route path="/products/:id" element={<ProductDetailsPage />} />

                                        {/* Auth Pages */}
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/register" element={<RegisterPage />} />

                                        {/* User Pages */}
                                        <Route path="/cart" element={<CartPage />} />
                                        <Route path="/checkout" element={<CheckoutPage />} />
                                        <Route path="/dashboard" element={<DashboardPage />} />
                                        <Route path="/dashboard/orders" element={<OrdersPage />} />

                                        {/* Admin Pages */}
                                        <Route path="/admin" element={<AdminDashboardPage />} />
                                        <Route path="/admin/products" element={<AdminProductsPage />} />
                                        <Route path="/admin/products/new" element={<NewProductPage />} />
                                        <Route path="/admin/orders" element={<AdminOrdersPage />} />
                                        <Route path="/admin/brands" element={<AdminBrandsPage />} />
                                        <Route path="/admin/reviews" element={<AdminReviewsPage />} />
                                        <Route path="/admin/shipping" element={<AdminShippingFeesPage />} />

                                        {/* Catch all - 404 */}
                                        <Route path="*" element={<HomePage />} />
                                        </Routes>
                                    </main>
                                    <Footer />
                                    <ThemeFloatingToggle />
                                </div>
                                <Toaster />
                            </InitialSplashGate>
                        </ToastProvider>
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
