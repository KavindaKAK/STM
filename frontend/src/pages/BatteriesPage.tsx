import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ProductCard } from '@/components/products/ProductCard';
import { FilterPanel } from '@/components/products/FilterPanel';
import { Button } from '@/components/ui/Button';

export default function BatteriesPage() {
    const [filters, setFilters] = useState<any>({ type: 'battery', inStock: false });
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const { data: brandsData } = useQuery({
        queryKey: ['brands'],
        queryFn: api.getBrands,
    });

    const { data: productsData, isLoading } = useQuery({
        queryKey: ['batteries', filters, sort, page],
        queryFn: () => api.getProducts({ ...filters, sort, page, limit: 12 }),
    });

    const brands = brandsData?.data || [];
    const products = productsData?.data || [];
    const pagination = productsData?.pagination || {};

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Apple-Style Header */}
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold text-[var(--text-main)] mb-4">Automotive Batteries</h1>
                <p className="text-xl text-[var(--text-muted)] font-light max-w-2xl mx-auto">
                    Reliable power for every journey. Built to last.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <FilterPanel
                        productType="battery"
                        brands={brands}
                        filters={filters}
                        onFilterChange={setFilters}
                    />
                </aside>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="lg:hidden rounded-lg border border-[var(--border-color)] bg-[var(--card-soft-bg)] px-4 py-2 text-sm text-[var(--text-main)] transition-colors hover:brightness-95"
                            >
                                Filters
                            </button>
                            <span className="text-sm text-[var(--text-muted)]">
                                {pagination.total || 0} {pagination.total === 1 ? 'product' : 'products'}
                            </span>
                        </div>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="rounded-lg border border-[var(--border-color)] bg-[var(--card-soft-bg)] px-4 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-400/70"
                        >
                            <option value="">Sort by</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                            <option value="-salesCount">Best Selling</option>
                        </select>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg">
                            <p className="text-gray-600 text-lg">No products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product: any) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            <Button onClick={() => setPage(page - 1)} disabled={page === 1} size="sm">
                                ← Previous
                            </Button>
                            <span className="px-4 py-2">Page {page} of {pagination.totalPages}</span>
                            <Button onClick={() => setPage(page + 1)} disabled={page >= pagination.totalPages} size="sm">
                                Next →
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
