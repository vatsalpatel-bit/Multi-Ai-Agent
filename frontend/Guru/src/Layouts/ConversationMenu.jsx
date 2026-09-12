const ConversationMenu = ({ onRename }) => {
    return (
        <div
            className="
                absolute
                right-2
                top-10
                z-50
                w-[130px]
                rounded-xl
                border
                border-[#D8CFBC]/10
                bg-[#3A3937]
                p-1.5
                shadow-[0_12px_35px_rgba(0,0,0,0.45)]
            "
        >
            <button
                onClick={onRename}
                className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-[#FFFBF4]
                    transition
                    hover:bg-[#565449]/50
                "
            >
                <span className="text-[#D8CFBC]">
                    ✎
                </span>

                Rename
            </button>
        </div>
    );
};

export default ConversationMenu;