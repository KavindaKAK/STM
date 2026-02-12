import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Brand from '@/models/Brand';
export async function GET(request) {
    try {
        await connectDB();
        const brands = await Brand.find({ isActive: true }).sort({ sortOrder: 1 });
        return NextResponse.json({
            success: true,
            data: brands,
        });
    }
    catch (error) {
        console.error('Get brands error:', error);
        return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
    }
}
