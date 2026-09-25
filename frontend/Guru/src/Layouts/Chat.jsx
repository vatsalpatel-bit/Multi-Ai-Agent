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

const Chat = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState("Auto");
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState("")
    const { id: conversationId } = useParams();
    const dispatch = useDispatch();

    const messages = useSelector((state) => state.chat.allMessages);

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
        const fetchGetConversationApi = async () => {
            const res = await getConversationApi();
            dispatch(setAllConversations(res.conversations))
        }
        fetchGetConversationApi();
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

            dispatch(moveConversationOnTop(conversationId));
            dispatch(addMessage({
                _id: crypto.randomUUID(),
                role: 'assistant',
                content: res.response
            }))
        } catch {
            console.log("Faild to send message")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen overflow-hidden bg-[#11120D] text-[#FFFBF4]">

            <Navbar />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onOpen={() => setIsSidebarOpen(true)}
            />
            <main className="flex h-[calc(100vh-82px)] flex-col">

                {/* Messages */}
                <section className="flex-1 overflow-y-auto px-5">

                    <div className="mx-auto flex w-full max-w-[780px] flex-col gap-8 py-10">

                        {messages?.map((message) => (
                            <Message
                                key={message._id}
                                role={message.role}
                                content={message.content}
                            />
                        ))}

                    </div>

                </section>

                {/* Input */}
                <footer className="px-5 pb-5 pt-3">
                    <div className="mx-auto w-full max-w-[720px]">

                        <div
                            className="
                overflow-hidden
                rounded-[22px]
                border
                border-[#D8CFBC]/20
                bg-[#11120D]
                shadow-[0_18px_50px_rgba(0,0,0,0.25)]
                transition
                focus-within:border-[#D8CFBC]/40
            "
                        >

                            {/* Agents */}
                            <div className="overflow-x-auto px-3 pt-3 scrollbar-hide">
                                <div className="flex min-w-max items-center gap-1.5">

                                    <AgentSelector
                                        selectedAgent={selectedAgent}
                                        setSelectedAgent={setSelectedAgent}
                                    />

                                </div>
                            </div>


                            {/* Input */}
                            <div className="flex items-end gap-3 px-4 pb-3 pt-2">

                                <textarea
                                    value={prompt}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            submitHandler();
                                        }
                                    }}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows="1"
                                    placeholder="Message AI Agent..."
                                    className="
                        min-h-[46px]
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
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#D8CFBC]
                        text-[18px]
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

                        <p className="mt-2 text-center text-[10px] text-[#D8CFBC]/30">
                            AI Agent can make mistakes. Check important information.
                        </p>

                    </div>
                </footer>

            </main>
        </div>
    );
};

export default Chat;
