"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { BookOpen, Stethoscope, Users, Leaf, Heart } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

const iconMap: any = {
  BookOpen, Stethoscope, Users, Leaf, Heart
};

export default function Initiatives() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/initiatives`);
        if (data.sections) {
          setContent(data.sections);
        }
      } catch (error) {
        console.error("Error fetching initiatives content:", error);
      }
    };
    fetchContent();
  }, []);

  const header = content?.header || {
    title: "Our Strategic Initiatives",
    subtitle: "Focused programs designed to address the most pressing needs of our society.",
  };

  const items = content?.initiatives_list?.items || [
    { title: "Education for All", description: "Bridging the literacy gap...", icon: "BookOpen", color: "bg-blue-500", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80" },
    { title: "Healthcare Outreach", description: "Bringing essential medical services...", icon: "Stethoscope", color: "bg-red-500", image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80" },
  ];

  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      {/* Header */}
      <section className="bg-secondary text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6 italic"
          >
            {header.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            {header.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Initiatives List */}
      <section className="section-padding space-y-32">
        {items.map((item: any, index: number) => {
          const Icon = iconMap[item.icon] || Heart;
          return (
            <div key={index} className="max-w-7xl mx-auto">
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
                <motion.div className="lg:w-1/2 relative">
                  <div className="rounded-3xl overflow-hidden shadow-2xl aspect-video">
                    <img src={item.image || item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                </motion.div>

                <motion.div className="lg:w-1/2 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className={`${item.color || 'bg-primary'} p-4 rounded-xl text-white shadow-lg`}>
                      <Icon size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary">{item.title}</h2>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {item.description || item.content}
                  </p>
                  <div className="pt-4 flex gap-4">
                    <Link href="/donate" className="btn-primary">Support this Cause</Link>
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </section>

      <Footer />
    </main>
  );
}
