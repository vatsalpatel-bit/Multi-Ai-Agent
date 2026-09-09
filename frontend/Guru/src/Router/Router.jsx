import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home.jsx";
import Chat from "../Layouts/Chat.jsx";

const Router = createBrowserRouter([
    {
        path: "/",
        element: (<Home />),
    },
    {
        path: "/chat",
        element: (<Chat />)
    }
]);

export default Router;