"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { ENV } from "@/config/env";
import SanitizedHTML from "@/components/ui/SanitizedHTML";

const API_URL = ENV.API_URL;

export default function BlogDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/blog/${slug}`);
      setBlog(data);
    } catch (error) {
      console.error("Failed to fetch blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6">
        <h1 className="text-3xl font-serif font-bold text-secondary mb-4">Blog Post Not Found</h1>
        <p className="text-gray-500 mb-8">The story you're looking for might have been moved or deleted.</p>
        <button onClick={() => router.push('/blog')} className="btn-primary flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Blog
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <article className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/blog')}
            className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-12 font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Stories
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-8 text-gray-400 text-sm py-4 border-y border-gray-50">
              <span className="flex items-center gap-2 font-medium">
                <Calendar size={18} className="text-primary" />
                {new Date(blog.createdAt || blog.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-2 font-medium">
                <User size={18} className="text-primary" />
                Sitara Official
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl overflow-hidden shadow-2xl mb-16 aspect-video bg-gray-100"
          >
            <img
              src={blog.featuredImage || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80"}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="prose prose-lg max-w-none prose-serif text-left hyphens-manual prose-headings:text-secondary prose-p:text-gray-600 prose-img:rounded-3xl prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6">
            <SanitizedHTML html={blog.content} />
          </div>

          <div className="mt-20 pt-12 border-t border-gray-100 text-center">
            <p className="text-gray-400 italic font-serif">
              Thank you for reading this story from Sitara Association.
            </p>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
