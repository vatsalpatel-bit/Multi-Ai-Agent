import Markdown from "react-markdown";

const Message = ({ role, content, images }) => {
    const isUser = role === "user";
    // console.log(content)
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
                    <Markdown>
                        {content}
                    </Markdown>
                </div>
                {/* Show images */}
                {images?.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={typeof image === "string" ? image : image.url}
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
        </div>
    );
};

export default Message;