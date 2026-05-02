"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { BookOpen, Stethoscope, Users, Leaf, Heart } from "lucide-react";
import Link from "next/link";
import SanitizedHTML from "@/components/ui/SanitizedHTML";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

const iconMap: any = {
  BookOpen, Stethoscope, Users, Leaf, Heart
};

export default function Initiatives() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/initiatives`);
        console.log("Initiatives data received:", data);
        if (data && data.sections) {
          setContent(data.sections);
        } else {
          // Set to empty object if no sections found, to avoid 'Oops' page
          setContent({});
        }
      } catch (error) {
        console.error("Error fetching initiatives content:", error);
        // Still set to empty object to allow default values to show
        setContent({});
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!content && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="text-4xl font-serif font-bold text-secondary mb-4">Error Loading Initiatives</h1>
        <p className="text-gray-600 mb-8 text-lg">We encountered an internal error while fetching the content. Please try again later.</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Refresh Page</button>
      </div>
    );
  }

  const header = content?.header || {};

  const items = content?.initiatives_list?.items || [];

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
        {items.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-500 italic">No initiatives found. Please add some from the CMS.</p>
          </div>
        )}
        {items.map((item: any, index: number) => {
          if (!item) return null;
          return (
            <div key={index} className="max-w-7xl mx-auto">
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="lg:w-1/2 relative"
                >
                  <div className="rounded-3xl overflow-hidden shadow-2xl aspect-video border-8 border-white">
                    <img src={item.image || item.imageUrl} alt={item.title || "Initiative"} className="w-full h-full object-cover" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="lg:w-1/2 space-y-6"
                >
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-secondary">{item.title}</h2>

                  <div className="space-y-4">
                    <div className="text-lg text-gray-600 leading-relaxed line-clamp-3">
                      <SanitizedHTML html={item.description || item.content || ""} />
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4">
                    <Link 
                      href={item.ctaLink || `/initiatives/${item.title?.toLowerCase().replace(/\s+/g, '-') || '#'}`} 
                      className="btn-primary flex items-center gap-2 group"
                    >
                      {item.ctaText || "View Full Story"}
                      <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                    </Link>
                    <Link href="/donate" className="btn-outline">Support this Cause</Link>
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
