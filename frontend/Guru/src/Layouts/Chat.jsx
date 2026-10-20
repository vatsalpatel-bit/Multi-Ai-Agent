import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import Message from "./Message.jsx";
import { getMessageAPi } from "../Services/chatApi.js";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, moveConversationOnTop, setAllMessages } from "../redux/slices/chatSlice.js";
import { agentApi } from "../Services/agentApi.js";
import { getConversationApi } from "../Services/chatApi.js";
import { setAllConversations } from "../redux/slices/chatSlice.js";
import AgentSelector from "./AgentSelector.jsx";
import ArtifactPanel from "./ArtifactPanel.jsx";

const Chat = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState("Auto");
    const [artifactOpen, setArtifactOpen] = useState(false);
    const [artifactFiles, setArtifactFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState("")
    const { id: conversationId } = useParams();
    const dispatch = useDispatch();

    const messages = useSelector((state) => state.chat?.allMessages);
    const handleAIResponse = (res) => {
        console.log("1")
        if (
            res.artifacts?.length > 0 &&
            res.artifacts[0]?.files?.length > 0
        ) {
            console.log("1.1")
            setArtifactFiles(res.artifacts[0].files);
            setArtifactOpen(true);
            console.log("2")
        }
    }
    useEffect(() => {
        const fetchGetMessagesApi = async () => {
            try {
                const res = await getMessageAPi(conversationId);
                dispatch(setAllMessages(res));
            } catch {
                console.log("Faild to get message api")
            }
        }
        fetchGetMessagesApi();
    }, [conversationId, dispatch])

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await getConversationApi();
                dispatch(setAllConversations(res.conversations));
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            }
        };
        fetchConversations();
    }, [dispatch]);

    const submitHandler = async () => {
        if (!prompt.trim()) return;
        const currentPrompt = prompt;
        try {
            setLoading(true)
            dispatch(addMessage({
                _id: crypto.randomUUID(),
                role: 'user',
                content: currentPrompt,
            }));

            setPrompt("");

            const res = await agentApi({
                conversationId,
                prompt: currentPrompt,
                agent: selectedAgent.trim().toLowerCase()
            });
            console.log(res)
            handleAIResponse(res);
            dispatch(moveConversationOnTop(conversationId));
            dispatch(addMessage({
                _id: crypto.randomUUID(),
                role: 'assistant',
                content: res.response,
                ...(res?.images?.length > 0 && { images: res?.images })
            }))
        } catch {
            console.log("Faild to send message")
        } finally {
            setLoading(false)
        }
    }

    return (


        <div className="flex h-dvh flex-col overflow-hidden bg-[#11120D] text-[#FFFBF4]">
            <Navbar />

            <div className="flex min-h-0 flex-1">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onOpen={() => setIsSidebarOpen(true)}
                />

                {/* Main content area */}
                <div className="flex min-w-0 flex-1">
                    {/* Chat area */}
                    <main
                        className={`flex min-h-0 min-w-0 flex-1 flex-col ${artifactOpen ? "lg:w-[55%] lg:flex-none" : "w-full"
                            }`}
                    >
                        {/* Messages */}
                        <section className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-5">
                            <div className="mx-auto flex w-full max-w-[780px] flex-col gap-8 py-8 sm:py-10">
                                {messages?.map((message) => (
                                    <Message
                                        key={message._id}
                                        role={message.role}
                                        content={message?.content}
                                        images={message?.images}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Input */}
                        <footer className="shrink-0 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
                            <div className="mx-auto w-full max-w-[720px]">
                                <div
                                    className="
                overflow-hidden rounded-[22px]
                border border-[#D8CFBC]/20
                bg-[#11120D]
                shadow-[0_18px_50px_rgba(0,0,0,0.25)]
                transition
                focus-within:border-[#D8CFBC]/40
              "
                                >
                                    {/* Agent selector */}
                                    <div className="overflow-x-auto px-3 pt-3 scrollbar-hide">
                                        <div className="flex min-w-max items-center gap-1.5">
                                            <AgentSelector
                                                selectedAgent={selectedAgent}
                                                setSelectedAgent={setSelectedAgent}
                                            />
                                        </div>
                                    </div>

                                    {/* Prompt input */}
                                    <div className="flex items-end gap-3 px-4 pb-3 pt-2">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    if (!loading && prompt.trim()) {
                                                        submitHandler();
                                                    }
                                                }
                                            }}
                                            rows={1}
                                            placeholder="Message AI Agent..."
                                            className="
                    min-h-[46px] max-h-[140px] flex-1
                    resize-none bg-transparent px-1 py-3
                    text-[15px] leading-6 text-[#FFFBF4]
                    outline-none placeholder:text-[#D8CFBC]/40
                  "
                                        />

                                        <button
                                            type="button"
                                            onClick={submitHandler}
                                            disabled={loading || !prompt.trim()}
                                            aria-label="Send message"
                                            className={`
                    flex h-10 w-10 shrink-0 items-center
                    justify-center rounded-full bg-[#D8CFBC]
                    text-[18px] text-[#11120D]
                    transition-all duration-200
                    ${loading || !prompt.trim()
                                                    ? "cursor-not-allowed opacity-40"
                                                    : "hover:scale-105 hover:bg-[#FFFBF4]"
                                                }
                  `}
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>

                                <p className="mt-2 text-center text-[10px] text-[#D8CFBC]/30">
                                    AI Agent can make mistakes. Check important information.
                                </p>
                            </div>
                        </footer>
                    </main>

                    {/* Right-side artifact panel */}
                    {artifactOpen && (
                        <aside
                            className=" 
            fixed inset-0 z-50 flex min-h-0 flex-col
            border-l border-[#D8CFBC]/15 bg-[#151610]
            lg:static lg:z-auto lg:w-[45%] lg:flex-none
          "
                        >
                            <ArtifactPanel
                                files={artifactFiles}
                                onClose={() => setArtifactOpen(false)}
                            />
                        </aside>
                    )}
                </div>
            </div>
        </div>


    );
};

export default Chat;
