"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("@/models/User"));
const auth_1 = require("@/lib/auth");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tyreshop';
async function checkAdmin() {
    try {
        console.log('🔍 Checking admin user...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        const adminEmail = 'admin@tyreshop.lk';
        const admin = await User_1.default.findOne({ email: adminEmail });
        if (admin) {
            console.log('\n✅ Admin user EXISTS in database:');
            console.log('   Email:', admin.email);
            console.log('   Name:', admin.name);
            console.log('   Role:', admin.role);
            console.log('   Has password hash:', !!admin.passwordHash);
            console.log('\n📝 Try logging in with:');
            console.log('   Email: admin@tyreshop.lk');
            console.log('   Password: admin123');
        }
        else {
            console.log('\n❌ Admin user NOT FOUND!');
            console.log('Creating admin user now...');
            const passwordHash = await (0, auth_1.hashPassword)('admin123');
            await User_1.default.create({
                role: 'admin',
                name: 'Administrator',
                email: adminEmail,
                phone: '+94771234567',
                passwordHash,
                addresses: [],
            });
            console.log('\n✅ Admin user created successfully!');
            console.log('   Email: admin@tyreshop.lk');
            console.log('   Password: admin123');
        }
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
checkAdmin();
