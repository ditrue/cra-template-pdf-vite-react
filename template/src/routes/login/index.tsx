import { RouteObject } from "react-router-dom"
import Login from "./login"

const loginRoute: RouteObject = {
  path: "login",
  children: [
    {
      index: true,
      element: <Login />,
    },
  ],
}
export default loginRoute
