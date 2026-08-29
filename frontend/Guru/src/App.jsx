import { useEffect } from "react";
import Router from "./Router/Router.jsx"
import { RouterProvider } from "react-router-dom";
import { getUserApi } from "./Services/userApi.js";
import { useDispatch } from 'react-redux';
import { setUser } from "./redux/slices/userSlice.js";

const App = () => {
  console.log("Hello")
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserApi = async () => {
      try {
        const data = await getUserApi();
        console.log(data.user);
        dispatch(setUser(data.user));
      } catch (error) {
        console.log(error)
      }
    }
    fetchUserApi();
  }, [dispatch]);

  return <RouterProvider router={Router} />
};

export default App;