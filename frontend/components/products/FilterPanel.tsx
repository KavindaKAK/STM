'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
    productType: 'tyre' | 'battery' | 'accessory';
    brands: any[];
    filters: any;
    onFilterChange: (filters: any) => void;
    isMobile?: boolean;
    onClose?: () => void;
}

export function FilterPanel({
    productType,
    brands,
    filters,
    onFilterChange,
    isMobile = false,
    onClose,
}: FilterPanelProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleApply = () => {
        onFilterChange(localFilters);
        onClose?.();
    };

    const handleReset = () => {
        const resetFilters = { inStock: false };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className={cn('bg-white p-6 rounded-lg', isMobile && 'max-h-screen overflow-y-auto')}>
            {isMobile && (
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Filters</h3>
                    <button onClick={onClose} className="text-2xl">
                        ✕
                    </button>
                </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={localFilters.inStock || false}
                        onChange={(e) => setLocalFilters({ ...localFilters, inStock: e.target.checked })}
                        className="w-4 h-4 text-primary-900 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span>In Stock Only</span>
                </label>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
                <h4 className="font-semibold mb-3">Brand</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand: any) => (
                        <label key={brand._id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localFilters.brand === brand.name}
                                onChange={(e) => {
                                    setLocalFilters({
                                        ...localFilters,
                                        brand: e.target.checked ? brand.name : undefined,
                                    });
                                }}
                                className="w-4 h-4 text-primary-900 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span>{brand.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range (LKR)</h4>
                <div className="space-y-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={localFilters.minPrice || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={localFilters.maxPrice || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            {/* Tyre-specific filters */}
            {productType === 'tyre' && (
                <>
                    <div className="mb-6">
                        <h4 className="font-semibold mb-3">Size</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="text"
                                placeholder="Width"
                                value={localFilters.width || ''}
                                onChange={(e) => setLocalFilters({ ...localFilters, width: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Profile"
                                value={localFilters.profile || ''}
                                onChange={(e) => setLocalFilters({ ...localFilters, profile: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Rim"
                                value={localFilters.rim || ''}
                                onChange={(e) => setLocalFilters({ ...localFilters, rim: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Battery-specific filters */}
            {productType === 'battery' && (
                <>
                    <div className="mb-6">
                        <h4 className="font-semibold mb-3">Voltage (V)</h4>
                        <select
                            value={localFilters.voltage || ''}
                            onChange={(e) => setLocalFilters({ ...localFilters, voltage: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">All</option>
                            <option value="12">12V</option>
                            <option value="24">24V</option>
                        </select>
                    </div>
                </>
            )}

            {/* Accessory-specific filters */}
            {productType === 'accessory' && (
                <div className="mb-6">
                    <h4 className="font-semibold mb-3">Category</h4>
                    <select
                        value={localFilters.accessoryCategory || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, accessoryCategory: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">All</option>
                        <option value="oil">Oil</option>
                        <option value="parts">Parts</option>
                        <option value="accessories">Accessories</option>
                    </select>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
                <Button onClick={handleApply} className="w-full">
                    Apply Filters
                </Button>
                <Button onClick={handleReset} variant="outline" className="w-full">
                    Reset Filters
                </Button>
            </div>
        </div>
    );
}
