const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

console.log('[API Client] Initialized with API_URL:', API_URL);

interface RequestOptions extends RequestInit {
    token?: string;
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = `${API_URL}${endpoint}`;
    console.log('[API] Making request to:', fullUrl, { hasToken: !!token });

    try {
        const response = await fetch(fullUrl, {
            ...fetchOptions,
            headers: {
                ...headers,
                ...fetchOptions.headers,
            },
        });

        const data = await response.json();

        console.log('[API] Response from:', endpoint, { status: response.status, success: response.ok });

        if (!response.ok) {
            console.error('[API] Error response:', { endpoint, status: response.status, error: data.error });
            throw new Error(data.error || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (error: any) {
        console.error('[API] Request failed:', { endpoint, error: error.message });
        throw error;
    }
}

export const api = {
    // Auth
    register: (data: any) => apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getMe: (token: string) => apiRequest('/api/auth/me', { token }),

    // Products
    getProducts: (params?: any) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return apiRequest(`/api/products${queryString}`);
    },
    getProduct: (id: string) => apiRequest(`/api/products/${id}`),

    // Cart
    getCart: (token: string) => apiRequest('/api/cart', { token }),
    addToCart: (data: any, token: string) => apiRequest('/api/cart/add', { method: 'POST', body: JSON.stringify(data), token }),
    updateCart: (data: any, token: string) => apiRequest('/api/cart/update', { method: 'POST', body: JSON.stringify(data), token }),

    // Orders
    checkout: (data: any, token: string) => apiRequest('/api/checkout', { method: 'POST', body: JSON.stringify(data), token }),
    getMyOrders: (token: string) => apiRequest('/api/orders/my', { token }),

    // Reviews
    submitReview: (data: any, token: string) => apiRequest('/api/reviews', { method: 'POST', body: JSON.stringify(data), token }),
    getReviews: (params?: any) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return apiRequest(`/api/reviews${queryString}`);
    },

    // Public data
    getBrands: () => apiRequest('/api/brands'),
    getBanners: () => apiRequest('/api/banners'),
    getShippingFees: () => apiRequest('/api/shipping-fees'),

    // Admin - Products
    createProduct: (data: any, token: string) => apiRequest('/api/admin/products', { method: 'POST', body: JSON.stringify(data), token }),
    updateProduct: (id: string, data: any, token: string) => apiRequest(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
    deleteProduct: (id: string, token: string) => apiRequest(`/api/admin/products/${id}`, { method: 'DELETE', token }),
    getAdminProducts: (token: string, params?: any) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return apiRequest(`/api/admin/products${queryString}`, { token });
    },

    // Admin - Orders
    getAdminOrders: (token: string, params?: any) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return apiRequest(`/api/admin/orders${queryString}`, { token });
    },
    updateOrderStatus: (id: string, data: any, token: string) => apiRequest(`/api/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(data), token }),

    // Admin - Reviews
    getAdminReviews: (token: string, params?: any) => {
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
        return apiRequest(`/api/admin/reviews${queryString}`, { token });
    },
    updateReviewStatus: (id: string, data: any, token: string) => apiRequest(`/api/admin/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
    deleteReview: (id: string, token: string) => apiRequest(`/api/admin/reviews/${id}`, { method: 'DELETE', token }),

    // Admin - Brands
    createBrand: (data: any, token: string) => apiRequest('/api/admin/brands', { method: 'POST', body: JSON.stringify(data), token }),
    updateBrand: (id: string, data: any, token: string) => apiRequest(`/api/admin/brands/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
    deleteBrand: (id: string, token: string) => apiRequest(`/api/admin/brands/${id}`, { method: 'DELETE', token }),
};

