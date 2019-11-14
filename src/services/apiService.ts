import axios from 'axios';

const queryBy = (searchBy: Fields[], term: string) => {
  return {
    _and: [
      {
        _or: searchBy.map(field => ({
          _and: [
            {
              _contains: {
                [field]: `${term}`,
              },
            },
          ],
        })),
      },
      {
        uspc_sequence: 0,
      },
    ],
  };
};

export const service = axios.create({
  baseURL: 'http://webapi.patentsview.org/api',
});
export default queryBy;
