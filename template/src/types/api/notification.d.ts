declare namespace API {
  namespace NOTIFICATION {
    interface User {
      ID: number;
      chineseName: string;
      mainPosition: {
        ID: number;
        name: string;
        department: {
          ID: number;
          name: string;
        };
      }
    }

    interface ListItem {
      ID: number;
      endTime: string;
      source: string;
      title: string;
      user: User;
    }
  }
}
