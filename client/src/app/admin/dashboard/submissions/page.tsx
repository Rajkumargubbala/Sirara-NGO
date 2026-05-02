"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, User, Calendar, Trash2, CheckCircle, Clock, Phone } from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function Submissions() {
  const [activeTab, setActiveTab] = useState("contact");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

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

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/submissions/${activeTab}/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Status updated");
      fetchSubmissions();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/submissions/${activeTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted successfully");
      fetchSubmissions();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const filteredSubmissions = submissions.filter(sub =>
    statusFilter === "all" || sub.status === statusFilter
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Submissions Viewer</h1>
          <p className="text-gray-500">Manage contact inquiries and volunteer applications.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm font-bold text-secondary outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="contacted">Contacted</option>
              <option value="read">Read</option>
              {activeTab === 'volunteer' && (
                <>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </>
              )}
            </select>
          </div>

          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => { setActiveTab("contact"); setStatusFilter("all"); }}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === "contact" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-secondary"
                }`}
            >
              Contact
            </button>
            <button
              onClick={() => { setActiveTab("volunteer"); setStatusFilter("all"); }}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === "volunteer" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-secondary"
                }`}
            >
              Volunteers
            </button>
            <button
              onClick={() => { setActiveTab("newsletter"); setStatusFilter("all"); }}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === "newsletter" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-secondary"
                }`}
            >
              Newsletter
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            Loading submissions...
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No submissions found matching this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-5 font-bold text-secondary text-sm uppercase tracking-wider">Date</th>
                  <th className="p-5 font-bold text-secondary text-sm uppercase tracking-wider">
                    {activeTab === 'newsletter' ? 'Subscriber' : 'Name & Contact'}
                  </th>
                  {activeTab === 'volunteer' && <th className="p-5 font-bold text-secondary text-sm uppercase tracking-wider">Area</th>}
                  {activeTab !== 'newsletter' && <th className="p-5 font-bold text-secondary text-sm uppercase tracking-wider">Message</th>}
                  <th className="p-5 font-bold text-secondary text-sm uppercase tracking-wider">Status</th>
                  <th className="p-5 font-bold text-secondary text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-secondary">{sub.name || 'Subscriber'}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Mail size={12} /> {sub.email}
                      </div>
                      {sub.phone && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Phone size={12} /> {sub.phone}
                        </div>
                      )}
                    </td>
                    {activeTab === 'volunteer' && (
                      <td className="p-5 text-sm font-medium text-primary whitespace-nowrap">
                        {sub.areaOfInterest}
                      </td>
                    )}
                    {activeTab !== 'newsletter' && (
                      <td className="p-5 max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2 italic">
                          "{sub.message || sub.motivation}"
                        </p>
                      </td>
                    )}
                    <td className="p-5">
                      <select
                        value={sub.status}
                        onChange={(e) => updateStatus(sub._id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-none outline-none cursor-pointer transition-all ${sub.status === 'unread' || sub.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : sub.status === 'contacted'
                              ? 'bg-blue-100 text-blue-600'
                              : sub.status === 'read' || sub.status === 'accepted'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        <option value="unread">Unread</option>
                        <option value="contacted">Contacted</option>
                        <option value="read">Read</option>
                        {activeTab === 'volunteer' && (
                          <>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </>
                        )}
                      </select>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={`mailto:${sub.email}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Reply by Email"
                        >
                          <Mail size={18} />
                        </a>
                        <button
                          onClick={() => deleteSubmission(sub._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
