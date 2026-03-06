import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';
import { Types } from 'mongoose';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const authUser = await getUserFromRequest(request);

        if (!authUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const cart = await Cart.findOne({ userId: new Types.ObjectId(authUser.userId) }).populate('items.productId');

        if (!cart) {
            return NextResponse.json({
                success: true,
                data: { items: [], userId: authUser.userId },
            });
        }

        return NextResponse.json({
            success: true,
            data: cart,
        });

    } catch (error) {
        console.error('Get cart error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch cart' },
            { status: 500 }
        );
    }
}
