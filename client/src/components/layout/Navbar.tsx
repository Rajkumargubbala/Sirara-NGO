"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/hooks/useDarkMode";
import axios from "axios";

import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerContent, setHeaderContent] = useState<any>(null);
  const { isDark, toggleDarkMode } = useDarkMode();

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
    logoText: "SITATRA",
    links: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Initiatives", href: "/initiatives" },
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
        isScrolled || isDark ? "bg-background/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
            <Heart className="text-white w-6 h-6 fill-current" />
          </div>
          <span className={cn(
            "text-2xl font-serif font-bold transition-colors text-primary"
          )}>
            {navbar.logoText}
          </span>
        </Link>

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

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-800">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-secondary dark:text-accent"
              title="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link href={navbar.ctaLink} className="btn-primary py-2 px-6">
              {navbar.ctaText}
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-secondary dark:text-accent"
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
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
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-xl lg:hidden border-t border-gray-100 dark:border-gray-800 z-[100]"
          >
            <div className="flex flex-col p-6 gap-4">
              {(navbar.links || []).map((link: any) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-primary border-b border-gray-50 dark:border-gray-800 pb-2 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href={navbar.ctaLink}
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
