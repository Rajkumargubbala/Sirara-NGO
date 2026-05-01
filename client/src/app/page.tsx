"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ImpactStats from "@/components/sections/ImpactStats";
import AboutPreview from "@/components/sections/AboutPreview";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function Home() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/home`);
        if (data.sections) {
          setContent(data.sections);
        }
      } catch (error) {
        console.error("Error fetching home content:", error);
      }
    };
    fetchContent();
  }, []);

  // Sections with fallbacks
  const hero = content?.hero || {
    title: "Transforming Lives Through Collective Compassion",
    subtitle: "SITATRA Association is a global community dedicated to sustainable empowerment.",
    ctaText: "Start Your Impact",
    ctaLink: "/donate",
    imageUrl: "/images/hero-banner.png"
  };

  const impact_stats = content?.impact_stats || {
    title: "Our Growing Impact",
    description: "Every number represents a life changed and a community strengthened.",
    items: [
      { label: "Lives Impacted", value: "50,000+", icon: "👥" },
      { label: "Volunteers", value: "1,200+", icon: "🤝" },
      { label: "Projects Completed", value: "150+", icon: "📊" },
      { label: "Communities Served", value: "25+", icon: "🏘️" },
    ]
  };

  const about_preview = content?.about_preview || {
    title: "About SITATRA",
    subtitle: "A Legacy of Hope and Sustainable Change",
    description: "SITATRA Association was born from a simple belief: that every individual deserves the opportunity to thrive.",
    imageUrl: "https://images.unsplash.com/photo-1509059852496-f3822ae057bf?auto=format&fit=crop&q=80",
    points: ["Transparency in every project", "Direct community involvement", "Sustainable long-term impact", "Global network of volunteers"],
    statValue: "15+",
    statLabel: "Years of Dedicated Service"
  };

  const initiatives_preview = content?.initiatives_preview || {
    title: "Our Key Initiatives",
    description: "Focused programs designed to address the most pressing needs of our society.",
    items: [
      { title: "Education for All", description: "Providing quality education and learning materials.", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80" },
      { title: "Healthcare Outreach", description: "Mobile clinics and health awareness programs.", imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80" },
      { title: "Women Empowerment", description: "Skill development and micro-finance support.", imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80" },
    ]
  };

  const cta_banner = content?.cta_banner || {
    title: "Be the change you wish to see in the world.",
    subtitle: "Your support can provide clean water, quality education, and medical care to those who need it most.",
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <Hero 
        title={hero.title}
        subtitle={hero.subtitle}
        ctaText={hero.ctaText}
        ctaLink={hero.ctaLink}
        imageUrl={hero.imageUrl}
      />

      <ImpactStats 
        title={impact_stats.title}
        description={impact_stats.description}
        stats={impact_stats.items}
      />
      
      <AboutPreview 
        title={about_preview.title}
        subtitle={about_preview.subtitle}
        description={about_preview.description}
        imageUrl={about_preview.imageUrl}
        points={about_preview.points}
        statValue={about_preview.statValue}
        statLabel={about_preview.statLabel}
      />

      {/* Initiatives Preview */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-secondary">{initiatives_preview.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{initiatives_preview.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(initiatives_preview.items || []).map((item: any, i: number) => (
            <div key={i} className="card-premium group">
              <div className="relative h-64 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-white text-2xl font-serif font-bold">{item.title}</h3>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-6">{item.description}</p>
                <Link href="/initiatives" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                  Learn More <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 italic">"{cta_banner.title}"</h2>
          <p className="text-xl text-gray-200 mb-10">{cta_banner.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/donate" className="btn-primary !bg-white !text-primary !hover:bg-gray-100 px-10 text-xl font-bold">Donate Now</Link>
            <Link href="/volunteer" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary px-10 text-xl font-bold">Join as Volunteer</Link>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] border-[40px] border-white rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] border-[20px] border-white rounded-full" />
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
