"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const images = [
  { id: 1, src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80", category: "Events", title: "Food Distribution Drive" },
  { id: 2, src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80", category: "Education", title: "New School Opening" },
  { id: 3, src: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80", category: "Health", title: "Medical Camp 2024" },
  { id: 4, src: "https://images.unsplash.com/photo-1509059852496-f3822ae057bf?auto=format&fit=crop&q=80", category: "Volunteers", title: "Team Building" },
  { id: 5, src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80", category: "Women", title: "Workshop Session" },
  { id: 6, src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80", category: "Events", title: "Community Meeting" },
];

const categories = ["All", "Events", "Education", "Health", "Volunteers", "Women"];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const filteredImages = activeCategory === "All" 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-6">Our Visual Journey</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Capturing moments of impact, joy, and transformation across our various initiatives.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredImages.map((img) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group cursor-pointer aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img.src} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                    <span className="text-accent text-sm font-bold uppercase tracking-widest mb-2">{img.category}</span>
                    <h3 className="text-white text-xl font-serif font-bold">{img.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-10 right-10 text-white hover:text-accent transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title} 
                className="w-full h-full object-contain rounded-lg" 
              />
              <div className="mt-6 text-center text-white">
                <h3 className="text-2xl font-serif font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-accent uppercase tracking-widest text-sm font-bold">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
