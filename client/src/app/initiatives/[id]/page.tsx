"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import SanitizedHTML from "@/components/ui/SanitizedHTML";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function InitiativeDetail() {
  const params = useParams();
  const [initiative, setInitiative] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitiative = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/initiatives`);
        const items = data?.sections?.initiatives_list?.items;
        
        if (items && Array.isArray(items)) {
          const found = items.find((item: any) => {
            if (!item || !item.title) return false;
            const slug = item.title.toLowerCase().replace(/\s+/g, '-');
            return slug === params.id || item.ctaLink?.endsWith(params.id as string);
          });
          setInitiative(found);
        }
      } catch (error) {
        console.error("Error fetching initiative detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitiative();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!initiative) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="text-4xl font-serif font-bold text-secondary mb-4">Initiative Not Found</h1>
        <p className="text-gray-600 mb-8 text-lg">We couldn't find the details for this initiative.</p>
        <Link href="/initiatives" className="btn-primary">Back to Initiatives</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />
      
      {/* Header */}
      <section className="relative pt-32 pb-16 px-6 bg-secondary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/initiatives" className="text-accent hover:text-white transition-colors inline-flex items-center gap-2 mb-8 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Initiatives
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            {initiative.title}
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 -mt-10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl overflow-hidden shadow-2xl aspect-video border-8 border-white bg-gray-100"
          >
            <img 
              src={initiative.image || initiative.imageUrl} 
              alt={initiative.title} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Description */}
          <div className="prose prose-xl max-w-none prose-serif prose-headings:text-secondary prose-p:text-gray-700 bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-6 italic underline decoration-accent decoration-2 underline-offset-4">The Story</p>
            <SanitizedHTML html={initiative.description || initiative.content || initiative.fullStory} />
            
            <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-secondary mb-2">Support this Cause</h3>
                <p className="text-gray-500 text-base">Your help makes a real difference in this mission.</p>
              </div>
              <Link href="/donate" className="btn-primary px-12 py-4 text-lg">Donate Now</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
