import { Navigate, RouteObject } from "react-router-dom";
import ProjectList from "./list";
import ProjectDetail from './detail';
import ProjectNew from "./new";

const projectsRoute: RouteObject = {
  path: 'projects',
  children: [
    {
      index: true,
      element: (<ProjectList />),
    },
    {
      path: 'new',
      element: (<ProjectNew />),
    },
    {
      path: ':id',
      element: (<Navigate to="information" />),
    },
    {
      path: ':id/:tab',
      element: (<ProjectDetail />),
    },
  ],
};

export default projectsRoute;
