"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function TestimonialsPage() {
  const [content, setContent] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, itemsRes] = await Promise.all([
          axios.get(`${API_URL}/content/testimonials`),
          axios.get(`${API_URL}/resources/testimonials`)
        ]);
        if (contentRes.data.sections) setContent(contentRes.data.sections);
        setItems(itemsRes.data);
      } catch (error) {
        console.error("Error fetching testimonials data:", error);
      }
    };
    fetchData();
  }, []);

  const header = content?.header || {
    title: "Voices of Impact",
    subtitle: "Hear from the partners, volunteers, and communities that make our work possible.",
    badge: "Testimonials"
  };

  // Fallback items if API is empty
  const displayItems = items.length > 0 ? items : [
    { name: "Dr. Sarah Mitchell", role: "Community Partner", content: "Working with SITATRA has been an eye-opening experience.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80", rating: 5 },
    { name: "James Wilson", role: "Volunteer", content: "The transparency and structure at SITATRA are what stand out.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80", rating: 5 }
  ];

  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <section className="section-padding bg-background overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">{header.badge}</span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-6">{header.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">{header.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayItems.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 relative group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute -top-5 left-10 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                  <Quote size={20} fill="currentColor" />
                </div>
                
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-accent fill-accent" />
                  ))}
                </div>

                <p className="text-gray-600 italic mb-8 leading-relaxed">"{t.content || t.message}"</p>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" 
                  />
                  <div>
                    <h4 className="font-bold text-secondary">{t.name}</h4>
                    <p className="text-sm text-gray-400">{t.role || t.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute top-1/2 left-0 w-full h-1/2 bg-primary/5 -z-0 skew-y-6 transform translate-y-1/2" />
      </section>

      <Footer />
    </main>
  );
}
