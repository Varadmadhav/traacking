import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb+srv://varadop09_db_user:XW3Wo4CYfV2K6sHi@cluster0.cazsekj.mongodb.net/winterarc?retryWrites=true&w=majority';
    const conn = await mongoose.connect(connUri);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error:`, error);
    process.exit(1);
  }
};
