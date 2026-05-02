"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import axios from "axios";

import SanitizedHTML from "@/components/ui/SanitizedHTML";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

import { PageLoader } from "@/components/ui/Loading";

export default function Terms() {
  const [content, setContent] = useState<any>({
    header: {
      title: "Terms & Conditions",
      lastUpdated: "April 29, 2026"
    },
    main_content: {
      content: `
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our site.</p>
        <h2>2. Donations</h2>
        <p>All donations made through our website are final. Sitara Association is a registered non-profit organization.</p>
        <h2>3. Intellectual Property</h2>
        <p>The content, logos, and images on this website are the property of Sitara Association.</p>
      `
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/content/terms`);
        if (data.sections) setContent(data.sections);
      } catch (error) {
        console.error("Error fetching terms content:", error);
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
