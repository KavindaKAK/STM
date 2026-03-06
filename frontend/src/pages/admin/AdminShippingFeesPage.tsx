import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api-client';
import { SRI_LANKA_DISTRICTS } from '@/types';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils';

export default function AdminShippingFeesPage() {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [fees, setFees] = useState<Record<string, number>>({});
    const [isSaving, setIsSaving] = useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['shipping-fees-admin'],
        queryFn: api.getShippingFees,
        onSuccess: (response: any) => {
            const feesMap: Record<string, number> = {};
            response.data?.forEach((fee: any) => {
                feesMap[fee.district] = fee.feeLkr;
            });
            setFees(feesMap);
        },
    });

    const shippingFees = data?.data || [];

    const handleFeeChange = (district: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setFees((prev) => ({
            ...prev,
            [district]: numValue,
        }));
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            for (const district of SRI_LANKA_DISTRICTS) {
                const currentFee = shippingFees.find((f: any) => f.district === district);
                const newFee = fees[district] || 0;

                if (currentFee && currentFee._id) {
                    await fetch(`/api/admin/shipping-fees/${currentFee._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ feeLkr: newFee }),
                    });
                }
            }

            await refetch();
            showToast('Shipping fees updated successfully', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to update shipping fees', 'error');
        } finally {
            setIsSaving(false);
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
                <div>
                    <h1 className="text-3xl font-bold">Shipping Fees Management</h1>
                    <p className="text-gray-600 mt-2">Configure shipping fees for all 25 Sri Lankan districts</p>
                </div>
                <Button onClick={handleSaveAll} isLoading={isSaving}>
                    💾 Save All Changes
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                District
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shipping Fee (LKR)
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {SRI_LANKA_DISTRICTS.map((district, idx) => (
                            <tr key={district} className="bg-white hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {idx + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {district}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <input
                                        type="number"
                                        value={fees[district] || ''}
                                        onChange={(e) => handleFeeChange(district, e.target.value)}
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 text-right">
                <Button onClick={handleSaveAll} isLoading={isSaving}>
                    💾 Save All Changes
                </Button>
            </div>
        </div>
    );
}
