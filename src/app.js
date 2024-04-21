import express from 'express';
import router from './routes/routes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));