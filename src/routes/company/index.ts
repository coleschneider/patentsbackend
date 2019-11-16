import { Router } from 'express';
import { fetchCompanies } from '../../controllers/company/search';
import { companySchemaDefinition } from '../../schemas/company';
const router = Router();

router.get('/', companySchemaDefinition, fetchCompanies);

export default router;
