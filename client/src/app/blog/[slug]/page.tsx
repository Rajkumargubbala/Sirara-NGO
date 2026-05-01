"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Calendar, User, Share2, Globe, MessageCircle, Heart } from "lucide-react";

import Image from "next/image";
import SanitizedHTML from "@/components/ui/SanitizedHTML";

export default function BlogDetail() {
  const { slug } = useParams();

  // In a real app, fetch blog data by slug
  const blog = {
    title: "The Future of Rural Education in 2024",
    content: `
      <p>Education has long been seen as the primary vehicle for social mobility. However, for those living in rural areas, this vehicle has often been stalled by lack of infrastructure, shortage of teachers, and distance.</p>
      <h2>The Digital Leap</h2>
      <p>In 2024, we are seeing a massive shift. The introduction of low-latency satellite internet and solar-powered learning hubs has allowed us to bring the world's best educational resources to the most remote villages.</p>
      <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80" alt="Children learning" style="width:100%; border-radius:1rem; margin: 2rem 0;" />
      <h2>Personalized Learning Path</h2>
      <p>Beyond just connectivity, we are implementing AI-driven personalized learning paths that adapt to each child's pace. This ensures that no student is left behind and those with special talents can accelerate.</p>
      <blockquote>"Technology is just a tool. In terms of getting the kids working together and motivating them, the teacher is the most important." - Bill Gates</blockquote>
      <p>While technology plays a role, our focus remains on training local educators to facilitate these digital resources effectively.</p>
    `,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80",
    author: "Robert Chen",
    date: "April 15, 2024",
    category: "Education",
    authorRole: "Executive Director"
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Article Header */}
      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-12"
          >
            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">{blog.category}</span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary leading-tight">{blog.title}</h1>
            <div className="flex items-center justify-center gap-8 text-gray-500 text-sm border-y border-gray-100 py-4">
              <span className="flex items-center gap-2 font-medium"><User size={18} className="text-primary" /> {blog.author}</span>
              <span className="flex items-center gap-2 font-medium"><Calendar size={18} className="text-primary" /> {blog.date}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl overflow-hidden shadow-2xl mb-16 aspect-video relative"
          >
            <Image src={blog.image} alt={blog.title} fill className="object-cover" />
          </motion.div>

          {/* Article Body */}
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Share */}
            <div className="lg:w-20 shrink-0">
              <div className="sticky top-32 flex lg:flex-col gap-4 items-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter mb-2 hidden lg:block">Share</span>
                <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><Globe size={20} /></button>
                <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><MessageCircle size={20} /></button>
                <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><Heart size={20} /></button>
                <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><Share2 size={20} /></button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 prose prose-lg max-w-none prose-serif prose-headings:text-secondary prose-p:text-gray-600 prose-img:rounded-2xl prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6">
              <SanitizedHTML html={blog.content} />
              
              <div className="mt-16 pt-12 border-t border-gray-100 flex items-center gap-6">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" alt={blog.author} className="w-20 h-20 rounded-full object-cover" />
                <div>
                  <h4 className="font-serif font-bold text-xl text-secondary">Written by {blog.author}</h4>
                  <p className="text-gray-500">{blog.authorRole} at SITATRA Association</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Blogs Preview */}
      <section className="section-padding bg-background border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-secondary mb-12">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 group cursor-pointer">
              <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80" alt="Related" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-serif font-bold text-lg text-secondary group-hover:text-primary transition-colors">Impact Report: Healthcare Q1</h4>
                <p className="text-sm text-gray-500 mt-2">April 10, 2024</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 group cursor-pointer">
              <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80" alt="Related" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-serif font-bold text-lg text-secondary group-hover:text-primary transition-colors">Empowering Women through Micro-Finance</h4>
                <p className="text-sm text-gray-500 mt-2">March 28, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
