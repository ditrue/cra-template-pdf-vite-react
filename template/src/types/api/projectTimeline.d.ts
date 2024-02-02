declare namespace API {
  namespace PROJECT {
    namespace TIMELINE {
      interface ListItem {
        ID: number;
        name: string;
        projectID: number;
        startTime: number;
        endTime: number;
        stageDesc?: string;
      }
  
      interface Project {
        ID: number;
        projectCode: string;
        projectName: string;
        coordinate: string;
        province: string;
        city: string;
        companyCode: string;
        companyName: string;
        depCode: string;
        depName: string;
        WorkspaceID: number;
        projectAttends: {
          ID: number;
          userID: number;
          name: string;
          roleName: string;
          roleCode: string;
        }[];
        stageName: string;
        projectStatus: string;
      }
  
      interface Detail {
        ID: number;
        name: string;
        projectID: number;
        project: Project;
        startTime: number;
        endTime: number;
        stageDesc: string;
        user?: any;
      }
    }
  }
}
