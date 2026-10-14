import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { X } from "lucide-react";
import remarkGfm from "remark-gfm"

const Message = ({ role, content, images }) => {
    const [lightBox, setLightBox] = useState(null);
    const isUser = role === "user";

    useEffect(() => {
        if (!lightBox) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setLightBox(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [lightBox])
    return (
        <div
            className={`
                flex w-full gap-4
                ${isUser ? "justify-end" : "justify-start"}
            `}
        >
            {!isUser && (
                <div
                    className="
                        mt-1
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-lg
                        bg-[#565449]
                        text-[11px]
                        font-semibold
                        text-[#FFFBF4]
                    "
                >
                    AI
                </div>
            )}

            <div
                className={`
                    max-w-[680px]
                    ${isUser
                        ? "rounded-2xl rounded-br-md bg-[#565449]/35 px-5 py-3.5"
                        : "pt-0"
                    }
                `}
            >
                {!isUser && (
                    <p className="mb-2 text-xs font-medium text-[#D8CFBC]/50">
                        AI Agent
                    </p>
                )}

                <div
                    className={`
                        text-[15px] leading-7
                        ${isUser
                            ? "text-[#FFFBF4]"
                            : "text-[#D8CFBC]"
                        }
                    `}
                >
                    <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => (
                                <h1 className="text-2xl font-bold mt-5 mb-3">
                                    {children}
                                </h1>
                            ),

                            h2: ({ children }) => (
                                <h2 className="text-xl font-semibold mt-4 mb-2">
                                    {children}
                                </h2>
                            ),

                            h3: ({ children }) => (
                                <h3 className="text-lg font-semibold mt-3 mb-2">
                                    {children}
                                </h3>
                            ),

                            p: ({ children }) => (
                                <p className="mb-3 whitespace-pre-wrap break-words">
                                    {children}
                                </p>
                            ),

                            ul: ({ children }) => (
                                <ul className="list-disc pl-5 space-y-1 my-2">
                                    {children}
                                </ul>
                            ),

                            ol: ({ children }) => (
                                <ol className="list-decimal pl-5 space-y-1 my-2">
                                    {children}
                                </ol>
                            ),

                            table: ({ children }) => (
                                <div className="overflow-x-auto my-4">
                                    <table className="min-w-full border border-white/10">
                                        {children}
                                    </table>
                                </div>
                            ),
                            th: ({ children }) => (
                                <th className="border border-white/10 bg-white/5 px-3 py-2 text-left">
                                    {children}
                                </th>
                            ),

                            td: ({ children }) => (
                                <td className="border border-white/10 px-3 py-2">
                                    {children}
                                </td>
                            ),

                            a: ({ children, href }) => (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2 break-words"
                                >
                                    {children}
                                </a>
                            ),
                        }}
                    >
                        {content}
                    </Markdown>
                </div>
                {/* Show images */}
                {images?.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                        {images?.map((image, index) => (
                            <img
                                onClick={() => setLightBox(image)}
                                key={index}
                                src={typeof image === "string" ? image : image?.url}
                                alt={`Image ${index + 1}`}
                                onError={(e) => e.currentTarget.remove()}
                                className="w-40 rounded-lg object-cover"
                            />
                        ))}
                    </div>
                )}
                {!isUser && (
                    <div className="mt-3 flex items-center gap-1">
                        <button
                            className="
                                rounded-lg
                                px-2.5 py-1.5
                                text-xs
                                text-[#D8CFBC]/40
                                transition
                                hover:bg-[#565449]/20
                                hover:text-[#D8CFBC]
                            "
                        >
                            Copy
                        </button>

                        <button
                            className="
                                rounded-lg
                                px-2.5 py-1.5
                                text-xs
                                text-[#D8CFBC]/40
                                transition
                                hover:bg-[#565449]/20
                                hover:text-[#D8CFBC]
                            "
                        >
                            Regenerate
                        </button>
                    </div>
                )}
            </div>
            {lightBox && (
                <div
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            e.preventDefault();
                            setLightBox(null)
                        }
                    }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <button
                        className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
                        onClick={() => setLightBox(null)}
                    >
                        <X />
                    </button>

                    <img
                        src={lightBox}
                        alt="Full-size preview"
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
                    />
                </div>
            )}
        </div>
    );
};

export default Message;