import { Router } from 'express';
import { fetchPatents, downloadPatentEvents } from '../../controllers/patent/search';
import { patentSchemaDefinition } from '../../schemas/patent';
import eventMiddleware from '../../middleware/eventMiddleware';

const router = Router();

router.get('/', patentSchemaDefinition, fetchPatents);

router.get('/:company/events', eventMiddleware(), downloadPatentEvents);

export default router;
