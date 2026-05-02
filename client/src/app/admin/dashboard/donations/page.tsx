"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Phone, Calendar, Trash2, DollarSign, User } from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function DonationsAdmin() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/submissions/donations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/submissions/donations/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Status updated");
      fetchDonations();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteDonation = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/submissions/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted successfully");
      fetchDonations();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-secondary">Donations Tracker</h1>
        <p className="text-gray-500">View and manage donation pledges from the website.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            Loading donations...
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No donations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-5 font-bold text-secondary text-sm uppercase tracking-wider">Date</th>
                  <th className="p-5 font-bold text-secondary text-sm uppercase tracking-wider">Donor</th>
                  <th className="p-5 font-bold text-secondary text-sm uppercase tracking-wider">Status</th>
                  <th className="p-5 font-bold text-secondary text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donations.map((don) => (
                  <tr key={don._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(don.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-secondary flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        {don.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Mail size={12} /> {don.email}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Phone size={12} /> {don.phone}
                      </div>
                    </td>
                    <td className="p-5">
                      <select 
                        value={don.status}
                        onChange={(e) => updateStatus(don._id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-none outline-none cursor-pointer transition-all ${
                          don.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-600' 
                            : don.status === 'completed'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={`mailto:${don.email}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Contact Donor"
                        >
                          <Mail size={18} />
                        </a>
                        <button
                          onClick={() => deleteDonation(don._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Record"
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
