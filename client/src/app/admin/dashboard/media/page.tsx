"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Trash2, Plus, Image as ImageIcon, X, Loader2, Filter } from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function GalleryManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Modal for adding/editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>({ title: "", imageUrl: "", category: "" });

  useEffect(() => {
    fetchCategories();
    fetchGallery();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/content/gallery`);
      if (data?.sections?.categories?.items) {
        setCategories(data.sections.categories.items);
      }
    } catch (error) {
      console.error("Failed to fetch gallery categories");
    }
  };

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/resources/gallery`);
      setGalleryItems(data);
    } catch (error) {
      toast.error("Failed to fetch gallery items");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_URL}/media/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });
      setEditingItem((prev: any) => ({ ...prev, imageUrl: data.url }));
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.imageUrl || !editingItem.category) {
      toast.error("Please upload an image and select a category");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (editingItem._id) {
        await axios.put(`${API_URL}/resources/gallery/${editingItem._id}`, editingItem, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Item updated!");
      } else {
        await axios.post(`${API_URL}/resources/gallery`, editingItem, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Item added to gallery!");
      }
      setIsModalOpen(false);
      fetchGallery();
    } catch (error) {
      toast.error("Failed to save item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/resources/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted successfully");
      fetchGallery();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filteredItems = selectedCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Gallery & Media Manager</h1>
          <p className="text-gray-500">Organize your visual content into segments/tabs.</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem({ title: "", imageUrl: "", category: categories[0]?.name || "General" });
            setIsModalOpen(true);
          }} 
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New Image
        </button>
      </div>

      {/* Categories / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
            selectedCategory === "All" 
              ? "bg-primary text-white shadow-lg shadow-primary/30" 
              : "bg-white text-gray-500 hover:bg-gray-100"
          }`}
        >
          All Items ({galleryItems.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat.name 
                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
          >
            {cat.name} ({galleryItems.filter(i => i.category === cat.name).length})
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p>Loading your gallery...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <p className="text-white text-xs font-bold mb-1">{item.category}</p>
                <h4 className="text-white text-sm font-serif line-clamp-2 mb-4">{item.title}</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                    className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-md transition-all"
                  >
                    <Upload size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 rounded-lg backdrop-blur-md transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-300">
          <ImageIcon size={64} className="mb-4 opacity-20" />
          <p className="text-lg">No images found in this segment.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-primary font-bold hover:underline"
          >
            Upload your first image
          </button>
        </div>
      )}

      {/* Upload/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-white">
              <h2 className="text-2xl font-serif font-bold text-secondary">
                {editingItem._id ? "Edit Gallery Item" : "Add Gallery Image"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-secondary">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              {/* Image Preview/Upload Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Image</label>
                {editingItem.imageUrl ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden group">
                    <img src={editingItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <label 
                      htmlFor="modal-image-upload"
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold"
                    >
                      Change Image
                    </label>
                  </div>
                ) : (
                  <label 
                    htmlFor="modal-image-upload"
                    className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all cursor-pointer"
                  >
                    {uploading ? <Loader2 className="animate-spin text-primary" /> : <Upload className="text-gray-300" size={32} />}
                    <span className="mt-2 text-sm text-gray-400">Click to upload</span>
                  </label>
                )}
                <input 
                  type="file" 
                  id="modal-image-upload" 
                  className="hidden" 
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Title / Caption</label>
                <input 
                  value={editingItem.title} 
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} 
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Students in the new library"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Segment / Tab</label>
                <select 
                  value={editingItem.category} 
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.name}>{cat.name}</option>
                  ))}
                  <option value="General">General</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Plus size={20} /> {editingItem._id ? "Update Item" : "Add to Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
