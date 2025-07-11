import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { applyGlobalMiddleware } from './middleware/middleware.js';
import { startServer } from './utils/server.js';
import apiRouter from './routes/index.js';
import errorGlobal from './middleware/errorGlobal.js';
import { initializeNlp } from './services/nlp.service.js';
import logger from './utils/logger.js';

dotenv.config();


const app = express();

applyGlobalMiddleware(app);

app.get('/', (req, res) => {
  logger.info('Health check route accessed');
  res.status(200).json({ message: 'API is running', timestamp: new Date() });
});

app.use('/api/v1/', apiRouter);
app.use(errorGlobal);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    await initializeNlp();
    startServer(app, PORT);
  } catch (err) {
    logger.error('Fatal startup error', {
      error: err,
      message: err?.message,
      stack: err?.stack,
    });
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
})();
