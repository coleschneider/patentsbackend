import { Handler } from 'express';
import asyncMiddleware from '../../middleware/asyncMiddleware';
import CompanyService from '../../services/companyService';

export const fetchCompanies: Handler = asyncMiddleware(async (req, res) => {
  const companyService = new CompanyService(req.query);
  const { data } = await companyService.request();
  const normalizedData = companyService.normalize(data);

  res.json(normalizedData);
});
