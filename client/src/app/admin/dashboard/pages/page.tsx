"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Eye, Settings as SettingsIcon } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { toast } from "react-hot-toast";
import axios from "axios";

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
    hero: { title: "Transforming Lives Through Collective Compassion", subtitle: "SITATRA Association is a global community dedicated to sustainable empowerment.", ctaText: "Start Your Impact", ctaLink: "/donate", imageUrl: "/images/hero-banner.png" },
    impact_stats: { title: "Our Growing Impact", description: "Every number represents a life changed.", items: [{ label: "Lives Impacted", value: "50,000+", icon: "👥" }, { label: "Volunteers", value: "1,200+", icon: "🤝" }] },
    about_preview: { title: "About SITATRA", subtitle: "A Legacy of Hope", description: "SITATRA Association was born from a simple belief.", imageUrl: "https://images.unsplash.com/photo-1509059852496-f3822ae057bf?auto=format&fit=crop&q=80", points: ["Transparency", "Impact"], statValue: "15+", statLabel: "Years" },
    initiatives_preview: { title: "Our Key Initiatives", description: "Focused programs.", items: [{ title: "Education", description: "Quality education", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80" }] },
    cta_banner: { title: "Be the change you wish to see", subtitle: "Your support can provide clean water." }
  },
  about: {
    hero: { title: "Dedicated to Uplifting Humanity", subtitle: "We believe in the power of collective action.", imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80" },
    mission: { content: "To empower marginalized communities through education, healthcare, and sustainable livelihood programs." },
    vision: { content: "A world where every individual has the opportunity to live a life of dignity, health, and prosperity." },
    values: { content: "Compassion, Transparency, Innovation, and Inclusivity are the pillars of everything we do." },
    story: { content: "<p>Founded in 2010, SITATRA began as a small group of volunteers...</p>" }
  },
  initiatives: {
    header: { title: "Our Strategic Initiatives", subtitle: "Focused programs designed to address the most pressing needs of our society." },
    initiatives_list: {
      items: [
        { title: "Education for All", description: "Bridging the literacy gap by providing quality education to underserved children.", icon: "BookOpen", color: "bg-blue-500", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80" },
        { title: "Healthcare Outreach", description: "Bringing essential medical services to remote communities through mobile clinics.", icon: "Stethoscope", color: "bg-red-500", image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80" },
        { title: "Women Empowerment", description: "Supporting women through vocational training and micro-finance opportunities.", icon: "Users", color: "bg-purple-500", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80" }
      ]
    }
  },
  testimonials: {
    header: { 
      title: "Voices of Impact", 
      subtitle: "Hear from the partners, volunteers, and communities that make our work possible.",
      badge: "Testimonials"
    }
  },
  contact: {
    header: { title: "Get In Touch", subtitle: "Have questions about our programs or want to support our mission? Reach out to us." },
    info: {
      address: "123 NGO Street, Community Hub, City, Country",
      phone: "+1 (234) 567-890",
      email: "contact@sitatra.org",
      whatsapp: "1234567890",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970718!3d40.69714942211307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1675176543210!5m2!1sen!2sin"
    }
  },
  volunteer: {
    header: { title: "Join the Movement", subtitle: "Use your skills, passion, and time to make a real difference in the lives of those who need it most." },
    why_join: {
      title: "Why Volunteer with SITATRA?",
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
  donate: {
    header: { 
      badge: "Make a Difference", 
      title: "Your Contribution Changes Lives", 
      description: "Every donation, no matter the size, goes directly towards our mission of empowering communities. We ensure 100% transparency in our funding and project execution." 
    },
    benefits: {
      items: [
        { icon: "Zap", title: "Immediate Impact", desc: "Your donation is put to work right away in our active projects." },
        { icon: "ShieldCheck", title: "Secure Payment", desc: "We use industry-standard encryption to protect your transaction." },
        { icon: "Heart", title: "Tax Deductible", desc: "All donations are eligible for tax benefits under local laws." }
      ]
    },
    monthly_card: {
      title: "Monthly Giving",
      description: "Join our group of monthly supporters and help us plan for long-term sustainable projects.",
      buttonText: "Become a Monthly Donor"
    },
    impact_guide: {
      items: [
        { minAmount: 0, text: "Provides educational supplies for 2 children for a month." },
        { minAmount: 50, text: "Funds a community health check-up camp for 20 families." },
        { minAmount: 200, text: "Supports a clean water well installation for an entire village." }
      ]
    }
  },
  header: {
    navbar: {
      logoText: "SITATRA",
      links: [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Initiatives", href: "/initiatives" },
        { name: "Contact", href: "/contact" },
        { name: "Blog", href: "/blog" }
      ],
      ctaText: "Donate",
      ctaLink: "/donate"
    }
  },
  footer: {
    about: {
      text: "SITATRA Association is dedicated to uplifting communities through sustainable development, education, and healthcare initiatives. Together, we create lasting change."
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
      email: "contact@sitatra.org"
    },
    bottom: {
      copyright: "© 2026 SITATRA Association. All Rights Reserved."
    }
  },
  terms: {
    header: { title: "Terms & Conditions", lastUpdated: "April 29, 2026" },
    main_content: {
      content: `
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our site.</p>
        <h2>2. Donations</h2>
        <p>All donations made through our website are final. SITATRA Association is a registered non-profit organization, and your donation may be tax-deductible according to your local laws.</p>
        <h2>3. Intellectual Property</h2>
        <p>The content, logos, and images on this website are the property of SITATRA Association and are protected by copyright laws.</p>
        <h2>4. Limitation of Liability</h2>
        <p>SITATRA Association shall not be liable for any direct, indirect, or consequential damages arising from your use of this website.</p>
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
        <p>At SITATRA Association, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.</p>
        <h2>2. Information We Collect</h2>
        <p>We may collect personal information such as your name, email address, phone number, and payment details when you donate or interact with our services.</p>
        <h2>3. How We Use Your Information</h2>
        <p>Your information is used to process donations, send impact updates, and improve our services. We do not sell your personal information.</p>
        <h2>4. Security</h2>
        <p>We implement industry-standard security measures to protect your data.</p>
        <h2>5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@sitatra.org.</p>
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
      const { data } = await axios.get(`${API_URL}/content/${selectedPage}`);
      if (data && data.sections && Object.keys(data.sections).length > 0) {
        setSections(data.sections);
      } else {
        // Automatically load template if empty
        setSections(DEFAULT_TEMPLATES[selectedPage] || { hero: { title: `Welcome to ${selectedPage}`, subtitle: "New page content" } });
      }
    } catch (error) {
      console.log("Error or 404, using template for", selectedPage);
      setSections(DEFAULT_TEMPLATES[selectedPage] || { hero: { title: `Welcome to ${selectedPage}`, subtitle: "New page content" } });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/content/${selectedPage}`, { sections }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)} page updated successfully!`);
    } catch (error) {
      toast.error("Failed to save changes");
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
        // Handle nested paths like "items.0.title"
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

  const deleteSection = (sectionKey: string) => {
    if (!confirm(`Are you sure you want to delete the ${sectionKey} section?`)) return;
    setSections((prev: any) => {
      const newSections = { ...prev };
      delete newSections[sectionKey];
      return newSections;
    });
  };

  const addSection = () => {
    const sectionName = prompt("Enter section name (e.g., custom_info):");
    if (sectionName) {
      setSections((prev: any) => ({
        ...prev,
        [sectionName.toLowerCase().replace(/\s+/g, "_")]: { title: "", content: "" }
      }));
    }
  };

  const handleImageUpload = async (sectionKey: string, field: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_URL}/media/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });
      updateSectionField(sectionKey, field, data.url);
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

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
              <button 
                onClick={() => deleteSection(sectionKey)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {Object.entries(sections[sectionKey]).map(([field, value]: [string, any]) => (
                <div key={field} className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {field.replace(/_/g, " ")}
                  </label>
                  
                  {Array.isArray(value) ? (
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(item).map(([subField, subValue]: [string, any]) => (
                              <div key={subField}>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">{subField}</label>
                                {subField.toLowerCase().includes("image") ? (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={subValue}
                                      onChange={(e) => {
                                        const newArr = [...value];
                                        newArr[idx] = { ...newArr[idx], [subField]: e.target.value };
                                        updateSectionField(sectionKey, field, newArr);
                                      }}
                                      className="flex-1 px-3 py-1 rounded border border-gray-200 text-sm outline-none"
                                    />
                                    <input
                                      type="file"
                                      id={`upload-${sectionKey}-${idx}-${subField}`}
                                      className="hidden"
                                      onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                          handleImageUpload(sectionKey, `${field}.${idx}.${subField}`, e.target.files[0]);
                                        }
                                      }}
                                    />
                                    <label 
                                      htmlFor={`upload-${sectionKey}-${idx}-${subField}`}
                                      className="cursor-pointer bg-accent text-secondary px-3 py-1 rounded text-[10px] font-bold"
                                    >
                                      Upload
                                    </label>
                                  </div>
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
                            ))}
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newItem = value.length > 0 ? Object.fromEntries(Object.keys(value[0]).map(k => [k, ""])) : {};
                          updateSectionField(sectionKey, field, [...value, newItem]);
                        }}
                        className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-primary hover:text-primary transition-all text-xs font-bold"
                      >
                        + Add Item
                      </button>
                    </div>
                  ) : field.toLowerCase().includes("content") || field.toLowerCase().includes("description") ? (
                    <RichTextEditor
                      value={value}
                      onChange={(val) => updateSectionField(sectionKey, field, val)}
                    />
                  ) : field.toLowerCase().includes("image") ? (
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateSectionField(sectionKey, field, e.target.value)}
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary outline-none"
                        />
                      </div>
                      <input
                        type="file"
                        id={`upload-${sectionKey}`}
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(sectionKey, field, e.target.files[0])}
                      />
                      <label 
                        htmlFor={`upload-${sectionKey}`}
                        className="cursor-pointer bg-accent text-secondary px-4 py-2 rounded-md hover:bg-accent-dark transition-all flex items-center gap-2 text-sm font-bold shadow-sm"
                      >
                        <Plus size={16} /> Upload
                      </label>
                    </div>
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

        <button 
          onClick={addSection}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add New Section
        </button>
      </div>
    </div>
  );
}

// Minimal helper to fix the 'cn' import in this demo
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
