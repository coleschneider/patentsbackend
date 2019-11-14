import { normalize } from 'normalizr';
import { companyEntity } from '../entities/companyEntity';
import queryBy, { service } from './apiService';

interface CompanyParams {
  page: number;
  company: string;
}

interface PatentParams extends CompanyParams {
  per_page: number;
}
const companyFactory = ({ page, company }: CompanyParams, fields: Fields[]) => ({
  s: JSON.stringify([
    {
      patent_id: 'desc',
    },
    {
      assignee_total_num_patents: 'desc',
    },
    {
      assignee_organization: 'asc',
    },
    {
      assignee_last_name: 'asc',
    },
    {
      assignee_first_name: 'asc',
    },
  ]),
  f: JSON.stringify([
    'assignee_id',
    'assignee_first_name',
    'assignee_last_name',
    'assignee_organization',
    'assignee_lastknown_country',
    'assignee_lastknown_state',
    'assignee_lastknown_city',
    'assignee_lastknown_location_id',
    'assignee_total_num_patents',
    'assignee_first_seen_date',
    'assignee_last_seen_date',
    'patent_id',
  ]),
  o: JSON.stringify({
    per_page: 25,
    matched_subentities_only: true,
    sort_by_subentity_counts: 'patent_id',
    page: `${page}`,
  }),
  q: JSON.stringify(queryBy(fields, company)),
});
const params = {
  // companyFactory: ,
  patentsFactory: ({ per_page, page, company }: PatentParams, fields: Fields[]) => ({
    f: JSON.stringify([
      'patent_id',
      'patent_title',
      'uspc_sequence',
      'uspc_mainclass_id',
      'uspc_mainclass_title',
      'cpc_group_id',
      'cpc_group_title',
      'nber_subcategory_id',
      'nber_subcategory_title',
      'patent_type',
      'patent_num_cited_by_us_patents',
      'app_date',
      'patent_date',
      'patent_number',
      'inventor_id',
      'inventor_first_name',
      'inventor_last_name',
      'inventor_country',
      'inventor_state',
      'inventor_city',
      'inventor_location_id',
      'assignee_id',
      'assignee_first_name',
      'assignee_last_name',
      'assignee_organization',
      'assignee_country',
      'assignee_state',
      'assignee_city',
      'assignee_location_id',
      'app_date',
      'patent_date',
      'govint_org_id',
      'govint_org_name',
    ]),
    s: JSON.stringify([
      {
        patent_num_cited_by_us_patents: 'desc',
      },
      {
        patent_title: 'asc',
      },
      {
        patent_date: 'desc',
      },
    ]),
    o: JSON.stringify({
      per_page,
      matched_subentities_only: false,
      page,
    }),
    q: JSON.stringify(queryBy(fields, company)),
  }),
};

class CompanyService {
  query: CompanyParams;
  searchBy: Fields[];
  constructor(
    query: CompanyParams,
    searchBy: Fields[] = ['assignee_first_name', 'assignee_last_name', 'assignee_organization'],
  ) {
    this.query = query;
    this.searchBy = searchBy;
  }
  request() {
    return service.get('/assignees/query', {
      params: companyFactory(this.query, this.searchBy),
    });
  }
  normalize(data: any) {
    const { entities, result } = normalize(data.assignees || [], [companyEntity]);
    return { ids: result, entities, count: data.count, total: data.total_assignee_count };
  }
}
export default CompanyService;
