import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import ApiError from "../../../server/utils/ApiError";
import { useDispatch } from 'react-redux';
import { setUserData } from "../redux/USerSlice";
const GlowOrb = ({ className }) => (
    <div
        className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    />
);
const Pricing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState("free");

    const plans = [
        {
            id: "free",
            name: "Free",
            price: "₹0",
            credits: 100,
            description:
                "Perfect for beginners starting interview preparation.",
            features: [
                "100 AI Interview Credits",
                "Basic Performance Report",
                "Voice Interview Access",
                "Limited History Tracking",
            ],
            default: true,
        },
        {
            id: "basic",
            name: "Starter Pack",
            price: "₹100",
            credits: 150,
            description: "Great for focused practice and skill improvement.",
            features: [
                "150 AI Interview Credits",
                "Detailed Feedback",
                "Performance Analytics",
                "Full Interview History",
            ],
            default: false,
        },
        {
            id: "pro",
            name: "Pro Pack",
            price: "₹500",
            credits: 650,
            description: "Best value for serious job preparation for high-paying roles",
            features: [
                "650 AI Interview Credits",
                "Advanced AI Feedback",
                "Skill Trend Analysis",
                "Priority AI Processing",
            ],
            default: false,
            badge: "Best Value",
        },
    ];

    const handlePayment = async (plan) => {
        try {
            setIsLoading(plan.id);
            const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;
            console.log("here handle payment ")

            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/payment/order`, { planId: plan.id, amount, credits: plan.credits }, { withCredentials: true });

            console.log("response of payment order :", result.data);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: result.data.data.amount,
                currency: "INR",
                name: "MockMate.AI",
                description: `${plan.name} - ${plan.credits} Credits`,
                order_id: result.data.id,

                handler: async function (response) {
                    console.log("response of handler", response)
                    const verifyPay = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/payment/verify`, {
                        razorpay_order_id: result.data.data.id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    }, { withCredentials: true });


                    dispatch(setUserData(verifyPay.data.user));
                    alert("Payment Successful Credits Added!");
                    navigate("/");

                },
                theme: {
                    color: "#10b981"
                }
            }

            const rzp = window.Razorpay(options);
            rzp.open();

            setIsLoading(null);



        } catch (error) {
            throw new ApiError(500, "error in pricing " + error)
        }
    }
    return (
        <div
            className="relative min-h-screen "
            style={{
                background: "#06050f",
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            {/* Background */}

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(109,40,217,0.2),transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(59,130,246,0.1),transparent)]" />
                {/* <GlowOrb className="w-[500px] h-[500px] top-[-150px] left-1/2 -translate-x-1/2 bg-violet-700/15" />  */}
            </div>

            {/* <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
          opacity: 0.03,
        }}
      /> */}

            <Navbar />
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-4">
                <AnimatedBackground />
                {/* <button className="mt-2">
                    <FaArrowLeft />
                </button> */}

                <div className="text-center w-full mb-4">
                    <div
                    className="absolute left-1/4 right-1/4 h-px z-10"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.6),transparent)', top: 0 }}
                />

                    <h1 className="text-3xl md:text-4xl font-semibold mt-6 text-white mb-4" style={{fontFamily:"'Syne', sans-serif"}}>
                        Choose Your Plan
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Flexible pricing to match your interview preparation
                        goals.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                    {plans.map((plan) => {
                        const isSelected = selectedPlan === plan.id;

                        return (
                            <motion.div
                                key={plan.id}
                                whileHover={!plan.default && { scale: 1.05 }}
                                onClick={() =>
                                    !plan.default && setSelectedPlan(plan.id)
                                }
                                className={`relative rounded-3xl p-8 transition-all duration-300 border     bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10
                                     ${isSelected
                                        ? "border-emerald-600 shadow-2xl bg-white"
                                        : "border-gray-200 bg-white shadow-md"
                                    }
                                ${plan.default
                                        ? "cursor-default"
                                        : "cursor-pointer"
                                    }
                                `}
                            >
                                {/* Badge */}
                                {plan.badge && (
                                    <div className="absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow  bg-gradient-to-br from-indigo-900/40 to-purple-900/40 
border border-indigo-500/40 
shadow-lg shadow-indigo-500/20
scale-105">
                                        {plan.badge}
                                    </div>
                                )}
                                {/* default tag */}
                                {plan.default && (
                                    <div className="absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-4 py-1 rounded-full shadow bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1 rounded-full">
                                        Default
                                    </div>
                                )}

                                {/* plan name */}
                                <h3 className="text-xl text-white font-semibold  ">
                                    {plan.name}
                                </h3>

                                {/* price */}
                                <div className="mt-4">
                                    <span className="text-xl font-bold text-emerald-600 text-indigo-400 text-3xl font-bold">
                                        {plan.price}
                                    </span>
                                    <p className="text-gray-400 text-sm mt-1 ">
                                        {plan.credits} Credits
                                    </p>
                                </div>
                                {/** description */}

                                <p className="text-gray-500 mt-4 text-sm text-gray-400 text-sm leading-relaxed leading-relaxed">
                                    {plan.description}
                                </p>

                                <div className="mt-6 space-y-3 text-left">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex gap-3 items-center text-indigo-400">
                                            <FaCheckCircle />
                                            <span style={{
                                                background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #f0abfc 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }} className=" text-sm text-gray-700">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {!plan.default && (
                                    <button
                                        disabled={isLoading === plan.id}
                                        className={`
  w-full mt-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1
  ${isSelected
                                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-105"
                                                : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white hover:border-indigo-400/30"
                                            }
`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isSelected) {
                                                setSelectedPlan(plan.id)
                                            } else {
                                                handlePayment(plan);
                                            }
                                        }}
                                    >
                                        {isLoading === plan.id
                                            ? "Processing..."
                                            : isSelected
                                                ? "Proceed to pay"
                                                : "Select plan"
                                        }
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Pricing;
