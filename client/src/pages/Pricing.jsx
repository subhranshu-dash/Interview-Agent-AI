import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const plans = [
  {
    name: "Free",
    price: 0,
    priceLabel: "₹0 / month",
    description: "Get started with basic AI interview practice.",
    features: [
      "3 AI Interviews / month",
      "Basic AI feedback",
      "Resume upload (1)",
      "Email support",
    ],
    buttonLabel: "Get Started",
    popular: false,
    razorpayAmount: null,
  },
  {
    name: "Pro",
    price: 499,
    priceLabel: "₹499 / month",
    description: "For serious job seekers who want more practice.",
    features: [
      "Unlimited AI Interviews",
      "Detailed AI feedback",
      "Resume upload (5)",
      "Priority support",
      "Performance analytics",
    ],
    buttonLabel: "Buy Pro",
    popular: true,
    razorpayAmount: 49900,
  },
  {
    name: "Enterprise",
    price: 999,
    priceLabel: "₹999 / month",
    description: "For teams and placement training institutes.",
    features: [
      "Everything in Pro",
      "Team dashboard",
      "Bulk resume upload",
      "Custom question sets",
      "Dedicated manager",
    ],
    buttonLabel: "Contact Us",
    popular: false,
    razorpayAmount: 99900,
  },
];

function Pricing() {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState("Free"); // ← New

  // ← New: User ka current plan fetch karo
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await axios.get("/api/user/profile", {
          withCredentials: true,
        });
        setCurrentPlan(data.plan || "Free");
      } catch (err) {
        console.error("Plan fetch error:", err);
      }
    };
    fetchPlan();
  }, []);

  const handlePayment = async (plan) => {
    if (plan.price === 0) {
      navigate("/interview");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/payment/create-order",
        { amount: plan.razorpayAmount, planName: plan.name },
        { withCredentials: true } // ← New
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "InterviewIQ",
        description: `${plan.name} Plan`,
        order_id: data.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              "/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planName: plan.name,
              },
              { withCredentials: true } // ← New
            );

            if (verifyRes.data.success) {
              setCurrentPlan(plan.name); // ← New: UI turant update
              alert(`🎉 ${plan.name} Plan activated successfully!`);
            }
          } catch (err) {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@email.com",
        },
        theme: { color: "#185FA5" },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK load nahi hua. Page refresh karo.");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Order creation failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600 bg-white shadow hover:shadow-md transition px-4 py-2 rounded-lg"
      >
        <FaArrowLeft className="text-gray-600" />
        Back
      </button>

      <div className="text-center w-full mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Choose Your Plan</h1>
        <p className="text-gray-500 mt-3 text-lg">
          Flexible pricing to match your interview preparation goals.
        </p>

        {/* ← New: Current Plan Badge */}
        <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
          <FaCrown />
          Current Plan: {currentPlan}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-2xl p-6 shadow transition hover:shadow-lg flex flex-col
              ${plan.popular ? "border-2 border-blue-500" : "border border-gray-200"}
              ${currentPlan === plan.name ? "ring-2 ring-green-400" : ""}`} // ← New: green border
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1 rounded-full">
                Most Popular
              </span>
            )}

            {/* ← New: Active Badge */}
            {currentPlan === plan.name && (
              <span className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                ✓ Active
              </span>
            )}

            <h2 className="text-xl font-bold text-gray-800">{plan.name}</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {plan.priceLabel.split(" ")[0]}
              <span className="text-base font-normal text-gray-500"> / month</span>
            </p>
            <p className="text-gray-500 text-sm mt-2 mb-4">{plan.description}</p>

            <ul className="flex-1 space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaCheck className="text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* ← New: Button logic */}
            <button
              onClick={() => handlePayment(plan)}
              disabled={currentPlan === plan.name}
              className={`w-full py-2.5 rounded-xl font-semibold transition text-sm
                ${currentPlan === plan.name
                  ? "bg-green-100 text-green-700 cursor-not-allowed"
                  : plan.popular
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              {currentPlan === plan.name ? "✓ Current Plan" : plan.buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;