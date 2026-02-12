"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ROLES = exports.PAYMENT_STATUSES = exports.PAYMENT_METHODS = exports.ORDER_STATUSES = exports.PRODUCT_TYPES = exports.DISTRICTS = exports.SRI_LANKA_DISTRICTS = void 0;
exports.SRI_LANKA_DISTRICTS = [
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
];
exports.DISTRICTS = exports.SRI_LANKA_DISTRICTS; // Alias for easier import
exports.PRODUCT_TYPES = ['tyre', 'battery', 'accessory'];
exports.ORDER_STATUSES = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];
exports.PAYMENT_METHODS = ['cod', 'card'];
exports.PAYMENT_STATUSES = ['pending', 'confirmed', 'failed'];
exports.USER_ROLES = ['customer', 'admin'];
