"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const db_1 = __importDefault(require("./lib/db"));
const Product_1 = __importDefault(require("./models/Product"));
const User_1 = __importDefault(require("./models/User"));
const Brand_1 = __importDefault(require("./models/Brand"));
const Banner_1 = __importDefault(require("./models/Banner"));
const ShippingFee_1 = __importDefault(require("./models/ShippingFee"));
const Review_1 = __importDefault(require("./models/Review"));
const Cart_1 = __importDefault(require("./models/Cart"));
const auth_1 = require("./lib/auth");
const auth_2 = require("./validators/auth");
const zod_2 = require("zod");
// Load environment variables
dotenv_1.default.config({ path: '.env.local' });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
].filter((origin) => Boolean(origin));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
function getAuthUser(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return (0, auth_1.verifyToken)(authHeader.substring(7));
}
function parseQueryString(value) {
    if (typeof value === 'string')
        return value;
    if (Array.isArray(value) && typeof value[0] === 'string')
        return value[0];
    return undefined;
}
function parsePositiveInt(value, fallback) {
    const parsed = Number.parseInt(value || '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
const addToCartSchema = zod_2.z.object({
    productId: zod_2.z.string(),
    qty: zod_2.z.number().int().min(1),
});
const updateCartSchema = zod_2.z.object({
    productId: zod_2.z.string(),
    qty: zod_2.z.number().int().min(0),
});
const updateReviewApprovalSchema = zod_2.z.object({
    isApproved: zod_2.z.boolean(),
});
const createBrandSchema = zod_2.z.object({
    name: zod_2.z.string().min(1, 'Brand name is required'),
    logoUrl: zod_2.z.string().min(1, 'Logo URL is required'),
    sortOrder: zod_2.z.number().int().optional(),
    isActive: zod_2.z.boolean().optional(),
});
const updateBrandSchema = zod_2.z.object({
    name: zod_2.z.string().min(1, 'Brand name is required').optional(),
    logoUrl: zod_2.z.string().min(1, 'Logo URL is required').optional(),
    sortOrder: zod_2.z.number().int().optional(),
    isActive: zod_2.z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'At least one field is required to update brand' });
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
        const validatedData = auth_2.registerSchema.parse(req.body);
        const existingUser = await User_1.default.findOne({ email: validatedData.email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        const passwordHash = await (0, auth_1.hashPassword)(validatedData.password);
        const user = await User_1.default.create({
            role: 'customer',
            name: validatedData.name,
            email: validatedData.email.toLowerCase(),
            phone: validatedData.phone,
            passwordHash,
            addresses: [],
        });
        const token = (0, auth_1.generateToken)({
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
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.issues });
        }
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Registration failed' });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const validatedData = auth_2.loginSchema.parse(req.body);
        const user = await User_1.default.findOne({ email: validatedData.email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isValidPassword = await (0, auth_1.comparePassword)(validatedData.password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = (0, auth_1.generateToken)({
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
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
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
        const user = await User_1.default.findById(authUser.userId).select('-passwordHash');
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
    }
    catch (error) {
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
                query.salePrice.$gte = Number.parseFloat(minPrice);
            if (maxPrice)
                query.salePrice.$lte = Number.parseFloat(maxPrice);
        }
        if (width)
            query['specs.width'] = width;
        if (profile)
            query['specs.profile'] = profile;
        if (rim)
            query['specs.rim'] = rim;
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
            Product_1.default.find(query).sort(sortObj).skip(skip).limit(limit),
            Product_1.default.countDocuments(query),
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
    }
    catch (error) {
        console.error('Get products error:', error);
        return res.status(500).json({ error: 'Failed to fetch products' });
    }
});
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!(0, auth_1.isValidObjectId)(id)) {
            return res.status(400).json({ error: 'Invalid product id' });
        }
        const product = await Product_1.default.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json({ success: true, data: product });
    }
    catch (error) {
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
        const query = {};
        if (type)
            query.type = type;
        const [products, total] = await Promise.all([
            Product_1.default.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Product_1.default.countDocuments(query),
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
    }
    catch (error) {
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
        const product = await Product_1.default.create(req.body);
        return res.status(201).json({ success: true, data: product });
    }
    catch (error) {
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
        if (!(0, auth_1.isValidObjectId)(id)) {
            return res.status(400).json({ error: 'Invalid product id' });
        }
        const product = await Product_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json({ success: true, data: product });
    }
    catch (error) {
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
        if (!(0, auth_1.isValidObjectId)(id)) {
            return res.status(400).json({ error: 'Invalid product id' });
        }
        const product = await Product_1.default.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error('Delete product error:', error);
        return res.status(500).json({ error: 'Failed to delete product' });
    }
});
// Admin - Brands
app.get('/api/admin/brands', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser || authUser.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const brands = await Brand_1.default.find().sort({ sortOrder: 1, name: 1 });
        return res.json({ success: true, data: brands });
    }
    catch (error) {
        console.error('Get admin brands error:', error);
        return res.status(500).json({ error: 'Failed to fetch brands' });
    }
});
app.post('/api/admin/brands', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser || authUser.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const validatedData = createBrandSchema.parse(req.body);
        const brand = await Brand_1.default.create({
            name: validatedData.name.trim(),
            logoUrl: validatedData.logoUrl.trim(),
            sortOrder: validatedData.sortOrder ?? 0,
            isActive: validatedData.isActive ?? true,
        });
        return res.status(201).json({ success: true, data: brand });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.issues });
        }
        if (error?.code === 11000) {
            return res.status(400).json({ error: 'Brand with this name already exists' });
        }
        console.error('Create brand error:', error);
        return res.status(500).json({ error: 'Failed to create brand' });
    }
});
app.put('/api/admin/brands/:id', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser || authUser.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { id } = req.params;
        if (!(0, auth_1.isValidObjectId)(id)) {
            return res.status(400).json({ error: 'Invalid brand id' });
        }
        const validatedData = updateBrandSchema.parse(req.body);
        const updateData = {};
        if (validatedData.name !== undefined)
            updateData.name = validatedData.name.trim();
        if (validatedData.logoUrl !== undefined)
            updateData.logoUrl = validatedData.logoUrl.trim();
        if (validatedData.sortOrder !== undefined)
            updateData.sortOrder = validatedData.sortOrder;
        if (validatedData.isActive !== undefined)
            updateData.isActive = validatedData.isActive;
        const brand = await Brand_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        return res.json({ success: true, data: brand });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.issues });
        }
        if (error?.code === 11000) {
            return res.status(400).json({ error: 'Brand with this name already exists' });
        }
        console.error('Update brand error:', error);
        return res.status(500).json({ error: 'Failed to update brand' });
    }
});
app.delete('/api/admin/brands/:id', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser || authUser.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { id } = req.params;
        if (!(0, auth_1.isValidObjectId)(id)) {
            return res.status(400).json({ error: 'Invalid brand id' });
        }
        const brand = await Brand_1.default.findByIdAndDelete(id);
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        return res.json({ success: true, message: 'Brand deleted successfully' });
    }
    catch (error) {
        console.error('Delete brand error:', error);
        return res.status(500).json({ error: 'Failed to delete brand' });
    }
});
// Admin - Reviews
app.get('/api/admin/reviews', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser || authUser.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const status = parseQueryString(req.query.status);
        const page = parsePositiveInt(parseQueryString(req.query.page), 1);
        const limit = parsePositiveInt(parseQueryString(req.query.limit), 20);
        const skip = (page - 1) * limit;
        const query = {};
        if (status === 'approved')
            query.isApproved = true;
        if (status === 'pending')
            query.isApproved = false;
        const [reviews, total] = await Promise.all([
            Review_1.default.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'name email')
                .populate('productId', 'name sku'),
            Review_1.default.countDocuments(query),
        ]);
        return res.json({
            success: true,
            data: reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('Get admin reviews error:', error);
        return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});
