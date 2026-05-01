"use client";

import { useState } from "react";
import axios from "axios";
import { Upload, Copy, Check, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function MediaLibrary() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${API_URL}/media/upload`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}` 
        }
      });
      setUploadedUrl(data.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Upload failed. Make sure Cloudinary is configured.");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("URL copied to clipboard!");
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif font-bold text-secondary">Media Library</h1>
        <p className="text-gray-500">Upload images to Cloudinary and get URLs for your CMS content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Upload Box */}
        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center text-center space-y-6 hover:border-primary transition-all">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Upload size={40} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-secondary">Choose a file to upload</h3>
            <p className="text-sm text-gray-400 mt-2">Support JPG, PNG, WEBP up to 5MB</p>
          </div>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden" 
            id="file-upload" 
          />
          <label htmlFor="file-upload" className="btn-outline cursor-pointer">
            {file ? file.name : "Select Image"}
          </label>
          {file && (
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className="btn-primary w-full py-4"
            >
              {uploading ? "Uploading..." : "Start Upload"}
            </button>
          )}
        </div>

        {/* Preview & URL */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center space-y-6">
          {uploadedUrl ? (
            <>
              <div className="relative aspect-video rounded-2xl overflow-hidden border">
                <img src={uploadedUrl} alt="Uploaded" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={uploadedUrl} 
                  readOnly 
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border-none text-sm text-gray-500"
                />
                <button 
                  onClick={copyToClipboard}
                  className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-20 text-gray-300">
              <ImageIcon size={64} className="mb-4 opacity-20" />
              <p>Upload an image to see the preview and URL here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
