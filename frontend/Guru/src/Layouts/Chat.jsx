import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import Message from "./Message.jsx";
import { getMessageAPi } from "../Services/chatApi.js";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setAllMessages } from "../redux/slices/chatSlice.js";
import { agentApi } from "../Services/agentApi.js";
import { getConversationApi } from "../Services/chatApi.js";
import { setAllConversations } from "../redux/slices/chatSlice.js";

const Chat = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [prompt, setPrompt] = useState("")

    const { id: conversationId } = useParams();
    const dispatch = useDispatch();


    const messages = useSelector((state) => state.chat.allMessages);
    // console.log(messages)

    useEffect(() => {
        const fetchGetMessagesApi = async () => {
            try {
                console.log(conversationId)
                const res = await getMessageAPi(conversationId);
                // console.log(res)
                dispatch(setAllMessages(res));
            } catch {
                console.log("Faild to get message api ")
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
            dispatch(addMessage({
                _id: crypto.randomUUID(),
                role: 'user',
                content: currentPrompt,
            }));

            setPrompt("");
            // console.log(conversationId)
            // console.log(currentPrompt)

            const res = await agentApi({
                conversationId,
                prompt: currentPrompt
            });
            // console.log(res)
            dispatch(addMessage({
                _id: crypto.randomUUID(),
                role: 'assistant',
                content: res.response
            }))
        } catch {
            console.log("Faild to send message")
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
                <footer className="px-5 pb-5 pt-2">

                    <div className="mx-auto w-full max-w-[700px]">

                        <div
                            className="
                                flex items-end gap-2
                                rounded-[18px]
                                border border-[#D8CFBC]/15
                                bg-[#FFFBF4]
                                p-1.5
                                shadow-[0_12px_45px_rgba(0,0,0,0.35)]
                            "
                        >

                            {/* Add */}
                            <button
                                className="
                                    mb-1 ml-1
                                    flex h-9 w-9 shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    text-lg
                                    text-[#565449]
                                    transition
                                    hover:bg-[#D8CFBC]/30
                                "
                            >
                                +
                            </button>

                            {/* Input */}
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows="1"
                                placeholder="Message AI Agent..."
                                className="
                                    min-h-[44px]
                                    max-h-[140px]
                                    flex-1
                                    resize-none
                                    bg-transparent
                                    px-2
                                    py-3
                                    text-sm
                                    text-[#11120D]
                                    outline-none
                                    placeholder:text-[#777467]
                                "
                            />

                            {/* Send */}
                            <button
                                onClick={submitHandler}
                                className="
                                    mb-1
                                    flex h-10 w-10 shrink-0
                                    items-center justify-center
                                    rounded-[13px]
                                    bg-[#11120D]
                                    text-lg
                                    text-[#FFFBF4]
                                    transition
                                    hover:bg-[#565449]
                                    active:scale-95
                                "
                            >
                                →
                            </button>

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
