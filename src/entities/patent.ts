import { schema } from 'normalizr';

export const patentSchema = new schema.Entity(
  'patents',
  {},
  {
    idAttribute: patent => {
      return patent.patent_id;
    },
  },
);
