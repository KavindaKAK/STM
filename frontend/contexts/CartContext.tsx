'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api-client';
import { useAuth } from './AuthContext';

interface CartContextType {
    cartCount: number;
    refreshCart: () => Promise<void>;
    addToCart: (productId: string, qty: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState(0);
    const { token } = useAuth();

    const refreshCart = async () => {
        if (!token) {
            setCartCount(0);
            return;
        }

        try {
            const response: any = await api.getCart(token);
            const count = response.data?.items?.reduce((sum: number, item: any) => sum + item.qty, 0) || 0;
            setCartCount(count);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    const addToCart = async (productId: string, qty: number) => {
        if (!token) {
            throw new Error('Please login to add items to cart');
        }

        await api.addToCart({ productId, qty }, token);
        await refreshCart();
    };

    useEffect(() => {
        refreshCart();
    }, [token]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
