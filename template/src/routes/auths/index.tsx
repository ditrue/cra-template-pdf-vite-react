import { Navigate, RouteObject } from "react-router-dom";
import EmailLogin from "./emailLogin";
import JwtLogin from "./JwtLogin";
import Root from "./Root";

const authsRoute: RouteObject = {
  path: 'auth',
  element: (<Root />),
  children: [
    {
      index: true,
      element: (<Navigate to="jwt" />),
    },
    {
      path: 'jwt',
      element: (<JwtLogin />),
    },
    {
      path: 'email',
      element: (<EmailLogin />),
    },
  ],
};

export default authsRoute;
