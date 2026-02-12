import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';

const addToCartSchema = z.object({
    productId: z.string(),
    qty: z.number().int().min(1),
});

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const authUser = await getUserFromRequest(request);

        if (!authUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { productId, qty } = addToCartSchema.parse(body);

        // Get product details
        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        if (product.stockQty < qty) {
            return NextResponse.json(
                { error: 'Insufficient stock' },
                { status: 400 }
            );
        }

        // Get or create cart
        let cart = await Cart.findOne({ userId: authUser.userId });

        if (!cart) {
            cart = new Cart({
                userId: authUser.userId,
                items: [],
            });
        }

        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].qty += qty;
            cart.items[existingItemIndex].priceSnapshot = product.salePrice;
        } else {
            // Add new item
            cart.items.push({
                productId: product._id,
                qty,
                priceSnapshot: product.salePrice,
                nameSnapshot: product.name,
                imageSnapshot: product.images[0] || '',
            });
        }

        cart.updatedAt = new Date();
        await cart.save();

        return NextResponse.json({
            success: true,
            data: cart,
        });

    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Add to cart error:', error);
        return NextResponse.json(
            { error: 'Failed to add to cart' },
            { status: 500 }
        );
    }
}
