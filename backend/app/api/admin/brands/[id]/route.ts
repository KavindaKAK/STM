import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Brand from '@/models/Brand';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, logoUrl, sortOrder, isActive } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const brand = await Brand.findByIdAndUpdate(
            params.id,
            { name, logoUrl, sortOrder, isActive },
            { new: true }
        );

        if (!brand) {
            return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Brand updated successfully',
            data: brand,
        });
    } catch (error: any) {
        console.error('Update brand error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update brand' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const brand = await Brand.findByIdAndDelete(params.id);

        if (!brand) {
            return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Brand deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete brand error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete brand' },
            { status: 500 }
        );
    }
}
