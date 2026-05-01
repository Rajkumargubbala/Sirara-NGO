"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function Contact() {
  const [content, setContent] = useState<any>({
    header: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you. Reach out with any questions or collaboration ideas."
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/contact`);
        if (data.sections) {
          setContent(data.sections);
        }
      } catch (error) {
        console.error("Error fetching contact content:", error);
      }
    };
    fetchContent();
  }, []);

  const header = content?.header || {
    badge: "Contact Us",
    title: "Get In Touch",
    subtitle: "Have questions about our programs or want to support our mission? Reach out to us.",
  };

  const info = content?.info || {
    address: "123 NGO Street, Community Hub, City, Country",
    phone: "+1 (234) 567-890",
    email: "contact@sitatra.org",
    whatsapp: "1234567890",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970718!3d40.69714942211307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1675176543210!5m2!1sen!2sin"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      await axios.post(`${API_URL}/submissions/contact`, data);
      toast.success("Message sent successfully! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error("Contact submission error:", error);
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      {/* Header */}
      <section className="bg-secondary text-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            {header.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            {header.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
        >
          <h2 className="text-3xl font-serif font-bold text-secondary mb-8">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input required name="name" type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary outline-none transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input required name="email" type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary outline-none transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <input required name="subject" type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary outline-none transition-all" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea required name="message" rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary outline-none transition-all resize-none" placeholder="Your message here..." />
            </div>
            <button
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg"
            >
              {loading ? "Sending..." : (
                <>
                  Send Message
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div>
            <h2 className="text-3xl font-serif font-bold text-secondary mb-8">Contact Information</h2>
            <div className="space-y-8">
              {[
                { icon: MapPin, title: "Our Location", detail: info.address },
                { icon: Phone, title: "Phone Number", detail: info.phone },
                { icon: Mail, title: "Email Address", detail: info.email },
              ].map((item) => (
                <div key={item.title} className="flex gap-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-lg">{item.title}</h4>
                    <p className="text-gray-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-accent/10 rounded-2xl border border-accent/20">
            <h3 className="text-xl font-serif font-bold text-secondary mb-4 flex items-center gap-2">
              <MessageCircle className="text-primary" />
              Chat With Us
            </h3>
            <p className="text-gray-700 mb-6">Need an immediate response? Our team is available on WhatsApp for quick inquiries.</p>
            <a
              href={`https://wa.me/${info.whatsapp}`}
              target="_blank"
              className="inline-flex items-center gap-2 font-bold text-primary hover:underline"
            >
              Start WhatsApp Chat →
            </a>
          </div>

          {/* Map Embed Placeholder */}
          <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden grayscale">
            <iframe
              src={info.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
