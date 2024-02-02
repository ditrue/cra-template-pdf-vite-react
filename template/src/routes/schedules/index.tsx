import { RouteObject } from "react-router-dom";
import ScheduleCalendar from "./scheduleCalendar";

const schedulesRoute: RouteObject = {
  path: '/schedules',
  element: (<ScheduleCalendar />),
};

export default schedulesRoute;
