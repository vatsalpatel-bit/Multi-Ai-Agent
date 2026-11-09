
import { useState } from "react";
import { ArrowRight, Check, Crown, Layers } from "lucide-react";

import Navbar from "../Layouts/Navbar";
import Sidebar from "../Layouts/Sidebar";
import { useNavigate } from "react-router-dom";

const plans = [
    {
        id: "starter",
        name: "Starter",
        tokens: "1,000",
        price: "299",
        popular: false,
    },
    {
        id: "pro",
        name: "Pro",
        tokens: "10,000",
        price: "799",
        popular: true,
    },
    {
        id: "team",
        name: "Team",
        tokens: "50,000",
        price: "2,999",
        popular: false,
    },
];

const Plans = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();

    return (
        <div className="h-dvh overflow-hidden bg-[#11120D] text-[#FFFBF4]">

            {/* Navbar */}
            <Navbar />

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onOpen={() => setIsSidebarOpen(true)}
            />

            {/* Main Content */}
            <main
                className={`
          relative flex
          h-[calc(100dvh-82px)]
          min-h-0
          items-center justify-center
          overflow-x-hidden
          px-4 py-3
          transition-all duration-300 ease-in-out

          ${isSidebarOpen
                        ? "ml-[320px] w-[calc(100%-320px)]"
                        : "ml-0 w-full"
                    }

          max-lg:overflow-y-auto
          max-lg:items-start
          max-lg:py-8
          max-lg:h-[calc(100dvh-82px)]
          max-md:ml-0
          max-md:w-full
        `}
            >

                <div className="mx-auto w-full max-w-[1100px]">

                    {/* Hero Section */}
                    <section className="mb-8 text-center sm:mb-10">

                        <p className="mb-3 text-[10px] font-semibold tracking-[3px] text-[#D8CFBC] sm:text-[11px]">
                            TOKEN PLANS
                        </p>

                        <h1 className="
              font-serif
              text-4xl
              font-medium
              leading-[1.06]
              tracking-[-1.2px]
              sm:text-5xl
              md:text-[54px]
            ">
                            Choose your plan.
                            <br />

                            <span className="text-[#D8CFBC]">
                                Get more tokens.
                            </span>
                        </h1>

                        <p className="
              mx-auto mt-4
              max-w-[500px]
              text-xs
              leading-6
              text-[#D8CFBC]/70
              sm:text-sm
            ">
                            Pick a plan that fits your needs and keep building with AI agents.
                        </p>

                    </section>

                    {/* Pricing Cards */}
                    <section className="
            mx-auto
            grid
            w-full
            grid-cols-1
            items-stretch
            gap-5
            md:grid-cols-2
            lg:grid-cols-3
          ">

                        {plans.map((plan) => {
                            const isSelected = selectedPlan === plan.id;

                            return (
                                <article
                                    key={plan.id}
                                    className={`
                    group
                    relative
                    flex
                    min-h-[270px]
                    flex-col
                    overflow-visible
                    rounded-[22px]
                    border
                    p-5
                    pt-7
                    sm:p-6
                    sm:pt-8

                    transition-all
                    duration-300
                    ease-out

                    ${isSelected
                                            ? `
                          z-10
                          -translate-y-1
                          border-[#D8CFBC]
                          bg-gradient-to-b
                          from-[#D8CFBC]/[0.12]
                          via-[#D8CFBC]/[0.04]
                          to-transparent
                          shadow-[0_0_20px_rgba(216,207,188,0.20),0_0_45px_rgba(216,207,188,0.10)]
                        `
                                            : `
                          border-[#D8CFBC]/20
                          bg-transparent
                          hover:-translate-y-1
                          hover:border-[#D8CFBC]/50
                          hover:bg-[#D8CFBC]/[0.025]
                        `
                                        }
                  `}
                                >

                                    {/* Selected Badge */}
                                    {isSelected && (
                                        <div className="
                      absolute
                      -top-3
                      left-5
                      z-20
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-[#D8CFBC]
                      px-3
                      py-1.5
                      text-[10px]
                      font-semibold
                      text-[#11120D]
                      shadow-[0_0_15px_rgba(216,207,188,0.25)]
                    ">
                                            <Check size={13} strokeWidth={2.5} />
                                            Selected
                                        </div>
                                    )}

                                    {/* Most Popular Badge */}
                                    {plan.popular && (
                                        <div className="
                      absolute
                      -top-3
                      right-4
                      z-20
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-[#D8CFBC]
                      px-3
                      py-1.5
                      text-[10px]
                      font-semibold
                      text-[#11120D]
                    ">
                                            <Crown size={13} />
                                            Most Popular
                                        </div>
                                    )}

                                    {/* Plan Name */}
                                    <h2 className={`
                    mb-5
                    text-center
                    font-serif
                    text-3xl
                    transition-colors
                    duration-300

                    ${isSelected
                                            ? "text-[#D8CFBC]"
                                            : "text-[#FFFBF4]"
                                        }
                  `}>
                                        {plan.name}
                                    </h2>

                                    {/* Token Count */}
                                    <div className="
                    mx-auto
                    mb-5
                    flex
                    w-fit
                    max-w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#D8CFBC]/[0.07]
                    px-3
                    py-2
                  ">

                                        <Layers
                                            size={19}
                                            className="shrink-0 text-[#D8CFBC]"
                                        />

                                        <span className="
                      text-xl
                      font-semibold
                      tracking-tight
                      text-[#FFFBF4]
                      sm:text-2xl
                    ">
                                            {plan.tokens}
                                        </span>

                                        <span className="
                      text-sm
                      text-[#D8CFBC]
                    ">
                                            Tokens
                                        </span>

                                    </div>

                                    {/* Price */}
                                    <div className="mb-7 text-center">

                                        <span className="
                      font-serif
                      text-4xl
                      text-[#FFFBF4]
                    ">
                                            ₹{plan.price}
                                        </span>

                                    </div>

                                    {/* Choose Button */}

                                    <div className="mt-auto">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/checkout/${plan.id}`)}
                                            className="
      group/button
      flex w-full items-center justify-center gap-2
      rounded-full border border-[#D8CFBC]/80
      bg-transparent px-4 py-3
      text-sm font-semibold text-[#FFFBF4]
      transition-all duration-300
      hover:border-[#D8CFBC]
      hover:bg-[#D8CFBC]
      hover:text-[#11120D]
    "
                                        >
                                            Choose {plan.name}

                                            <ArrowRight
                                                size={17}
                                                className="transition-transform duration-300 group-hover/button:translate-x-1"
                                            />
                                        </button>
                                    </div>


                                </article>
                            );
                        })}

                    </section>

                </div>

            </main>

        </div>
    );
};

export default Plans;
