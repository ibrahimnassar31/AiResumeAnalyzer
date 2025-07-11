import logger from './logger.js';

export function startServer(app, port) {
  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
}
