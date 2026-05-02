"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Target, Heart, Eye } from "lucide-react";

import SanitizedHTML from "@/components/ui/SanitizedHTML";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function About() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/about`);
        if (data.sections) {
          setContent(data.sections);
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      }
    };
    fetchContent();
  }, []);

  const hero = content?.hero || {};

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-6xl font-serif font-bold text-secondary leading-tight"
            >
              {hero.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              {hero.subtitle}
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:w-1/2 relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src={hero.imageUrl} alt="About Sitara" className="w-full aspect-video object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent rounded-2xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Vision/Mission */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              title: content?.mission?.title || "Our Mission", 
              icon: content?.mission?.icon, 
              defaultIcon: <Target size={32} />,
              content: content?.mission?.description || content?.mission?.content || "To empower marginalized communities through education, healthcare, and sustainable livelihood programs." 
            },
            { 
              title: content?.vision?.title || "Our Vision", 
              icon: content?.vision?.icon, 
              defaultIcon: <Eye size={32} />,
              content: content?.vision?.description || content?.vision?.content || "A world where every individual has the opportunity to live a life of dignity, health, and prosperity." 
            },
            { 
              title: content?.values?.title || "Our Values", 
              icon: content?.values?.icon, 
              defaultIcon: <Heart size={32} />,
              content: content?.values?.description || content?.values?.content || "Compassion, Transparency, Innovation, and Inclusivity are the pillars of everything we do." 
            },
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 bg-white rounded-3xl shadow-sm border border-gray-100 text-center space-y-6 flex flex-col h-full"
            >
              <div className="shrink-0 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto overflow-hidden">
                {item.icon && item.icon.startsWith('/') || item.icon?.startsWith('http') ? (
                  <img src={item.icon} alt={item.title} className="w-10 h-10 object-contain" />
                ) : (
                  item.defaultIcon
                )}
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-serif font-bold text-secondary">{item.title}</h3>
                <SanitizedHTML 
                  html={item.content} 
                  className="text-gray-600 leading-relaxed break-words text-sm md:text-base prose-p:my-0" 
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl font-serif font-bold text-secondary text-center italic">{content?.story?.title || "Our Journey"}</h2>
          <SanitizedHTML 
            className="prose prose-lg max-w-none prose-serif prose-headings:text-secondary prose-p:text-gray-600"
            html={content?.story?.content || "<p>Founded in 2010, Sitara began as a small group of volunteers...</p>"}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
