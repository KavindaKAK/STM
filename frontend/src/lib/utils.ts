import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function calculateSalePrice(price: number, discountType?: 'percent' | 'fixed', discountValue?: number): number {
    if (!discountType || !discountValue) return price;

    if (discountType === 'percent') {
        return price - (price * discountValue / 100);
    }

    return Math.max(0, price - discountValue);
}

export function generateSKU(prefix: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

export function generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString(36).toUpperCase();
    return `INV-${year}${month}-${timestamp}`;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
