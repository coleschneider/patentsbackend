import * as search from '../search';
import sinon, { SinonStub } from 'sinon';
import PatentService from '../../../services/patentService';
import patentResponse from '../../../routes/patent/__test__/fetchPatents.fixture.json';
import { expect } from 'chai';
const createMockResponse = (stub: SinonStub) => {
  return {
    eventConnection: stub,
  };
};
const createMockRequest = (cb: any) => {
  return {
    params: {
      company: 'testing',
    },
    on: (event: string) => cb(event),
  };
};

describe('Patent Search Controller', () => {
  describe('Event Controller', () => {
    it('should call the event controller on the request', async () => {
      const stub = sinon.stub().resolves({
        data: patentResponse,
        status: 200,
      });
      const eventConnection = sinon.stub();
      PatentService.prototype.request = stub;
      const request = createMockRequest((close: string) => close);
      const response = createMockResponse(eventConnection);
      const res = await search.downloadPatentEvents(request as any, response as any, { next: () => {} } as any);
      expect(eventConnection.getCall(0).args[0]).to.eql({
        event: 'UPDATE',
        data: { message: 'Fetching data...', step: 1 },
      });
      expect(eventConnection.getCall(1).args[0]).to.eql({
        event: 'UPDATE',
        data: { message: 'Compressing Data...', step: 2 },
      });
    });
  });
});
