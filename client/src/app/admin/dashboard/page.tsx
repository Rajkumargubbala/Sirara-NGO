"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Settings
} from "lucide-react";

const stats = [
  { label: "Total Volunteers", value: "1,248", icon: Users, color: "bg-blue-500", trend: "+12%" },
  { label: "Donations (MTD)", value: "$45,200", icon: Heart, color: "bg-primary", trend: "+24%" },
  { label: "Contact Inquiries", value: "85", icon: MessageSquare, color: "bg-accent", trend: "-5%" },
  { label: "Blog Posts", value: "12", icon: TrendingUp, color: "bg-purple-500", trend: "Stable" },
];

const recentActivity = [
  { id: 1, type: "donation", user: "Anonymous", action: "donated $500", time: "2 hours ago", status: "success" },
  { id: 2, type: "volunteer", user: "John Smith", action: "applied to volunteer", time: "5 hours ago", status: "pending" },
  { id: 3, type: "contact", user: "Maria Garcia", action: "sent a message", time: "Yesterday", status: "unread" },
  { id: 4, type: "blog", user: "Admin", action: "published a new blog post", time: "Yesterday", status: "success" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif font-bold text-secondary">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between"
          >
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-3xl font-serif font-bold text-secondary">{stat.value}</h3>
              <p className={`text-xs mt-2 font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : stat.trend === 'Stable' ? 'text-gray-400' : 'text-red-500'}`}>
                {stat.trend} <span className="text-gray-300 font-normal ml-1">vs last month</span>
              </p>
            </div>
            <div className={`${stat.color} p-4 rounded-xl text-white shadow-lg`}>
              <stat.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold text-secondary">Recent Activity</h2>
            <button className="text-primary font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-secondary">
                    {activity.type === 'donation' && <Heart size={18} />}
                    {activity.type === 'volunteer' && <Users size={18} />}
                    {activity.type === 'contact' && <MessageSquare size={18} />}
                    {activity.type === 'blog' && <Clock size={18} />}
                  </div>
                  <div>
                    <p className="text-secondary font-medium">
                      <span className="font-bold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
                <div>
                  {activity.status === 'success' && <CheckCircle2 className="text-green-500" size={18} />}
                  {activity.status === 'pending' && <Clock className="text-yellow-500" size={18} />}
                  {activity.status === 'unread' && <AlertCircle className="text-red-400" size={18} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-secondary">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-primary text-white p-6 rounded-2xl flex items-center gap-4 hover:bg-primary-dark transition-all shadow-lg shadow-primary/10 group">
              <div className="bg-white/20 p-3 rounded-lg group-hover:rotate-12 transition-transform">
                <TrendingUp size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold">Publish New Blog</p>
                <p className="text-xs text-white/70">Share latest updates with everyone</p>
              </div>
            </button>
            <button className="w-full bg-white text-secondary border border-gray-100 p-6 rounded-2xl flex items-center gap-4 hover:border-primary transition-all shadow-sm group">
              <div className="bg-gray-100 p-3 rounded-lg group-hover:rotate-12 transition-transform">
                <MessageSquare size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold">Add Testimonial</p>
                <p className="text-xs text-gray-400">Add a new success story</p>
              </div>
            </button>
            <button className="w-full bg-white text-secondary border border-gray-100 p-6 rounded-2xl flex items-center gap-4 hover:border-primary transition-all shadow-sm group">
              <div className="bg-gray-100 p-3 rounded-lg group-hover:rotate-12 transition-transform">
                <Settings size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold">Site Settings</p>
                <p className="text-xs text-gray-400">Update logo, contact info, etc.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
