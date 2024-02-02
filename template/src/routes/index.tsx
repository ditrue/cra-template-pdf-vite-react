import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import NotFound from './NotFound';
import { BasicLayout } from './layouts';
import homeRoute from './home';
import projectsRoute from './projects';
import authsRoute from './auths';
import ppmRoute from './ppm';
import schedulesRoute from './schedules';

const router = createBrowserRouter([
  {
    path: '/',
    element: (<Root />),
    children: [
      authsRoute,
      {
        path: '/',
        element: (<BasicLayout />),
        children: [
          homeRoute,
          projectsRoute,
          schedulesRoute,
        ],
      },
      ppmRoute,
      {
        path: '*',
        element: (<NotFound />),
      },
    ],
  }
]);

export default router;
