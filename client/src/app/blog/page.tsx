"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Loader2, BookOpen } from "lucide-react";
import axios from "axios";
import { ENV } from "@/config/env";
import SanitizedHTML from "@/components/ui/SanitizedHTML";

const API_URL = ENV.API_URL;

export default function BlogListing() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contentRes, blogsRes] = await Promise.all([
        axios.get(`${API_URL}/content/blog`),
        axios.get(`${API_URL}/blog`)
      ]);
      setContent(contentRes.data?.sections || null);
      setBlogs(blogsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch blog data:", error);
    } finally {
      setLoading(false);
    }
  };

  const header = content?.header || {};

  // Helper to strip HTML for the preview
  const getPreviewText = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-background">
      <Navbar />
      
      {/* Simple Header */}
      <section className="py-24 px-6 bg-white border-b border-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-6"
          >
            {header.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SanitizedHTML html={header.subtitle} className="text-xl text-gray-500 font-light" />
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding max-w-7xl mx-auto">
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={blog.featuredImage || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80"} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-primary font-bold uppercase tracking-widest mb-4">
                    <Calendar size={14} />
                    {new Date(blog.createdAt || blog.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-secondary mb-4 group-hover:text-primary transition-colors leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-left line-clamp-3 mb-8 leading-relaxed flex-1">
                    {getPreviewText(blog.content)}
                  </p>
                  <Link 
                    href={`/blog/${blog._id}`} 
                    className="btn-primary w-full flex items-center justify-center gap-2 group/btn"
                  >
                    View More <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-gray-300">
            <BookOpen size={64} className="mx-auto mb-4 opacity-10" />
            <p className="text-xl font-serif italic">No stories published yet...</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
