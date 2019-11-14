import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ okay: true });
});

export default router;
