import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ShippingFee from '@/models/ShippingFee';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const fees = await ShippingFee.find().sort({ district: 1 });

        return NextResponse.json({
            success: true,
            data: fees,
        });

    } catch (error) {
        console.error('Get shipping fees error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch shipping fees' },
            { status: 500 }
        );
    }
}
