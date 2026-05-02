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

  // Sections (Strictly CMS Data)
  const hero = content?.hero || {};
  const impact_stats = content?.impact_stats || {};
  const about_preview = content?.about_preview || {};
  const initiatives_preview = content?.initiatives_preview || {};
  const featured_items = allInitiatives.length > 0 ? allInitiatives.slice(0, 3) : [];
  const cta_banner = content?.cta_banner || {};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
            <Link href={cta_banner.btn1Link || "#"} className="btn-primary !bg-white !text-primary !hover:bg-gray-100 px-10 text-xl font-bold">{cta_banner.btn1Text}</Link>
            <Link href={cta_banner.btn2Link || "#"} className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary px-10 text-xl font-bold">{cta_banner.btn2Text}</Link>
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
