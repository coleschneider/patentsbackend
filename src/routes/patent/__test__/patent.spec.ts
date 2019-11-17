import { expect } from 'chai';
import Application from '../../../app';
import assert from 'assert';
import fetchPatentsResponse from './fetchPatents.fixture.json';
import PatentService from '../../../services/patentService';
import request from 'supertest';
import sinon from 'sinon';

describe('GET /api/patents', () => {
  const app = new Application().start();
  describe('ERROR', () => {
    it('it should send a 400 and an object of page and company if missing from query', async () => {
      const res = await request(app).get('/api/patents');
      expect(res.status).to.equal(400);
      expect(res.body).to.eql({ company: 'company is required', page: 'page is required' });
    });
    it('it should send a 400 and an object of page if missing from query', async () => {
      const res = await request(app).get(`/api/patents?company=test`);
      expect(res.status).to.equal(400);
      expect(res.body).to.eql({ page: 'page is required' });
    });
    it('it should send a 400 and an object of company if missing from query', async () => {
      const res = await request(app).get(`/api/patents?page=1`);
      expect(res.status).to.equal(400);
      expect(res.body).to.eql({ company: 'company is required' });
    });
  });
  describe('SUCCESS', () => {
    it('should call the service and normalize the data', async () => {
      const stub = sinon.stub().returns({
        data: fetchPatentsResponse,
        status: 200,
      });
      const spy = sinon.spy(PatentService.prototype, 'normalize');
      PatentService.prototype.request = stub;
      const res = await request(app).get('/api/patents?page=1&company=testing');
      expect(res.status).to.equal(200);
      const normal = new PatentService({ page: 1, company: 'testing', per_page: 25 }).normalize(fetchPatentsResponse);
      expect(res.body).to.eql(normal);
      assert.equal(spy.called, true);
    });
  });
});
