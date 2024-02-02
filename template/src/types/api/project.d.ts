declare namespace API {
  namespace PROJECT {
    interface Attend {
      ID: number;
      name: string;
      roleCode: string;
      roleName: string;
      userID: number;
    }

    interface ListItem {
      ID: number;
      fzr: string;
      leader: string;
      projectCode: string;
      projectName: string;
      stage: string;
      thCloudUrl: string;
      workspaceID: number;
      attends: Attend[];
    }

    interface Detail {
      ID: number;
      attends: Attend[];
      chiefCreator: string;
      companyName: string;
      depName: string;
      leader: string;
      major: string;
      participants: string;
      permissions?: string[];
      projectCode: string;
      projectManager: string;
      projectName: string;
      projectStatus: string;
      stage: string;
      stageName: string;
      thCloudUrl: string;
      workspaceID: number;
    }
  }
}
