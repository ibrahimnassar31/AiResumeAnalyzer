import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/aiResumeAnalyzer';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export async function connectDB() {
  try {
    await mongoose.connect(mongoURI, options);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error', { error: err });
    throw err;
  }
}
