"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import SanitizedHTML from "@/components/ui/SanitizedHTML";

import { PageLoader } from "@/components/ui/Loading";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

const iconMap: any = { Zap, ShieldCheck, Heart };

export default function Donate() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>({
    header: {
      title: "Your Contribution Changes Lives",
      description: "Every donation, no matter the size, goes directly towards our mission of empowering communities. We ensure 100% transparency in our funding and project execution.",
      quotation: "We believe that every person deserves the opportunity to thrive. Your support helps us provide the tools and resources needed to create lasting change."
    }
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      await axios.post(`${API_URL}/submissions/donate`, data);
      toast.success("Thank you for your donation pledge! We will contact you soon.");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit donation.");
    } finally {
      setLoading(false);
    }
  };

  const header = content?.header || {};

  if (Object.keys(content).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Info */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-6 leading-tight">
              {header.title}
            </h1>
            <div className="text-gray-600 text-lg leading-relaxed mb-8 prose max-w-none break-words overflow-hidden">
              <SanitizedHTML html={header.description} />
            </div>
            <div className="p-8 bg-primary/10 rounded-2xl border border-primary/20">
              <p className="text-primary-dark font-medium italic">
                "{header.quotation}"
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100"
          >
            <h2 className="text-2xl font-serif font-bold text-secondary mb-8 text-center">Donation Interest Form</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <input required name="name" type="text" placeholder="Full Name" className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none transition-all" />
                <input required name="email" type="email" placeholder="Email Address" className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none transition-all" />
                <input required name="phone" type="tel" placeholder="Phone Number" className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none transition-all" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-5 text-xl font-bold shadow-lg shadow-primary/20"
              >
                {loading ? "Processing..." : "Submit Interest"}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Thank you for your interest in supporting Sitara. We will reach out to you shortly to discuss your contribution.
            </p>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
