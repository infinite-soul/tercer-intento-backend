import logger from '../utils/logger.js';

function errorHandler(err, req, res, next) {
    logger.error(`${err.name}: ${err.message}\n${err.stack}`);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'No autorizado' });
    }
    
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
}

export default errorHandler;