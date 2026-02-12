import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import { getUserFromRequest } from '@/lib/auth';
import { reviewSchema } from '@/validators/review';
export async function POST(request) {
    try {
        await connectDB();
        const authUser = await getUserFromRequest(request);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const body = await request.json();
        const validatedData = reviewSchema.parse(body);
        const review = await Review.create({
            userId: authUser.userId,
            productId: validatedData.productId || null,
            rating: validatedData.rating,
            comment: validatedData.comment,
            isApproved: false,
        });
        return NextResponse.json({
            success: true,
            data: review,
            message: 'Review submitted for approval',
        }, { status: 201 });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('Create review error:', error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
}
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');
        const limit = parseInt(searchParams.get('limit') || '20');
        const query = { isApproved: true };
        if (productId)
            query.productId = productId;
        const reviews = await Review.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('userId', 'name');
        return NextResponse.json({
            success: true,
            data: reviews,
        });
    }
    catch (error) {
        console.error('Get reviews error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
