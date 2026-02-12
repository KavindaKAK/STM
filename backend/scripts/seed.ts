import mongoose from 'mongoose';
import User from '@/models/User';
import ShippingFee from '@/models/ShippingFee';
import Brand from '@/models/Brand';
import Banner from '@/models/Banner';
import Product from '@/models/Product';
import { hashPassword } from '@/lib/auth';
import { SRI_LANKA_DISTRICTS } from '@/types';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tyre-shop';

async function seed() {
    try {
        console.log('🌱 Starting database seed...');

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Seed Admin User
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@tyreshop.lk';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const passwordHash = await hashPassword(adminPassword);
            await User.create({
                role: 'admin',
                name: 'Administrator',
                email: adminEmail,
                phone: '+94771234567',
                passwordHash,
                addresses: [],
            });
            console.log(`✅ Admin user created: ${adminEmail}`);
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Seed Shipping Fees for all 25 districts
        const existingFees = await ShippingFee.countDocuments();

        if (existingFees === 0) {
            const defaultFee = 500; // Default LKR 500
            const shippingFees = SRI_LANKA_DISTRICTS.map((district) => ({
                district,
                feeLkr: district === 'Colombo' ? 300 : defaultFee, // Lower fee for Colombo
            }));

            await ShippingFee.insertMany(shippingFees);
            console.log(`✅ Seeded shipping fees for ${SRI_LANKA_DISTRICTS.length} districts`);
        } else {
            console.log('ℹ️  Shipping fees already exist');
        }

        // Seed sample brands
        const existingBrands = await Brand.countDocuments();

        if (existingBrands === 0) {
            const sampleBrands = [
                // Tyre Brands
                { name: 'Michelin', logoUrl: 'https://via.placeholder.com/150x50?text=Michelin', sortOrder: 1, isActive: true },
                { name: 'Bridgestone', logoUrl: 'https://via.placeholder.com/150x50?text=Bridgestone', sortOrder: 2, isActive: true },
                { name: 'Goodyear', logoUrl: 'https://via.placeholder.com/150x50?text=Goodyear', sortOrder: 3, isActive: true },
                { name: 'Continental', logoUrl: 'https://via.placeholder.com/150x50?text=Continental', sortOrder: 4, isActive: true },
                { name: 'Pirelli', logoUrl: 'https://via.placeholder.com/150x50?text=Pirelli', sortOrder: 5, isActive: true },
                { name: 'Hankook', logoUrl: 'https://via.placeholder.com/150x50?text=Hankook', sortOrder: 6, isActive: true },
                { name: 'Yokohama', logoUrl: 'https://via.placeholder.com/150x50?text=Yokohama', sortOrder: 7, isActive: true },
                { name: 'Toyo', logoUrl: 'https://via.placeholder.com/150x50?text=Toyo', sortOrder: 8, isActive: true },
                { name: 'Sumitomo', logoUrl: 'https://via.placeholder.com/150x50?text=Sumitomo', sortOrder: 9, isActive: true },
                { name: 'Dunlop', logoUrl: 'https://via.placeholder.com/150x50?text=Dunlop', sortOrder: 10, isActive: true },
                // Battery Brands
                { name: 'Amaron', logoUrl: 'https://via.placeholder.com/150x50?text=Amaron', sortOrder: 11, isActive: true },
                { name: 'Exide', logoUrl: 'https://via.placeholder.com/150x50?text=Exide', sortOrder: 12, isActive: true },
                // Other Brands
                { name: 'Bosch', logoUrl: 'https://via.placeholder.com/150x50?text=Bosch', sortOrder: 13, isActive: true },
                { name: 'Castrol', logoUrl: 'https://via.placeholder.com/150x50?text=Castrol', sortOrder: 14, isActive: true },
                { name: 'Generic', logoUrl: 'https://via.placeholder.com/150x50?text=Generic', sortOrder: 15, isActive: true },
            ];

            await Brand.insertMany(sampleBrands);
            console.log('✅ Seeded sample brands');
        } else {
            console.log('ℹ️  Brands already exist');
        }

        // Seed sample banners
        const existingBanners = await Banner.countDocuments();

        if (existingBanners === 0) {
            const sampleBanners = [
                {
                    title: 'Premium Tyres Now Available',
                    imageUrl: 'https://via.placeholder.com/1200x400/1E3A8A/FFFFFF?text=Premium+Tyres+Sale',
                    linkUrl: '/tyres',
                    sortOrder: 1,
                    isActive: true
                },
                {
                    title: 'High Performance Batteries',
                    imageUrl: 'https://via.placeholder.com/1200x400/3B82F6/FFFFFF?text=Battery+Sale',
                    linkUrl: '/batteries',
                    sortOrder: 2,
                    isActive: true
                },
                {
                    title: 'Auto Accessories - Up to 30% Off',
                    imageUrl: 'https://via.placeholder.com/1200x400/60A5FA/FFFFFF?text=Accessories+Sale',
                    linkUrl: '/accessories',
                    sortOrder: 3,
                    isActive: true
                },
            ];

            await Banner.insertMany(sampleBanners);
            console.log('✅ Seeded sample banners');
        } else {
            console.log('ℹ️  Banners already exist');
        }

        // Seed sample products
        const existingProducts = await Product.countDocuments();

        if (existingProducts === 0) {
            const sampleProducts = [
                // Tyres
                {
                    type: 'tyre',
                    name: 'Michelin Primacy 4',
                    brand: 'Michelin',
                    sku: 'TYR-MICH-205-55-16',
                    price: 28000,
                    discountType: 'percent',
                    discountValue: 10,
                    salePrice: 25200,
                    stockQty: 20,
                    images: ['https://via.placeholder.com/400?text=Michelin+Primacy+4'],
                    shortDesc: 'Premium touring tyre with excellent wet grip',
                    longDesc: 'The Michelin Primacy 4 offers exceptional safety and longevity. Perfect for sedans and family cars.',
                    tags: ['premium', 'sedan', 'touring'],
                    status: 'active',
                    salesCount: 45,
                    specs: {
                        width: '205',
                        profile: '55',
                        rim: '16',
                        speedRating: 'V',
                        loadIndex: '91',
                        vehicleType: 'Sedan',
                    }
                },
                {
                    type: 'tyre',
                    name: 'Bridgestone Turanza T005',
                    brand: 'Bridgestone',
                    sku: 'TYR-BRID-215-60-17',
                    price: 32000,
                    discountType: null,
                    discountValue: 0,
                    salePrice: 32000,
                    stockQty: 15,
                    images: ['https://via.placeholder.com/400?text=Bridgestone+Turanza'],
                    shortDesc: 'Superior comfort and handling for SUVs',
                    longDesc: 'Bridgestone Turanza T005 provides a quiet ride with excellent braking performance in both wet and dry conditions.',
                    tags: ['suv', 'comfort', 'performance'],
                    status: 'active',
                    salesCount: 32,
                    specs: {
                        width: '215',
                        profile: '60',
                        rim: '17',
                        speedRating: 'H',
                        loadIndex: '96',
                        vehicleType: 'SUV',
                    }
                },
                {
                    type: 'tyre',
                    name: 'Goodyear Eagle F1',
                    brand: 'Goodyear',
                    sku: 'TYR-GOOD-225-45-18',
                    price: 38000,
                    discountType: 'fixed',
                    discountValue: 3000,
                    salePrice: 35000,
                    stockQty: 8,
                    images: ['https://via.placeholder.com/400?text=Goodyear+Eagle+F1'],
                    shortDesc: 'High-performance tyre for sports cars',
                    longDesc: 'Goodyear Eagle F1 delivers ultimate grip and precise handling for high-performance vehicles.',
                    tags: ['performance', 'sports', 'grip'],
                    status: 'active',
                    salesCount: 18,
                    specs: {
                        width: '225',
                        profile: '45',
                        rim: '18',
                        speedRating: 'Y',
                        loadIndex: '95',
                        vehicleType: 'Sports Car',
                    }
                },

                // Batteries
                {
                    type: 'battery',
                    name: 'Amaron GO 45Ah',
                    brand: 'Amaron',
                    sku: 'BAT-AMAR-45AH-12V',
                    price: 12500,
                    discountType: null,
                    discountValue: 0,
                    salePrice: 12500,
                    stockQty: 30,
                    images: ['https://via.placeholder.com/400?text=Amaron+GO+45Ah'],
                    shortDesc: '12V 45Ah maintenance-free battery for small cars',
                    longDesc: 'Amaron GO is a premium maintenance-free battery with high cranking power and long life. Ideal for city driving.',
                    tags: ['maintenance-free', 'compact', 'reliable'],
                    status: 'active',
                    salesCount: 67,
                    specs: {
                        voltage: '12',
                        ampereHours: '45',
                        cca: '330',
                        warranty: '36',
                        vehicleType: 'Compact Car',
                    }
                },
                {
                    type: 'battery',
                    name: 'Exide Matrix 65Ah',
                    brand: 'Exide',
                    sku: 'BAT-EXID-65AH-12V',
                    price: 18000,
                    discountType: 'percent',
                    discountValue: 5,
                    salePrice: 17100,
                    stockQty: 25,
                    images: ['https://via.placeholder.com/400?text=Exide+Matrix+65Ah'],
                    shortDesc: '12V 65Ah premium battery for sedans and SUVs',
                    longDesc: 'Exide Matrix offers superior performance with advanced calcium technology. Perfect for modern vehicles with high electrical loads.',
                    tags: ['premium', 'high-capacity', 'durable'],
                    status: 'active',
                    salesCount: 54,
                    specs: {
                        voltage: '12',
                        ampereHours: '65',
                        cca: '520',
                        warranty: '48',
                        vehicleType: 'Sedan/SUV',
                    }
                },

                // Accessories
                {
                    type: 'accessory',
                    accessoryCategory: 'oil',
                    name: 'Castrol EDGE 5W-30 Engine Oil - 4L',
                    brand: 'Castrol',
                    sku: 'ACC-CAST-5W30-4L',
                    price: 8500,
                    discountType: null,
                    discountValue: 0,
                    salePrice: 8500,
                    stockQty: 50,
                    images: ['https://via.placeholder.com/400?text=Castrol+EDGE'],
                    shortDesc: 'Premium synthetic engine oil for superior protection',
                    longDesc: 'Castrol EDGE with Fluid Titanium Technology provides superior engine protection and performance.',
                    tags: ['synthetic', 'premium', 'engine-oil'],
                    status: 'active',
                    salesCount: 89,
                    specs: {
                        description: '5W-30 Fully Synthetic Engine Oil, 4 Liter Pack',
                    }
                },
                {
                    type: 'accessory',
                    accessoryCategory: 'parts',
                    name: 'Bosch Air Filter',
                    brand: 'Bosch',
                    sku: 'ACC-BOSC-AIRFILT-01',
                    price: 1500,
                    discountType: 'percent',
                    discountValue: 15,
                    salePrice: 1275,
                    stockQty: 100,
                    images: ['https://via.placeholder.com/400?text=Bosch+Air+Filter'],
                    shortDesc: 'High-quality engine air filter',
                    longDesc: 'Bosch air filters ensure optimal airflow and engine protection. Easy to install.',
                    tags: ['filter', 'engine', 'maintenance'],
                    status: 'active',
                    salesCount: 123,
                    specs: {
                        description: 'Universal air filter compatible with most sedans',
                    }
                },
                {
                    type: 'accessory',
                    accessoryCategory: 'accessories',
                    name: 'Premium Car Floor Mats Set',
                    brand: 'Generic',
                    sku: 'ACC-FLMT-PREM-01',
                    price: 3500,
                    discountType: 'fixed',
                    discountValue: 500,
                    salePrice: 3000,
                    stockQty: 40,
                    images: ['https://via.placeholder.com/400?text=Floor+Mats'],
                    shortDesc: 'Waterproof rubber floor mats - Set of 4',
                    longDesc: 'Premium quality rubber floor mats with anti-slip backing. Universal fit for most vehicles.',
                    tags: ['interior', 'protection', 'waterproof'],
                    status: 'active',
                    salesCount: 76,
                    specs: {
                        description: 'Set of 4 universal floor mats, waterproof rubber material',
                    }
                },
            ];

            await Product.insertMany(sampleProducts);
            console.log('✅ Seeded sample products (tyres, batteries, accessories)');
        } else {
            console.log('ℹ️  Products already exist');
        }

        console.log('🎉 Database seeding completed successfully!');
        console.log(`\n📧 Admin Login:\n   Email: ${adminEmail}\n   Password: ${adminPassword}\n`);
        console.log(`📍 Districts Seeded: ${SRI_LANKA_DISTRICTS.length} districts`);
        console.log(`   ${SRI_LANKA_DISTRICTS.join(', ')}\n`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seed();

