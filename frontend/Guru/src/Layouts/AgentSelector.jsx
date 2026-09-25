const agents = [
    { name: "Auto", icon: "✦" },
    { name: "Chat", icon: "□" },
    { name: "Coding", icon: "</>" },
    { name: "PDF", icon: "▤" },
    { name: "PPT", icon: "▱" },
    { name: "Image", icon: "▧" },
    { name: "Search", icon: "◎" },
];

const AgentSelector = ({
    selectedAgent,
    setSelectedAgent,
}) => {
    return (
        <div className="flex min-w-max items-center gap-1.5">

            {agents.map((agent) => {
                const active = selectedAgent === agent.name;

                return (
                    <button
                        key={agent.name}
                        onClick={() => setSelectedAgent(agent.name)}
                        className={`
                            flex
                            h-9
                            items-center
                            gap-1.5
                            rounded-full
                            px-3
                            text-[13px]
                            font-medium
                            transition-all
                            duration-200
                            ${
                                active
                                    ? `
                                        bg-[#D8CFBC]
                                        text-[#11120D]
                                        shadow-[0_3px_12px_rgba(216,207,188,0.12)]
                                      `
                                    : `
                                        bg-[#565449]/20
                                        text-[#D8CFBC]/65
                                        hover:bg-[#565449]/40
                                        hover:text-[#FFFBF4]
                                      `
                            }
                        `}
                    >
                        <span className="text-[12px]">
                            {agent.icon}
                        </span>

                        {agent.name}
                    </button>
                );
            })}

        </div>
    );
};

export default AgentSelector;