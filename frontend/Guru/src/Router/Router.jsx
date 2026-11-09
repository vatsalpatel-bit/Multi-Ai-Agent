import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home.jsx";
import Chat from "../Layouts/Chat.jsx";
import Plans from "../Pages/Plans.jsx";
import Checkout from "../Pages/Checkout.jsx";

const Router = createBrowserRouter([
    {
        path: "/",
        element: (<Home />),
    },
    {
        path: "/chat/:id",
        element: (<Chat />)
    },
    {
        path: "/plans",
        element: (<Plans />)
    },
    {
        path: "/checkout/:planId",
        element: (<Checkout />)
    }
]);

export default Router;