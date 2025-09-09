import { Router } from 'express';

export const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'core-api', timestamp: new Date().toISOString() });
});