app.put('/api/admin/reviews/:id', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser || authUser.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { id } = req.params;
        if (!(0, auth_1.isValidObjectId)(id)) {
            return res.status(400).json({ error: 'Invalid review id' });
        }
        const { isApproved } = updateReviewApprovalSchema.parse(req.body);
        const review = await Review_1.default.findByIdAndUpdate(id, { isApproved }, { new: true });
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        return res.json({ success: true, data: review });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.issues });
        }
        console.error('Update review error:', error);
        return res.status(500).json({ error: 'Failed to update review' });
    }
});
app.delete('/api/admin/reviews/:id', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser || authUser.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { id } = req.params;
        if (!(0, auth_1.isValidObjectId)(id)) {
            return res.status(400).json({ error: 'Invalid review id' });
        }
        const review = await Review_1.default.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        return res.json({ success: true, message: 'Review deleted successfully' });
    }
    catch (error) {
        console.error('Delete review error:', error);
        return res.status(500).json({ error: 'Failed to delete review' });
    }
});
// Cart
app.get('/api/cart', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const cart = await Cart_1.default.findOne({ userId: authUser.userId }).populate('items.productId');
        if (!cart) {
            return res.json({
                success: true,
                data: { items: [], userId: authUser.userId },
            });
        }
        return res.json({ success: true, data: cart });
    }
    catch (error) {
        console.error('Get cart error:', error);
        return res.status(500).json({ error: 'Failed to fetch cart' });
    }
});
app.post('/api/cart/add', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { productId, qty } = addToCartSchema.parse(req.body);
        if (!(0, auth_1.isValidObjectId)(productId)) {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        let cart = await Cart_1.default.findOne({ userId: authUser.userId });
        if (!cart) {
            cart = new Cart_1.default({
                userId: authUser.userId,
                items: [],
            });
        }
        const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
        if (existingItemIndex > -1) {
            const nextQty = cart.items[existingItemIndex].qty + qty;
            if (product.stockQty < nextQty) {
                return res.status(400).json({ error: 'Insufficient stock' });
            }
            cart.items[existingItemIndex].qty = nextQty;
            cart.items[existingItemIndex].priceSnapshot = product.salePrice;
        }
        else {
            if (product.stockQty < qty) {
                return res.status(400).json({ error: 'Insufficient stock' });
            }
            cart.items.push({
                productId: product._id,
                qty,
                priceSnapshot: product.salePrice,
                nameSnapshot: product.name,
                imageSnapshot: product.images[0] || '',
            });
        }
        cart.updatedAt = new Date();
        await cart.save();
        return res.json({ success: true, data: cart });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.issues });
        }
        console.error('Add to cart error:', error);
        return res.status(500).json({ error: 'Failed to add to cart' });
    }
});
app.post('/api/cart/update', async (req, res) => {
    try {
        const authUser = getAuthUser(req);
        if (!authUser) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { productId, qty } = updateCartSchema.parse(req.body);
        if (!(0, auth_1.isValidObjectId)(productId)) {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }
        const cart = await Cart_1.default.findOne({ userId: authUser.userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        if (qty === 0) {
            cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        }
        else {
            const product = await Product_1.default.findById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            if (product.stockQty < qty) {
                return res.status(400).json({ error: 'Insufficient stock' });
            }
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].qty = qty;
                cart.items[itemIndex].priceSnapshot = product.salePrice;
            }
        }
        cart.updatedAt = new Date();
        await cart.save();
        return res.json({ success: true, data: cart });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.issues });
        }
        console.error('Update cart error:', error);
        return res.status(500).json({ error: 'Failed to update cart' });
    }
});
// Public data
app.get('/api/brands', async (_req, res) => {
    try {
        const brands = await Brand_1.default.find({ isActive: true }).sort({ sortOrder: 1 });
        return res.json({ success: true, data: brands });
    }
    catch (error) {
        console.error('Get brands error:', error);
        return res.status(500).json({ error: 'Failed to fetch brands' });
    }
});
app.get('/api/banners', async (_req, res) => {
    try {
        const banners = await Banner_1.default.find({ isActive: true }).sort({ sortOrder: 1 });
        return res.json({ success: true, data: banners });
    }
    catch (error) {
        console.error('Get banners error:', error);
        return res.status(500).json({ error: 'Failed to fetch banners' });
    }
});
app.get('/api/shipping-fees', async (_req, res) => {
    try {
        const fees = await ShippingFee_1.default.find().sort({ district: 1 });
        return res.json({ success: true, data: fees });
    }
    catch (error) {
        console.error('Get shipping fees error:', error);
        return res.status(500).json({ error: 'Failed to fetch shipping fees' });
    }
});
app.get('/api/reviews', async (req, res) => {
    try {
        const productId = parseQueryString(req.query.productId);
        const limit = parsePositiveInt(parseQueryString(req.query.limit), 20);
        const query = { isApproved: true };
        if (productId)
            query.productId = productId;
        const reviews = await Review_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('userId', 'name');
        return res.json({ success: true, data: reviews });
    }
    catch (error) {
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
app.use((err, _req, res, _next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
    });
});
// Start server
const startServer = async () => {
    try {
        await (0, db_1.default)();
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Backend server is running on http://localhost:${PORT}`);
            console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
            console.log('MongoDB connected');
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        console.error('Make sure MongoDB is running on your system');
        process.exit(1);
    }
};
startServer();
