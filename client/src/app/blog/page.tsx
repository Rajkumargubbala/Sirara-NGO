"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "The Future of Rural Education in 2024",
    slug: "future-rural-education-2024",
    excerpt: "Exploring the new digital initiatives that are bringing world-class education to the most remote areas of the country.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80",
    author: "Robert Chen",
    date: "April 15, 2024",
    category: "Education"
  },
  {
    id: 2,
    title: "Impact Report: Our Healthcare Outreach in Q1",
    slug: "impact-report-healthcare-q1",
    excerpt: "How our mobile clinics reached over 5,000 families this quarter, providing essential vaccinations and health checks.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80",
    author: "Lila Vance",
    date: "April 10, 2024",
    category: "Impact"
  },
  {
    id: 3,
    title: "Empowering Women through Micro-Finance",
    slug: "empowering-women-micro-finance",
    excerpt: "Success stories from our latest cohort of entrepreneurs who are transforming their local economies.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80",
    author: "Sarah Jenkins",
    date: "March 28, 2024",
    category: "Empowerment"
  },
  {
    id: 4,
    title: "Why Community Involvement is Key to Sustainability",
    slug: "community-involvement-sustainability",
    excerpt: "Deep dive into our methodology of local-led development and why it yields long-term results.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80",
    author: "Amina J. Okafor",
    date: "March 15, 2024",
    category: "Insights"
  }
];

export default function BlogListing() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      {/* Header */}
      <section className="bg-primary text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 italic">Insights & Updates</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">Stay updated with our latest stories, impact reports, and community insights.</p>
        </div>
        <div className="absolute inset-0 opacity-10">
          <img src="https://www.transparenttextures.com/patterns/cubes.png" alt="" className="w-full h-full object-repeat" />
        </div>
      </section>

      {/* Featured Blog */}
      <section className="section-padding max-w-7xl mx-auto -mt-20 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 group"
        >
          <div className="h-96 lg:h-auto relative overflow-hidden">
            <img src={blogs[0].image} alt={blogs[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute top-6 left-6 bg-accent text-secondary font-bold px-4 py-1 rounded-full text-sm">Featured</div>
          </div>
          <div className="p-12 flex flex-col justify-center">
            <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
              <span className="flex items-center gap-2"><Calendar size={16} /> {blogs[0].date}</span>
              <span className="flex items-center gap-2"><User size={16} /> {blogs[0].author}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-6 group-hover:text-primary transition-colors">
              <Link href={`/blog/${blogs[0].slug}`}>{blogs[0].title}</Link>
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">{blogs[0].excerpt}</p>
            <Link href={`/blog/${blogs[0].slug}`} className="btn-primary self-start flex items-center gap-2">
              Read Full Story <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="section-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogs.slice(1).map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-lg">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary font-bold px-3 py-1 rounded-md text-xs uppercase tracking-widest">{blog.category}</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{blog.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>{blog.author}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-secondary group-hover:text-primary transition-colors leading-tight">
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h3>
                <p className="text-gray-600 line-clamp-3">{blog.excerpt}</p>
                <Link href={`/blog/${blog.slug}`} className="text-primary font-bold inline-flex items-center gap-1 group-hover:gap-3 transition-all">
                  Continue Reading <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Placeholder */}
        <div className="mt-20 flex justify-center gap-4">
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 cursor-not-allowed">←</button>
          <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</button>
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-all font-bold">2</button>
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-all">→</button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
