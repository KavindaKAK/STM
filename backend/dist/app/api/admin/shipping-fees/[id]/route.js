import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ShippingFee from '@/models/ShippingFee';
import { getUserFromRequest } from '@/lib/auth';
export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const body = await req.json();
        const { feeLkr } = body;
        if (typeof feeLkr !== 'number' || feeLkr < 0) {
            return NextResponse.json({ error: 'Invalid fee amount' }, { status: 400 });
        }
        const shippingFee = await ShippingFee.findByIdAndUpdate(params.id, { feeLkr }, { new: true });
        if (!shippingFee) {
            return NextResponse.json({ error: 'Shipping fee not found' }, { status: 404 });
        }
        return NextResponse.json({
            message: 'Shipping fee updated',
            data: shippingFee,
        });
    }
    catch (error) {
        console.error('Update shipping fee error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update shipping fee' }, { status: 500 });
    }
}
