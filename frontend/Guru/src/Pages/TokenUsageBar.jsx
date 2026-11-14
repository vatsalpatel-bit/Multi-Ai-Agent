
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight, 
    Zap,
    Sparkles,
    RefreshCw,
    TrendingUp,
    Wallet,
    Coins,
    Activity,
} from "lucide-react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import Navbar from "../Layouts/Navbar";
import Sidebar from "../Layouts/Sidebar";

const TokenStatus = () => {
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [period, setPeriod] = useState("7d");

    const [tokenData, setTokenData] = useState({
        totalTokens: 0,
        remainingTokens: 0,
        usageHistory: [],
    });

    const fetchTokenBalance = async () => {
        try {
            setLoading(true);
            setError("");

            const { data } = await axios.get(
                "/api/v1/token/balance",
                { withCredentials: true }
            );

            setTokenData({
                totalTokens: Number(data.totalTokens) || 0,
                remainingTokens: Number(data.remainingTokens) || 0,
                usageHistory: data.usageHistory || [],
            });

        } catch (err) {
            console.error("Token API Error:", err);
            console.error("Response:", err.response?.data);
            console.error("Status:", err.response?.status);
            console.error("URL:", err.config?.url);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load your token information."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTokenBalance();
    }, []);

    const totalTokens = tokenData.totalTokens;
    const remainingTokens = tokenData.remainingTokens;

    const usedTokens = Math.max(
        0,
        totalTokens - remainingTokens
    );

    const usedPercentage = totalTokens > 0
        ? Math.min(100, (usedTokens / totalTokens) * 100)
        : 0;

    const remainingPercentage = 100 - usedPercentage;

    const formatNumber = (value) =>
        new Intl.NumberFormat("en-IN").format(value);

    const chartData = useMemo(() => {
        const days = period === "7d" ? 7 : 30;

        return tokenData.usageHistory.slice(-days);
    }, [tokenData.usageHistory, period]);

    const getBalanceStatus = () => {
        if (totalTokens === 0) return "No tokens";
        if (remainingTokens === 0) return "Exhausted";
        if (remainingPercentage <= 20) return "Running low";
        return "Healthy";
    };

    const getBalanceMessage = () => {
        if (totalTokens === 0) {
            return "Purchase your first token package to start using AI agents.";
        }

        if (remainingTokens === 0) {
            return "Your balance is exhausted. Purchase more tokens to continue.";
        }

        if (remainingPercentage <= 20) {
            return "Your balance is running low. Consider adding more tokens.";
        }

        return "Your wallet is in good shape. Keep creating with Guru AI.";
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;

        return (
            <div className="rounded-xl border border-[#D8CFBC]/20 bg-[#1D1D17] px-4 py-3 shadow-xl">
                <p className="mb-2 text-xs text-[#D8CFBC]/60">
                    {label}
                </p>

                <p className="text-sm font-semibold text-[#FFFBF4]">
                    {formatNumber(payload[0].value)} tokens
                </p>

                <p className="mt-1 text-[10px] text-[#D8CFBC]/50">
                    Consumed
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#11120D] text-[#FFFBF4]">

            <Navbar />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onOpen={() => setIsSidebarOpen(true)}
            />

            <main className="min-h-[calc(100dvh-82px)] px-4 py-8 sm:px-7 lg:px-10">

                <div className="mx-auto max-w-[1120px]">

                    {/* Page Header */}
                    <header className="mb-9">

                        <button
                            onClick={() => navigate("/")}
                            className="mb-7 flex items-center gap-2 text-sm text-[#D8CFBC]/60 transition hover:text-[#FFFBF4]"
                        >
                            <ArrowLeft size={16} />
                            Back to Workspace
                        </button>

                        <div className="flex flex-wrap items-end justify-between gap-5">

                            <div>
                                <p className="mb-3 text-[10px] font-semibold tracking-[3px] text-[#D8CFBC]">
                                    WALLET & ANALYTICS
                                </p>

                                <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
                                    Token Overview
                                </h1>

                                <p className="mt-3 text-sm text-[#D8CFBC]/55">
                                    Your balance, consumption and usage insights.
                                </p>
                            </div>

                            <button
                                onClick={fetchTokenBalance}
                                disabled={loading}
                                className="flex items-center gap-2 rounded-full border border-[#D8CFBC]/20 px-4 py-2.5 text-xs text-[#D8CFBC]/80 transition hover:border-[#D8CFBC]/50 hover:text-[#FFFBF4] disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={14}
                                    className={loading ? "animate-spin" : ""}
                                />
                                Refresh balance
                            </button>

                        </div>
                    </header>

                    {/* Loading */}
                    {loading && (
                        <div className="flex min-h-[380px] items-center justify-center gap-3 text-sm text-[#D8CFBC]/70">
                            <RefreshCw size={19} className="animate-spin" />
                            Loading your wallet...
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-3xl border border-red-400/20 bg-red-400/[0.03]">
                            <Activity size={30} className="text-red-400" />
                            <p className="text-sm text-red-300">{error}</p>

                            <button
                                onClick={fetchTokenBalance}
                                className="rounded-full border border-[#D8CFBC]/30 px-5 py-2 text-sm hover:bg-[#D8CFBC] hover:text-[#11120D]"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="space-y-6">

                            {/* Wallet Balance Hero */}
                            <section className="relative overflow-hidden rounded-[26px] border border-[#D8CFBC]/20 bg-gradient-to-br from-[#28271F] via-[#1B1B15] to-[#15150F] p-6 sm:p-9">

                                <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#D8CFBC]/[0.055] blur-3xl" />

                                <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-center">

                                    <div>

                                        <div className="mb-7 flex items-center gap-2">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8CFBC]/20 bg-[#D8CFBC]/10">
                                                <Wallet size={17} className="text-[#D8CFBC]" />
                                            </div>

                                            <span className="text-[11px] font-semibold tracking-[2px] text-[#D8CFBC]/80">
                                                AVAILABLE BALANCE
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-baseline gap-3">
                                            <h2 className="font-serif text-5xl tracking-tight sm:text-6xl">
                                                {formatNumber(remainingTokens)}
                                            </h2>

                                            <span className="text-sm text-[#D8CFBC]/60">
                                                tokens
                                            </span>
                                        </div>

                                        <p className="mt-4 max-w-md text-sm leading-6 text-[#D8CFBC]/55">
                                            {getBalanceMessage()}
                                        </p>

                                        <div className="mt-6 flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${remainingTokens === 0
                                                    ? "bg-red-400"
                                                    : remainingPercentage <= 20
                                                        ? "bg-amber-400"
                                                        : "bg-emerald-400"
                                                }`} />

                                            <span className="text-xs text-[#D8CFBC]/75">
                                                {getBalanceStatus()}
                                            </span>
                                        </div>

                                    </div>

                                    <div className="relative flex shrink-0 flex-col gap-3 sm:items-end">

                                        <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-[#D8CFBC]/15 bg-[#D8CFBC]/[0.06] sm:h-24 sm:w-24">
                                            <Coins
                                                size={39}
                                                strokeWidth={1.2}
                                                className="text-[#D8CFBC]"
                                            />
                                        </div>

                                        <button
                                            onClick={() => navigate("/plans")}
                                            className="flex items-center justify-center gap-2 rounded-full bg-[#D8CFBC] px-6 py-3 text-sm font-semibold text-[#11120D] transition hover:bg-[#FFFBF4]"
                                        >
                                            Add Tokens
                                            <ArrowUpRight size={16} />
                                        </button>

                                    </div>

                                </div>
                            </section>

                            {/* Analytics Section */}
                            <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.65fr_0.8fr]">

                                {/* Usage Chart */}
                                <div className="rounded-[24px] border border-[#D8CFBC]/15 bg-[#191912] p-5 sm:p-7">

                                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <TrendingUp
                                                    size={18}
                                                    className="text-[#D8CFBC]"
                                                />

                                                <h2 className="font-serif text-2xl">
                                                    Usage Analytics
                                                </h2>
                                            </div>

                                            <p className="mt-2 text-xs text-[#D8CFBC]/45">
                                                Daily token consumption
                                            </p>
                                        </div>

                                        <div className="flex rounded-full border border-[#D8CFBC]/15 bg-[#11120D] p-1">
                                            {["7d", "30d"].map((item) => (
                                                <button
                                                    key={item}
                                                    onClick={() => setPeriod(item)}
                                                    className={`rounded-full px-4 py-2 text-[11px] font-medium transition ${period === item
                                                            ? "bg-[#D8CFBC] text-[#11120D]"
                                                            : "text-[#D8CFBC]/60 hover:text-[#FFFBF4]"
                                                        }`}
                                                >
                                                    {item === "7d" ? "7 days" : "30 days"}
                                                </button>
                                            ))}
                                        </div>

                                    </div>

                                    <div className="h-[280px] w-full">

                                        {chartData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    data={chartData}
                                                    margin={{
                                                        top: 8,
                                                        right: 8,
                                                        left: -20,
                                                        bottom: 0,
                                                    }}
                                                >

                                                    <defs>
                                                        <linearGradient
                                                            id="usageArea"
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="1"
                                                        >
                                                            <stop
                                                                offset="0%"
                                                                stopColor="#D8CFBC"
                                                                stopOpacity={0.24}
                                                            />
                                                            <stop
                                                                offset="100%"
                                                                stopColor="#D8CFBC"
                                                                stopOpacity={0}
                                                            />
                                                        </linearGradient>
                                                    </defs>

                                                    <CartesianGrid
                                                        stroke="#D8CFBC"
                                                        strokeOpacity={0.07}
                                                        vertical={false}
                                                    />

                                                    <XAxis
                                                        dataKey="date"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: "#AFA58F", fontSize: 10 }}
                                                        tickMargin={12}
                                                        minTickGap={20}
                                                    />

                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: "#AFA58F", fontSize: 10 }}
                                                        tickFormatter={(value) =>
                                                            new Intl.NumberFormat("en-IN", {
                                                                notation: "compact",
                                                            }).format(value)
                                                        }
                                                    />

                                                    <Tooltip
                                                        content={<CustomTooltip />}
                                                        cursor={{
                                                            stroke: "#D8CFBC",
                                                            strokeOpacity: 0.2,
                                                            strokeDasharray: "4 4",
                                                        }}
                                                    />

                                                    <Area
                                                        type="monotone"
                                                        dataKey="usedTokens"
                                                        stroke="#D8CFBC"
                                                        strokeWidth={2.5}
                                                        fill="url(#usageArea)"
                                                        activeDot={{
                                                            r: 5,
                                                            fill: "#D8CFBC",
                                                            stroke: "#191912",
                                                            strokeWidth: 2,
                                                        }}
                                                    />

                                                </AreaChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center text-center">
                                                <Activity size={27} className="mb-3 text-[#D8CFBC]/40" />

                                                <p className="text-sm text-[#D8CFBC]/70">
                                                    No usage activity yet
                                                </p>

                                                <p className="mt-2 text-xs text-[#D8CFBC]/35">
                                                    Your token consumption will appear here.
                                                </p>
                                            </div>
                                        )}

                                    </div>

                                </div>

                                {/* Usage Summary */}
                                <div className="flex flex-col rounded-[24px] border border-[#D8CFBC]/15 bg-[#191912] p-6 sm:p-7">

                                    <div className="mb-8 flex items-center gap-2">
                                        <Activity size={18} className="text-[#D8CFBC]" />

                                        <h2 className="font-serif text-2xl">
                                            Overview
                                        </h2>
                                    </div>

                                    <div className="space-y-7">

                                        <div>
                                            <p className="text-xs text-[#D8CFBC]/45">
                                                Total purchased
                                            </p>

                                            <p className="mt-2 font-serif text-3xl">
                                                {formatNumber(totalTokens)}
                                            </p>
                                        </div>

                                        <div className="h-px bg-[#D8CFBC]/10" />

                                        <div>
                                            <p className="text-xs text-[#D8CFBC]/45">
                                                Total consumed
                                            </p>

                                            <p className="mt-2 font-serif text-3xl">
                                                {formatNumber(usedTokens)}
                                            </p>
                                        </div>

                                        <div className="h-px bg-[#D8CFBC]/10" />

                                        <div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <p className="text-xs text-[#D8CFBC]/45">
                                                    Consumption rate
                                                </p>

                                                <p className="text-sm font-medium text-[#D8CFBC]">
                                                    {Math.round(usedPercentage)}%
                                                </p>
                                            </div>

                                            <div className="h-2 overflow-hidden rounded-full bg-[#D8CFBC]/10">
                                                <div
                                                    className="h-full rounded-full bg-[#D8CFBC] transition-all duration-700"
                                                    style={{
                                                        width: `${usedPercentage}%`,
                                                    }}
                                                />
                                            </div>

                                            <p className="mt-3 text-[11px] text-[#D8CFBC]/40">
                                                {formatNumber(remainingTokens)} tokens remaining
                                            </p>
                                        </div>

                                    </div>

                                    <div className="mt-auto pt-8">
                                        <p className="text-[10px] leading-5 text-[#D8CFBC]/35">
                                            Usage is calculated from your recorded token transactions.
                                        </p>
                                    </div>

                                </div>

                            </section>

                            {/* Purchase CTA */}
                            <section className="relative overflow-hidden rounded-[24px] border border-[#D8CFBC]/20 bg-gradient-to-r from-[#25241D] to-[#181811] p-6 sm:p-8">

                                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                                    <div className="flex items-start gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D8CFBC]/20 bg-[#D8CFBC]/10">
                                            <Sparkles
                                                size={23}
                                                className="text-[#D8CFBC]"
                                            />
                                        </div>

                                        <div>
                                            <p className="mb-2 text-[10px] font-semibold tracking-[2px] text-[#D8CFBC]/70">
                                                KEEP CREATING
                                            </p>

                                            <h2 className="font-serif text-2xl sm:text-3xl">
                                                Ready for more?
                                            </h2>

                                            <p className="mt-2 max-w-lg text-sm leading-6 text-[#D8CFBC]/50">
                                                Get additional tokens and unlock more possibilities with your AI agents.
                                            </p>
                                        </div>

                                    </div>

                                    <button
                                        onClick={() => navigate("/plans")}
                                        className="flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#D8CFBC] px-7 py-3.5 text-sm font-semibold text-[#11120D] transition hover:bg-[#FFFBF4]"
                                    >
                                        Explore Packages
                                        <ArrowRight size={17} />
                                    </button>

                                </div>

                            </section>

                        </div>
                    )}

                    <footer className="mt-10 border-t border-[#D8CFBC]/10 py-6 text-center">
                        <p className="text-xs text-[#D8CFBC]/35">
                            Guru AI · Your intelligent AI workspace.
                        </p>
                    </footer>

                </div>
            </main>
        </div>
    );
};

export default TokenStatus;
