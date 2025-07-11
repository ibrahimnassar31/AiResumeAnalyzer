import logger from '../utils/logger.js';

export default function errorGlobal(err, req, res, next) {
  logger.error('Global error handler', { error: err, url: req.originalUrl, method: req.method });
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
