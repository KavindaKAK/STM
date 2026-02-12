import mongoose from 'mongoose';

let cachedConnection: typeof mongoose | null = null;

async function connectDB() {
    if (cachedConnection) {
        return cachedConnection;
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }

    const opts = {
        bufferCommands: false,
    };

    try {
        cachedConnection = await mongoose.connect(mongoUri, opts);
        return cachedConnection;
    } catch (e) {
        cachedConnection = null;
        throw e;
    }
}

export default connectDB;
