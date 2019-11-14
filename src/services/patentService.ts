import { normalize } from 'normalizr';
import queryBy, { service } from './apiService';
import { patentEntity } from 'src/entities/patentEntity';

interface CompanyParams {
  page: number;
  company: string;
}

interface PatentParams extends CompanyParams {
  per_page: number;
}

const patentFactory = ({ per_page, page, company }: PatentParams, fields: Fields[]) => ({
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
});

class PatentService {
  query: PatentParams;
  searchBy: Fields[];
  constructor(
    query: PatentParams,
    searchBy: Fields[] = ['assignee_first_name', 'assignee_last_name', 'assignee_organization'],
  ) {
    this.query = query;
    this.searchBy = searchBy;
  }
  request() {
    return service.get('/patents/query', {
      params: patentFactory(this.query, this.searchBy),
    });
  }
  normalize(data: any) {
    const { entities, result } = normalize(data.patents || [], [patentEntity]);
    return { ids: result, entities, count: data.count, total: data.total_patent_count };
  }
}
export default PatentService;
