import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL;

        if (!mongoUrl) {
            throw new Error("MONGODB_URL is missing from environment variables");
        }

        await mongoose.connect(mongoUrl, {
            maxPoolSize: 20,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxIdleTimeMS: 30000,
            autoIndex: true  //note: must false in production 
        });
        console.log(`MongoDB connected:${mongoose.connection.host}`);

    } catch (error) {
        console.log(`MongoDB connection failed`, error.message)
        throw error;
    }
}

export default connectDB;