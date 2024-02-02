import { RouteObject } from "react-router-dom";
import DocumentList from "./list";

const documentsRoute: RouteObject = {
  path: 'documents',
  children: [
    {
      index: true,
      element: (<DocumentList />),
    },
  ],
};

export default documentsRoute;
