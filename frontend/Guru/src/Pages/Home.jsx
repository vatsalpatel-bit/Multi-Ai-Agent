import { useEffect, useState } from "react";
import Navbar from "../Layouts/Navbar.jsx";
import Sidebar from "../Layouts/Sidebar.jsx";
import { agentApi } from "../Services/agentApi.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getConversationApi } from "../Services/chatApi.js";
import { setAllConversations } from "../redux/slices/chatSlice.js";
import AgentSelector from "../Layouts/AgentSelector.jsx";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState("Auto");
    console.log(selectedAgent)
    const [message, setMessage] = useState({
        conversationId: null,
        prompt: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGetConversationApi = async () => {
            const res = await getConversationApi();
            dispatch(setAllConversations(res.conversations))
        }
        fetchGetConversationApi();
    }, [dispatch]);

    const submitHandler = async () => {
        if (!message.prompt.trim()) return;

        try {
            setLoading(true)
            const res = await agentApi({
                conversationId: message.conversationId,
                prompt: message.prompt,
                agent: selectedAgent.trim().toLowerCase()
            });
            navigate(`/chat/${res.conversationId}`);
        } catch {
            console.log("Faild to send message")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#11120D] text-[#FFFBF4]">

            {/* Navbar */}
            <Navbar />

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onOpen={() => setIsSidebarOpen(true)}
            />

            {/* Home */}
            <main
                className={`
    min-h-[calc(100vh-82px)]
    flex
    items-center
    justify-center
    px-5
    transition-all
    duration-300
    ease-in-out
    ${isSidebarOpen
                        ? "ml-[320px] w-[calc(100%-320px)]"
                        : "ml-0 w-full"
                    }
  `}
            >
                <div className="w-full max-w-[850px] text-center">

                    <p className="mb-[22px] text-[11px] font-semibold tracking-[3px] text-[#D8CFBC]">
                        INTELLIGENT AI AGENT
                    </p>

                    <h1 className="font-serif text-5xl font-medium leading-[1.03] tracking-[-3px] sm:text-7xl">
                        Think smarter.
                        <br />
                        <span className="text-[#D8CFBC]">
                            Build faster.
                        </span>
                    </h1>

                    <p className="mx-auto mt-[25px] mb-[42px] max-w-[560px] text-base leading-[1.7] text-[#D8CFBC]/70">
                        Your intelligent AI workspace for asking questions,
                        solving problems and getting things done.
                    </p>

                    {/* Chat Bar */}
                    <div
                        className="
        mx-auto
        w-full
        max-w-[720px]
        overflow-hidden
        rounded-[22px]
        border
        border-[#D8CFBC]/20
        bg-[#11120D]
        text-left
        shadow-[0_18px_50px_rgba(0,0,0,0.3)]
        transition
        focus-within:border-[#D8CFBC]/40
    "
                    >
                        {/* Agents */}
                        <div className="overflow-x-auto px-3 pt-3 scrollbar-hide">
                            <AgentSelector
                                selectedAgent={selectedAgent}
                                setSelectedAgent={setSelectedAgent}
                            />
                        </div>

                        {/* Input Row */}
                        <div className="flex items-end gap-3 px-4 pb-3 pt-2">

                            <textarea
                                value={message.prompt}
                                onChange={(e) =>
                                    setMessage((prev) => ({
                                        ...prev,
                                        prompt: e.target.value,
                                    }))
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        submitHandler();
                                    }
                                }}
                                rows="1"
                                placeholder="Ask your AI agent anything..."
                                className="
                min-h-[48px]
                max-h-[140px]
                flex-1
                resize-none
                bg-transparent
                px-1
                py-3
                text-[15px]
                leading-6
                text-[#FFFBF4]
                outline-none
                placeholder:text-[#D8CFBC]/40
            "
                            />

                            <button
                                onClick={submitHandler}
                                disabled={loading}
                                className={`
                mb-1
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#D8CFBC]
                text-lg
                text-[#11120D]
                transition-all
                duration-200
                ${loading
                                        ? "cursor-not-allowed opacity-40"
                                        : "hover:bg-[#FFFBF4] hover:scale-105"
                                    }
            `}
                            >
                                →
                            </button>

                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="mt-[18px] flex flex-wrap justify-center gap-2">

                        <button className="rounded-full border border-[#D8CFBC]/20 bg-[#565449]/25 px-3.5 py-2 text-xs text-[#D8CFBC] transition hover:bg-[#565449] hover:text-[#FFFBF4]">
                            Explain something
                        </button>

                        <button className="rounded-full border border-[#D8CFBC]/20 bg-[#565449]/25 px-3.5 py-2 text-xs text-[#D8CFBC] transition hover:bg-[#565449] hover:text-[#FFFBF4]">
                            Write code
                        </button>

                        <button className="rounded-full border border-[#D8CFBC]/20 bg-[#565449]/25 px-3.5 py-2 text-xs text-[#D8CFBC] transition hover:bg-[#565449] hover:text-[#FFFBF4]">
                            Analyze data
                        </button>

                    </div>

                </div>
            </main >
        </div >
    );
};

export default Home;
