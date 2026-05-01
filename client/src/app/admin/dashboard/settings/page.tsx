"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Save, Plus, Trash2, GripVertical, Globe, Settings as SettingsIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function SiteSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/settings`);
      setSettings(data);
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const updateNavLink = (index: number, field: string, value: string) => {
    const newLinks = [...settings.navbarLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSettings({ ...settings, navbarLinks: newLinks });
  };

  const addNavLink = () => {
    setSettings({
      ...settings,
      navbarLinks: [...settings.navbarLinks, { name: "New Link", href: "/", order: settings.navbarLinks.length + 1 }]
    });
  };

  const removeNavLink = (index: number) => {
    const newLinks = settings.navbarLinks.filter((_: any, i: number) => i !== index);
    setSettings({ ...settings, navbarLinks: newLinks });
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading settings...</div>;
  if (!settings) return <div className="p-12 text-center text-red-400">Failed to load settings. Please ensure the backend is running.</div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Site Settings</h1>
          <p className="text-gray-500">Manage global website configuration, navigation, and SEO.</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save size={18} /> Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Navigation Editor */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-serif font-bold text-secondary flex items-center gap-2">
            <GripVertical size={20} className="text-primary" /> Navigation Menu
          </h3>
          <div className="space-y-4">
            {settings.navbarLinks.map((link: any, index: number) => (
              <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl group">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => updateNavLink(index, "name", e.target.value)}
                    className="px-3 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary outline-none text-sm"
                    placeholder="Link Name"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updateNavLink(index, "href", e.target.value)}
                    className="px-3 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary outline-none text-sm"
                    placeholder="/link"
                  />
                </div>
                <button onClick={() => removeNavLink(index)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button onClick={addNavLink} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-sm font-bold">
              <Plus size={16} /> Add Link
            </button>
          </div>
        </div>

        {/* Global SEO */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-serif font-bold text-secondary flex items-center gap-2">
            <Globe size={20} className="text-primary" /> Global SEO Settings
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Default Meta Title</label>
              <input
                type="text"
                value={settings.globalSeo?.metaTitle || ""}
                onChange={(e) => setSettings({...settings, globalSeo: {...settings.globalSeo, metaTitle: e.target.value}})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Default Meta Description</label>
              <textarea
                rows={4}
                value={settings.globalSeo?.metaDescription || ""}
                onChange={(e) => setSettings({...settings, globalSeo: {...settings.globalSeo, metaDescription: e.target.value}})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
