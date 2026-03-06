'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminBrandsPage() {
    const { user, token, isLoading: isAuthLoading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
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
            router.push('/');
        }
    }, [isAuthLoading, router, user]);

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

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;
        if (!token) {
            showToast('Please login as admin to manage brands', 'error');
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

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        if (!token) {
            showToast('Please login as admin to manage brands', 'error');
            return;
        }
        try {
            const brand = brands.find((b: any) => b._id === id);
            if (!brand) {
                showToast('Brand not found', 'error');
                return;
            }
            await api.updateBrand(id, {
                ...brand,
                isActive: !currentStatus,
            }, token);

            showToast('Status updated successfully', 'success');
            refetch();
        } catch (error: any) {
            showToast(error.message || 'Failed to update status', 'error');
        }
    };

    if (isLoading || isAuthLoading || !user || user.role !== 'admin') {
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Brands</h1>
                <Button onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : '+ Add New Brand'}
                </Button>
            </div>

            {/* Add Brand Form */}
            {isAdding && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Add New Brand</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Brand Name *"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="e.g., Michelin"
                            />
                            <Input
                                label="Logo URL (optional)"
                                value={formData.logoUrl}
                                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                placeholder="https://example.com/logo.png"
                            />
                            <Input
                                label="Sort Order (optional)"
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                                placeholder="Auto-assigned"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Create Brand</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Brands List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Brand Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Logo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sort Order
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {brands.map((brand: any) => (
                            <tr key={brand._id} className={editingId === brand._id ? 'bg-blue-50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingId === brand._id ? (
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingId === brand._id ? (
                                        <input
                                            type="text"
                                            value={editData.logoUrl}
                                            onChange={(e) => setEditData({ ...editData, logoUrl: e.target.value })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                            placeholder="Logo URL"
                                        />
                                    ) : (
                                        <img
                                            src={brand.logoUrl}
                                            alt={brand.name}
                                            className="h-8 w-auto"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://via.placeholder.com/150x50?text=${encodeURIComponent(brand.name)}`;
                                            }}
                                        />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {editingId === brand._id ? (
                                        <input
                                            type="number"
                                            value={editData.sortOrder}
                                            onChange={(e) => setEditData({ ...editData, sortOrder: Number.parseInt(e.target.value || '0', 10) })}
                                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        brand.sortOrder
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleStatus(brand._id, brand.isActive)}
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${brand.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {brand.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {editingId === brand._id ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleUpdate(brand._id)}
                                                className="text-green-600 hover:underline"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="text-gray-600 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => startEdit(brand)}
                                                className="text-primary-900 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(brand._id, brand.name)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {brands.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-600">No brands found. Add your first brand above!</p>
                </div>
            )}
        </div>
    );
}
