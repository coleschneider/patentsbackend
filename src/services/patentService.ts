import { normalize } from 'normalizr';
import queryBy, { service } from './apiService';
import { patentEntity } from '../entities/patentEntity';
import { AxiosPromise } from 'axios';
import { NotFound } from 'middleware/errorHandler';
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

interface Applications {
  app_date: string;
  app_id: string;
}
interface Assignees {
  assignee_city: string | null;
  assignee_country: string | null;
  assignee_first_name: string | null;
  assignee_last_name: string | null;
  assignee_id: string | null;
  assignee_location_id: string | null;
  assignee_organization: string | null;
  assignee_state: string | null;
}
interface CPC {
  cpc_group_title: string | null;
  cpc_group_id: string | null;
}
interface GovInterests {
  govint_org_id: string | null;
  govint_org_name: string | null;
}
interface Inventors {
  inventor_city: string | null;
  inventor_country: string | null;
  inventor_first_name: string | null;
  inventor_last_name: string | null;
  inventor_location_id: string | null;
  inventor_state: string | null;
}

interface NBERS {
  nber_subcategory_id: string | null;
  nber_subcategory_title: string | null;
}

interface USPCS {
  uspc_mainclass_id: string | null;
  uspc_mainclass_title: string | null;
  uspc_sequence: string | null;
}

interface Patent {
  applications: Applications[];
  assignees: Assignees[];
  cpcs: CPC[];
  gov_interests: GovInterests[];
  uspcs: USPCS[];
  inventors: Inventors[];
  nbers: NBERS[];
  patent_date: string;
  patent_id: string;
  patent_num_cited_by_us_patents: string;
  patent_number: string;
  patent_title: string;
  patent_type: string;
}
class PatentService {
  query: PatentParams;
  searchBy: Fields[];
  constructor(query: PatentParams, searchBy: Fields[] = ['assignee_id']) {
    this.query = query;
    this.searchBy = searchBy;
  }
  request(): AxiosPromise<{ patents: Patent[]; count: number; total_patent_count: number }> {
    return service.get('/patents/query', {
      params: patentFactory(this.query, this.searchBy),
    });
  }
  normalize(data: { patents: Patent[]; count: number; total_patent_count: number }) {
    if (!data.patents) {
      throw new NotFound();
    }
    const { entities, result } = normalize(data.patents || [], [patentEntity]);
    return { ids: result, entities, count: data.count, total: data.total_patent_count };
  }
  async transformToWorkbook(data: { patents: Patent[]; count: number; total_patent_count: number }) {
    return data.patents.map(patent => {
      const applications = patent.applications.reduce((acc, curr, index) => {
        const { app_date, app_id } = curr;
        const appDate = `app_date_${index}`;
        const appId = `app_id_${index}`;
        acc[appDate] = app_date;
        acc[appId] = app_id;
        return acc;
      }, {} as any);
      const cpcs = patent.cpcs.reduce((acc, curr, index) => {
        const { cpc_group_id, cpc_group_title } = curr;
        const cpcGroupTitle = `cpc_group_title_${index}`;
        const cpcGroupId = `cpc_group_id_${index}`;
        acc[cpcGroupTitle] = cpc_group_title;
        acc[cpcGroupId] = cpc_group_id;
        return acc;
      }, {} as any);
      const nbers = patent.nbers.reduce((acc, curr, index) => {
        const { nber_subcategory_id, nber_subcategory_title } = curr;
        const nberSubcategoryId = `nber_subcategory_id_${index}`;
        const nberSubCategoryTitle = `nber_subcategory_title_${index}`;
        acc[nberSubcategoryId] = nber_subcategory_id;
        acc[nberSubCategoryTitle] = nber_subcategory_title;
        return acc;
      }, {} as any);
      const inventors = patent.inventors.reduce((acc, curr, index) => {
        const {
          inventor_city,
          inventor_country,
          inventor_first_name,
          inventor_last_name,
          inventor_state,
          inventor_location_id,
        } = curr;
        const inventorCity = `inventor_city_${index}`;
        const inventorCountry = `inventor_country_${index}`;
        const inventorFirstName = `inventor_first_name_${index}`;
        const inventorLastName = `inventor_last_name_${index}`;
        const inventorState = `inventor_state_${index}`;
        const inventorLocationId = `inventor_location_id_${index}`;

        acc[inventorCity] = inventor_city;
        acc[inventorCountry] = inventor_country;
        acc[inventorFirstName] = inventor_first_name;
        acc[inventorLastName] = inventor_last_name;
        acc[inventorState] = inventor_state;
        acc[inventorLocationId] = inventor_location_id;
        return acc;
      }, {} as any);
      const govInterests = patent.gov_interests.reduce((acc, curr, index) => {
        const { govint_org_id, govint_org_name } = curr;
        const govInterestOrgId = `govint_org_id_${index}`;
        const govInterestOrgName = `govint_org_name_${index}`;

        acc[govInterestOrgId] = govint_org_id;
        acc[govInterestOrgName] = govint_org_name;
        return acc;
      }, {} as any);
      const USPCS = patent.uspcs.reduce((acc, curr, index) => {
        const { uspc_mainclass_id, uspc_mainclass_title, uspc_sequence } = curr;
        const uscpcMainClassId = `uspc_mainclass_id_${index}`;
        const uscpcMainClassTitle = `uspc_mainclass_title_${index}`;
        const uscpcMainClassSequence = `uspc_sequence_${index}`;

        acc[uscpcMainClassId] = uspc_mainclass_id;
        acc[uscpcMainClassTitle] = uspc_mainclass_title;
        acc[uscpcMainClassSequence] = uspc_sequence;
        return acc;
      }, {} as any);
      const assignees = patent.assignees.reduce((acc, curr, index) => {
        const {
          assignee_city,
          assignee_country,
          assignee_first_name,
          assignee_last_name,
          assignee_id,
          assignee_location_id,
          assignee_organization,
          assignee_state,
        } = curr;
        const assigneeCity = `assignee_city_${index}`;
        const assigneeCountry = `assignee_country_${index}`;
        const assigneeFirstName = `assignee_first_name_${index}`;
        const assigneeLastName = `assignee_last_name_${index}`;
        const assigneeId = `assignee_id_${index}`;
        const assigneeLocationId = `assignee_location_id_${index}`;
        const assigneeOrganization = `assignee_organization_${index}`;
        const assigneeState = `assignee_state_${index}`;

        acc[assigneeCity] = assignee_city;
        acc[assigneeCountry] = assignee_country;
        acc[assigneeFirstName] = assignee_first_name;
        acc[assigneeLastName] = assignee_last_name;
        acc[assigneeId] = assignee_id;
        acc[assigneeLocationId] = assignee_location_id;
        acc[assigneeOrganization] = assignee_organization;
        acc[assigneeState] = assignee_state;
        return acc;
      }, {} as any);
      const {
        applications: anyApps,
        cpcs: anyCpcs,
        nbers: anyNbcs,
        inventors: anyInventors,
        gov_interests: anyGov,
        assignees: anyAssignees,
        uspcs: anyUscps,
        ...clearedPayload
      } = patent;

      return {
        ...clearedPayload,
        ...applications,
        ...cpcs,
        ...nbers,
        ...USPCS,
        ...assignees,
        ...govInterests,
        ...inventors,
      };
    });
  }
}
export default PatentService;
