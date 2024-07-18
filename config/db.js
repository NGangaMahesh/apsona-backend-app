import mongoose from 'mongoose'
import 'dotenv/config.js'

const mongoUrl = process.env.MONGO_URL
export const connectDB = async () => {
    await mongoose.connect(mongoUrl).then(() => {
        console.log('MongoDB Connected');
    });
}