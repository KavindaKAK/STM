import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useNavigate } from 'react-router-dom';

export default function AdminBrandsPage() {
    const { user, token, isLoading: isAuthLoading } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        logoUrl: '',
        sortOrder: '',
    });
    const [editData, setEditData] = useState<any>({});

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'admin')) {
            navigate('/');
        }
    }, [isAuthLoading, navigate, user]);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-brands'],
        queryFn: api.getBrands,
    });

    const brands = data?.data || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            showToast('Please login as admin to manage brands', 'error');
            return;
        }

        try {
            await api.createBrand({
                name: formData.name,
                logoUrl: formData.logoUrl || `https://via.placeholder.com/150x50?text=${encodeURIComponent(formData.name)}`,
                sortOrder: parseInt(formData.sortOrder) || brands.length + 1,
                isActive: true,
            }, token!);

            showToast('Brand created successfully!', 'success');
            setFormData({ name: '', logoUrl: '', sortOrder: '' });
            setIsAdding(false);
            refetch();
        } catch (error: any) {
            showToast(error.message || 'Failed to create brand', 'error');
        }
    };

    const startEdit = (brand: any) => {
        setEditingId(brand._id);
        setEditData({
            name: brand.name,
            logoUrl: brand.logoUrl,
            sortOrder: brand.sortOrder,
            isActive: brand.isActive,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleUpdate = async (id: string) => {
        if (!token) {
            showToast('Please login as admin to manage brands', 'error');
            return;
        }
        try {
            const payload = {
                name: (editData.name || '').trim(),
                logoUrl: (editData.logoUrl || '').trim(),
                sortOrder: Number.isFinite(editData.sortOrder) ? editData.sortOrder : 0,
                isActive: typeof editData.isActive === 'boolean' ? editData.isActive : true,
            };
            await api.updateBrand(id, payload, token);

            showToast('Brand updated successfully', 'success');
            setEditingId(null);
            setEditData({});
            refetch();
        } catch (error: any) {
            showToast(error.message || 'Failed to update brand', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this brand?')) return;
        if (!token) {
            showToast('Please login as admin', 'error');
            return;
        }

        try {
            await api.deleteBrand(id, token);
            showToast('Brand deleted successfully', 'success');
            refetch();
        } catch (error: any) {
            showToast(error.message || 'Failed to delete brand', 'error');
        }
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Manage Brands</h1>

            {/* Add New Brand Form */}
            {!isAdding ? (
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800 mb-8"
                >
                    + Add New Brand
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">Add New Brand</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Input
                            label="Brand Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Logo URL"
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                            placeholder="Leave blank for auto-generated"
                        />
                        <Input
                            label="Sort Order"
                            type="number"
                            value={formData.sortOrder}
                            onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                        />
                    </div>
                    <div className="space-x-3">
                        <button
                            type="submit"
                            className="bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800"
                        >
                            Add Brand
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Brands List */}
            <div className="space-y-4">
                {brands.map((brand: any) => (
                    <div key={brand._id} className="bg-white rounded-lg shadow p-6">
                        {editingId === brand._id ? (
                            // Edit Mode
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        label="Brand Name"
                                        value={editData.name}
                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    />
                                    <Input
                                        label="Logo URL"
                                        value={editData.logoUrl}
                                        onChange={(e) => setEditData({ ...editData, logoUrl: e.target.value })}
                                    />
                                    <Input
                                        label="Sort Order"
                                        type="number"
                                        value={editData.sortOrder}
                                        onChange={(e) => setEditData({ ...editData, sortOrder: e.target.value })}
                                    />
                                </div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={editData.isActive}
                                        onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <span>Active</span>
                                </label>
                                <div className="space-x-3">
                                    <button
                                        onClick={() => handleUpdate(brand._id)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {brand.logoUrl && (
                                        <img src={brand.logoUrl} alt={brand.name} className="h-12 w-auto" />
                                    )}
                                    <div>
                                        <h3 className="font-semibold">{brand.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            Sort Order: {brand.sortOrder} {' '}
                                            <span className={brand.isActive ? 'text-green-600' : 'text-red-600'}>
                                                {brand.isActive ? '(Active)' : '(Inactive)'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="space-x-3">
                                    <button
                                        onClick={() => startEdit(brand)}
                                        className="text-primary-900 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(brand._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

