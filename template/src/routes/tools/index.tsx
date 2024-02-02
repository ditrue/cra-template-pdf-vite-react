import { RouteObject } from "react-router-dom";
import ToolList from "./list";

const toolsRoute: RouteObject = {
  path: 'tools',
  element: (<ToolList />),
};

export default toolsRoute;
