"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ImageIcon } from "lucide-react";
import axios from "axios";
import { ENV } from "@/config/env";
import SanitizedHTML from "@/components/ui/SanitizedHTML";

const API_URL = ENV.API_URL;

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Page Content
      const contentRes = await axios.get(`${API_URL}/content/gallery`);
      if (contentRes.data?.sections) {
        setContent(contentRes.data.sections);
      }

      // Fetch Gallery Items
      const galleryRes = await axios.get(`${API_URL}/resources/gallery`);
      setGalleryItems(galleryRes.data);
    } catch (error) {
      console.error("Failed to fetch gallery data:", error);
    } finally {
      setLoading(false);
    }
  };

  const header = content?.header || {
    title: "Our Visual Journey",
    subtitle: "Explore the moments and milestones that define our impact across communities."
  };

  const categories = ["All", ...(content?.categories?.items?.map((c: any) => c.name) || [])];

  const filteredImages = activeCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(img => img.category === activeCategory);

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
      
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-6">{header.title}</h1>
            <SanitizedHTML html={header.subtitle} className="text-gray-600 max-w-2xl mx-auto" />
          </div>

          {/* Filters */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                    activeCategory === cat 
                      ? "bg-primary text-white shadow-lg shadow-primary/30" 
                      : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {filteredImages.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((img) => (
                  <motion.div
                    key={img._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="relative group cursor-pointer aspect-[4/3] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img 
                      src={img.imageUrl} 
                      alt={img.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                      <span className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{img.category}</span>
                      <h3 className="text-white text-xl font-serif font-bold leading-tight">{img.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-gray-300">
              <ImageIcon size={64} className="mb-4 opacity-10" />
              <p className="text-xl font-serif italic">No images in this segment yet...</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} strokeWidth={1} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-6xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full aspect-[16/10] md:aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.title} 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="mt-8 text-center">
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">{selectedImage.category}</span>
                <h3 className="text-white text-2xl md:text-3xl font-serif font-bold">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
