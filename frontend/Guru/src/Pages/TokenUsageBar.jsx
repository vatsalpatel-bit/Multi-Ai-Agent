
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Zap,
    Crown,
    CalendarDays,
    Sparkles,
    CheckCircle2,
    Clock,
} from "lucide-react";

import Navbar from "../Layouts/Navbar";
import Sidebar from "../Layouts/Sidebar";
import { useState } from "react";

const subscription = {
    planName: "Starter",
    totalTokens: 1000,
    remainingTokens: 750,
    price: 299,
    status: "Active",
    purchaseDate: "09 Nov 2026",
    expiryDate: "09 Dec 2026",
};

const PlanStatus = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const usedTokens =
        subscription.totalTokens - subscription.remainingTokens;

    const usedPercentage =
        subscription.totalTokens > 0
            ? Math.min(
                100,
                (usedTokens / subscription.totalTokens) * 100
            )
            : 0;

    const formatNumber = (value) =>
        value.toLocaleString("en-IN");

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#11120D] text-[#FFFBF4]">

            {/* Navbar */}
            <Navbar />

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onOpen={() => setIsSidebarOpen(true)}
            />

            {/* Main */}
            <main className="min-h-[calc(100vh-82px)] px-5 py-8 sm:px-8 lg:px-10">

                <div className="mx-auto max-w-[1050px]">

                    {/* Back */}
                    <button
                        onClick={() => navigate("/")}
                        className="
              mb-8 flex items-center gap-2
              text-sm text-[#D8CFBC]/65
              transition hover:text-[#FFFBF4]
            "
                    >
                        <ArrowLeft size={16} />
                        Back to Workspace
                    </button>

                    {/* Heading */}
                    <div className="mb-10">

                        <p className="
              mb-3 text-[10px]
              font-semibold tracking-[3px]
              text-[#D8CFBC]
            ">
                            ACCOUNT SETTINGS
                        </p>

                        <h1 className="
              font-serif text-4xl
              tracking-tight sm:text-5xl
            ">
                            Your Subscription
                        </h1>

                        <p className="mt-3 text-sm text-[#D8CFBC]/60">
                            Manage your plan and keep track of your token balance.
                        </p>

                    </div>

                    {/* Main Layout */}
                    <div className="
            grid grid-cols-1
            gap-6 lg:grid-cols-[1.5fr_0.85fr]
          ">

                        {/* LEFT */}
                        <div className="space-y-6">

                            {/* Current Plan */}
                            <section className="
                relative overflow-hidden
                rounded-[24px]
                border border-[#D8CFBC]/25
                bg-gradient-to-br
                from-[#D8CFBC]/[0.10]
                to-transparent
                p-6 sm:p-8
              ">

                                <div className="mb-8 flex items-center justify-between">

                                    <div className="flex items-center gap-2">
                                        <Crown
                                            size={18}
                                            className="text-[#D8CFBC]"
                                        />

                                        <span className="
                      text-xs font-semibold
                      tracking-[2px] text-[#D8CFBC]
                    ">
                                            CURRENT PLAN
                                        </span>
                                    </div>

                                    <span className="
                    flex items-center gap-2
                    rounded-full border
                    border-[#D8CFBC]/25
                    bg-[#D8CFBC]/10
                    px-3 py-1.5
                    text-xs text-[#D8CFBC]
                  ">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#D8CFBC]" />
                                        {subscription.status}
                                    </span>

                                </div>

                                <div className="
                  flex flex-wrap
                  items-end justify-between gap-5
                ">

                                    <div>
                                        <h2 className="font-serif text-4xl sm:text-5xl">
                                            {subscription.planName}
                                        </h2>

                                        <p className="mt-2 text-sm text-[#D8CFBC]/65">
                                            AI Agent Subscription
                                        </p>
                                    </div>

                                    <div>
                                        <span className="font-serif text-4xl">
                                            ₹{formatNumber(subscription.price)}
                                        </span>

                                        <p className="mt-1 text-right text-xs text-[#D8CFBC]/55">
                                            Purchase amount
                                        </p>
                                    </div>

                                </div>

                                <div className="
                  mt-8 grid grid-cols-2 gap-5
                  border-t border-[#D8CFBC]/15 pt-6
                ">

                                    <div>
                                        <p className="mb-2 text-xs text-[#D8CFBC]/55">
                                            Purchased On
                                        </p>

                                        <div className="flex items-center gap-2 text-sm">
                                            <CalendarDays
                                                size={16}
                                                className="text-[#D8CFBC]"
                                            />
                                            {subscription.purchaseDate}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs text-[#D8CFBC]/55">
                                            Expires On
                                        </p>

                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock
                                                size={16}
                                                className="text-[#D8CFBC]"
                                            />
                                            {subscription.expiryDate}
                                        </div>
                                    </div>

                                </div>

                            </section>

                            {/* Token Usage */}
                            <section className="
                rounded-[24px]
                border border-[#D8CFBC]/20
                bg-[#D8CFBC]/[0.025]
                p-6 sm:p-8
              ">

                                <div className="
                  mb-7 flex items-center justify-between
                ">

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Zap
                                                size={19}
                                                className="text-[#D8CFBC]"
                                            />

                                            <h2 className="font-serif text-2xl">
                                                Token Usage
                                            </h2>
                                        </div>

                                        <p className="mt-2 text-xs text-[#D8CFBC]/55">
                                            Your current token consumption
                                        </p>
                                    </div>

                                </div>

                                {/* Remaining Balance */}
                                <div className="mb-7">

                                    <p className="mb-2 text-xs text-[#D8CFBC]/60">
                                        Available Balance
                                    </p>

                                    <div className="flex items-baseline gap-2">

                                        <span className="
                      font-serif text-5xl
                      tracking-tight
                    ">
                                            {formatNumber(subscription.remainingTokens)}
                                        </span>

                                        <span className="text-sm text-[#D8CFBC]/65">
                                            tokens
                                        </span>

                                    </div>

                                </div>

                                {/* Progress Bar */}
                                <div className="mb-5">

                                    <div className="
                    mb-3 flex items-center
                    justify-between text-xs
                  ">
                                        <span className="text-[#D8CFBC]/65">
                                            Usage progress
                                        </span>

                                        <span className="text-[#D8CFBC]">
                                            {Math.round(usedPercentage)}% used
                                        </span>
                                    </div>

                                    <div className="
                    h-2.5 w-full overflow-hidden
                    rounded-full bg-[#D8CFBC]/10
                  ">
                                        <div
                                            className="
                        h-full rounded-full
                        bg-[#D8CFBC]
                        transition-all duration-700
                      "
                                            style={{
                                                width: `${usedPercentage}%`,
                                            }}
                                        />
                                    </div>

                                </div>

                                {/* Used / Total */}
                                <div className="
                  flex items-center justify-between
                  border-t border-[#D8CFBC]/15 pt-5
                ">

                                    <div>
                                        <p className="text-xs text-[#D8CFBC]/55">
                                            Used Tokens
                                        </p>

                                        <p className="mt-1 text-lg font-semibold">
                                            {formatNumber(usedTokens)}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-[#D8CFBC]/55">
                                            Total Allocation
                                        </p>

                                        <p className="mt-1 text-lg font-semibold">
                                            {formatNumber(subscription.totalTokens)}
                                        </p>
                                    </div>

                                </div>

                            </section>

                        </div>

                        {/* RIGHT */}
                        <aside className="space-y-6">

                            {/* Upgrade Card */}
                            <section className="
                relative overflow-hidden
                rounded-[24px]
                border border-[#D8CFBC]/30
                bg-gradient-to-br
                from-[#D8CFBC]/[0.12]
                to-transparent
                p-6 sm:p-7
              ">

                                <div className="
                  mb-5 flex h-12 w-12
                  items-center justify-center
                  rounded-xl border
                  border-[#D8CFBC]/25
                  bg-[#D8CFBC]/10
                ">
                                    <Sparkles
                                        size={23}
                                        className="text-[#D8CFBC]"
                                    />
                                </div>

                                <p className="
                  mb-2 text-[10px]
                  font-semibold tracking-[2px]
                  text-[#D8CFBC]
                ">
                                    GROW WITH GURU AI
                                </p>

                                <h2 className="
                  font-serif text-3xl
                  leading-tight
                ">
                                    Need more tokens?
                                </h2>

                                <p className="
                  mt-3 text-sm leading-6
                  text-[#D8CFBC]/65
                ">
                                    Get more tokens and continue using your AI agents without interruption.
                                </p>

                                <button
                                    onClick={() => navigate("/plans")}
                                    className="
                    mt-7 flex w-full
                    items-center justify-center gap-2
                    rounded-full bg-[#D8CFBC]
                    px-5 py-3.5
                    text-sm font-semibold
                    text-[#11120D]
                    transition-all duration-300
                    hover:bg-[#FFFBF4]
                  "
                                >
                                    Explore Plans
                                    <ArrowRight size={17} />
                                </button>

                            </section>

                            {/* Subscription Details */}
                            <section className="
                rounded-[24px]
                border border-[#D8CFBC]/20
                bg-[#D8CFBC]/[0.025]
                p-6
              ">

                                <h2 className="mb-5 font-serif text-xl">
                                    Subscription Details
                                </h2>

                                <div className="space-y-5">

                                    <div className="flex items-center justify-between gap-3">

                                        <span className="text-sm text-[#D8CFBC]/60">
                                            Plan Name
                                        </span>

                                        <span className="text-sm font-medium">
                                            {subscription.planName}
                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between gap-3">

                                        <span className="text-sm text-[#D8CFBC]/60">
                                            Plan Status
                                        </span>

                                        <span className="flex items-center gap-1.5 text-sm text-[#D8CFBC]">
                                            <CheckCircle2 size={15} />
                                            {subscription.status}
                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between gap-3">

                                        <span className="text-sm text-[#D8CFBC]/60">
                                            Purchase Date
                                        </span>

                                        <span className="text-sm">
                                            {subscription.purchaseDate}
                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between gap-3">

                                        <span className="text-sm text-[#D8CFBC]/60">
                                            Expiry Date
                                        </span>

                                        <span className="text-sm">
                                            {subscription.expiryDate}
                                        </span>

                                    </div>

                                </div>

                            </section>

                        </aside>

                    </div>

                    {/* Footer */}
                    <footer className="
            mt-10 border-t border-[#D8CFBC]/15
            py-5 text-center
          ">
                        <p className="text-xs text-[#D8CFBC]/40">
                            Guru AI · Your intelligent AI workspace.
                        </p>
                    </footer>

                </div>

            </main>

        </div>
    );
};

export default PlanStatus;
