"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import RichTextEditor from "@/components/admin/RichTextEditor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function BlogManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/blog`);
      setPosts(data);
    } catch (error) {
      toast.error("Failed to fetch posts");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (editingPost._id) {
        await axios.put(`${API_URL}/blog/${editingPost._id}`, editingPost, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        toast.success("Post updated!");
      } else {
        await axios.post(`${API_URL}/blog`, editingPost, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        toast.success("Post created!");
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      toast.error("Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/blog/${id}`, {
        withCredentials: true
      });
      toast.success("Post deleted");
      fetchPosts();
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const openModal = (post: any = { title: "", content: "", featuredImage: "" }) => {
    setEditingPost(post);
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
      setEditingPost({ ...editingPost, featuredImage: data.url });
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Blog Manager</h1>
          <p className="text-gray-500">Create and manage your stories.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Create New Blog
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Blog Article</th>
              <th className="px-6 py-4">Created Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={post.featuredImage || "https://placehold.co/100x60"} className="w-16 h-10 object-cover rounded" />
                    <div className="font-bold text-secondary">{post.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(post.createdAt || post.publishedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(post)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="p-2 text-red-400 hover:bg-red-50/10 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-serif font-bold text-secondary">
                {editingPost._id ? "Edit Blog" : "Create New Blog"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-secondary">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              // Auto-generate slug from title if not present
              if (!editingPost.slug) {
                editingPost.slug = editingPost.title.toLowerCase().replace(/\s+/g, '-');
              }
              handleSave(e);
            }} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Blog Title</label>
                <input 
                  required 
                  value={editingPost.title} 
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary text-lg"
                  placeholder="Enter blog title..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Featured Image</label>
                <div className="flex items-center gap-4">
                  {editingPost.featuredImage && (
                    <div className="w-32 h-20 rounded-xl border shadow-sm overflow-hidden">
                      <img src={editingPost.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 flex gap-4">
                    <input 
                      value={editingPost.featuredImage} 
                      onChange={(e) => setEditingPost({ ...editingPost, featuredImage: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Image URL"
                    />
                    <input type="file" id="blog-image" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                    <label htmlFor="blog-image" className="cursor-pointer p-3 bg-accent text-secondary rounded-xl hover:bg-accent-dark transition-all flex items-center justify-center min-w-[50px]">
                      <ImageIcon size={24} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Blog Description / Content</label>
                <RichTextEditor 
                  value={editingPost.content} 
                  onChange={(val) => setEditingPost({ ...editingPost, content: val })}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                  <Save size={20} /> {loading ? "Saving..." : "Save Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
