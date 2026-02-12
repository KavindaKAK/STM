'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { useState } from 'react';

interface ProductCardProps {
    product: any;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            showToast('Please login to add items to cart', 'error');
            return;
        }

        setIsAdding(true);
        try {
            await addToCart(product._id, 1);
            showToast('Added to cart!', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to add to cart', 'error');
        } finally {
            setIsAdding(false);
        }
    };

    const isOutOfStock = product.stockQty === 0;

    // Get tagline based on product type
    const getTagline = () => {
        if (product.type === 'tyre') {
            return 'Premium performance and durability.';
        } else if (product.type === 'battery') {
            return 'Reliable power when you need it most.';
        } else {
            return 'Quality accessories for your vehicle.';
        }
    };

    // Calculate monthly payment (example: 24 months)
    const monthlyPayment = (product.salePrice / 24).toFixed(2);

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            {/* Product Image */}
            <Link href={`/products/${product._id}`} className="block">
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                        src={product.images[0] || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">Out of Stock</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div className="px-6 pb-8 text-center">
                {/* Product Name */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {product.name}
                </h3>

                {/* Tagline */}
                <p className="text-base text-gray-600 font-normal mb-1 line-clamp-2">
                    {product.description || getTagline()}
                </p>

                {/* Brand */}
                <p className="text-sm text-gray-500 mb-4">
                    {product.brand}
                </p>

                {/* Pricing */}
                <p className="text-lg font-normal text-gray-900 mb-6">
                    From <span className="font-semibold">{formatCurrency(product.salePrice)}</span> or{' '}
                    <span className="font-semibold">{formatCurrency(parseFloat(monthlyPayment))}/mo.</span> for 24 mo.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link
                        href={`/products/${product._id}`}
                        className="px-6 py-2.5 bg-[#0071e3] text-white rounded-full text-sm font-semibold hover:bg-[#0077ed] transition-colors"
                    >
                        Learn more
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || isAdding}
                        className="px-6 py-2.5 text-[#0071e3] text-sm font-normal hover:underline disabled:text-gray-400 disabled:no-underline transition-colors"
                    >
                        {isAdding ? 'Adding...' : 'Buy ›'}
                    </button>
                </div>
            </div>
        </div>
    );
}
