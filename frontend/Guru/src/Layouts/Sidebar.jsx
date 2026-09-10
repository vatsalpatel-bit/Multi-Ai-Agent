import { useDispatch, useSelector } from "react-redux";
import { logoutApi } from "../Services/authApi.js";
import { clearUser } from "../redux/slices/userSlice.js";
import { useEffect } from "react";
import { conversationApi, getConversationApi } from "../Services/chatApi.js";
import { addConversation, setAllConversations } from "../redux/slices/chatSlice.js";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose, onOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const convsersations = useSelector((state) => state.chat.allConversations)
  // console.log(convsersations)

  const logoutHandle = async () => {
    try {
      await logoutApi();

      dispatch(clearUser());

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
          h-screen
          w-[320px]
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
        <div className="flex items-center justify-between">

          <div className="text-[21px] font-medium text-[#FFFBF4]">
            <span className="font-semibold text-[#D8CFBC]">
              AI
            </span>{" "}
            Agent
          </div>

          {/* Close Button */}
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

        {/* New Chat */}
        <button
          onClick={handleConversation}
          className="
            mt-10
            flex
            w-full
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
        <div className="mt-9">

          <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[2px] text-[#D8CFBC]/40">
            Recent Chats
          </p>
          {
            convsersations.map((conversation) => (
              <div
                key={conversation._id}
                className="space-y-1">

                <button
                  onClick={() => navigate(`/chat/${conversation._id}`)}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#D8CFBC]/70 transition hover:bg-[#565449]/25 hover:text-[#FFFBF4]">
                  {conversation.title}
                </button>


              </div>
            ))
          }

        </div>

        {/* Bottom */}
        <div className="absolute bottom-6 left-6 right-6 space-y-1">

         
{/* 
          <button
            onClick={logoutHandle}
            className="
              w-full
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
            Logout
          </button> */}
          {/* User Profile */}
          <div className="mt-3 border-t border-[#D8CFBC]/10 pt-3">

            <div className="
          flex
          items-center
          gap-3
          rounded-xl
          px-2
          py-2
        ">

              {/* Avatar */}
              <div className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#D8CFBC]
            text-xs
            font-semibold
            text-[#11120D]
          ">
                VP
              </div>

              {/* User */}
              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-medium text-[#FFFBF4]">
                  vatsal patel
                </p>

                <p className="text-xs text-[#D8CFBC]/45">
                  Go
                </p>

              </div>

              {/* More */}
              <button
                className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-[#D8CFBC]/50
              transition
              hover:bg-[#565449]/25
              hover:text-[#FFFBF4]
            "
              >
                ⋯
              </button>

            </div>

          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;