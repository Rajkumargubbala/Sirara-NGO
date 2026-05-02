"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Eye, Settings as SettingsIcon, Image as ImageIcon } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { toast } from "react-hot-toast";
import axios from "axios";
import { cn } from "@/lib/utils";

import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

const PAGES = [
  "home",
  "about",
  "initiatives",
  "testimonials",
  "gallery",
  "blog",
  "contact",
  "volunteer",
  "donate",
  "terms",
  "privacy",
  "header",
  "footer"
];

const DEFAULT_TEMPLATES: Record<string, any> = {
  home: {
    hero: { title: "Transforming Lives Through Collective Compassion", subtitle: "Sitara Association is a global community dedicated to sustainable empowerment.", ctaText: "Start Your Impact", ctaLink: "/donate", imageUrl: "/images/hero-banner.png" },
    impact_stats: {
      title: "Our Growing Impact",
      description: "Every number represents a life changed and a community strengthened.",
      items: [
        { label: "Lives Impacted", value: "50,000+", icon: "👥", description: "Across 20+ countries" },
        { label: "Volunteers", value: "1,200+", icon: "🤝", description: "Dedicated change makers" },
        { label: "Projects", value: "150+", icon: "📊", description: "Sustainable initiatives" },
        { label: "Communities", value: "25+", icon: "🏘️", description: "Local partnerships" }
      ]
    },
    about_preview: {
      title: "About Sitara",
      subtitle: "A Legacy of Hope",
      description: "Sitara Association was born from a simple belief.",
      imageUrl: "https://images.unsplash.com/photo-1509059852496-f3822ae057bf?auto=format&fit=crop&q=80",
      points: ["Transparency", "Impact"],
      statValue: "15+",
      statLabel: "Years",
      ctaText: "Discover Our Journey",
      ctaLink: "/about"
    },
    initiatives_preview: { title: "Our Key Initiatives", description: "Focused programs." },
    cta_banner: {
      title: "Be the change you wish to see",
      subtitle: "Your support can provide clean water.",
      btn1Text: "Donate Now",
      btn1Link: "/donate",
      btn2Text: "Join as Volunteer",
      btn2Link: "/volunteer"
    },
    social_feed: {
      title: "Latest Updates",
      embedCode1: "Paste 1st LinkedIn iframe here...",
      embedCode2: "Paste 2nd LinkedIn iframe here...",
      embedCode3: "Paste 3rd LinkedIn iframe here..."
    }
  },
  about: {
    hero: { title: "Dedicated to Uplifting Humanity", subtitle: "We believe in the power of collective action.", imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80" },
    mission: { title: "Our Mission", icon: "/icons/mission.png", description: "To empower marginalized communities through education, healthcare, and sustainable livelihood programs." },
    vision: { title: "Our Vision", icon: "/icons/vision.png", description: "A world where every individual has the opportunity to live a life of dignity, health, and prosperity." },
    values: { title: "Our Values", icon: "/icons/values.png", description: "Compassion, Transparency, Innovation, and Inclusivity are the pillars of everything we do." },
    story: { title: "Our Journey", content: "<p>Founded in 2010, Sitara began as a small group of volunteers...</p>" }
  },
  initiatives: {
    header: { title: "Our Strategic Initiatives", subtitle: "Focused programs designed to address the most pressing needs of our society." },
    initiatives_list: {
      items: [
        { title: "Education for All", description: "Bridging the literacy gap by providing quality education to underserved children.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80", fullStory: "<p>Detailed story about education...</p>", ctaText: "View Full Story", ctaLink: "/initiatives/education-for-all" },
        { title: "Healthcare Outreach", description: "Bringing essential medical services to remote communities through mobile clinics.", image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80", fullStory: "<p>Detailed story about healthcare...</p>", ctaText: "View Full Story", ctaLink: "/initiatives/healthcare-outreach" },
        { title: "Women Empowerment", description: "Supporting women through vocational training and micro-finance opportunities.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80", fullStory: "<p>Detailed story about women empowerment...</p>", ctaText: "View Full Story", ctaLink: "/initiatives/women-empowerment" }
      ]
    }
  },
  testimonials: {
    header: {
      title: "Voices of Impact",
      subtitle: "Hear from the partners, volunteers, and communities that make our work possible."
    }
  },
  blog: {
    header: { 
      title: "Voices of Sitara", 
      subtitle: "Stories of change, community impact, and the journey of our mission." 
    }
  },
  contact: {
    header: { title: "Get In Touch", subtitle: "Have questions about our programs or want to support our mission? Reach out to us." },
    info: {
      address: "123 NGO Street, Community Hub, City, Country",
      phone: "+1 (234) 567-890",
      email: "contact@sitara.org",
      whatsapp: "1234567890",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970718!3d40.69714942211307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1675176543210!5m2!1sen!2sin"
    }
  },
  volunteer: {
    header: { title: "Join the Movement", subtitle: "Use your skills, passion, and time to make a real difference in the lives of those who need it most." },
    why_join: {
      title: "Why Volunteer with Sitara?",
      description: "Volunteering is at the core of our organization. Whether you're a professional looking to donate your skills or a student eager to learn, there's a place for you here.",
      benefits: [
        { title: "Skill Development", desc: "Gain practical experience in community development and NGO management." },
        { title: "Global Network", desc: "Connect with like-minded individuals from around the world." },
        { title: "Local Impact", desc: "See the direct results of your efforts in the communities we serve." },
        { title: "Certificates", desc: "Receive official recognition for your contribution and impact." },
      ]
    },
    opportunities: {
      title: "Current Opportunities",
      items: [
        { title: "Community Health Educator", tag: "Urgent" },
        { title: "Digital Literacy Tutor", tag: "Remote" },
        { title: "Content Creator & Storyteller", tag: "Flexible" },
        { title: "Event Coordinator", tag: "Part-time" },
      ]
    }
  },
  gallery: {
    header: { 
      title: "Our Visual Journey", 
      subtitle: "Explore the moments and milestones that define our impact across communities." 
    },
    categories: {
      items: [
        { name: "Education", slug: "education" },
        { name: "Healthcare", slug: "healthcare" },
        { name: "Community", slug: "community" }
      ]
    }
  },
  donate: {
    header: {
      title: "Your Contribution Changes Lives",
      description: "Every donation, no matter the size, goes directly towards our mission of empowering communities. We ensure 100% transparency in our funding and project execution.",
      quotation: "We believe that every person deserves the opportunity to thrive. Your support helps us provide the tools and resources needed to create lasting change."
    }
  },
  header: {
    navbar: {
      logoImage: "/images/logo.png",
      links: [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Initiatives", href: "/initiatives" },
        { name: "Testimonials", href: "/testimonials" },
        { name: "Reports", href: "/reports" },
        { name: "Blog", href: "/blog" },
        { name: "Gallery", href: "/gallery" },
        { name: "Contact", href: "/contact" }
      ],
      ctaText: "Donate",
      ctaLink: "/donate"
    }
  },
  footer: {
    about: {
      logoImage: "/images/logo.png"
    },
    social_links: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://wa.me/1234567890",
      email: "contact@sitara.org"
    },
    quick_links: {
      items: [
        { name: "Our Story", href: "/about" },
        { name: "Initiatives", href: "/initiatives" },
        { name: "Become a Volunteer", href: "/volunteer" },
        { name: "Donate Now", href: "/donate" }
      ]
    },
    contact_info: {
      address: "123 NGO Street, Community Hub, City, Country",
      phone: "+1 (234) 567-890",
      whatsapp: "1234567890",
      email: "contact@sitara.org"
    },
    bottom: {
      copyright: "© 2026 Sitara Association. All Rights Reserved."
    }
  },
  terms: {
    header: { title: "Terms & Conditions", lastUpdated: "April 29, 2026" },
    main_content: {
      content: `
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our site.</p>
        <h2>2. Donations</h2>
        <p>All donations made through our website are final. Sitara Association is a registered non-profit organization, and your donation may be tax-deductible according to your local laws.</p>
        <h2>3. Intellectual Property</h2>
        <p>The content, logos, and images on this website are the property of Sitara Association and are protected by copyright laws.</p>
        <h2>4. Limitation of Liability</h2>
        <p>Sitara Association shall not be liable for any direct, indirect, or consequential damages arising from your use of this website.</p>
        <h2>5. Governing Law</h2>
        <p>These terms are governed by and construed in accordance with the laws of the jurisdiction where the NGO is registered.</p>
      `
    }
  },
  privacy: {
    header: { title: "Privacy Policy", lastUpdated: "April 29, 2026" },
    main_content: {
      content: `
        <h2>1. Introduction</h2>
        <p>At Sitara Association, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.</p>
        <h2>2. Information We Collect</h2>
        <p>We may collect personal information such as your name, email address, phone number, and payment details when you donate or interact with our services.</p>
        <h2>3. How We Use Your Information</h2>
        <p>Your information is used to process donations, send impact updates, and improve our services. We do not sell your personal information.</p>
        <h2>4. Security</h2>
        <p>We implement industry-standard security measures to protect your data.</p>
        <h2>5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@sitara.org.</p>
      `
    }
  }
};

export default function ManagePages() {
  const [selectedPage, setSelectedPage] = useState("home");
  const [sections, setSections] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPageContent();
  }, [selectedPage]);

  const fetchPageContent = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const { data } = await axios.get(`${API_URL}/content/${selectedPage}?t=${timestamp}`);
      const template = DEFAULT_TEMPLATES[selectedPage] || {};

      if (data && data.sections) {
        // Merge fetched sections with template to ensure new fields show up
        const mergedSections = { ...template };
        Object.keys(data.sections).forEach(key => {
          const sectionData = data.sections[key];
          const templateData = template[key] || {};

          mergedSections[key] = { ...templateData, ...sectionData };

          // Force items from template if they are empty in the DB
          if (templateData.items && (!sectionData.items || sectionData.items.length === 0)) {
            mergedSections[key].items = templateData.items;
          }
        });
        setSections(mergedSections);
      } else {
        setSections(template);
      }
    } catch (error) {
      setSections(DEFAULT_TEMPLATES[selectedPage] || {});
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please login again.");
        return;
      }

      await axios.post(`${API_URL}/content/${selectedPage}`, { sections }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      toast.success(`${selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)} page updated successfully!`);
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const updateSectionField = (sectionKey: string, field: string, value: any) => {
    setSections((prev: any) => {
      const newSections = { ...prev };
      const fieldsArr = field.split('.');

      if (fieldsArr.length === 1) {
        newSections[sectionKey] = {
          ...newSections[sectionKey],
          [field]: value
        };
      } else {
        let current = newSections[sectionKey];
        for (let i = 0; i < fieldsArr.length - 1; i++) {
          const key = fieldsArr[i];
          current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
          current = current[key];
        }
        current[fieldsArr[fieldsArr.length - 1]] = value;
      }

      return newSections;
    });
  };

  const handleImageUpload = async (sectionKey: string, field: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_URL}/media/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      updateSectionField(sectionKey, field, data.url);
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const ImageField = ({ value, onChange, onUpload }: { value: string, onChange: (val: string) => void, onUpload: (file: File) => void }) => (
    <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-2xl border border-gray-100 shadow-sm">
      {value ? (
        <div className="relative w-16 h-12 rounded-xl overflow-hidden border bg-white shrink-0 shadow-sm group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            title="Remove Image"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ) : (
        <div className="w-16 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 shrink-0">
          <ImageIcon size={20} />
        </div>
      )}
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-transparent border-none outline-none text-xs text-gray-500 font-mono truncate"
          placeholder="Paste URL or upload..."
        />
      </div>
      <div className="shrink-0 flex items-center gap-2 pr-2">
        <input
          type="file"
          id={`upload-${Math.random()}`}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        />
        <label
          onClick={(e) => {
            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
            input.click();
          }}
          className="cursor-pointer bg-white text-secondary px-3 py-2 rounded-xl hover:bg-accent hover:text-white transition-all flex items-center gap-2 text-[10px] font-bold border border-gray-100 shadow-sm"
        >
          <Plus size={14} /> Upload
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Manage Pages</h1>
          <p className="text-gray-500">Edit dynamic content for your website pages.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline flex items-center gap-2 py-2">
            <Eye size={18} />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary flex items-center gap-2 py-2"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Page to Edit</label>
        <div className="flex gap-2">
          {PAGES.map((page) => (
            <button
              key={page}
              onClick={() => setSelectedPage(page)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                selectedPage === page
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="space-y-6">
        {loading && (
          <div className="py-20 text-center text-gray-400">Loading page content...</div>
        )}

        {!loading && Object.keys(sections).length === 0 && (
          <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <SettingsIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-secondary">No content available</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Click below to initialize this page with a template.</p>
            <button
              onClick={() => setSections(DEFAULT_TEMPLATES[selectedPage] || { hero: { title: "Welcome" } })}
              className="px-6 py-2 bg-primary text-white rounded-lg font-bold"
            >
              Initialize Template
            </button>
          </div>
        )}

        {Object.keys(sections).map((sectionKey) => (
          <div key={sectionKey} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-serif font-bold text-secondary uppercase tracking-wider">
                {sectionKey.replace("_", " ")} Section
              </h3>
            </div>

            <div className="space-y-6">
              {Object.entries(sections[sectionKey])
                .filter(([field]) => {
                  if (field.startsWith('_') || field === '__v') return false;
                  // Hero should not have items or points
                  if (sectionKey === 'hero' && (field === 'items' || field === 'points')) return false;
                  // Points should ONLY appear in about_preview
                  if (field === 'points' && sectionKey !== 'about_preview') return false;
                  // Impact Stats should not have points
                  if (sectionKey === 'impact_stats' && field === 'points') return false;
                  // About Preview should not have items
                  if (sectionKey === 'about_preview' && field === 'items') return false;
                  // Initiatives Preview should not have items or featured_titles
                  if (sectionKey === 'initiatives_preview' && (field === 'items' || field === 'featured_titles')) return false;
                  // About Mission/Vision/Values/Story should not have 'items' (redundant)
                  if ((sectionKey === 'mission' || sectionKey === 'vision' || sectionKey === 'values' || sectionKey === 'story') && field === 'items') return false;
                  // About Mission/Vision/Values should not have 'content' (redundant - they use description)
                  if ((sectionKey === 'mission' || sectionKey === 'vision' || sectionKey === 'values') && field === 'content') return false;
                  // Header sections should not have items (redundant)
                  if (sectionKey === 'header' && field === 'items') return false;
                  // CTA Banner should not have items
                  if (sectionKey === 'cta_banner' && field === 'items') return false;
                  // Footer About should not have text
                  if (selectedPage === 'footer' && sectionKey === 'about' && field === 'text') return false;
                  return true;
                })
                .map(([field, value]: [string, any]) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {field.replace(/_/g, " ")}
                    </label>

                    {Array.isArray(value) && !(field === "items" && (sectionKey === "header" || sectionKey === "hero" || selectedPage === "testimonials")) ? (
                      <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl">
                        {value.map((item, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm space-y-4 relative group">
                            <button
                              onClick={() => {
                                const newArr = [...value];
                                newArr.splice(idx, 1);
                                updateSectionField(sectionKey, field, newArr);
                              }}
                              className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                            <div className={typeof value[0] === 'object' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-2"}>
                              {typeof value[0] === 'object' ? (
                                Object.entries(item)
                                  .filter(([subField]) => {
                                    if (sectionKey === 'initiatives_list' || sectionKey === 'initiatives') {
                                      if (subField === 'icon' || subField === 'color') return false;
                                    }
                                    return !subField.startsWith('_') && subField !== '__v';
                                  })
                                  .map(([subField, subValue]: [string, any]) => (
                                    <div key={subField} className="space-y-1">
                                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{subField}</label>
                                      {subField.toLowerCase().includes("image") || subField.toLowerCase().includes("icon") ? (
                                        <ImageField
                                          value={subValue}
                                          onChange={(val) => {
                                            const newArr = [...value];
                                            newArr[idx] = { ...newArr[idx], [subField]: val };
                                            updateSectionField(sectionKey, field, newArr);
                                          }}
                                          onUpload={(file) => handleImageUpload(sectionKey, `${field}.${idx}.${subField}`, file)}
                                        />
                                      ) : subField.toLowerCase().includes("description") || subField.toLowerCase().includes("content") || subField.toLowerCase().includes("story") ? (
                                        <RichTextEditor
                                          value={subValue}
                                          onChange={(val) => {
                                            const newArr = [...value];
                                            newArr[idx] = { ...newArr[idx], [subField]: val };
                                            updateSectionField(sectionKey, field, newArr);
                                          }}
                                        />
                                      ) : (
                                        <input
                                          type="text"
                                          value={subValue}
                                          onChange={(e) => {
                                            const newArr = [...value];
                                            newArr[idx] = { ...newArr[idx], [subField]: e.target.value };
                                            updateSectionField(sectionKey, field, newArr);
                                          }}
                                          className="w-full px-3 py-1 rounded border border-gray-200 text-sm outline-none"
                                        />
                                      )}
                                    </div>
                                  ))
                              ) : (
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => {
                                    const newArr = [...value];
                                    newArr[idx] = e.target.value;
                                    updateSectionField(sectionKey, field, newArr);
                                  }}
                                  className="w-full px-3 py-1 rounded border border-gray-200 text-sm outline-none"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                        {!(sectionKey === "impact_stats" && value.length >= 4) &&
                          !(sectionKey === "header") &&
                          !(sectionKey === "about_preview" && field === "points" && value.length >= 4) && (
                            <button
                              onClick={() => {
                                const newItem = value.length > 0
                                  ? (typeof value[0] === 'object' ? Object.fromEntries(Object.keys(value[0]).map(k => [k, ""])) : "")
                                  : "";
                                updateSectionField(sectionKey, field, [...value, newItem]);
                              }}
                              className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-primary hover:text-primary transition-all text-xs font-bold"
                            >
                              + Add Item
                            </button>
                          )}
                      </div>
                    ) : (sectionKey === 'mission' || sectionKey === 'vision' || sectionKey === 'values') && (field === 'description' || field === 'content') ? (
                      <div className="space-y-2">
                        <textarea
                          value={value}
                          maxLength={150}
                          onChange={(e) => updateSectionField(sectionKey, field, e.target.value)}
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary outline-none min-h-[100px]"
                          placeholder={`Enter ${field}...`}
                        />
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className={value?.length >= 150 ? "text-red-500" : "text-gray-400"}>
                            Characters: {value?.length || 0} / 150
                          </span>
                          <span className="text-gray-400">
                            Remaining: {150 - (value?.length || 0)}
                          </span>
                        </div>
                      </div>
                    ) : field.toLowerCase().includes("content") || field.toLowerCase().includes("description") ? (
                      <RichTextEditor
                        value={value}
                        onChange={(val) => updateSectionField(sectionKey, field, val)}
                      />
                    ) : field.toLowerCase().includes("image") || field.toLowerCase().includes("icon") ? (
                      <ImageField
                        value={value}
                        onChange={(val) => updateSectionField(sectionKey, field, val)}
                        onUpload={(file) => handleImageUpload(sectionKey, field, file)}
                      />
                    ) : field.toLowerCase().includes("embed") ? (
                      <textarea
                        value={value}
                        onChange={(e) => updateSectionField(sectionKey, field, e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary outline-none font-mono text-sm h-32"
                        placeholder="Paste iframe code here..."
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateSectionField(sectionKey, field, e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary outline-none"
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Removed Add New Section button */}
      </div>
    </div>
  );
}
