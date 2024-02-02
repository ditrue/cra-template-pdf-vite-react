declare namespace API {
  namespace WXWORK {
    type Org = {
      ID: number;
      name: string;
      children: Org[];
    }

    type OrgUser = {
      ID: number;
      cybrosUserID: number;
      name: string;
      departmentIds?: number[];
    }
  }
}
