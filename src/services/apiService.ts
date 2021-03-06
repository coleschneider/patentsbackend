import axios from 'axios';
type CompanyFields =
  | 'assignee_id'
  | 'assignee_first_name'
  | 'assignee_last_name'
  | 'assignee_organization'
  | 'assignee_lastknown_country'
  | 'assignee_lastknown_state'
  | 'assignee_lastknown_city'
  | 'assignee_lastknown_location_id'
  | 'assignee_total_num_patents'
  | 'assignee_first_seen_date'
  | 'assignee_last_seen_date'
  | 'patent_id';

type Fields =
  | 'assignee_id'
  | 'assignee_first_name'
  | 'assignee_last_name'
  | 'assignee_organization'
  | 'assignee_lastknown_country'
  | 'assignee_lastknown_state'
  | 'assignee_lastknown_city'
  | 'assignee_lastknown_location_id'
  | 'assignee_total_num_patents'
  | 'assignee_first_seen_date'
  | 'assignee_last_seen_date'
  | 'patent_id'
  | 'patent_title'
  | 'uspc_sequence'
  | 'uspc_mainclass_id'
  | 'uspc_mainclass_title'
  | 'cpc_group_id'
  | 'cpc_group_title'
  | 'nber_subcategory_id'
  | 'nber_subcategory_title'
  | 'patent_type'
  | 'patent_num_cited_by_us_patents'
  | 'app_date'
  | 'patent_date'
  | 'patent_number'
  | 'inventor_id'
  | 'inventor_first_name'
  | 'inventor_last_name'
  | 'inventor_country'
  | 'inventor_state'
  | 'inventor_city'
  | 'inventor_location_id'
  | 'assignee_id'
  | 'assignee_first_name'
  | 'assignee_last_name'
  | 'assignee_organization';

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
