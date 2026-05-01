"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Briefcase, Heart, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function Volunteer() {
  const [content, setContent] = useState<any>({
    header: {
      title: "Join Our Mission",
      subtitle: "Your time and skills can change lives. Become a part of the SITATRA family today."
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/volunteer`);
        if (data.sections) {
          setContent(data.sections);
        }
      } catch (error) {
        console.error("Error fetching volunteer content:", error);
      }
    };
    fetchContent();
  }, []);

  const header = content.header;

  const why_join = content?.why_join || {
    title: "Why Volunteer with SITATRA?",
    description: "Volunteering is at the core of our organization. Whether you're a professional looking to donate your skills or a student eager to learn, there's a place for you here.",
    benefits: [
      { title: "Skill Development", desc: "Gain practical experience in community development and NGO management." },
      { title: "Global Network", desc: "Connect with like-minded individuals from around the world." },
      { title: "Local Impact", desc: "See the direct results of your efforts in the communities we serve." },
      { title: "Certificates", desc: "Receive official recognition for your contribution and impact." },
    ]
  };

  const opportunities = content?.opportunities || {
    title: "Current Opportunities",
    items: [
      { title: "Community Health Educator", tag: "Urgent" },
      { title: "Digital Literacy Tutor", tag: "Remote" },
      { title: "Content Creator & Storyteller", tag: "Flexible" },
      { title: "Event Coordinator", tag: "Part-time" },
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (!data.areaOfInterest) {
      toast.error("Please select an area of interest");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/submissions/volunteer`, data);
      toast.success("Application submitted! We will review your profile and contact you.");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-primary text-white py-32 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-8 italic"
          >
            {header.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200"
          >
            {header.subtitle}
          </motion.p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <Heart size={400} className="absolute -bottom-20 -right-20 rotate-12" />
        </div>
      </section>

      <section className="section-padding max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Info */}
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-secondary mb-6">{why_join.title}</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {why_join.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(why_join.benefits || []).map((item: any) => (
                <div key={item.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-50 hover:border-primary/20 transition-all">
                  <h4 className="font-bold text-primary mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary p-10 rounded-3xl text-white">
            <h3 className="text-2xl font-serif font-bold mb-6 italic text-accent">{opportunities.title}</h3>
            <ul className="space-y-4">
              {(opportunities.items || []).map((item: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center pb-4 border-b border-white/10 last:border-0 last:pb-0">
                  <span>{item.title}</span>
                  <span className={`text-xs ${item.tag === 'Urgent' ? 'bg-accent text-secondary' : 'bg-white/10 text-white'} px-2 py-1 rounded font-bold uppercase`}>
                    {item.tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100"
        >
          <h2 className="text-3xl font-serif font-bold text-secondary mb-10">Application Form</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required name="name" type="text" className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required name="email" type="email" className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required name="phone" type="text" className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="+1 (234) 567-890" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Area of Interest</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <select required name="areaOfInterest" className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all appearance-none">
                    <option value="">Select Opportunity</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="environment">Environment</option>
                    <option value="women">Women Empowerment</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Why do you want to join us?</label>
              <textarea required name="motivation" rows={4} className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all resize-none" placeholder="Share your motivation..." />
            </div>

            <button
              disabled={loading}
              className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-xl shadow-primary/20"
            >
              {loading ? "Submitting..." : (
                <>
                  Apply Now
                  <Send size={20} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
