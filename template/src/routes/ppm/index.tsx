import { RouteObject, Navigate } from "react-router-dom";
import PpmProjectTimeline from "./PpmProjectTimeline";
import NotFound from "../NotFound";
import PpmLoading from "./PpmLoading";
import PpmError from "./PpmError";
import { PpmLayout } from "../layouts";

const ppmRoute: RouteObject = {
  path: 'ppm',
  element: (<PpmLayout />),
  children: [
    {
      index: true,
      element: (<Navigate to="404" />),
    },
    {
      path: 'projects/:code/timeline',
      element: (<PpmProjectTimeline />),
    },
    {
      path: 'loading',
      element: (<PpmLoading />),
    },
    {
      path: 'error',
      element: (<PpmError />),
    },
    {
      path: '*',
      element: (<NotFound hideBack />),
    },
  ],
};

export default ppmRoute;
