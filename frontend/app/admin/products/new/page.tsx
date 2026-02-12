'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

export default function NewProductPage() {
    const { token } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();

    const [productType, setProductType] = useState<'tyre' | 'battery' | 'accessory'>('tyre');
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        sku: '',
        price: '',
        discountType: '',
        discountValue: '',
        stockQty: '',
        images: '',
        shortDesc: '',
        longDesc: '',
        tags: '',
        // Tyre specific
        width: '',
        profile: '',
        rim: '',
        speedRating: '',
        loadIndex: '',
        vehicleType: '',
        // Battery specific
        voltage: '',
        ampereHours: '',
        cca: '',
        warranty: '',
        // Accessory specific
        accessoryCategory: 'oil',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: brandsData } = useQuery({
        queryKey: ['brands'],
        queryFn: api.getBrands,
    });

    const brands = brandsData?.data || [];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const price = parseFloat(formData.price);
            const discountValue = parseFloat(formData.discountValue) || 0;
            let salePrice = price;

            if (formData.discountType === 'fixed') {
                salePrice = price - discountValue;
            } else if (formData.discountType === 'percent') {
                salePrice = price - (price * discountValue / 100);
            }

            const productData: any = {
                type: productType,
                name: formData.name,
                brand: formData.brand,
                sku: formData.sku,
                price,
                discountType: formData.discountType || null,
                discountValue,
                salePrice,
                stockQty: parseInt(formData.stockQty),
                images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
                shortDesc: formData.shortDesc,
                longDesc: formData.longDesc,
                tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
                status: 'active',
                salesCount: 0,
                specs: {},
            };

            if (productType === 'tyre') {
                productData.specs = {
                    width: formData.width,
                    profile: formData.profile,
                    rim: formData.rim,
                    speedRating: formData.speedRating,
                    loadIndex: formData.loadIndex,
                    vehicleType: formData.vehicleType,
                };
            } else if (productType === 'battery') {
                productData.specs = {
                    voltage: formData.voltage,
                    ampereHours: formData.ampereHours,
                    cca: formData.cca,
                    warranty: formData.warranty,
                    vehicleType: formData.vehicleType,
                };
            } else if (productType === 'accessory') {
                productData.accessoryCategory = formData.accessoryCategory;
                productData.specs = {
                    description: formData.description,
                };
            }

            await api.createProduct(productData, token!);
            showToast('Product created successfully!', 'success');
            router.push('/admin/products');
        } catch (error: any) {
            showToast(error.message || 'Failed to create product', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Add New Product</h1>
                <Link href="/admin/products" className="text-primary-900 hover:underline">
                    ← Back to Products
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 max-w-4xl">
                {/* Product Type Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Type *</label>
                    <div className="grid grid-cols-3 gap-4">
                        {(['tyre', 'battery', 'accessory'] as const).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setProductType(type)}
                                className={`px-4 py-3 rounded-lg font-medium ${productType === type
                                        ? 'bg-primary-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4 mb-6">
                    <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Product Name *"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Michelin Primacy 4"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                            <select
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            >
                                <option value="">Select Brand</option>
                                {brands.map((brand: any) => (
                                    <option key={brand._id} value={brand.name}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="SKU *"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            placeholder="e.g., TYR-MICH-205-55-16"
                        />
                        <Input
                            label="Stock Quantity *"
                            name="stockQty"
                            type="number"
                            value={formData.stockQty}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4 mb-6">
                    <h2 className="text-xl font-semibold border-b pb-2">Pricing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Price (LKR) *"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">No Discount</option>
                                <option value="fixed">Fixed Amount</option>
                                <option value="percent">Percentage</option>
                            </select>
                        </div>
                        {formData.discountType && (
                            <Input
                                label={`Discount ${formData.discountType === 'percent' ? '(%)' : '(LKR)'}`}
                                name="discountValue"
                                type="number"
                                value={formData.discountValue}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                        )}
                    </div>
                </div>

                {/* Product Specifications - Type Specific */}
                <div className="space-y-4 mb-6">
                    <h2 className="text-xl font-semibold border-b pb-2">Specifications</h2>

                    {productType === 'tyre' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Width *" name="width" value={formData.width} onChange={handleChange} required placeholder="205" />
                            <Input label="Profile *" name="profile" value={formData.profile} onChange={handleChange} required placeholder="55" />
                            <Input label="Rim *" name="rim" value={formData.rim} onChange={handleChange} required placeholder="16" />
                            <Input label="Speed Rating *" name="speedRating" value={formData.speedRating} onChange={handleChange} required placeholder="V" />
                            <Input label="Load Index *" name="loadIndex" value={formData.loadIndex} onChange={handleChange} required placeholder="91" />
                            <Input label="Vehicle Type *" name="vehicleType" value={formData.vehicleType} onChange={handleChange} required placeholder="Sedan" />
                        </div>
                    )}

                    {productType === 'battery' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Voltage (V) *" name="voltage" value={formData.voltage} onChange={handleChange} required placeholder="12" />
                            <Input label="Ampere Hours (Ah) *" name="ampereHours" value={formData.ampereHours} onChange={handleChange} required placeholder="45" />
                            <Input label="CCA *" name="cca" value={formData.cca} onChange={handleChange} required placeholder="330" />
                            <Input label="Warranty (months) *" name="warranty" value={formData.warranty} onChange={handleChange} required placeholder="36" />
                            <Input label="Vehicle Type *" name="vehicleType" value={formData.vehicleType} onChange={handleChange} required placeholder="Compact Car" />
                        </div>
                    )}

                    {productType === 'accessory' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    name="accessoryCategory"
                                    value={formData.accessoryCategory}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    required
                                >
                                    <option value="oil">Oil \u0026 Lubricants</option>
                                    <option value="parts">Parts</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                            </div>
                            <Input label="Description *" name="description" value={formData.description} onChange={handleChange} required placeholder="Product specifications" />
                        </div>
                    )}
                </div>

                {/* Description \u0026 Media */}
                <div className="space-y-4 mb-6">
                    <h2 className="text-xl font-semibold border-b pb-2">Description \u0026 Media</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                        <textarea
                            name="shortDesc"
                            value={formData.shortDesc}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={2}
                            required
                            placeholder="Brief product description"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
                        <textarea
                            name="longDesc"
                            value={formData.longDesc}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={4}
                            placeholder="Detailed product information"
                        />
                    </div>
                    <Input
                        label="Image URLs (comma separated) *"
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        required
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                    <Input
                        label="Tags (comma separated)"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="premium, sedan, touring"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                    <Link href="/admin/products" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancel
                    </Link>
                    <Button type="submit" isLoading={isSubmitting}>
                        Create Product
                    </Button>
                </div>
            </form>
        </div>
    );
}
