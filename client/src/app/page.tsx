"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ImpactStats from "@/components/sections/ImpactStats";
import AboutPreview from "@/components/sections/AboutPreview";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import SanitizedHTML from "@/components/ui/SanitizedHTML";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function Home() {
  const [content, setContent] = useState<any>(null);
  const [allInitiatives, setAllInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime();
        
        // Fetch home content
        try {
          const homeRes = await axios.get(`${API_URL}/content/home?t=${timestamp}`);
          if (homeRes.data && homeRes.data.sections) {
            console.log("Home Content Sections:", homeRes.data.sections);
            setContent(homeRes.data.sections);
          }
        } catch (homeError) {
          console.error("Error fetching home content:", homeError);
        }

        // Fetch initiatives for the initiatives list
        try {
          const initRes = await axios.get(`${API_URL}/content/initiatives?t=${timestamp}`);
          if (initRes.data && initRes.data.sections?.initiatives_list?.items) {
            setAllInitiatives(initRes.data.sections.initiatives_list.items);
          }
        } catch (initError) {
          console.error("Error fetching initiatives content:", initError);
        }
      } catch (error) {
        console.error("Critical error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sections with fallbacks
  const hero = content?.hero || {
    title: "Transforming Lives Through Collective Compassion",
    subtitle: "Sitara Association is a global community dedicated to sustainable empowerment.",
    ctaText: "Start Your Impact",
    ctaLink: "/donate",
    imageUrl: "/images/hero-banner.png"
  };

  const impact_stats = {
    title: content?.impact_stats?.title || "Our Growing Impact",
    description: content?.impact_stats?.description || "Every number represents a life changed and a community strengthened.",
    items: (content?.impact_stats?.items && content.impact_stats.items.length > 0)
      ? content.impact_stats.items
      : [
        { label: "Lives Impacted", value: "50,000+", icon: "👥", description: "Across global communities" },
        { label: "Volunteers", value: "1,200+", icon: "🤝", description: "Dedicated change-makers" },
        { label: "Projects Completed", value: "150+", icon: "📊", description: "Sustainable initiatives" },
        { label: "Communities Served", value: "25+", icon: "🏘️", description: "Local partnerships" },
      ]
  };

  const about_preview = {
    title: content?.about_preview?.title || "About Sitara",
    subtitle: content?.about_preview?.subtitle || "A Legacy of Hope and Sustainable Change",
    description: content?.about_preview?.description || "Sitara Association was born from a simple belief: that every individual deserves the opportunity to thrive.",
    imageUrl: content?.about_preview?.imageUrl || "https://images.unsplash.com/photo-1509059852496-f3822ae057bf?auto=format&fit=crop&q=80",
    points: content?.about_preview?.points || ["Transparency in every project", "Direct community involvement", "Sustainable long-term impact", "Global network of volunteers"],
    statValue: content?.about_preview?.statValue || "15+",
    statLabel: content?.about_preview?.statLabel || "Years of Dedicated Service",
    ctaText: content?.about_preview?.ctaText || "Discover Our Journey",
    ctaLink: content?.about_preview?.ctaLink || "/about"
  };

  const initiatives_preview = {
    title: content?.initiatives_preview?.title || "Our Key Initiatives",
    description: content?.initiatives_preview?.description || "Focused programs designed to address the most pressing needs of our society."
  };

  // Show the first 3 initiatives from the list
  const featured_items = allInitiatives.length > 0
    ? allInitiatives.slice(0, 3)
    : [
      { title: "Education for All", description: "Providing quality education and learning materials.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80" },
      { title: "Healthcare Outreach", description: "Mobile clinics and health awareness programs.", image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80" },
      { title: "Women Empowerment", description: "Skill development and micro-finance support.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80" },
    ];

  const cta_banner = {
    title: content?.cta_banner?.title || "Be the change you wish to see in the world.",
    subtitle: content?.cta_banner?.subtitle || content?.cta_banner?.description || content?.cta_banner?.content || "Your support can provide clean water, quality education, and medical care to those who need it most.",
    btn1Text: content?.cta_banner?.btn1Text || content?.cta_banner?.ctaText || "Donate Now",
    btn1Link: content?.cta_banner?.btn1Link || content?.cta_banner?.ctaLink || "/donate",
    btn2Text: content?.cta_banner?.btn2Text || "Join as Volunteer",
    btn2Link: content?.cta_banner?.btn2Link || "/volunteer"
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
        ctaText={about_preview.ctaText}
        ctaLink={about_preview.ctaLink}
      />

      {/* Initiatives Preview */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-secondary">{initiatives_preview.title}</h2>
          <SanitizedHTML html={initiatives_preview.description} className="text-gray-600 max-w-2xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(featured_items || []).map((item: any, i: number) => (
            <div key={i} className="card-premium group">
              <div className="relative h-64 overflow-hidden">
                <img src={item.image || item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-white text-2xl font-serif font-bold">{item.title}</h3>
              </div>
              <div className="p-8">
                <SanitizedHTML html={item.description || item.content} className="text-gray-600 mb-6 line-clamp-3" />
                <Link 
                  href={item.ctaLink || `/initiatives/${item.title?.toLowerCase().replace(/\s+/g, '-') || '#'}`} 
                  className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all"
                >
                  {item.ctaText || "Learn More"} <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Feed / LinkedIn Embed Section */}
      {(content?.social_feed?.embedCode || content?.social_feed?.embedCode1 || content?.social_feed?.embedCode2 || content?.social_feed?.embedCode3) && (
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-10 text-secondary">
              {content?.social_feed?.title || "Latest Updates"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[content.social_feed.embedCode || content.social_feed.embedCode1, content.social_feed.embedCode2, content.social_feed.embedCode3].map((code, index) => {
                if (!code) return null;
                
                let finalEmbed = code;
                
                // If the user pasted a standard LinkedIn URL instead of an iframe, automatically convert it!
                if (!code.includes('<iframe') && code.includes('linkedin.com')) {
                  const match = code.match(/-(ugcPost|share|activity)-(\d+)/);
                  if (match) {
                    const type = match[1];
                    const id = match[2];
                    finalEmbed = `<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:${type}:${id}" height="400" width="100%" frameborder="0" allowfullscreen="" title="LinkedIn Post"></iframe>`;
                  } else {
                    return null; // Invalid URL structure
                  }
                }

                if (!finalEmbed.includes('<iframe')) return null;

                return (
                  <div 
                    key={index}
                    className="flex justify-center overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-white p-4 w-full h-[400px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: finalEmbed }}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section id="cta-banner-section" className="py-24 px-6 bg-primary text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 italic">
            <SanitizedHTML html={cta_banner.title} className="inline" />
          </h2>
          <SanitizedHTML html={cta_banner.subtitle} className="text-xl text-gray-200 mb-10" />
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href={cta_banner.btn1Link} className="btn-primary !bg-white !text-primary !hover:bg-gray-100 px-10 text-xl font-bold">{cta_banner.btn1Text}</Link>
            <Link href={cta_banner.btn2Link} className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary px-10 text-xl font-bold">{cta_banner.btn2Text}</Link>
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
