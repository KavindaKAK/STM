import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getUserFromRequest } from '@/lib/auth';

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

        const orders = await Order.find({ userId: authUser.userId })
            .sort({ createdAt: -1 })
            .populate('items.productId', 'name');

        return NextResponse.json({
            success: true,
            data: orders,
        });

    } catch (error) {
        console.error('Get user orders error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
