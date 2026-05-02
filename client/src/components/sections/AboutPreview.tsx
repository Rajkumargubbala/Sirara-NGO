"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import SanitizedHTML from "@/components/ui/SanitizedHTML";

interface AboutPreviewProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  points?: string[];
  statValue?: string;
  statLabel?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function AboutPreview({
  title = "About Sitara",
  subtitle = "A Legacy of Hope and Sustainable Change",
  description = "Sitara Association was born from a simple belief: that every individual deserves the opportunity to thrive.",
  imageUrl = "https://images.unsplash.com/photo-1509059852496-f3822ae057bf?auto=format&fit=crop&q=80",
  points = ["Transparency in every project", "Direct community involvement", "Sustainable long-term impact", "Global network of volunteers"],
  statValue = "15+",
  statLabel = "Years of Dedicated Service",
  ctaText = "Discover Our Journey",
  ctaLink = "/about"
}: AboutPreviewProps) {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl h-[500px]">
            <Image
              src={imageUrl}
              alt="Volunteers at work"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-accent/20 rounded-full -z-0 blur-3xl" />
          <div className="absolute -top-8 -left-8 w-48 h-48 bg-primary/10 rounded-full -z-0 blur-2xl" />
          
          <div className="absolute bottom-6 right-6 bg-white p-6 rounded-xl shadow-xl z-20 hidden md:block">
            <p className="text-primary font-bold text-4xl font-serif">{statValue}</p>
            <p className="text-gray-500 text-sm">{statLabel}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">{title}</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-secondary mb-6 leading-tight">
              {subtitle}
            </h2>
            <SanitizedHTML 
              className="text-gray-600 leading-relaxed text-lg"
              html={description}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {points.map((point) => (
              <div key={point} className="flex items-center gap-3">
                <CheckCircle2 className="text-primary shrink-0" size={20} />
                <span className="text-gray-700 font-medium">{point}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link href={ctaLink || "#"} className="btn-primary inline-block font-bold">
              {ctaText}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
