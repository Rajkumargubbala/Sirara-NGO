"use client";

import { motion } from "framer-motion";
import SanitizedHTML from "@/components/ui/SanitizedHTML";

interface StatItem {
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

interface ImpactStatsProps {
  title?: string;
  description?: string;
  stats?: StatItem[];
}

const defaultStats = [
  { label: "Lives Impacted", value: "50,000+", icon: "👥", description: "Across global communities" },
  { label: "Volunteers", value: "1,200+", icon: "🤝", description: "Dedicated change-makers" },
  { label: "Projects Completed", value: "150+", icon: "📊", description: "Sustainable initiatives" },
  { label: "Communities Served", value: "25+", icon: "🏘️", description: "Local partnerships" },
];

export default function ImpactStats({ 
  title = "Our Growing Impact", 
  description = "Every number represents a life changed and a community strengthened through our collective efforts.", 
  stats = defaultStats 
}: ImpactStatsProps) {
  return (
    <section className="section-padding bg-secondary text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{title}</h2>
          <SanitizedHTML html={description} className="text-gray-300 max-w-2xl mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(stats || defaultStats).map((stat, index) => (
            <motion.div
              key={stat.label + index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all flex justify-center">
                {stat.icon ? (
                  stat.icon.startsWith("http") || stat.icon.startsWith("/") ? (
                    <img src={stat.icon} alt={stat.label} className="h-12 w-auto object-contain" />
                  ) : (
                    <span>{stat.icon}</span>
                  )
                ) : (
                  <span>✨</span>
                )}
              </div>
              <div className="text-3xl md:text-4xl font-serif font-bold text-accent mb-2">{stat.value}</div>
              <div className="text-sm uppercase tracking-widest text-white font-bold mb-2">{stat.label}</div>
              {stat.description && (
                <p className="text-xs text-gray-400 leading-relaxed">{stat.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
