"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import axios from "axios";

import SanitizedHTML from "@/components/ui/SanitizedHTML";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

import { PageLoader } from "@/components/ui/Loading";

export default function PrivacyPolicy() {
  const [content, setContent] = useState<any>({
    header: {
      title: "Privacy Policy",
      lastUpdated: "April 29, 2026"
    },
    main_content: {
      content: `
        <h2>1. Introduction</h2>
        <p>At Sitara Association, we are committed to protecting your privacy.</p>
        <h2>2. Information We Collect</h2>
        <p>We may collect personal information such as your name, email address, and phone number.</p>
        <h2>3. How We Use Your Information</h2>
        <p>Your information is used to process donations and communicate our impact.</p>
      `
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/privacy`);
        if (data.sections) setContent(data.sections);
      } catch (error) {
        console.error("Error fetching privacy content:", error);
      }
    };
    fetchContent();
  }, []);

  const header = content.header;
  const main_content = content.main_content;

  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <section className="section-padding max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-4">{header.title}</h1>
        <p className="font-bold text-primary mb-12">Last updated: {header.lastUpdated}</p>
        
        <SanitizedHTML 
          className="prose prose-lg prose-serif max-w-none text-gray-600 prose-headings:text-secondary prose-strong:text-secondary"
          html={main_content.content}
        />
      </section>
      <Footer />
    </main>
  );
}
