import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ZodError } from 'zod';
import connectDB from './lib/db';
import Product from './models/Product';
import User from './models/User';
import Brand from './models/Brand';
import Banner from './models/Banner';
import ShippingFee from './models/ShippingFee';
import Review from './models/Review';
import { comparePassword, generateToken, hashPassword, isValidObjectId, verifyToken } from './lib/auth';
import { loginSchema, registerSchema } from './validators/auth';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

type AuthPayload = {
    userId: string;
    email: string;
    role: 'admin' | 'customer';
};

function getAuthUser(req: express.Request): AuthPayload | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return verifyToken(authHeader.substring(7)) as AuthPayload | null;
}

function parseQueryString(value: unknown): string | undefined {
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    return undefined;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value || '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
    });
});

// Auth
app.post('/api/auth/register', async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const passwordHash = await hashPassword(validatedData.password);
        const user = await User.create({
            role: 'customer',
            name: validatedData.name,
            email: validatedData.email.toLowerCase(),
            phone: validatedData.phone,
            passwordHash,
            addresses: [],
        });

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.issues });
        }
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await User.findOne({ email: validatedData.email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValidPassword = await comparePassword(validatedData.password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        return res.json({
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
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.issues });
        }
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/auth/me', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findById(authUser.userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                addresses: user.addresses,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({ error: 'Failed to get user' });
    }
});

// Products
app.get('/api/products', async (req, res) => {
    try {
        const type = parseQueryString(req.query.type);
        const brand = parseQueryString(req.query.brand);
        const minPrice = parseQueryString(req.query.minPrice);
        const maxPrice = parseQueryString(req.query.maxPrice);
        const inStock = parseQueryString(req.query.inStock);
        const accessoryCategory = parseQueryString(req.query.accessoryCategory);
        const width = parseQueryString(req.query.width);
        const profile = parseQueryString(req.query.profile);
        const rim = parseQueryString(req.query.rim);
        const sort = parseQueryString(req.query.sort) || 'createdAt';
        const order = parseQueryString(req.query.order) === 'asc' ? 1 : -1;
        const page = parsePositiveInt(parseQueryString(req.query.page), 1);
        const limit = parsePositiveInt(parseQueryString(req.query.limit), 10);
        const skip = (page - 1) * limit;

        const query: Record<string, any> = { status: 'active' };

        if (type) query.type = type;
        if (brand) query.brand = brand;
        if (accessoryCategory) query.accessoryCategory = accessoryCategory;
        if (inStock === 'true') query.stockQty = { $gt: 0 };

        if (minPrice || maxPrice) {
            query.salePrice = {};
            if (minPrice) query.salePrice.$gte = Number.parseFloat(minPrice);
            if (maxPrice) query.salePrice.$lte = Number.parseFloat(maxPrice);
        }

        if (width) query['specs.width'] = width;
        if (profile) query['specs.profile'] = profile;
        if (rim) query['specs.rim'] = rim;

        const sortObj: Record<string, 1 | -1> = {};
        if (sort === 'price') {
            sortObj.salePrice = order as 1 | -1;
        } else if (sort === 'salesCount') {
            sortObj.salesCount = -1;
        } else {
            sortObj.createdAt = order as 1 | -1;
        }

        const [products, total] = await Promise.all([
            Product.find(query).sort(sortObj).skip(skip).limit(limit),
            Product.countDocuments(query),
        ]);

        return res.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get products error:', error);
        return res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid product id' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.json({ success: true, data: product });
    } catch (error) {
        console.error('Get product error:', error);
        return res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Admin - Products
app.get('/api/admin/products', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser || authUser.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const type = parseQueryString(req.query.type);
        const page = parsePositiveInt(parseQueryString(req.query.page), 1);
        const limit = parsePositiveInt(parseQueryString(req.query.limit), 20);
        const skip = (page - 1) * limit;

        const query: Record<string, any> = {};
        if (type) query.type = type;

        const [products, total] = await Promise.all([
            Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Product.countDocuments(query),
        ]);

        return res.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get admin products error:', error);
        return res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.post('/api/admin/products', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser || authUser.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const product = await Product.create(req.body);
        return res.status(201).json({ success: true, data: product });
    } catch (error: any) {
        if (error?.code === 11000) {
            return res.status(400).json({ error: 'Product with this SKU already exists' });
        }
        console.error('Create product error:', error);
        return res.status(500).json({ error: 'Failed to create product' });
    }
});

app.put('/api/admin/products/:id', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser || authUser.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid product id' });
        }

        const product = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.json({ success: true, data: product });
    } catch (error) {
        console.error('Update product error:', error);
        return res.status(500).json({ error: 'Failed to update product' });
    }
});

app.delete('/api/admin/products/:id', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser || authUser.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid product id' });
        }

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        return res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Public data
app.get('/api/brands', async (_req, res) => {
    try {
        const brands = await Brand.find({ isActive: true }).sort({ sortOrder: 1 });
        return res.json({ success: true, data: brands });
    } catch (error) {
        console.error('Get brands error:', error);
        return res.status(500).json({ error: 'Failed to fetch brands' });
    }
});

app.get('/api/banners', async (_req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1 });
        return res.json({ success: true, data: banners });
    } catch (error) {
        console.error('Get banners error:', error);
        return res.status(500).json({ error: 'Failed to fetch banners' });
    }
});

app.get('/api/shipping-fees', async (_req, res) => {
    try {
        const fees = await ShippingFee.find().sort({ district: 1 });
        return res.json({ success: true, data: fees });
    } catch (error) {
        console.error('Get shipping fees error:', error);
        return res.status(500).json({ error: 'Failed to fetch shipping fees' });
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
        const productId = parseQueryString(req.query.productId);
        const limit = parsePositiveInt(parseQueryString(req.query.limit), 20);

        const query: Record<string, any> = { isApproved: true };
        if (productId) query.productId = productId;

        const reviews = await Review.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('userId', 'name');

        return res.json({ success: true, data: reviews });
    } catch (error) {
        console.error('Get reviews error:', error);
        return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        message: 'Sithuruwana Tyre Mart Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
        },
    });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
    });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Backend server is running on http://localhost:${PORT}`);
            console.log(`CORS enabled for: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`);
            console.log('MongoDB connected');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        console.error('Make sure MongoDB is running on your system');
        process.exit(1);
    }
};

startServer();
