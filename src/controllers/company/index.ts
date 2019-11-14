import { Handler } from 'express';
import http from 'http';
import { BadRequest } from 'src/middleware/errorHandler';
import axios from 'axios';
import asyncMiddleware from 'src/middleware/asyncMiddleware';
import CompanyService from 'src/services/companyService';

export const fetchCompanies: Handler = asyncMiddleware(async (req, res) => {
  const companyService = new CompanyService(req.query);
  const { data } = await companyService.request();
  const normalizedData = companyService.normalize(data);

  res.json(normalizedData);
});
