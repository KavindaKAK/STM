import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';
import { loginSchema } from '@/validators/auth';
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const validatedData = loginSchema.parse(body);
        // Find user by email
        const user = await User.findOne({ email: validatedData.email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }
        // Verify password
        const isValidPassword = await comparePassword(validatedData.password, user.passwordHash);
        if (!isValidPassword) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }
        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                addresses: user.addresses,
            },
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
