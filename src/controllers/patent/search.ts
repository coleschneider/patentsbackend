import { Handler } from 'express';
import asyncMiddleware from '../../middleware/asyncMiddleware';
import { ResponseExt } from '../../middleware/eventMiddleware';
import XLSX from 'xlsx';
import PatentService from '../../services/patentService';

export const fetchPatents: Handler = asyncMiddleware(async (req, res: ResponseExt) => {
  const patentService = new PatentService(req.query);
  const { data } = await patentService.request();
  const normalizedData = patentService.normalize(data);
  res.json(normalizedData);
});

export const downloadPatentEvents = asyncMiddleware(async (req, res: ResponseExt) => {
  res.eventConnection({
    event: 'UPDATE',
    data: { message: 'Fetching data...', step: 1 },
  });

  const patentService = new PatentService({ per_page: 10000, company: req.params.company, page: 1 });

  const { data } = await patentService.request();
  res.eventConnection({
    event: 'UPDATE',
    data: { message: 'Compressing Data...', step: 2 },
  });
  const workbook = await patentService.transformToWorkbook(data);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(workbook);
  wb.SheetNames.push('Test Sheet');
  wb.Sheets['Test Sheet'] = ws;
  const buff = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  res.eventConnection({
    event: 'DATA',
    data: { buff, step: 3 },
  });
  res.eventConnection({
    event: 'UPDATE',
    data: { message: 'Ok', step: 4 },
  });

  req.on('close', () => {
    res.end();
  });
});
