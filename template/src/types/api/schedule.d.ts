declare namespace API {
  namespace SCHEDULE {
    interface Project {
      projectCode: string;
      projectName: string;
      province: string;
      city: string;
      area: string;
      companyCode: string;
      companyName: string;
      depCode: string;
      depName: string;
      userCode: string;
      userName: string;
      ID: number;
    }

    interface User {
      ID: number;
      chineseName: string;
      mainPosition?: {
        ID: number;
        name: string;
        department?: {
          ID: number;
          name: string;
        };
      }
    }
    interface ListItem {
      ID: number;
      calendarID: number;
      calendar?: CALENDAR.Calendar;
      scheduleType: string;
      accountType: string;
      summary: string;
      description: string;
      location: string;
      startTime: number;
      endTime: number;
      startTimeUnix: number;
      endTimeUnix: number;
      reminder: {
        ID: number;
        CreatedAt: string;
        UpdatedAt: string;
        scheduleID: number;
        isRemind: number;
        remindBeforeEventSecs: number;
        remindTimeDiffs: number[];
        isRepeat: number;
        repeatType: number;
        repeatUntil: number;
        isCustomRepeat: number;
        repeatInterval: number
        repeatDayOfWeek: number[];
        repeatDayOfMonth: number[];
        timezone: number;
        excludeTimeList: {
          start_time: number;
        }[];
      };
      organizer?: User;
      outlookOrganizer?: string;
      attendeUsers?: User[];
      permissions: string[];
      project?: Project;
      projectID?: number;
      stageDesc?: string;
      timelineID: number;
    }

    interface Detail {
      ID: number;
      calendarID: number;
      scheduleType: string;
      accountType: string;
      summary: string;
      description: string;
      location: string;
      startTime: number;
      endTime: number;
      startTimeUnix: number;
      endTimeUnix: number;
      attendees: number[];
      allowActiveJoin: boolean;
      reminder: {
          ID?: number;
          CreatedAt?: string;
          UpdatedAt?: string;
          scheduleID?: number;
          isRemind?: number;
          remindTimeDiffs?: number[];
          isRepeat?: number;
          repeatType?: number;
          repeatUntil?: number;
          isCustomRepeat?: number;
          repeatInterval?: number;
          repeatDayOfWeek?: number[];
          repeatDayOfMonth?: number[];
          timezone?: number;
          excludeTimeList?: {
            start_time: string;
          }[];
      };
      organizer?: User;
      outlookOrganizer?: string;
      attendeUsers?: User[];
      permissions: string[];
      project?: Project;
      stageDesc?: string;
    }

    interface File {
      ID: number;
      fileName: string;
      path: string;
      permissions: string[];
      scheduleID: number;
      tag: string;
      user: User;
    }
  }
}
