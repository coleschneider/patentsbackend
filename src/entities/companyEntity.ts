import { schema } from 'normalizr';

export const companyEntity = new schema.Entity(
  'companies',
  {},
  {
    idAttribute: company => {
      return company.assignee_id;
    },
  },
);
