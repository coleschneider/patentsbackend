import { Handler } from 'express';
import asyncMiddleware from 'src/middleware/asyncMiddleware';
import PatentService from 'src/services/patentService';

export const fetchPatents: Handler = asyncMiddleware(async (req, res) => {
  const patentService = new PatentService(req.query);
  const { data } = await patentService.request();
  const normalizedData = patentService.normalize(data);
  res.json(normalizedData);
});
