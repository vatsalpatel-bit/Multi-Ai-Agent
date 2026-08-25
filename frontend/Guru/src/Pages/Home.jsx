import Navbar from "../Layouts/Navbar.jsx"

const Home = () => {
    return (
        <div className="min-h-screen bg-[#11120D] text-[#FFFBF4]">
            <Navbar />

            {/* Home */}
            <main className="min-h-[calc(100vh-82px)] flex items-center justify-center px-5">
                <div className="w-full max-w-[850px] text-center">

                    <p className="mb-[22px] text-[11px] font-semibold tracking-[3px] text-[#D8CFBC]">
                        INTELLIGENT AI AGENT
                    </p>

                    <h1 className="font-serif text-5xl font-medium leading-[1.03] tracking-[-3px] sm:text-7xl">
                        Think smarter.
                        <br />
                        <span className="text-[#D8CFBC]">Build faster.</span>
                    </h1>

                    <p className="mx-auto mt-[25px] mb-[42px] max-w-[560px] text-base leading-[1.7] text-[#D8CFBC]/70">
                        Your intelligent AI workspace for asking questions,
                        solving problems and getting things done.
                    </p>

                    {/* Chat Bar */}
                    <div className="mx-auto flex w-full max-w-[720px] items-end gap-2 rounded-[22px] bg-[#FFFBF4] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

                        <textarea
                            rows="1"
                            placeholder="Ask your AI agent anything..."
                            className="
                min-h-[52px]
                flex-1
                resize-none
                bg-transparent
                px-[15px]
                py-4
                text-[15px]
                text-[#11120D]
                outline-none
                placeholder:text-[#777467]
              "
                        />

                        <button
                            className="
                h-12
                w-12
                shrink-0
                rounded-[15px]
                bg-[#11120D]
                text-[23px]
                text-[#FFFBF4]
                transition-all duration-300
                hover:bg-[#565449]
                hover:-translate-y-0.5
              "
                        >
                            →
                        </button>

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
            </main>
        </div>
    )
}

export default Home
