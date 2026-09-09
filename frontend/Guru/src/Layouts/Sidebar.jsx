import { useDispatch } from "react-redux";
import { logoutApi } from "../Services/authApi.js";
import { clearUser } from "../redux/slices/userSlice.js";
import { useEffect } from "react";
import { getConversationApi } from "../Services/chatApi.js";

const Sidebar = ({ isOpen, onClose, onOpen }) => {
  const dispatch = useDispatch();

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
      console.log(res)
    }
    fetchGetConversationApi();
  }, [])

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

          <div className="space-y-1">

            <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#D8CFBC]/70 transition hover:bg-[#565449]/25 hover:text-[#FFFBF4]">
              React question
            </button>

            <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#D8CFBC]/70 transition hover:bg-[#565449]/25 hover:text-[#FFFBF4]">
              Node.js project
            </button>

            <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#D8CFBC]/70 transition hover:bg-[#565449]/25 hover:text-[#FFFBF4]">
              AI agent
            </button>

          </div>
        </div>

        {/* Bottom */}
        <div className="absolute bottom-6 left-6 right-6 space-y-1">

          <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#D8CFBC]/70 transition hover:bg-[#565449]/25 hover:text-[#FFFBF4]">
            Settings
          </button>

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
          </button>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;