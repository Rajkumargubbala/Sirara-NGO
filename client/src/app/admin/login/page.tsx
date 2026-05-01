"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import axios from "axios";

import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await axios.post(`${API_URL}/admin/login`, 
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("adminInfo", JSON.stringify(data));
      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-secondary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] border-[60px] border-white rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] border-[30px] border-white rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        <div className="bg-primary p-12 text-center text-white relative">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <Heart size={40} className="fill-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold italic">Admin Access</h1>
          <p className="text-white/70 mt-2">SITATRA Association CMS</p>
        </div>

        <div className="p-12">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all" 
                  placeholder="admin@sitatra.org" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-xl shadow-primary/20 mt-4"
            >
              {loading ? "Authenticating..." : (
                <>
                  Secure Login
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-10">
            Protected by SITATRA Security Protocols. Unauthorized access is prohibited.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
