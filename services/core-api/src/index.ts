import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router as healthRouter } from './routes/health.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ name: 'LocalKart Core API', version: '1.0.0' });
});

app.use('/api/health', healthRouter);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Core API listening on port ${port}`);
});

