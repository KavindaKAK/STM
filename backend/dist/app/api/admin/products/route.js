import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';
import { productSchema } from '@/validators/product';
export async function POST(request) {
    try {
        await connectDB();
        const authUser = await getUserFromRequest(request);
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const body = await request.json();
        const validatedData = productSchema.parse(body);
        const product = await Product.create(validatedData);
        return NextResponse.json({
            success: true,
            data: product,
        }, { status: 201 });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Product with this SKU already exists' }, { status: 400 });
        }
        console.error('Create product error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
export async function GET(request) {
    try {
        await connectDB();
        const authUser = await getUserFromRequest(request);
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Product.countDocuments(),
        ]);
        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('Get admin products error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
