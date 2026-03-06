import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function ProductDetailsPage() {
    const params = useParams();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const { data: productData, isLoading } = useQuery({
        queryKey: ['product', params.id],
        queryFn: () => api.getProduct(params.id as string),
    });

    const { data: reviewsData } = useQuery({
        queryKey: ['reviews', params.id],
        queryFn: () => api.getReviews({ productId: params.id }),
    });

    const product = productData?.data;
    const reviews = reviewsData?.data || [];

    const handleAddToCart = async () => {
        if (!user) {
            showToast('Please login to add items to cart', 'error');
            return;
        }

        if (!product?._id) {
            showToast('Product information is missing', 'error');
            return;
        }

        setIsAdding(true);
        try {
            await addToCart(product._id, quantity);
            showToast(`✓ Added ${quantity} item(s) to cart!`, 'success');
        } catch (error: any) {
            console.error('Add to cart error:', error);
            const errorMessage = error?.message || 'Failed to add to cart. Please try again.';
            showToast(errorMessage, 'error');
        } finally {
            setIsAdding(false);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>
                        ★
                    </span>
                ))}
            </div>
        );
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

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
                </div>
            </div>
        );
    }

    const isOutOfStock = product.stockQty === 0;
    const hasDiscount = product.price > product.salePrice;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    {/* Image Gallery */}
                    <div>
                        <div className="relative aspect-square mb-4">
                            <img
                                src={product.images[0] || '/placeholder.png'}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.slice(1, 5).map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square">
                                        <img src={img} alt={`${product.name} ${idx + 2}`} className="w-full h-full object-cover rounded" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                        <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

                        <div className="mb-6">
                            {hasDiscount && (
                                <div className="text-2xl text-gray-500 line-through mb-1">
                                    {formatCurrency(product.price)}
                                </div>
                            )}
                            <div className="text-4xl font-bold text-primary-900">
                                {formatCurrency(product.salePrice)}
                            </div>
                        </div>

                        <div className="mb-6">
                            {isOutOfStock ? (
                                <span className="text-red-600 font-bold text-lg">Out of Stock</span>
                            ) : (
                                <span className="text-green-600 font-semibold">
                                    In Stock ({product.stockQty} available)
                                </span>
                            )}
                        </div>

                        {product.shortDesc && (
                            <p className="text-gray-700 mb-6">{product.shortDesc}</p>
                        )}

                        {/* Quantity and Add to Cart */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-gray-100"
                                    disabled={isOutOfStock}
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-16 text-center border-x border-gray-300"
                                    disabled={isOutOfStock}
                                />
                                <button
                                    onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
                                    className="px-4 py-2 hover:bg-gray-100"
                                    disabled={isOutOfStock}
                                >
                                    +
                                </button>
                            </div>
                            <Button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || isAdding}
                                className="flex-1"
                            >
                                🛒 Add to Cart
                            </Button>
                        </div>

                        {/* Specifications */}
                        <div className="border-t pt-6">
                            <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                            <table className="w-full">
                                <tbody>
                                    <tr className="border-b">
                                        <td className="py-2 font-medium">SKU</td>
                                        <td className="py-2 text-gray-600">{product.sku}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-medium">Brand</td>
                                        <td className="py-2 text-gray-600">{product.brand}</td>
                                    </tr>
                                    {product.type === 'tyre' && (
                                        <>
                                            <tr className="border-b">
                                                <td className="py-2 font-medium">Size</td>
                                                <td className="py-2 text-gray-600">
                                                    {product.specs?.width}/{product.specs?.profile}R{product.specs?.rim}
                                                </td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-2 font-medium">Speed Rating</td>
                                                <td className="py-2 text-gray-600">{product.specs?.speedRating}</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Long Description */}
                {product.longDesc && (
                    <div className="border-t p-8">
                        <h3 className="text-2xl font-semibold mb-4">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{product.longDesc}</p>
                    </div>
                )}

                {/* Reviews Section */}
                {reviews.length > 0 && (
                    <div className="border-t p-8">
                        <h3 className="text-2xl font-semibold mb-6">Customer Reviews</h3>
                        <div className="space-y-6">
                            {reviews.map((review: any) => (
                                <div key={review._id} className="border-b pb-6">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="font-semibold">{review.userId?.name}</h4>
                                        <span className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="mb-2">{renderStars(review.rating)}</div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
