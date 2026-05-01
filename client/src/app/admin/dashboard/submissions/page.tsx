"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, User, Calendar, Trash2, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function Submissions() {
  const [activeTab, setActiveTab] = useState("contact");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/submissions/${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-secondary">Submissions Viewer</h1>
        <p className="text-gray-500">Manage contact inquiries and volunteer applications.</p>
      </div>

      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-6 py-3 font-medium transition-all border-b-2 ${
            activeTab === "contact" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-secondary"
          }`}
        >
          Contact Inquiries
        </button>
        <button
          onClick={() => setActiveTab("volunteer")}
          className={`px-6 py-3 font-medium transition-all border-b-2 ${
            activeTab === "volunteer" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-secondary"
          }`}
        >
          Volunteer Applications
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No submissions found.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {submissions.map((sub) => (
              <div key={sub._id} className="p-8 hover:bg-gray-50 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary text-lg">{sub.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Mail size={14} /> {sub.email}
                        {sub.phone && <span>• {sub.phone}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      sub.status === 'unread' || sub.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {sub.status}
                    </span>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} /> {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="pl-16 space-y-4">
                  {sub.subject && <h5 className="font-bold text-secondary">Subject: {sub.subject}</h5>}
                  {sub.areaOfInterest && <p className="font-bold text-primary">Area: {sub.areaOfInterest}</p>}
                  <p className="text-gray-600 bg-gray-100/50 p-4 rounded-xl italic">
                    "{sub.message || sub.motivation}"
                  </p>
                  
                  <div className="flex gap-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                      <CheckCircle size={16} /> Mark as Read
                    </button>
                    <button className="flex items-center gap-2 text-sm font-bold text-red-400 hover:underline">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
