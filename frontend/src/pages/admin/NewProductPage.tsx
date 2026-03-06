import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function NewProductPage() {
    const { token } = useAuth();
    const navigate = useNavigate();
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
        width: '',
        profile: '',
        rim: '',
        speedRating: '',
        loadIndex: '',
        vehicleType: '',
        voltage: '',
        ampereHours: '',
        cca: '',
        warranty: '',
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
                };
            }

            await api.createProduct(productData, token!);
            showToast('Product created successfully!', 'success');
            navigate('/admin/products');
        } catch (error: any) {
            showToast(error.message || 'Failed to create product', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 max-w-4xl">
                {/* Product Type */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Type *</label>
                    <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value as 'tyre' | 'battery' | 'accessory')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                    >
                        <option value="tyre">Tyre</option>
                        <option value="battery">Battery</option>
                        <option value="accessory">Accessory</option>
                    </select>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input
                        label="Product Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
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
                            {brands.map(brand => (
                                <option key={brand._id} value={brand.name}>{brand.name}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="SKU *"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Stock Quantity *"
                        name="stockQty"
                        type="number"
                        value={formData.stockQty}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Input
                        label="Price (LKR) *"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                        <select
                            name="discountType"
                            value={formData.discountType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">None</option>
                            <option value="fixed">Fixed</option>
                            <option value="percent">Percentage</option>
                        </select>
                    </div>
                    <Input
                        label="Discount Value"
                        name="discountValue"
                        type="number"
                        value={formData.discountValue}
                        onChange={handleChange}
                    />
                </div>

                {/* Descriptions */}
                <div className="mb-6">
                    <Input
                        label="Short Description"
                        name="shortDesc"
                        value={formData.shortDesc}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
                    <textarea
                        name="longDesc"
                        value={formData.longDesc}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={4}
                    ></textarea>
                </div>

                {/* Images */}
                <div className="mb-6">
                    <Input
                        label="Images (comma-separated URLs)"
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                    />
                </div>

                {/* Tags */}
                <div className="mb-6">
                    <Input
                        label="Tags (comma-separated)"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                    />
                </div>

                {/* Specifications based on type */}
                {productType === 'tyre' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Input label="Width" name="width" value={formData.width} onChange={handleChange} />
                        <Input label="Profile" name="profile" value={formData.profile} onChange={handleChange} />
                        <Input label="Rim" name="rim" value={formData.rim} onChange={handleChange} />
                        <Input label="Speed Rating" name="speedRating" value={formData.speedRating} onChange={handleChange} />
                        <Input label="Load Index" name="loadIndex" value={formData.loadIndex} onChange={handleChange} />
                        <Input label="Vehicle Type" name="vehicleType" value={formData.vehicleType} onChange={handleChange} />
                    </div>
                )}

                {productType === 'battery' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Input label="Voltage" name="voltage" value={formData.voltage} onChange={handleChange} />
                        <Input label="Ampere Hours" name="ampereHours" value={formData.ampereHours} onChange={handleChange} />
                        <Input label="CCA" name="cca" value={formData.cca} onChange={handleChange} />
                        <Input label="Warranty" name="warranty" value={formData.warranty} onChange={handleChange} />
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                    <Button type="submit" isLoading={isSubmitting}>
                        Create Product
                    </Button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
