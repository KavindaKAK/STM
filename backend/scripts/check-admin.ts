import mongoose from 'mongoose';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tyreshop';

async function checkAdmin() {
    try {
        console.log('🔍 Checking admin user...');

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const adminEmail = 'admin@tyreshop.lk';
        const admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log('\n✅ Admin user EXISTS in database:');
            console.log('   Email:', admin.email);
            console.log('   Name:', admin.name);
            console.log('   Role:', admin.role);
            console.log('   Has password hash:', !!admin.passwordHash);
            console.log('\n📝 Try logging in with:');
            console.log('   Email: admin@tyreshop.lk');
            console.log('   Password: admin123');
        } else {
            console.log('\n❌ Admin user NOT FOUND!');
            console.log('Creating admin user now...');

            const passwordHash = await hashPassword('admin123');
            await User.create({
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

        await mongoose.disconnect();
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkAdmin();
