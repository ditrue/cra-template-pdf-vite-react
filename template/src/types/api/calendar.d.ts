declare namespace API {
  namespace CALENDAR {
    interface Calendar {
      ID: number;
      name: string;
      account: CalendarAccount;
      changeKey?: string;
      description?: string;
      color?: string;
      default?: boolean;
      permissions?: string[];
    }

    interface CalendarAccount {
      ID: number;
      name: string;
      accountType: string;
      color: string;
      icon: string;
      status: number;
    }
  }
}
