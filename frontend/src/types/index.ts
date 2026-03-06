export const SRI_LANKA_DISTRICTS = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Matara',
    'Hambantota',
    'Jaffna',
    'Kilinochchi',
    'Mannar',
    'Vavuniya',
    'Mullaitivu',
    'Batticaloa',
    'Ampara',
    'Trincomalee',
    'Kurunegala',
    'Puttalam',
    'Anuradhapura',
    'Polonnaruwa',
    'Badulla',
    'Monaragala',
    'Ratnapura',
    'Kegalle',
] as const;

export const DISTRICTS = SRI_LANKA_DISTRICTS; // Alias for easier import

export type District = typeof SRI_LANKA_DISTRICTS[number];

export const PRODUCT_TYPES = ['tyre', 'battery', 'accessory'] as const;
export type ProductType = typeof PRODUCT_TYPES[number];

export const ORDER_STATUSES = ['new', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export const PAYMENT_METHODS = ['cod', 'card'] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];

export const PAYMENT_STATUSES = ['pending', 'confirmed', 'failed'] as const;
export type PaymentStatus = typeof PAYMENT_STATUSES[number];

export const USER_ROLES = ['customer', 'admin'] as const;
export type UserRole = typeof USER_ROLES[number];
