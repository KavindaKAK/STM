import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function AdminProductsPage() {
    const { token } = useAuth();
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({ type: '' });

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-products', page, filter],
        queryFn: () => api.getAdminProducts(token!, { ...filter, page, limit: 20 }),
        enabled: !!token,
    });

    const products = data?.data || [];
    const pagination = data?.pagination || {};

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.deleteProduct(id, token!);
            refetch();
            alert('Product deleted successfully');
        } catch (error: any) {
            alert(error.message || 'Failed to delete product');
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Products</h1>
                <Link
                    to="/admin/products/new"
                    className="bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800"
                >
                    + Add New Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <select
                    value={filter.type}
                    onChange={(e) => setFilter({ type: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="">All Types</option>
                    <option value="tyre">Tyres</option>
                    <option value="battery">Batteries</option>
                    <option value="accessory">Accessories</option>
                </select>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SKU
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
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
                        {products.map((product: any) => (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {product.sku}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {product.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatCurrency(product.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {product.stockQty}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                    <Link
                                        to={`/admin/products/${product._id}`}
                                        className="text-primary-900 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">Page {page} of {pagination.totalPages}</span>
                    <button
                        onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                        disabled={page >= pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
