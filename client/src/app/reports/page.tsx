"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, Download, Eye, Calendar, Search } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { ENV } from "@/config/env";
import { PageLoader } from "@/components/ui/Loading";

const API_URL = ENV.API_URL;

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Annual" | "Financial">("All");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/reports`);
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = activeTab === "All" 
    ? reports 
    : reports.filter(r => r.type === activeTab);

  if (loading) return (
    <main className="min-h-screen pt-20">
      <Navbar />
      <PageLoader />
      <Footer />
    </main>
  );

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-20 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <span className="bg-accent/20 text-accent px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">Transparency</span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">Financial & Annual Reports</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We believe in complete transparency. Access our past reports to see how your contributions are making a difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-12 border-b border-gray-100 sticky top-20 bg-white z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-4">
          {["All", "Annual", "Financial"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                activeTab === tab 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {tab} Reports
            </button>
          ))}
        </div>
      </section>

      {/* Reports Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-6">
          {filteredReports.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <FileText className="mx-auto text-gray-200 mb-4" size={64} />
              <p className="text-gray-400 font-medium">No reports found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <FileText size={28} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                      {report.year}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-sm font-bold text-primary mb-6">{report.type} Report</p>
                  
                  <div className="flex gap-4">
                    <a 
                      href={report.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-white font-bold hover:bg-secondary-dark transition-all"
                    >
                      <Eye size={18} /> View
                    </a>
                    <a 
                      href={report.fileUrl} 
                      download
                      className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-100 text-gray-400 hover:border-primary hover:text-primary transition-all"
                    >
                      <Download size={20} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
