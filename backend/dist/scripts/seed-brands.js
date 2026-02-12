"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Brand_1 = __importDefault(require("@/models/Brand"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tyreshop';
async function seedBrands() {
    try {
        console.log('🏷️ Seeding brands...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        // Clear existing brands
        await Brand_1.default.deleteMany({});
        console.log('🗑️ Cleared existing brands');
        const brands = [
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
        await Brand_1.default.insertMany(brands);
        console.log(`✅ Inserted ${brands.length} brands successfully!`);
        console.log('\n📋 Brands added:');
        brands.forEach(b => console.log(`   - ${b.name}`));
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
seedBrands();
