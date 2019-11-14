import { Router } from 'express';
import companyRoutes from './company';
import patentRoutes from './patent';

const router = Router();

router.use('/companies', companyRoutes);
router.use('/patents', patentRoutes);

export default router;
