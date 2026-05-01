"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Star } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function TestimonialManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/resources/testimonials`);
      setItems(data);
    } catch (error) {
      toast.error("Failed to fetch testimonials");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (editingItem._id) {
        await axios.put(`${API_URL}/resources/testimonials/${editingItem._id}`, editingItem, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Testimonial updated!");
      } else {
        await axios.post(`${API_URL}/resources/testimonials`, editingItem, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Testimonial created!");
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error("Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/resources/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const openModal = (item: any = { name: "", role: "", content: "", rating: 5, image: "" }) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_URL}/media/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });
      setEditingItem({ ...editingItem, image: data.url });
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Testimonial Manager</h1>
          <p className="text-gray-500">Manage feedback from your community.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-xl transition-all relative">
            <div className="flex items-center gap-4 mb-6">
              <img src={item.image || "https://placehold.co/100"} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-secondary">{item.name}</h4>
                <p className="text-sm text-gray-400">{item.role}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 italic">"{item.content}"</p>
            <div className="flex gap-1 text-accent">
              {[...Array(item.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(item)} className="p-2 bg-white shadow-md text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(item._id)} className="p-2 bg-white shadow-md text-red-400 rounded-lg hover:bg-red-400 hover:text-white transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-white">
              <h2 className="text-2xl font-serif font-bold text-secondary">
                {editingItem._id ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-secondary">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
                  <input required value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Role</label>
                  <input value={editingItem.role} onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Content</label>
                <textarea required rows={4} value={editingItem.content} onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={editingItem.rating} onChange={(e) => setEditingItem({ ...editingItem, rating: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">User Photo</label>
                  <div className="flex gap-2">
                    <input type="file" id="test-image" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                    <label htmlFor="test-image" className="flex-1 cursor-pointer p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all border border-dashed border-gray-300 flex items-center justify-center gap-2">
                      <Plus size={16} /> {editingItem.image ? "Change" : "Upload"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                  <Save size={20} /> {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
