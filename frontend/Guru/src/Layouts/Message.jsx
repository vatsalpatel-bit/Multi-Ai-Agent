const Message = ({ role, content }) => {
    const isUser = role === "user";

    return (
        <div
            className={`
                flex w-full gap-4
                ${isUser ? "justify-end" : "justify-start"}
            `}
        >
            {/* AI Avatar */}
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

            {/* Message */}
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
                    {content}
                </div>

                {/* AI Actions */}
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