"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl?: string;
}

export default function Hero({ title, subtitle, ctaText, ctaLink, imageUrl }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80"}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href={ctaLink || "#"} className="btn-primary !bg-accent !text-secondary !hover:bg-accent-dark !border-none text-lg">
            {ctaText}
          </Link>
          <Link href="/about" className="btn-outline !text-white !border-white hover:!bg-white hover:!text-primary text-lg">
            Learn More
          </Link>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white opacity-70"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
