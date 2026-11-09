
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Crown,
    Layers,
    LockKeyhole,
    Mail,
    Phone,
    ShieldCheck,
    User,
    CreditCard,
} from "lucide-react";

import Navbar from "../Layouts/Navbar";

const plans = {
    starter: {
        id: "starter",
        name: "Starter",
        tokens: "1,000",
        price: 299,
        description: "Get 1,000 tokens to use across all AI agents.",
    },
    pro: {
        id: "pro",
        name: "Pro",
        tokens: "10,000",
        price: 799,
        description: "Get 10,000 tokens to use across all AI agents.",
    },
    team: {
        id: "team",
        name: "Team",
        tokens: "50,000",
        price: 2999,
        description: "Get 50,000 tokens to use across all AI agents.",
    },
};

const Checkout = () => {
    const { planId } = useParams();
    const navigate = useNavigate();

    const selectedPlan = plans[planId?.toLowerCase()] || plans.pro;

    const [paymentMethod, setPaymentMethod] = useState("razorpay");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handlePayment = (e) => {
        e.preventDefault();

        // Connect your backend payment API here.
        // Create Razorpay order and verify payment on the server.

        console.log({
            plan: selectedPlan.id,
            paymentMethod,
            ...formData,
        });
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#11120D] text-[#FFFBF4]">

            {/* Navbar */}
            <Navbar />

            <main className="mx-auto w-full max-w-[1300px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

                {/* Back Button */}
                <button
                    onClick={() => navigate("/plans")}
                    className="
            mb-6 flex items-center gap-2
            text-sm text-[#D8CFBC]/80
            transition hover:text-[#FFFBF4]
          "
                >
                    <ArrowLeft size={17} />
                    Back to Plans
                </button>

                {/* Main Layout */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.8fr_1fr] lg:gap-10">

                    {/* LEFT SECTION */}
                    <section>

                        {/* Heading */}
                        <div className="mb-6">

                            <p className="mb-2 text-[10px] font-semibold tracking-[3px] text-[#D8CFBC]">
                                CHECKOUT
                            </p>

                            <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
                                Complete your purchase
                            </h1>

                            <p className="mt-3 text-sm text-[#D8CFBC]/70 sm:text-base">
                                You're one step away from getting more tokens.
                            </p>

                        </div>

                        {/* Selected Plan */}
                        <div className="
              mb-7 rounded-2xl
              border border-[#D8CFBC]/30
              bg-[#D8CFBC]/[0.04]
              p-5 sm:p-6
            ">

                            <p className="mb-4 text-sm font-semibold text-[#FFFBF4]">
                                Selected Plan
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-4">

                                <div className="flex items-center gap-4">

                                    <div className="
                    flex h-16 w-16 shrink-0
                    items-center justify-center
                    rounded-xl border border-[#D8CFBC]/30
                    bg-[#D8CFBC]/10
                  ">
                                        {selectedPlan.id === "pro" ? (
                                            <Crown size={32} className="text-[#D8CFBC]" />
                                        ) : (
                                            <Layers size={30} className="text-[#D8CFBC]" />
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="font-serif text-2xl">
                                            {selectedPlan.name} Plan
                                        </h2>

                                        <p className="mt-1 text-sm text-[#D8CFBC]/80">
                                            {selectedPlan.description}
                                        </p>
                                    </div>

                                </div>

                                <p className="font-serif text-3xl text-[#FFFBF4]">
                                    ₹{selectedPlan.price.toLocaleString("en-IN")}
                                </p>

                            </div>
                        </div>

                        {/* Account Details */}
                        <form onSubmit={handlePayment}>

                            <h2 className="mb-4 font-serif text-2xl">
                                Account Details
                            </h2>

                            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">

                                {/* Full Name */}
                                <div>
                                    <label className="mb-2 block text-sm text-[#D8CFBC]">
                                        Full Name
                                    </label>

                                    <div className="
                    flex items-center gap-3
                    rounded-xl border border-[#D8CFBC]/25
                    bg-[#D8CFBC]/[0.04]
                    px-4 transition
                    focus-within:border-[#D8CFBC]/70
                  ">
                                        <User size={19} className="text-[#D8CFBC]" />

                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            required
                                            className="
                        h-12 w-full bg-transparent
                        text-sm text-[#FFFBF4]
                        outline-none
                        placeholder:text-[#D8CFBC]/40
                      "
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="mb-2 block text-sm text-[#D8CFBC]">
                                        Email Address
                                    </label>

                                    <div className="
                    flex items-center gap-3
                    rounded-xl border border-[#D8CFBC]/25
                    bg-[#D8CFBC]/[0.04]
                    px-4 transition
                    focus-within:border-[#D8CFBC]/70
                  ">
                                        <Mail size={19} className="text-[#D8CFBC]" />

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            required
                                            className="
                        h-12 w-full bg-transparent
                        text-sm text-[#FFFBF4]
                        outline-none
                        placeholder:text-[#D8CFBC]/40
                      "
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="sm:col-span-2">

                                    <label className="mb-2 block text-sm text-[#D8CFBC]">
                                        Phone Number (Optional)
                                    </label>

                                    <div className="
                    flex items-center gap-3
                    rounded-xl border border-[#D8CFBC]/25
                    bg-[#D8CFBC]/[0.04]
                    px-4 transition
                    focus-within:border-[#D8CFBC]/70
                  ">
                                        <Phone size={19} className="text-[#D8CFBC]" />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            className="
                        h-12 w-full bg-transparent
                        text-sm text-[#FFFBF4]
                        outline-none
                        placeholder:text-[#D8CFBC]/40
                      "
                                        />
                                    </div>

                                </div>

                            </div>

                            {/* Payment Method */}
                            <h2 className="mb-4 font-serif text-2xl">
                                Payment Method
                            </h2>

                            <div className="mb-8 space-y-3">

                                {/* Razorpay */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("razorpay")}
                                    className={`
                    flex w-full items-center gap-4
                    rounded-2xl border p-4
                    text-left transition-all duration-300
                    ${paymentMethod === "razorpay"
                                            ? "border-[#D8CFBC] bg-[#D8CFBC]/[0.09] shadow-[0_0_15px_rgba(216,207,188,0.07)]"
                                            : "border-[#D8CFBC]/20 hover:border-[#D8CFBC]/50"
                                        }
                  `}
                                >

                                    <span className={`
                    flex h-5 w-5 shrink-0 items-center justify-center
                    rounded-full border
                    ${paymentMethod === "razorpay"
                                            ? "border-[#D8CFBC] bg-[#D8CFBC]"
                                            : "border-[#D8CFBC]/60"
                                        }
                  `}>
                                        {paymentMethod === "razorpay" && (
                                            <span className="h-2 w-2 rounded-full bg-[#11120D]" />
                                        )}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-bold italic text-lg">
                                                <span className="text-blue-400">R</span>azorpay
                                            </span>

                                            <span className="
                        rounded-full bg-[#D8CFBC]
                        px-2.5 py-1 text-[10px]
                        font-semibold text-[#11120D]
                      ">
                                                Recommended
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs text-[#D8CFBC]/70">
                                            UPI, Cards, Net Banking & more
                                        </p>
                                    </div>

                                    <CreditCard
                                        size={22}
                                        className="shrink-0 text-[#D8CFBC]"
                                    />

                                </button>

                                {/* Direct UPI */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("upi")}
                                    className={`
                    flex w-full items-center gap-4
                    rounded-2xl border p-4
                    text-left transition-all duration-300
                    ${paymentMethod === "upi"
                                            ? "border-[#D8CFBC] bg-[#D8CFBC]/[0.09]"
                                            : "border-[#D8CFBC]/20 hover:border-[#D8CFBC]/50"
                                        }
                  `}
                                >

                                    <span className={`
                    flex h-5 w-5 shrink-0 items-center justify-center
                    rounded-full border
                    ${paymentMethod === "upi"
                                            ? "border-[#D8CFBC] bg-[#D8CFBC]"
                                            : "border-[#D8CFBC]/60"
                                        }
                  `}>
                                        {paymentMethod === "upi" && (
                                            <span className="h-2 w-2 rounded-full bg-[#11120D]" />
                                        )}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <span className="text-xl font-bold italic">
                                            UPI
                                        </span>

                                        <p className="mt-1 text-xs text-[#D8CFBC]/70">
                                            Pay using your preferred UPI app
                                        </p>
                                    </div>

                                    <Layers
                                        size={22}
                                        className="shrink-0 text-[#D8CFBC]"
                                    />

                                </button>

                            </div>

                            {/* Pay Button */}
                            <button
                                type="submit"
                                className="
                  flex w-full items-center justify-center gap-3
                  rounded-full bg-[#D8CFBC]
                  px-6 py-4
                  text-base font-semibold text-[#11120D]
                  shadow-[0_8px_25px_rgba(216,207,188,0.15)]
                  transition-all duration-300
                  hover:bg-[#FFFBF4]
                  hover:shadow-[0_8px_35px_rgba(216,207,188,0.22)]
                "
                            >
                                <LockKeyhole size={19} />

                                Pay ₹{selectedPlan.price.toLocaleString("en-IN")} Now

                                <ArrowRight size={20} />
                            </button>

                            <p className="
                mt-4 flex items-center justify-center gap-2
                text-xs text-[#D8CFBC]/50
              ">
                                <ShieldCheck size={15} />
                                Secure payment experience
                            </p>

                        </form>

                    </section>

                    {/* RIGHT SECTION - ORDER SUMMARY */}
                    <aside className="h-fit rounded-[24px] border border-[#D8CFBC]/25 bg-[#D8CFBC]/[0.025] p-6 sm:p-7 lg:sticky lg:top-8">

                        <h2 className="mb-6 font-serif text-2xl">
                            Order Summary
                        </h2>

                        {/* Summary Details */}
                        <div className="space-y-4">

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#D8CFBC]">Plan</span>
                                <span className="font-semibold">
                                    {selectedPlan.name}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-[#D8CFBC]/15 pb-4 text-sm">
                                <span className="text-[#D8CFBC]">Tokens</span>
                                <span>{selectedPlan.tokens}</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#D8CFBC]">Subtotal</span>
                                <span>
                                    ₹{selectedPlan.price.toLocaleString("en-IN")}
                                </span>
                            </div>

                            <div className="
                flex items-center justify-between
                rounded-xl border border-[#D8CFBC]/25
                bg-[#D8CFBC]/10 p-4
              ">
                                <span className="font-semibold">
                                    Total Payable
                                </span>

                                <span className="font-serif text-2xl">
                                    ₹{selectedPlan.price.toLocaleString("en-IN")}
                                </span>
                            </div>

                        </div>

                        {/* Benefits */}
                        <div className="my-7 border-t border-[#D8CFBC]/20 pt-6">

                            <h3 className="mb-5 font-serif text-xl">
                                What you get
                            </h3>

                            <div className="space-y-4">

                                {[
                                    `${selectedPlan.tokens} Tokens`,
                                    "Access to all AI agents",
                                    "Use tokens across your agents",
                                    "Secure account balance",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="
                      flex h-5 w-5 shrink-0
                      items-center justify-center
                      rounded-full bg-[#D8CFBC]
                      text-[#11120D]
                    ">
                                            <Check size={13} strokeWidth={3} />
                                        </span>

                                        <span className="text-sm text-[#D8CFBC]">
                                            {item}
                                        </span>
                                    </div>
                                ))}

                            </div>

                        </div>

                        {/* Security */}
                        <div className="border-t border-[#D8CFBC]/20 pt-6">

                            <div className="flex items-center gap-3">

                                <div className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-full border border-[#D8CFBC]/30
                  bg-[#D8CFBC]/10
                ">
                                    <ShieldCheck
                                        size={23}
                                        className="text-[#D8CFBC]"
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        Secure Payment
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-[#D8CFBC]/65">
                                        Your payment will be processed securely.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
};

export default Checkout;
