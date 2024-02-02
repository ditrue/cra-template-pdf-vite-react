declare namespace API {
  namespace AUTH {
    type Jwt = {
      ID: string;
      chineseName: string;
      mainPosition: {
        ID: number;
        name: string;
        department: {
          ID: number;
          name: string;
        };
      };
      avatar: string;
      weComID: string;
    }

    type Email = {
      token: string;
    }
  }
}
