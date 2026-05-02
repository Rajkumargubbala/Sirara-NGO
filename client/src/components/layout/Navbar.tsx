"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import axios from "axios";

import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerContent, setHeaderContent] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch dynamic header
    const fetchHeader = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/header`);
        if (data.sections) {
          setHeaderContent(data.sections);
        }
      } catch (error) {
        console.error("Error fetching header:", error);
      }
    };

    fetchHeader();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbar = headerContent?.navbar || {
    logoImage: "/images/logo.png",
    links: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Initiatives", href: "/initiatives" },
      { name: "Testimonials", href: "/testimonials" },
      { name: "Reports", href: "/reports" },
      { name: "Blog", href: "/blog" },
      { name: "Gallery", href: "/gallery" },
      { name: "Contact", href: "/contact" },
    ],
    ctaText: "Donate",
    ctaLink: "/donate"
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative h-12">
        {/* Logo */}
        <div className="flex items-center h-full">
          <Link href="/" className="flex items-center gap-2 group absolute left-0 top-1/2 -translate-y-1/2">
            {navbar.logoImage ? (
              <img
                src={navbar.logoImage}
                alt="Logo"
                className="h-25 w-auto object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
                  <Heart className="text-white w-6 h-6 fill-current" />
                </div>
                <span className={cn(
                  "text-2xl font-serif font-bold transition-colors text-primary"
                )}>
                  {navbar.logoText || "Sitara"}
                </span>
              </>
            )}
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {(navbar.links || []).map((link: any) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
            <Link href={navbar.ctaLink || "#"} className="btn-primary py-2 px-6">
              {navbar.ctaText}
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            className="text-primary p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl lg:hidden border-t border-gray-100 z-[100]"
          >
            <div className="flex flex-col p-6 gap-4">
              {(navbar.links || []).map((link: any) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-primary border-b border-gray-50 pb-2 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href={navbar.ctaLink || "#"}
                onClick={() => setIsOpen(false)}
                className="btn-primary text-center mt-2"
              >
                {navbar.ctaText}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
