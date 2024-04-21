function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal' });
}

export default errorHandler;