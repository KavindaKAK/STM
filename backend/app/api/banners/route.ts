import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Banner from '@/models/Banner';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1 });

        return NextResponse.json({
            success: true,
            data: banners,
        });

    } catch (error) {
        console.error('Get banners error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch banners' },
            { status: 500 }
        );
    }
}
