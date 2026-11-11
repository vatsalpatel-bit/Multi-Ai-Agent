import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const mongoDbURl = process.env.MONGODB_URL;
        if (!mongoDbURl) {
            throw new Error("MONGODB_URL is missing from environement variables")
        }

        await mongoose.connect(mongoDbURl, {
            maxPoolSize: 20,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxIdleTimeMS: 30000,
            autoIndex: true, //note: must false in production 
        });

        console.log(`MongoDB connected:${mongoose.connection.host}`);

    } catch (error) {
        console.log(`MongoDB connection failed`, error.message);
        throw error;

    }
}

export default connectDb;