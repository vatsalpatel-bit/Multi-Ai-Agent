import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";

import Router from "./Router/Router.jsx";
import { getUserApi } from "./Services/userApi.js";
import { setUser, clearUser } from "./redux/slices/userSlice.js";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserApi();

        dispatch(setUser(data));

      } catch (error) {
        dispatch(clearUser());
        console.log(error)
      }
    };

    fetchUser();
  }, [dispatch]);

  return <RouterProvider router={Router} />;
};

export default App;