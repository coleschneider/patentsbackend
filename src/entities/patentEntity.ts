import { schema } from 'normalizr';

export const patentEntity = new schema.Entity(
  'patents',
  {},
  {
    idAttribute: patent => {
      return patent.patent_id;
    },
  },
);
