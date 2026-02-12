"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("@/models/Product"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tyreshop';
async function checkProducts() {
    try {
        console.log('🔍 Checking products...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        const count = await Product_1.default.countDocuments();
        console.log(`📦 Found ${count} products in database`);
        if (count === 0) {
            console.log('\n🌱 No products found. Seeding sample products...\n');
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
                    longDesc: 'Bridgestone Turanza T005 provides a quiet ride with excellent braking performance.',
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
                    longDesc: 'Goodyear Eagle F1 delivers ultimate grip and precise handling.',
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
                    longDesc: 'Amaron GO is a premium maintenance-free battery with high cranking power.',
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
                    longDesc: 'Exide Matrix offers superior performance with advanced calcium technology.',
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
                    longDesc: 'Castrol EDGE with Fluid Titanium Technology.',
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
                    longDesc: 'Bosch air filters ensure optimal airflow and engine protection.',
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
                    longDesc: 'Premium quality rubber floor mats with anti-slip backing.',
                    tags: ['interior', 'protection', 'waterproof'],
                    status: 'active',
                    salesCount: 76,
                    specs: {
                        description: 'Set of 4 universal floor mats, waterproof rubber',
                    }
                },
            ];
            await Product_1.default.insertMany(sampleProducts);
            console.log(`✅ Successfully seeded ${sampleProducts.length} products!`);
            console.log('\n📋 Products added:');
            sampleProducts.forEach(p => console.log(`   - ${p.name} (${p.type})`));
        }
        else {
            console.log('\n✅ Products already exist in database');
            const products = await Product_1.default.find().limit(5);
            console.log('\n📋 Sample products:');
            products.forEach(p => console.log(`   - ${p.name} (${p.type})`));
        }
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
checkProducts();
