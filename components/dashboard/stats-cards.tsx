"use client"

import { Users, ClipboardCheck, BarChart3, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useState } from "react"

const stats = [
  {
    title: "إجمالي الـ Seats",
    value: "36",
    subtitle: "من 50 مقعداً متاحاً",
    delta: "72% مستخدم",
    deltaType: "neutral",
    progress: 72,
    icon: Users,
    primary: true,
  },
  {
    title: "أكملوا التقييم",
    value: "24",
    subtitle: "12 لم يبدأوا بعد",
    delta: "67%",
    deltaType: "warning",
    icon: ClipboardCheck,
    primary: false,
  },
  {
    title: "متوسط درجة الفريق",
    value: "71%",
    subtitle: "أعلى من الشهر الماضي",
    delta: "↑ 6%",
    deltaType: "success",
    icon: BarChart3,
    primary: false,
  },
  {
    title: "دروس مكتملة",
    value: "148",
    subtitle: "هذا الشهر",
    delta: "↓ 12 عن الشهر الماضي",
    deltaType: "danger",
    icon: BookOpen,
    primary: false,
  },
]

// Sequential scale: teal = mastery/improvement, amber = attention, amber-dark = gap. No red or green.
const deltaColors: Record<string, string> = {
  success: "text-primary",          // teal — improvement/mastery
  warning: "text-amber-500",         // amber — attention needed
  danger:  "text-amber-700",         // amber dark — gap (NOT red — gaps are opportunities)
  neutral: "text-muted-foreground",
}

export function StatsCards() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ animationDelay: `${i * 100}ms` }}
            className={`p-4 animate-slide-in-up transition-colors duration-150 cursor-pointer ${
              stat.primary ? "bg-primary border-primary/50" : "bg-card"
            } ${hovered === i ? "shadow-md" : ""}`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className={`text-xs font-medium ${stat.primary ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {stat.title}
              </p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                stat.primary ? "bg-white/20" : "bg-primary/15"
              }`}>
                <Icon className={`w-4 h-4 ${stat.primary ? "text-white" : "text-primary"}`} />
              </div>
            </div>

            <p className={`text-3xl font-bold mb-1 ${stat.primary ? "text-white" : "text-foreground"}`}>
              {stat.value}
            </p>

            {/* Progress bar for seats */}
            {stat.progress && (
              <div className="w-full h-1.5 bg-white/20 rounded-full mb-2">
                <div
                  className="h-full bg-white rounded-full transition-none"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            )}

            <p className={`text-[11px] mb-1 ${stat.primary ? "text-white/70" : "text-muted-foreground"}`}>
              {stat.subtitle}
            </p>
            <p className={`text-[11px] font-medium ${stat.primary ? "text-white" : deltaColors[stat.deltaType]}`}>
              {stat.delta}
            </p>
          </Card>
        )
      })}
    </div>
  )
}
