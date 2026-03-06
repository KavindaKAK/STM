import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getUserFromRequest, isValidObjectId } from '@/lib/auth';
import { z } from 'zod';
import { Types } from 'mongoose';

const updateCartSchema = z.object({
    productId: z.string(),
    qty: z.number().int().min(0),
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
        const { productId, qty } = updateCartSchema.parse(body);

        // Validate productId format
        if (!isValidObjectId(productId)) {
            return NextResponse.json(
                { error: 'Invalid product ID format' },
                { status: 400 }
            );
        }

        const userObjectId = new Types.ObjectId(authUser.userId);
        const cart = await Cart.findOne({ userId: userObjectId });

        if (!cart) {
            return NextResponse.json(
                { error: 'Cart not found' },
                { status: 404 }
            );
        }

        if (qty === 0) {
            // Remove item
            cart.items = cart.items.filter(
                (item) => item.productId.toString() !== productId
            );
        } else {
            // Verify stock
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

            // Update quantity
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].qty = qty;
                cart.items[itemIndex].priceSnapshot = product.salePrice;
            }
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

        console.error('Update cart error:', error);
        return NextResponse.json(
            { error: 'Failed to update cart' },
            { status: 500 }
        );
    }
}
