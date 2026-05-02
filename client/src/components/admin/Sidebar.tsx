"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  ChevronRight,
  HandCoins
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "react-hot-toast";

import { useRouter } from "next/navigation";
import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

const menuItems = [
  { name: "Manage Pages", href: "/admin/dashboard/pages", icon: FileText },
  { name: "Blog Posts", href: "/admin/dashboard/blog", icon: FileText },
  { name: "Testimonials", href: "/admin/dashboard/testimonials", icon: MessageSquare },
  { name: "Team Members", href: "/admin/dashboard/team", icon: Users },
  { name: "Manage Reports", href: "/admin/dashboard/reports", icon: FileText },
  { name: "Submissions", href: "/admin/dashboard/submissions", icon: MessageSquare },
  { name: "Donations", href: "/admin/dashboard/donations", icon: HandCoins },
  { name: "Media Library", href: "/admin/dashboard/media", icon: ImageIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/admin/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("adminInfo");
      toast.success("Logged out");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
      // Fallback: clear local storage anyway
      localStorage.removeItem("token");
      localStorage.removeItem("adminInfo");
      router.push("/admin/login");
    }
  };

  return (
    <div className="w-64 h-screen bg-secondary text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-serif font-bold text-accent">Sitara Admin</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-all group",
                isActive 
                  ? "bg-accent text-secondary font-bold" 
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
