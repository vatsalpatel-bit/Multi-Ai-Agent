import { useEffect, useState } from "react";
import LoginPopup from "./LoginPopup.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getConversationApi } from "../Services/chatApi.js";
import { setAllConversations } from "../redux/slices/chatSlice.js";

const Navbar = () => {
  const dispatch = useDispatch();
  const [showLogin, setShowLogin] = useState(false);

  const user = useSelector((state) => state.user.user);
  
  useEffect(() => {
    if (!user) return;
    const fetchGetConversationApi = async () => {
      const res = await getConversationApi();
      dispatch(setAllConversations(res.conversations))
    }
    fetchGetConversationApi();
  }, [user, dispatch]);

  return (
    <>
      <nav className="flex h-[82px] items-center justify-between  border-[#D8CFBC]/10 px-[5%]">

        {/* Logo */}
        <div className="text-[21px] font-medium text-[#FFFBF4]">
          <span className="font-semibold text-[#D8CFBC]">
            AI
          </span>{" "}
          Agent
        </div>

        {/* Login */}
        {!user && (
          <button
            onClick={() => setShowLogin(true)}
            className="
              rounded-full
              border border-[#D8CFBC]/35
              px-[22px] py-[10px]
              text-sm
              text-[#FFFBF4]
              transition
              hover:bg-[#D8CFBC]
              hover:text-[#11120D]
            "
          >
            Login
          </button>
        )}

      </nav>

      {/* Login Popup */}
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
};

export default Navbar;