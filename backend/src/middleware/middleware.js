import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import express from 'express';

export function applyGlobalMiddleware(app) {
  app.use(helmet());
  app.use(cors({ origin: '*', credentials: true }));
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use(limiter);
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
  app.use(express.json());
}
