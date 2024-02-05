import { createBrowserRouter } from "react-router-dom"
import Root from "./Root"
import NotFound from "./NotFound"
import loginRoute from "./login"
import Home from "./Home"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      loginRoute,
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])

export default router
