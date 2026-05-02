"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, User, Link as LinkIcon, Share, Globe, Camera } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

export default function TeamManager() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/resources/team`);
      setMembers(data);
    } catch (error) {
      toast.error("Failed to fetch team members");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (editingMember._id) {
        await axios.put(`${API_URL}/resources/team/${editingMember._id}`, editingMember, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Member updated!");
      } else {
        await axios.post(`${API_URL}/resources/team`, editingMember, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Member added!");
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      toast.error("Failed to save member");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/resources/team/${id}`, {
        withCredentials: true
      });
      toast.success("Deleted successfully");
      fetchMembers();
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const openModal = (member: any = { name: "", role: "", bio: "", image: "", socialLinks: { linkedin: "", twitter: "", instagram: "" } }) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_URL}/media/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      setEditingMember({ ...editingMember, image: data.url });
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Team Manager FIXED</h1>
          <p className="text-gray-500">Manage your staff and dedicated volunteers.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((member) => (
          <div key={member._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group relative">
            <div className="aspect-square overflow-hidden">
              <img src={member.image || "https://placehold.co/400x400"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="p-6">
              <h4 className="font-bold text-secondary text-lg">{member.name}</h4>
              <p className="text-primary text-sm font-medium mb-4">{member.role}</p>
              <div className="flex gap-3">
                {member.socialLinks?.linkedin && <LinkIcon size={18} className="text-gray-400" />}
                {member.socialLinks?.twitter && <Share size={18} className="text-gray-400" />}
                {member.socialLinks?.instagram && <Globe size={18} className="text-gray-400" />}
              </div>
            </div>
            
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(member)} className="p-2 bg-white/90 backdrop-blur-sm shadow-md text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(member._id)} className="p-2 bg-white/90 backdrop-blur-sm shadow-md text-red-400 rounded-xl hover:bg-red-400 hover:text-white transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-10 border-b flex justify-between items-center bg-white">
              <h2 className="text-2xl font-serif font-bold text-secondary flex items-center gap-3">
                <User className="text-primary" /> {editingMember._id ? "Edit Member" : "Add Team Member"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-secondary">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                  <input required value={editingMember.name} onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Role / Title</label>
                  <input required value={editingMember.role} onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Short Bio</label>
                <textarea rows={3} value={editingMember.bio} onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Profile Picture</label>
                <div className="flex items-center gap-6">
                  {editingMember.image && (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border shadow-sm">
                      <img src={editingMember.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 flex gap-4">
                    <input value={editingMember.image} onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })} className="flex-1 px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="Image URL" />
                    <input type="file" id="member-image" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                    <label htmlFor="member-image" className="cursor-pointer px-6 py-4 bg-accent text-secondary rounded-2xl hover:bg-accent-dark transition-all flex items-center gap-2 font-bold">
                      <Plus size={20} /> Upload
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">LinkedIn</label>
                  <input value={editingMember.socialLinks?.linkedin} onChange={(e) => setEditingMember({ ...editingMember, socialLinks: { ...editingMember.socialLinks, linkedin: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Twitter</label>
                  <input value={editingMember.socialLinks?.twitter} onChange={(e) => setEditingMember({ ...editingMember, socialLinks: { ...editingMember.socialLinks, twitter: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Instagram</label>
                  <input value={editingMember.socialLinks?.instagram} onChange={(e) => setEditingMember({ ...editingMember, socialLinks: { ...editingMember.socialLinks, instagram: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline !rounded-2xl">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary !rounded-2xl flex items-center gap-2">
                  <Save size={20} /> {loading ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
