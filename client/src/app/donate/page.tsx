"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

import { PageLoader } from "@/components/ui/Loading";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

const iconMap: any = { Zap, ShieldCheck, Heart };

export default function Donate() {
  const [amount, setAmount] = useState(50);
  const [content, setContent] = useState<any>({
    header: {
      badge: "Make a Difference",
      title: "Your Contribution Changes Lives",
      description: "Every donation, no matter the size, goes directly towards our mission of empowering communities. We ensure 100% transparency in our funding and project execution."
    }
  });
  const presetAmounts = [10, 25, 50, 100, 250, 500];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/donate`);
        if (data.sections) setContent(data.sections);
      } catch (error) {
        console.error("Error fetching donate content:", error);
      }
    };
    fetchContent();
  }, []);

  const header = content?.header || {
    badge: "Make a Difference",
    title: "Your Contribution Changes Lives",
    description: "Every donation, no matter the size, goes directly towards our mission of empowering communities. We ensure 100% transparency in our funding and project execution."
  };

  const benefits = content?.benefits?.items || [
    { icon: "Zap", title: "Immediate Impact", desc: "Your donation is put to work right away in our active projects." },
    { icon: "ShieldCheck", title: "Secure Payment", desc: "We use industry-standard encryption to protect your transaction." },
    { icon: "Heart", title: "Tax Deductible", desc: "All donations are eligible for tax benefits under local laws." },
  ];

  const monthly_card = content?.monthly_card || {
    title: "Monthly Giving",
    description: "Join our group of monthly supporters and help us plan for long-term sustainable projects.",
    buttonText: "Become a Monthly Donor"
  };

  const impact_guide = content?.impact_guide?.items || [
    { minAmount: 0, text: "Provides educational supplies for 2 children for a month." },
    { minAmount: 50, text: "Funds a community health check-up camp for 20 families." },
    { minAmount: 200, text: "Supports a clean water well installation for an entire village." }
  ];

  const getImpactText = (amt: number) => {
    const sorted = [...impact_guide].sort((a, b) => b.minAmount - a.minAmount);
    return sorted.find(i => amt >= i.minAmount)?.text || impact_guide[0]?.text;
  };

  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Info */}
          <div className="space-y-8">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">{header.badge}</span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-6 leading-tight">
                {header.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {header.description}
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit: any) => {
                const Icon = iconMap[benefit.icon] || Zap;
                return (
                  <div key={benefit.title} className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-8 bg-secondary text-white rounded-2xl relative overflow-hidden">
              <h3 className="text-2xl font-serif font-bold mb-4 relative z-10">{monthly_card.title}</h3>
              <p className="text-gray-300 mb-6 relative z-10">{monthly_card.description}</p>
              <button className="btn-primary !bg-accent !text-secondary font-bold relative z-10">{monthly_card.buttonText}</button>
              <Heart className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 rotate-12" />
            </div>
          </div>

          {/* Right: Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 sticky top-32"
          >
            <h2 className="text-2xl font-serif font-bold text-secondary mb-8">Choose Donation Amount</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`py-4 rounded-xl border-2 font-bold transition-all ${
                    amount === amt 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-gray-100 text-gray-500 hover:border-primary/30"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="relative mb-8">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter custom amount"
                className="w-full pl-10 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none transition-all text-xl font-bold text-secondary"
              />
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-bold text-secondary">Impact of your ${amount}:</h4>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 text-primary-dark">
                <p>{getImpactText(amount)}</p>
              </div>
            </div>

            <button className="btn-primary w-full py-5 text-xl font-bold shadow-lg shadow-primary/20">
              Complete Donation
            </button>
            
            <p className="text-center text-gray-400 text-xs mt-6">
              SITATRA Association is a registered 501(c)(3) non-profit organization.
            </p>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
