"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Upload, Calendar, Tag, Download } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

export default function ManageReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Annual",
    year: new Date().getFullYear().toString(),
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/reports`);
      setReports(data);
    } catch (error) {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("image", file); // Backend expects 'image' field for media upload

    try {
      // 1. Upload to Cloudinary via our media endpoint
      const token = localStorage.getItem("token");
      const { data: uploadData } = await axios.post(`${API_URL}/media/upload`, uploadFormData, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      // 2. Create Report record in DB
      await axios.post(`${API_URL}/reports`, {
        ...formData,
        fileUrl: uploadData.url,
        publicId: uploadData.id
      }, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      toast.success("Report uploaded successfully!");
      setFormData({ title: "", type: "Annual", year: new Date().getFullYear().toString() });
      setFile(null);
      fetchReports();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload report");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/reports/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      toast.success("Report deleted");
      fetchReports();
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif font-bold text-secondary">Manage Reports</h1>
        <p className="text-gray-500">Upload and manage annual and financial reports.</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
          <Upload size={20} className="text-primary" />
          Upload New Report
        </h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Report Title</label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Annual Report 2024"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="Annual">Annual Report</option>
              <option value="Financial">Financial Report</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Year</label>
            <input
              required
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">File (PDF/Image)</label>
            <input
              required
              type="file"
              accept=".pdf,.docx,.xlsx,.csv,image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
          <div className="md:col-span-4">
            <button
              disabled={uploading}
              className="btn-primary px-10 py-4 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              {uploading ? "Uploading..." : <><Plus size={18} /> Add Report</>}
            </button>
          </div>
        </form>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-secondary">Existing Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 uppercase text-xs font-bold tracking-widest">
              <tr>
                <th className="px-8 py-4">Title</th>
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4">Year</th>
                <th className="px-8 py-4">Date Added</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-10 text-center text-gray-400">Loading reports...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-10 text-center text-gray-400">No reports uploaded yet.</td></tr>
              ) : reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 font-medium text-secondary flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                      <FileText size={20} />
                    </div>
                    {report.title}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.type === 'Annual' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium">{report.year}</td>
                  <td className="px-8 py-6 text-gray-400 text-sm">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={async () => {
                          try {
                            const response = await fetch(report.fileUrl);
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${report.title.replace(/\s+/g, '_')}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                          } catch (error) {
                            toast.error("Download failed");
                            window.open(report.fileUrl, '_blank');
                          }
                        }}
                        className="p-2 text-gray-300 hover:text-primary transition-colors"
                        title="Download Report"
                      >
                        <Download size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(report._id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
