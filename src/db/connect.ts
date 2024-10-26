import mongoose from 'mongoose';

const connectDB = async (url: string): Promise<void> => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
    }
};

export default connectDB;
