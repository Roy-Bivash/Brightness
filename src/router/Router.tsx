import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Home } from "../pages/home/Home";
import { Setting } from "../pages/setting/Setting";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/setting",
      element: <Setting />
    }
]);

export function Router(){
    return <RouterProvider router={router} />;
}