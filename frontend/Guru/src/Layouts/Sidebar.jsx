import { useDispatch, useSelector } from "react-redux";
import { logoutApi } from "../Services/authApi.js";
import { clearUser } from "../redux/slices/userSlice.js";
import { useEffect } from "react";
import { conversationApi, getConversationApi } from "../Services/chatApi.js";
import { addConversation, setAllConversations } from "../redux/slices/chatSlice.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserMenu from "./UserMenu";
import LoginPopup from "./LoginPopup.jsx";

const Sidebar = ({ isOpen, onClose, onOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const convsersations = useSelector((state) => state.chat.allConversations)
  const user = useSelector((state) => state.user.user);

  // console.log(convsersations)

  const logoutHandle = async () => {
    try {
      await logoutApi();

      dispatch(clearUser());
      navigate("/")
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  useEffect(() => {
    const fetchGetConversationApi = async () => {
      const res = await getConversationApi();
      dispatch(setAllConversations(res.conversations))
    }
    fetchGetConversationApi();
  }, [dispatch]);

  const handleConversation = async () => {
    try {
      const res = await conversationApi();
      console.log(res);
      dispatch(addConversation(res))
      navigate(`/chat/${res._id}`);
    } catch (error) {
      console.log("Conversation create request faild")
    }
  }

  return (
    <>
      {/* Open Sidebar Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="
            fixed
            left-6
            top-6
            z-30
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            text-[#D8CFBC]
            transition
            hover:bg-[#565449]/30
          "
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
    fixed
    left-0
    top-0
    z-50
    flex
    h-screen
    w-[320px]
    flex-col
    border-r
    border-[#D8CFBC]/10
    bg-[#11120D]
    px-6
    py-6
    transition-transform
    duration-300
    ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        {/* Header */}
        <div className="shrink-0">
          <div className="flex items-center justify-between">

            <div className="text-[21px] font-medium text-[#FFFBF4]">
              <span className="font-semibold text-[#D8CFBC]">
                AI
              </span>{" "}
              Agent
            </div>

            <button
              onClick={onClose}
              className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          text-[#D8CFBC]/70
          transition
          hover:bg-[#565449]/40
          hover:text-[#FFFBF4]
        "
            >
              ✕
            </button>

          </div>
        </div>


        {/* New Chat */}
        <button
          onClick={handleConversation}
          className="
      mt-10
      flex
      w-full
      shrink-0
      items-center
      gap-3
      rounded-xl
      border
      border-[#D8CFBC]/15
      bg-[#565449]/20
      px-4
      py-3
      text-sm
      text-[#FFFBF4]
      transition
      hover:bg-[#565449]/40
    "
        >
          <span className="text-lg">+</span>
          New Chat
        </button>


        {/* Recent Chats */}
        <div className="mt-9 min-h-0 flex-1 overflow-y-auto">

          <p className="mb-4 px-2 text-[11px] font-semibold uppercase tracking-[2px] text-[#D8CFBC]/40">
            Recent Chats
          </p>

          <div className="space-y-1">

            {convsersations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => navigate(`/chat/${conversation._id}`)}
                className="
            w-full
            truncate
            rounded-lg
            px-3
            py-2.5
            text-left
            text-sm
            text-[#D8CFBC]/70
            transition
            hover:bg-[#565449]/25
            hover:text-[#FFFBF4]
          "
              >
                {conversation.title}
              </button>
            ))}

          </div>

        </div>


        {/* Bottom Section */}
        <div className="relative mt-auto shrink-0 pt-4">

          {user ? (
            <>
              {/* User Popup */}
              {showUserMenu && (
                <UserMenu
                  user={user}
                  onLogout={logoutHandle}
                />
              )}

              {/* User Profile Button */}
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          px-3
          py-3
          text-left
          transition
          hover:bg-[#565449]/25
        "
              >
                {/* Avatar */}
                <div
                  className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#F28B82]
            text-xs
            font-medium
            text-white
          "
                >
                  {user?.name
                    ? user.name.slice(0, 2).toUpperCase()
                    : "VP"}
                </div>

                {/* User Info */}
                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-medium text-[#FFFBF4]">
                    {user?.name}
                  </p>
                  
                </div>

                {/* More */}
                <span className="text-xl text-[#D8CFBC]/60">
                  ⋯
                </span>

              </button>
            </>
          ) : (
            /* Login Button */
            <button
              onClick={() => setShowLogin(true)}
              className="
          flex
          w-full
          items-center
          justify-center
          rounded-xl
          border
          border-[#D8CFBC]/20
          bg-[#565449]/20
          px-4
          py-3
          text-sm
          font-medium
          text-[#FFFBF4]
          transition
          hover:bg-[#D8CFBC]
          hover:text-[#11120D]
          "
            >
              Login
            </button>
          )}

        </div>


      </aside >
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
