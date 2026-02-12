import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getUserFromRequest } from '@/lib/auth';
import { z } from 'zod';
const updateStatusSchema = z.object({
    status: z.enum(['new', 'processing', 'shipped', 'delivered', 'cancelled']),
});
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const authUser = await getUserFromRequest(request);
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const body = await request.json();
        const { status } = updateStatusSchema.parse(body);
        const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true, runValidators: true });
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('Update order status error:', error);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
}
