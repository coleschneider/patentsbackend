import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import Application from '../../../app';
import CompanyService from '../../../services/companyService';
import fetchCompaniesResponse from './fetchCompanies.fixture.json';
import assert from 'assert';

describe('GET /api/companies', () => {
  const app = new Application().start();
  describe('ERROR', () => {
    it('it should send a 400 and an object of page and company if missing from query', async () => {
      const res = await request(app).get('/api/companies');
      expect(res.status).to.equal(400);
      expect(res.body).to.eql({ company: 'company is required', page: 'page is required' });
    });
    it('it should send a 400 and an object of page if missing from query', async () => {
      const res = await request(app).get(`/api/companies?company=test`);
      expect(res.status).to.equal(400);
      expect(res.body).to.eql({ page: 'page is required' });
    });
    it('it should send a 400 and an object of company if missing from query', async () => {
      const res = await request(app).get(`/api/companies?page=1`);
      expect(res.status).to.equal(400);
      expect(res.body).to.eql({ company: 'company is required' });
    });
  });
  describe('SUCCESS', () => {
    it('should call the service and normalize the data', async () => {
      const stub = sinon.stub().returns({
        data: fetchCompaniesResponse,
        status: 200,
      });
      const spy = sinon.spy(CompanyService.prototype, 'normalize');
      CompanyService.prototype.request = stub;
      const res = await request(app).get('/api/companies?page=1&company=testing');
      expect(res.status).to.equal(200);
      const normal = new CompanyService({ page: 1, company: 'testing' }).normalize(fetchCompaniesResponse);
      expect(res.body).to.eql(normal);
      assert.equal(spy.called, true);
    });
  });
});
