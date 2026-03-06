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
            console.log('[CartContext] Refreshing cart with token:', token ? 'Present' : 'Missing');
            const response: any = await api.getCart(token);
            const count = response.data?.items?.reduce((sum: number, item: any) => sum + item.qty, 0) || 0;
            console.log('[CartContext] Cart count updated to:', count);
            setCartCount(count);
        } catch (error) {
            console.error('[CartContext] Failed to fetch cart:', error);
        }
    };

    const addToCart = async (productId: string, qty: number) => {
        console.log('[CartContext] Adding to cart:', { productId, qty, hasToken: !!token });
        
        if (!token) {
            console.error('[CartContext] No token available');
            throw new Error('Please login to add items to cart');
        }

        if (!productId) {
            console.error('[CartContext] No product ID provided');
            throw new Error('Product ID is missing');
        }

        try {
            console.log('[CartContext] Calling addToCart API with:', {
                productId,
                qty,
                apiUrl: import.meta.env.VITE_API_URL,
                tokenLength: token?.length
            });
            
            const response = await api.addToCart({ productId, qty }, token);
            console.log('[CartContext] Add to cart response:', response);
            
            await refreshCart();
            console.log('[CartContext] Cart refreshed successfully');
        } catch (error: any) {
            console.error('[CartContext] Add to cart error:', {
                message: error.message,
                statusCode: error.statusCode,
                response: error.response,
                productId,
                qty,
                token: token ? 'Present' : 'Missing',
                apiUrl: import.meta.env.VITE_API_URL
            });
            throw error;
        }
    };

    useEffect(() => {
        console.log('[CartContext] Token changed, refreshing cart:', { hasToken: !!token });
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
