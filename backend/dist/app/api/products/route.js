import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        // Filters
        const type = searchParams.get('type');
        const brand = searchParams.get('brand');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const inStock = searchParams.get('inStock');
        const accessoryCategory = searchParams.get('accessoryCategory');
        // Tyre filters
        const width = searchParams.get('width');
        const profile = searchParams.get('profile');
        const rim = searchParams.get('rim');
        // Sorting
        const sort = searchParams.get('sort') || 'createdAt';
        const order = searchParams.get('order') === 'asc' ? 1 : -1;
        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        // Build query
        const query = { status: 'active' };
        if (type)
            query.type = type;
        if (brand)
            query.brand = brand;
        if (accessoryCategory)
            query.accessoryCategory = accessoryCategory;
        if (inStock === 'true')
            query.stockQty = { $gt: 0 };
        if (minPrice || maxPrice) {
            query.salePrice = {};
            if (minPrice)
                query.salePrice.$gte = parseFloat(minPrice);
            if (maxPrice)
                query.salePrice.$lte = parseFloat(maxPrice);
        }
        // Tyre-specific filters
        if (width)
            query['specs.width'] = width;
        if (profile)
            query['specs.profile'] = profile;
        if (rim)
            query['specs.rim'] = rim;
        // Build sort object
        const sortObj = {};
        if (sort === 'price') {
            sortObj.salePrice = order;
        }
        else if (sort === 'salesCount') {
            sortObj.salesCount = -1;
        }
        else {
            sortObj.createdAt = order;
        }
        const [products, total] = await Promise.all([
            Product.find(query).sort(sortObj).skip(skip).limit(limit),
            Product.countDocuments(query),
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
        console.error('Get products error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
