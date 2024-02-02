import { RouteObject } from "react-router-dom";
import Home from "./home";

const homeRoute: RouteObject = {
  path: '/',
  element: (<Home />),
};

export default homeRoute;
