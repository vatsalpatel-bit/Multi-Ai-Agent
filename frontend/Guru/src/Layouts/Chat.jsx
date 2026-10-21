import {
    Files,
    PanelRightClose,
    PanelRightOpen,
} from "lucide-react";
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
import {
    setArtifacts,
    openArtifactPanel,
    closeArtifactPanel,
} from "../redux/slices/artifactSlice.js";

const Chat = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState("Auto");
    // const [artifactOpen, setArtifactOpen] = useState(false);
    // const [artifactFiles, setArtifactFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState("")
    const { id: conversationId } = useParams();
    const dispatch = useDispatch();

    const messages = useSelector((state) => state.chat?.allMessages);
    const {
        artifacts,
        activeArtifactId,
        isOpen,
    } = useSelector((state) => state.artifact);

    const activeArtifact =
        artifacts.find((item) => item.id === activeArtifactId) ??
        artifacts.at(-1);

    const artifactFiles = activeArtifact?.files ?? [];
    // const handleAIResponse = (res) => {
    //     console.log("1")
    //     if (
    //         res.artifacts?.length > 0 &&
    //         res.artifacts[0]?.files?.length > 0
    //     ) {
    //         console.log("1.1")
    //         setArtifactFiles(res.artifacts[0].files);
    //         setArtifactOpen(true);
    //         console.log("2")
    //     }
    // }

    useEffect(() => {
        let cancelled = false;

        const fetchGetMessagesApi = async () => {
            try {
                const res = await getMessageAPi(conversationId);

                if (cancelled) return;

                // Restore conversation messages.
                dispatch(setAllMessages(res));

                // Restore artifacts saved with assistant messages.
                const savedArtifacts = (Array.isArray(res) ? res : [])
                    .flatMap((message) => message.artifacts ?? []);

                if (savedArtifacts.length > 0) {
                    dispatch(setArtifacts(savedArtifacts));
                } else {
                    dispatch(setArtifacts([]));
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        if (conversationId) {
            fetchGetMessagesApi();
        }

        return () => {
            cancelled = true;
        };
    }, [conversationId, dispatch]);


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
        if (!prompt.trim() || loading) return;

        const currentPrompt = prompt.trim();

        try {
            setLoading(true);

            dispatch(
                addMessage({
                    _id: crypto.randomUUID(),
                    role: "user",
                    content: currentPrompt,
                })
            );

            setPrompt("");

            const res = await agentApi({
                conversationId,
                prompt: currentPrompt,
                agent: selectedAgent.trim().toLowerCase(),
            });

            if (res.artifacts?.length > 0) {
                dispatch(setArtifacts(res.artifacts));
                dispatch(openArtifactPanel());
            }

            dispatch(moveConversationOnTop(conversationId));

            dispatch(
                addMessage({
                    _id: crypto.randomUUID(),
                    role: "assistant",
                    content: res.response,
                    ...(res.images?.length > 0 && {
                        images: res.images,
                    }),
                    ...(res.artifacts?.length > 0 && {
                        artifacts: res.artifacts,
                    }),
                })
            );
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (


        <div className="flex h-dvh flex-col overflow-hidden bg-[#11120D] text-[#FFFBF4]">
            <Navbar />

            <div className="flex min-h-0 min-w-0 flex-1">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onOpen={() => setIsSidebarOpen(true)}
                />

                <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
                    {/* Chat area */}
                    <main className="flex min-h-0 min-w-0 flex-1 flex-col">

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
                                <div className="overflow-hidden rounded-[22px] border border-[#D8CFBC]/20 bg-[#11120D] shadow-[0_18px_50px_rgba(0,0,0,0.25)] transition focus-within:border-[#D8CFBC]/40">

                                    <div className="overflow-x-auto px-3 pt-3 scrollbar-hide">
                                        <div className="flex min-w-max items-center gap-1.5">
                                            <AgentSelector
                                                selectedAgent={selectedAgent}
                                                setSelectedAgent={setSelectedAgent}
                                            />
                                        </div>
                                    </div>

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
                                            className="min-h-[46px] max-h-[140px] flex-1 resize-none bg-transparent px-1 py-3 text-[15px] leading-6 text-[#FFFBF4] outline-none placeholder:text-[#D8CFBC]/40"
                                        />

                                        <button
                                            type="button"
                                            onClick={submitHandler}
                                            disabled={loading || !prompt.trim()}
                                            aria-label="Send message"
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D8CFBC] text-[18px] text-[#11120D] transition-all duration-200 ${loading || !prompt.trim()
                                                ? "cursor-not-allowed opacity-40"
                                                : "hover:scale-105 hover:bg-[#FFFBF4]"
                                                }`}
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

                    {/* Professional Artifact Sidebar */}
                    <aside
                        className={`relative flex h-full min-h-0 shrink-0 overflow-hidden
    border-l border-[#D8CFBC]/10 bg-[#11120D]
    transition-[width] duration-300 ease-in-out
    ${isOpen
                                ? "w-[min(48vw,720px)] min-w-[360px]"
                                : "w-[56px]"
                            }`}
                    >
                        {/* Permanent icon rail */}
                        <div className="z-10 flex w-[56px] shrink-0 flex-col items-center gap-3 border-r border-[#D8CFBC]/10 bg-[#151610] py-4">
                            {/* Toggle panel */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (isOpen) {
                                        dispatch(closeArtifactPanel());
                                    } else {
                                        dispatch(openArtifactPanel());
                                    }
                                }}
                                aria-label={isOpen ? "Collapse artifacts" : "Expand artifacts"}
                            >
                                {isOpen ? (
                                    <PanelRightClose size={19} strokeWidth={1.7} />
                                ) : (
                                    <PanelRightOpen size={19} strokeWidth={1.7} />
                                )}
                            </button>

                            {/* Artifact shortcut */}

                            <button
                                type="button"
                                onClick={() => dispatch(openArtifactPanel())}
                                title="Artifacts"
                                aria-label="Open artifacts"
                                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${isOpen
                                    ? "bg-[#D8CFBC]/10 text-[#D8CFBA]"
                                    : "text-[#D8CFBC]/60 hover:bg-[#D8CFBC]/10 hover:text-[#FFFBF4]"
                                    }`}
                            >
                                <Files size={19} strokeWidth={1.7} />

                                {artifactFiles.length > 0 && (
                                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#151610]" />
                                )}
                            </button>

                        </div>

                        {/* Expandable artifact content */}
                        {isOpen && (
                            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                                {artifactFiles.length > 0 ? (
                                    <ArtifactPanel
                                        files={artifactFiles}
                                        onClose={() => dispatch(closeArtifactPanel())}
                                    />
                                ) : (
                                    <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-[#D8CFBC]/50">
                                        Generated files will appear here.
                                    </div>
                                )}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>

    );
};

export default Chat;
