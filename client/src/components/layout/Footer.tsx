"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { FacebookIcon, InstagramIcon, TwitterIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

export default function Footer() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const timestamp = new Date().getTime();
        const { data } = await axios.get(`${API_URL}/content/footer?t=${timestamp}`);
        if (data.sections) setContent(data.sections);
      } catch (error) {
        console.error("Error fetching footer:", error);
      }
    };
    fetchContent();
  }, []);

  const about = content?.about || {
    logoImage: "/images/logo.png"
  };
  
  const socialLinks = content?.social_links || {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    whatsapp: "#",
    email: "contact@sitara.org"
  };

  const quickLinks = content?.quick_links?.items || [
    { name: "Our Story", href: "/about" },
    { name: "Initiatives", href: "/initiatives" },
    { name: "Become a Volunteer", href: "/volunteer" },
    { name: "Donate Now", href: "/donate" },
    { name: "Latest News", href: "/blog" },
  ];

  const contact = content?.contact_info || {
    address: "123 NGO Street, Community Hub, City, Country",
    phone: "+1 (234) 567-890",
    email: "contact@sitara.org"
  };

  const bottom = content?.bottom || {
    copyright: "© 2026 Sitara Association. All Rights Reserved."
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    if (!email) return;

    try {
      await axios.post(`${API_URL}/submissions/newsletter`, { email });
      toast.success("Subscribed successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Subscription failed");
    }
  };

  return (
    <footer className="bg-secondary text-white pt-16 pb-8 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* About */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 group">
            {about.logoImage ? (
              <img
                src={about.logoImage}
                alt="Logo"
                className="h-28 w-auto object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
                  <Heart className="text-secondary w-6 h-6 fill-current" />
                </div>
                <span className="text-2xl font-serif font-bold group-hover:text-accent transition-colors">Sitara</span>
              </>
            )}
          </Link>
          <div className="flex gap-4">
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><FacebookIcon size={20} /></a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><InstagramIcon size={20} /></a>
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><TwitterIcon size={20} /></a>
            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><WhatsAppIcon size={20} /></a>
            <a href={`mailto:${socialLinks.email}`} className="hover:text-accent transition-colors"><Mail size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-serif font-bold mb-6 text-accent">Quick Links</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            {quickLinks.map((link: any) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white transition-colors">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-serif font-bold mb-6 text-accent">Contact Us</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-accent shrink-0" />
              <span>{contact.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-accent shrink-0" />
              <span>{contact.phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle size={18} className="text-accent shrink-0" />
              <span>{contact.whatsapp || "WhatsApp"}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-accent shrink-0" />
              <span>{contact.email}</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-serif font-bold mb-6 text-accent">Newsletter</h4>
          <p className="text-gray-300 text-sm mb-4">Subscribe to receive updates on our impact and stories.</p>
          <form onSubmit={handleNewsletter} className="space-y-3">
            <input
              required
              name="email"
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:border-accent text-white"
            />
            <button type="submit" className="w-full btn-primary !bg-accent !text-secondary !hover:bg-accent-dark">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
        <p>{bottom.copyright}</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
