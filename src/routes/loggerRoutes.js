// routes/loggerRoutes.js
import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/loggerTest', (req, res) => {
  logger.fatal('Esto es un log fatal');
  logger.error('Esto es un log de error');
  logger.warning('Esto es un log de warning');
  logger.info('Esto es un log de info');
  logger.http('Esto es un log de http');
  logger.debug('Esto es un log de debug');
  
  res.send('Logs de prueba generados. Revisa la consola y el archivo errors.log');
});

export default router;