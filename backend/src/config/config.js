import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const config = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  port: process.env.PORT || 3001,
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-analyzer',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '1d',
  },
};

export default config;
