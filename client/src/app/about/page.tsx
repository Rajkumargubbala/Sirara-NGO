"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Target, Heart, Eye } from "lucide-react";
import { 
  LinkedinIcon as Linkedin, 
  TwitterIcon as Twitter, 
  InstagramIcon as Instagram 
} from "@/components/ui/SocialIcons";

import SanitizedHTML from "@/components/ui/SanitizedHTML";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function About() {
  const [content, setContent] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/about`);
        if (data.sections) {
          setContent(data.sections);
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      }
    };

    const fetchTeam = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/resources/team`);
        setTeam(data);
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };

    fetchContent();
    fetchTeam();
  }, []);

  const hero = content?.hero || {};
  const ceo = content?.ceo || {};

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-6xl font-serif font-bold text-secondary leading-tight"
            >
              {hero.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              {hero.subtitle}
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:w-1/2 relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src={hero.imageUrl} alt="About Sitara" className="w-full aspect-video object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent rounded-2xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Vision/Mission */}
      <section className="section-padding bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              title: content?.mission?.title || "Our Mission", 
              icon: content?.mission?.icon, 
              defaultIcon: <Target size={32} />,
              content: content?.mission?.description || content?.mission?.content || "To empower marginalized communities through education, healthcare, and sustainable livelihood programs." 
            },
            { 
              title: content?.vision?.title || "Our Vision", 
              icon: content?.vision?.icon, 
              defaultIcon: <Eye size={32} />,
              content: content?.vision?.description || content?.vision?.content || "A world where every individual has the opportunity to live a life of dignity, health, and prosperity." 
            },
            { 
              title: content?.values?.title || "Our Values", 
              icon: content?.values?.icon, 
              defaultIcon: <Heart size={32} />,
              content: content?.values?.description || content?.values?.content || "Compassion, Transparency, Innovation, and Inclusivity are the pillars of everything we do." 
            },
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 bg-white rounded-3xl shadow-sm border border-gray-100 text-center space-y-6 flex flex-col h-full"
            >
              <div className="shrink-0 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto overflow-hidden">
                {item.icon && (item.icon.startsWith('/') || item.icon.startsWith('http')) ? (
                  <img src={item.icon} alt={item.title} className="w-10 h-10 object-contain" />
                ) : (
                  item.defaultIcon
                )}
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-serif font-bold text-secondary">{item.title}</h3>
                <SanitizedHTML 
                  html={item.content} 
                  className="text-gray-600 leading-relaxed break-words text-sm md:text-base prose-p:my-0" 
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CEO Message Section */}
      {ceo.title && (
        <section className="section-padding">
          <div className="max-w-7xl mx-auto bg-gray-50 rounded-[3rem] overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch">
              <div className="lg:w-1/2">
                <img 
                  src={ceo.imageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"} 
                  alt={ceo.name} 
                  className="w-full h-full object-cover min-h-[400px]"
                />
              </div>
              <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-serif font-bold text-secondary italic">{ceo.title}</h2>
                  <div className="w-20 h-1.5 bg-accent rounded-full" />
                </div>
                <SanitizedHTML 
                  html={ceo.content} 
                  className="text-lg text-gray-600 leading-relaxed prose-p:mb-4"
                />
                <div>
                  <p className="text-2xl font-serif font-bold text-secondary">{ceo.name}</p>
                  <p className="text-primary font-medium tracking-widest uppercase text-sm">{ceo.role}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Story Section */}
      <section className="section-padding bg-background/50">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl font-serif font-bold text-secondary text-center italic">{content?.story?.title || "Our Journey"}</h2>
          <SanitizedHTML 
            className="prose prose-lg max-w-none prose-serif prose-headings:text-secondary prose-p:text-gray-600"
            html={content?.story?.content || "<p>Founded in 2010, Sitara began as a small group of volunteers...</p>"}
          />
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-serif font-bold text-secondary">Our Dedicated Team</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Meet the passionate individuals working behind the scenes to drive our mission forward.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6">
                    <img 
                      src={member.image || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80"} 
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                      <div className="flex gap-4">
                        {member.socialLinks?.linkedin && (
                          <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary hover:bg-accent hover:text-white transition-all">
                            <Linkedin size={18} />
                          </a>
                        )}
                        {member.socialLinks?.twitter && (
                          <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary hover:bg-accent hover:text-white transition-all">
                            <Twitter size={18} />
                          </a>
                        )}
                        {member.socialLinks?.instagram && (
                          <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary hover:bg-accent hover:text-white transition-all">
                            <Instagram size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-serif font-bold text-secondary group-hover:text-primary transition-colors">{member.name}</h3>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
