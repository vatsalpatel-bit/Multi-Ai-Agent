import Router from "./Router/Router.jsx"
import { RouterProvider } from "react-router-dom";

const app = () => {
  return <RouterProvider router={Router} />
};

export default app;