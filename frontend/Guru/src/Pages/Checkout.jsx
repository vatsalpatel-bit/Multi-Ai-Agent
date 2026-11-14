// src/Pages/Checkout.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft,
    ShieldCheck,
    LockKeyhole,
    CreditCard,
    Smartphone,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Zap,
    RefreshCw,
} from "lucide-react";

import Navbar from "../Layouts/Navbar";
import Sidebar from "../Layouts/Sidebar";
import { getPlanByIdApi } from "../Services/plansApi";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    });
};

const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price || 0);

const formatTokens = (tokens) =>
    new Intl.NumberFormat("en-IN").format(tokens || 0);

const Checkout = () => {
    const navigate = useNavigate();
    const { planId } = useParams();

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState("razorpay");

    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch only the selected plan
    useEffect(() => {
        let isMounted = true;

        const fetchSelectedPlan = async () => {
            try {
                setLoading(true);
                setError("");

                if (!planId) {
                    throw new Error("Plan ID is missing.");
                }

                // Your controller returns the plan directly.
                const plan = await getPlanByIdApi(planId);

                if (!plan?._id) {
                    throw new Error("Selected plan could not be found.");
                }

                if (isMounted) {
                    setSelectedPlan(plan);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Unable to load the selected plan."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchSelectedPlan();

        return () => {
            isMounted = false;
        };
    }, [planId]);

    // Razorpay payment
    const handleRazorpayPayment = async () => {
        try {
            setPaymentLoading(true);
            setError("");
            setSuccessMessage("");

            const scriptLoaded = await loadRazorpayScript();

            if (!scriptLoaded) {
                throw new Error("Unable to load Razorpay. Please try again.");
            }

            /*
             * Expected backend response:
             * {
             *   success: true,
             *   orderId: "...",
             *   amount: 79900,
             *   currency: "INR",
             *   keyId: "rzp_test_xxxxx"
             * }
             *
             * amount must be in paise.
             */
            const { data: order } = await axios.post(
                "/api/v1/payment/razorpay/create-order",
                { planId }
            );

            if (!order?.success || !order?.orderId || !order?.keyId) {
                throw new Error(
                    order?.message || "Unable to create payment order."
                );
            }

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency || "INR",
                name: "Guru AI",
                description: `${selectedPlan.name} Plan`,
                order_id: order.orderId,

                handler: async (response) => {
                    try {
                        setPaymentLoading(true);

                        /*
                         * Backend must verify the Razorpay signature
                         * and confirm the payment before adding tokens.
                         */
                        const { data: verification } = await axios.post(
                            "/api/v1/payment/razorpay/verify",
                            {
                                planId,
                                razorpay_order_id:
                                    response.razorpay_order_id,
                                razorpay_payment_id:
                                    response.razorpay_payment_id,
                                razorpay_signature:
                                    response.razorpay_signature,
                            }
                        );

                        if (
                            verification?.success &&
                            verification?.verified
                        ) {
                            setSuccessMessage(
                                "Payment successful! Your tokens have been credited."
                            );
                        } else {
                            setError(
                                verification?.message ||
                                "Payment verification failed. Please contact support."
                            );
                        }
                    } catch (err) {
                        setError(
                            err.response?.data?.message ||
                            "Payment verification failed. Please contact support."
                        );
                    } finally {
                        setPaymentLoading(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        setPaymentLoading(false);
                    },
                },

                theme: {
                    color: "#D8CFBC",
                },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", (response) => {
                setError(
                    response.error?.description ||
                    "Payment failed. Please try again."
                );
                setPaymentLoading(false);
            });

            razorpay.open();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to start Razorpay payment."
            );
            setPaymentLoading(false);
        }
    };

    // Google Pay / UPI payment
    const handleGooglePayPayment = async () => {
        try {
            setPaymentLoading(true);
            setError("");
            setSuccessMessage("");

            /*
             * Expected backend response:
             * {
             *   success: true,
             *   reference: "unique_payment_reference",
             *   intentUrl: "upi://pay?... "
             * }
             *
             * Backend creates the UPI payment intent using
             * your registered merchant details.
             */
            const { data } = await axios.post(
                "/api/v1/payment/google-pay/create-intent",
                { planId }
            );

            if (!data?.success || !data?.intentUrl || !data?.reference) {
                throw new Error(
                    data?.message || "Unable to start Google Pay payment."
                );
            }

            // Keep the reference so it can be checked after returning.
            sessionStorage.setItem(
                "guru_ai_pending_payment",
                JSON.stringify({
                    planId,
                    reference: data.reference,
                })
            );

            window.location.href = data.intentUrl;
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to start Google Pay payment."
            );
            setPaymentLoading(false);
        }
    };

    // Check Google Pay payment after returning to the checkout page.
    const verifyGooglePayPayment = async () => {
        try {
            setPaymentLoading(true);
            setError("");
            setSuccessMessage("");

            const pendingPayment = sessionStorage.getItem(
                "guru_ai_pending_payment"
            );

            if (!pendingPayment) {
                throw new Error("No pending Google Pay payment was found.");
            }

            const { planId: pendingPlanId, reference } =
                JSON.parse(pendingPayment);

            if (pendingPlanId !== planId || !reference) {
                throw new Error("Payment reference is invalid.");
            }

            /*
             * This endpoint must verify the payment with your
             * payment provider on the backend. Never trust a
             * client-side success response.
             */
            const { data } = await axios.post(
                "/api/v1/payment/google-pay/verify",
                {
                    planId,
                    reference,
                }
            );

            if (data?.success && data?.verified) {
                sessionStorage.removeItem("guru_ai_pending_payment");

                setSuccessMessage(
                    "Payment successful! Your tokens have been credited."
                );
            } else {
                setError(
                    data?.message ||
                    "Payment is not confirmed yet. Please try again shortly."
                );
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to verify Google Pay payment."
            );
        } finally {
            setPaymentLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#11120D] text-[#FFFBF4]">
                <Navbar />
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-[#D8CFBC]" />
                        <p className="text-sm text-[#A8A294]">
                            Loading your selected plan...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !selectedPlan) {
        return (
            <div className="min-h-screen bg-[#11120D] text-[#FFFBF4]">
                <Navbar />
                <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 text-center">
                    <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
                    <h2 className="text-2xl font-semibold">
                        Unable to load checkout
                    </h2>
                    <p className="mt-3 text-sm text-[#A8A294]">{error}</p>

                    <button
                        onClick={() => navigate("/plans")}
                        className="mt-6 rounded-xl bg-[#D8CFBC] px-6 py-3 text-sm font-semibold text-[#11120D] transition hover:bg-[#FFFBF4]"
                    >
                        Back to Plans
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#11120D] text-[#FFFBF4]">
            <Navbar />

            <div className="flex">
                <Sidebar />

                <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
                    <div className="mx-auto max-w-6xl">

                        {/* Header */}
                        <button
                            onClick={() => navigate("/plans")}
                            className="mb-8 inline-flex items-center gap-2 text-sm text-[#A8A294] transition hover:text-[#FFFBF4]"
                        >
                            <ArrowLeft size={17} />
                            Back to plans
                        </button>

                        <div className="mb-9">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#B6AA91]">
                                Secure checkout
                            </p>

                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Complete your purchase.
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-[#A8A294] sm:text-base">
                                Choose your preferred payment method and get
                                tokens to use across your Guru AI agents.
                            </p>
                        </div>

                        {/* Alerts */}
                        {/* {error && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )} */}

                        {successMessage && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-medium">
                                        Payment confirmed
                                    </p>
                                    <p className="mt-1">{successMessage}</p>
                                    <button
                                        onClick={() => navigate("/")}
                                        className="mt-3 font-semibold underline underline-offset-4"
                                    >
                                        Continue to Guru AI
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">

                            {/* Payment methods */}
                            <section className="rounded-2xl border border-white/[0.08] bg-[#191A14] p-5 sm:p-7">
                                <div className="mb-7">
                                    <h2 className="text-lg font-semibold">
                                        Payment method
                                    </h2>
                                    <p className="mt-1 text-sm text-[#A8A294]">
                                        Select how you want to pay.
                                    </p>
                                </div>

                                <div className="space-y-4">

                                    {/* Razorpay */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedPayment("razorpay")
                                        }
                                        className={`w-full rounded-xl border p-4 text-left transition sm:p-5 ${
                                            selectedPayment === "razorpay"
                                                ? "border-[#D8CFBC] bg-[#D8CFBC]/[0.07]"
                                                : "border-white/[0.08] bg-[#11120D] hover:border-white/20"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D8CFBC]/10 text-[#D8CFBC]">
                                                <CreditCard size={23} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold">
                                                        Razorpay
                                                    </h3>

                                                    <span className="rounded-md bg-white/[0.07] px-2 py-1 text-[10px] font-medium text-[#C9C1B2]">
                                                        RECOMMENDED
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs leading-5 text-[#A8A294] sm:text-sm">
                                                    Cards, UPI, Net Banking and
                                                    more.
                                                </p>
                                            </div>

                                            <span
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                                    selectedPayment === "razorpay"
                                                        ? "border-[#D8CFBC]"
                                                        : "border-[#77766D]"
                                                }`}
                                            >
                                                {selectedPayment === "razorpay" && (
                                                    <span className="h-2.5 w-2.5 rounded-full bg-[#D8CFBC]" />
                                                )}
                                            </span>
                                        </div>
                                    </button>

                                    {/* Google Pay */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedPayment("googlepay")
                                        }
                                        className={`w-full rounded-xl border p-4 text-left transition sm:p-5 ${
                                            selectedPayment === "googlepay"
                                                ? "border-[#D8CFBC] bg-[#D8CFBC]/[0.07]"
                                                : "border-white/[0.08] bg-[#11120D] hover:border-white/20"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-[#FFFBF4]">
                                                <Smartphone size={23} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold">
                                                    Google Pay
                                                </h3>
                                                <p className="mt-1 text-xs leading-5 text-[#A8A294] sm:text-sm">
                                                    Pay directly using UPI
                                                    through Google Pay.
                                                </p>
                                            </div>

                                            <span
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                                    selectedPayment === "googlepay"
                                                        ? "border-[#D8CFBC]"
                                                        : "border-[#77766D]"
                                                }`}
                                            >
                                                {selectedPayment === "googlepay" && (
                                                    <span className="h-2.5 w-2.5 rounded-full bg-[#D8CFBC]" />
                                                )}
                                            </span>
                                        </div>
                                    </button>
                                </div>

                                {/* Payment details */}
                                <div className="mt-7 rounded-xl border border-white/[0.06] bg-[#11120D] p-4 sm:p-5">
                                    {selectedPayment === "razorpay" ? (
                                        <div className="flex items-start gap-3">
                                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#D8CFBC]" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Secure Razorpay checkout
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-[#A8A294]">
                                                    Complete your payment in
                                                    Razorpay's secure payment
                                                    window. Available payment
                                                    methods depend on your
                                                    account and region.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-3">
                                            <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-[#D8CFBC]" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Google Pay UPI
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-[#A8A294]">
                                                    Continue to your UPI payment
                                                    app. After paying, return to
                                                    Guru AI and verify your
                                                    payment.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Pay button */}
                                <button
                                    type="button"
                                    disabled={
                                        paymentLoading ||
                                        !selectedPlan ||
                                        !!successMessage
                                    }
                                    onClick={
                                        selectedPayment === "razorpay"
                                            ? handleRazorpayPayment
                                            : handleGooglePayPayment
                                    }
                                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D8CFBC] px-6 py-4 text-sm font-semibold text-[#11120D] transition hover:bg-[#FFFBF4] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {paymentLoading ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <LockKeyhole size={17} />
                                            {selectedPayment === "razorpay"
                                                ? `Pay ${formatPrice(selectedPlan?.price)}`
                                                : `Continue with Google Pay`}
                                        </>
                                    )}
                                </button>

                                {selectedPayment === "googlepay" && (
                                    <button
                                        type="button"
                                        disabled={paymentLoading}
                                        onClick={verifyGooglePayPayment}
                                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-[#D8CFBC] transition hover:bg-white/[0.04] disabled:opacity-50"
                                    >
                                        <RefreshCw size={16} />
                                        I have completed my payment
                                    </button>
                                )}

                                <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-[#77766D]">
                                    <LockKeyhole size={13} />
                                    Your payment is processed securely.
                                </div>
                            </section>

                            {/* Order summary */}
                            <aside className="h-fit rounded-2xl border border-white/[0.08] bg-[#191A14] p-5 sm:p-7">
                                <h2 className="text-lg font-semibold">
                                    Order summary
                                </h2>

                                <p className="mt-1 text-sm text-[#A8A294]">
                                    Review your selected plan.
                                </p>

                                <div className="my-6 h-px bg-white/[0.08]" />

                                <div className="rounded-xl border border-white/[0.07] bg-[#11120D] p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#A8A294]">
                                            Selected plan
                                        </span>

                                        {selectedPlan?.popular && (
                                            <span className="rounded-full bg-[#D8CFBC]/10 px-2.5 py-1 text-[10px] font-semibold text-[#D8CFBC]">
                                                POPULAR
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mt-4 text-2xl font-semibold capitalize">
                                        {selectedPlan?.name}
                                    </h3>

                                    <div className="mt-4 flex items-center gap-2 text-sm text-[#D8CFBC]">
                                        <Zap size={17} />
                                        <span className="font-medium">
                                            {formatTokens(selectedPlan?.token)} tokens
                                        </span>
                                    </div>
                                </div>

                                <div className="my-6 space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#A8A294]">
                                            Plan price
                                        </span>
                                        <span className="font-medium">
                                            {formatPrice(selectedPlan?.price)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#A8A294]">
                                            Tokens
                                        </span>
                                        <span className="font-medium">
                                            {formatTokens(selectedPlan?.token)}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-px bg-white/[0.08]" />

                                <div className="mt-5 flex items-center justify-between gap-3">
                                    <span className="font-semibold">
                                        Total amount
                                    </span>
                                    <span className="text-2xl font-semibold tracking-tight">
                                        {formatPrice(selectedPlan?.price)}
                                    </span>
                                </div>

                                <div className="mt-7 rounded-xl bg-[#D8CFBC]/[0.06] p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D8CFBC]" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                Instant token activation
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-[#A8A294]">
                                                Tokens will be added to your
                                                account after successful
                                                payment verification.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>

                        <p className="mt-8 text-center text-xs leading-5 text-[#77766D]">
                            By completing your purchase, you agree to Guru AI's
                            terms of service and payment policy.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Checkout;