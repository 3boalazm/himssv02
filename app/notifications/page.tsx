"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, BookOpen, Clock, CheckCircle2, Bell } from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  type: "assessment" | "content" | "deadline" | "system"
  title: string
  body: string
  time: string
  read: boolean
  href?: string
  actionLabel?: string
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "assessment",
    title: "تقييم جديد متاح",
    body: "أضافت مؤسستك تقييماً جديداً: جاهزية الأنظمة السريرية",
    time: "منذ 5 دقائق",
    read: false,
    href: "/assess",
    actionLabel: "ابدأ التقييم",
  },
  {
    id: "2",
    type: "deadline",
    title: "موعد التقييم يقترب",
    body: "التقييم الدوري لهذا الربع يُغلق خلال 3 أيام",
    time: "منذ ساعتين",
    read: false,
    href: "/assess",
    actionLabel: "أكمل الآن",
  },
  {
    id: "3",
    type: "content",
    title: "درس جديد منشور",
    body: "\"تكامل FHIR R4 مع الأنظمة السريرية\" متاح الآن في مسارك",
    time: "أمس",
    read: true,
    href: "/lessons",
    actionLabel: "استعرض الدرس",
  },
  {
    id: "4",
    type: "assessment",
    title: "اكتمل التقييم بنجاح",
    body: "تم احتساب نتيجتك في التقييم الشامل #3 — 63%",
    time: "منذ 3 أيام",
    read: true,
    href: "/assess/results/3",
    actionLabel: "عرض النتيجة",
  },
  {
    id: "5",
    type: "system",
    title: "تحديث في مخطط التقييم",
    body: "تم تعديل توزيع أوزان مجال الأمن والخصوصية في التقييم القادم",
    time: "منذ أسبوع",
    read: true,
  },
]

const typeMeta: Record<Notification["type"], { icon: typeof Bell; color: string }> = {
  assessment: { icon: ClipboardList, color: "#14B8A6" },
  content: { icon: BookOpen, color: "#22C55E" },
  deadline: { icon: Clock, color: "#3B82F6" },
  system: { icon: CheckCircle2, color: "var(--muted-foreground)" },
}

const filters = [
  { id: "all", label: "الكل" },
  { id: "assessment", label: "التقييمات" },
  { id: "content", label: "المحتوى" },
  { id: "deadline", label: "المواعيد" },
] as const

export default function NotificationsPage() {
  const [filter, setFilter] = useState<string>("all")
  const [items, setItems] = useState(notifications)

  const filtered = items.filter((n) => filter === "all" || n.type === filter)
  const unreadCount = items.filter((n) => !n.read).length

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })))

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">الإشعارات</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : "كل الإشعارات مقروءة"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs">
              تعليم الكل كمقروء
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 mb-5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-sm text-muted-foreground">لا توجد إشعارات في هذا التصنيف</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((n) => {
              const meta = typeMeta[n.type]
              const content = (
                <Card
                  className={`activity-item p-4 flex items-start gap-3 ${
                    !n.read ? "border-primary/20" : ""
                  } ${n.href ? "card-interactive cursor-pointer" : ""}`}
                  style={{ "--accent-color": meta.color } as React.CSSProperties}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${meta.color}1A` }}
                  >
                    <meta.icon className="w-4 h-4" style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-muted-foreground">{n.time}</span>
                      {n.actionLabel && (
                        <span className="text-[11px] text-primary font-medium">{n.actionLabel} ←</span>
                      )}
                    </div>
                  </div>
                </Card>
              )
              return n.href ? (
                <Link key={n.id} href={n.href}>
                  {content}
                </Link>
              ) : (
                <div key={n.id}>{content}</div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
