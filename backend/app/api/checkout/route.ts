import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import Product from '@/models/Product';
import ShippingFee from '@/models/ShippingFee';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';
import { checkoutSchema } from '@/validators/order';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await connectDB();

        const authUser = await getUserFromRequest(request);

        if (!authUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = checkoutSchema.parse(body);

        // Get cart
        const cart = await Cart.findOne({ userId: authUser.userId }).session(session);

        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();
            return NextResponse.json(
                { error: 'Cart is empty' },
                { status: 400 }
            );
        }

        // Get user data
        const user = await User.findById(authUser.userId).session(session);

        if (!user) {
            await session.abortTransaction();
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Verify stock and calculate total
        let itemsTotal = 0;
        const orderItems = [];

        for (const cartItem of cart.items) {
            const product = await Product.findById(cartItem.productId).session(session);

            if (!product) {
                await session.abortTransaction();
                return NextResponse.json(
                    { error: `Product ${cartItem.nameSnapshot} not found` },
                    { status: 404 }
                );
            }

            if (product.stockQty < cartItem.qty) {
                await session.abortTransaction();
                return NextResponse.json(
                    { error: `Insufficient stock for ${product.name}` },
                    { status: 400 }
                );
            }

            // Decrement stock
            product.stockQty -= cartItem.qty;
            product.salesCount += cartItem.qty;
            await product.save({ session });

            itemsTotal += cartItem.priceSnapshot * cartItem.qty;

            orderItems.push({
                productId: product._id,
                nameSnapshot: product.name,
                priceSnapshot: cartItem.priceSnapshot,
                qty: cartItem.qty,
                imageSnapshot: product.images[0] || '',
            });
        }

        // Get shipping fee
        const shippingFeeDoc = await ShippingFee.findOne({
            district: validatedData.district
        }).session(session);

        const shippingFee = shippingFeeDoc?.feeLkr || 0;

        // Calculate totals
        const discountTotal = 0; // Future: implement discount logic
        const grandTotal = itemsTotal + shippingFee - discountTotal;

        // Create order
        const order = await Order.create([{
            userId: authUser.userId,
            items: orderItems,
            customer: {
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
            shippingAddress: validatedData.shippingAddress,
            district: validatedData.district,
            shippingFee,
            pricing: {
                itemsTotal,
                discountTotal,
                shippingFee,
                grandTotal,
            },
            payment: {
                method: validatedData.paymentMethod,
                status: 'confirmed', // Auto-confirm for COD
            },
            status: 'new',
        }], { session });

        // Clear cart
        await Cart.findByIdAndUpdate(
            cart._id,
            { items: [] },
            { session }
        );

        // Create notification
        await Notification.create([{
            userId: authUser.userId,
            title: 'Order Confirmed',
            message: `Your order has been confirmed. Order ID: ${order[0]._id}`,
            isRead: false,
        }], { session });

        await session.commitTransaction();

        return NextResponse.json({
            success: true,
            data: order[0],
        }, { status: 201 });

    } catch (error: any) {
        await session.abortTransaction();

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Checkout failed' },
            { status: 500 }
        );
    } finally {
        session.endSession();
    }
}
