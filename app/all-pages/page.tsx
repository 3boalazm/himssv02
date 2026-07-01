"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import {
  Globe, GraduationCap, Building2, ShieldCheck, Sparkles,
  ArrowLeft, LayoutDashboard, ChevronDown, ChevronLeft,
} from "lucide-react"

interface RouteItem {
  label: string
  href: string
  note?: string
}

interface RouteGroup {
  title: string
  icon: React.ElementType
  color: string
  routes: RouteItem[]
}

const groups: RouteGroup[] = [
  {
    title: "الموقع العام (بدون تسجيل دخول)",
    icon: Globe,
    color: "#0F6B6B",
    routes: [
      { label: "الصفحة الرئيسية (Landing)", href: "/" },
      { label: "الأسعار", href: "/pricing" },
      { label: "معاينة التصنيف", href: "/capabilities" },
      { label: "تسجيل الدخول", href: "/login", note: "واجهة فقط" },
      { label: "إنشاء حساب", href: "/register", note: "واجهة فقط" },
    ],
  },
  {
    title: "المتعلم (الموظف الفرد)",
    icon: GraduationCap,
    color: "#0F6B6B",
    routes: [
      { label: "لوحة المتعلم", href: "/dashboard" },
      { label: "مقدمة التقييم", href: "/assess" },
      { label: "شاشة الامتحان", href: "/assess/session/1" },
      { label: "نتيجة التقييم", href: "/assess/results/1" },
      { label: "مصفوفة القدرات", href: "/matrix" },
      { label: "قارئ الدرس", href: "/lessons/fhir-r4" },
      { label: "التدريب", href: "/practice" },
      { label: "المسارات", href: "/paths" },
      { label: "التقارير (خزنة الأدلة)", href: "/reports" },
      { label: "الإعدادات", href: "/settings" },
    ],
  },
  {
    title: "المؤسسة (org_admin — الشركة اللي ضايفاه)",
    icon: Building2,
    color: "#0F6B6B",
    routes: [
      { label: "لوحة تحكم المؤسسة", href: "/org" },
      { label: "أعضاء الفريق", href: "/team" },
      { label: "التقارير المجمّعة", href: "/analytics" },
      { label: "إعدادات المؤسسة", href: "/org/settings" },
    ],
  },
  {
    title: "السوبر أدمن (منصة كاملة)",
    icon: ShieldCheck,
    color: "#B45309",
    routes: [
      { label: "لوحة تحكم النظام", href: "/admin" },
      { label: "إدارة المستخدمين", href: "/admin/users" },
      { label: "إدارة المحتوى", href: "/admin/content" },
      { label: "إعدادات المنصة", href: "/admin/settings" },
    ],
  },
  {
    title: "وضع السيناريو (تفاعلي)",
    icon: Sparkles,
    color: "#7F77DD",
    routes: [
      { label: "كتالوج السيناريوهات", href: "/scenarios" },
      { label: "الإحاطة (Briefing)", href: "/scenarios/1/briefing" },
      { label: "تشغيل السيناريو", href: "/scenarios/1/play" },
    ],
  },
]

export default function AllPagesNav() {
  // Only one panel open at a time — the rest stay collapsed
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">خريطة الموقع — كل الشاشات</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 lg:px-6 py-10">
        <p className="text-sm text-muted-foreground mb-6">
          دوس على أي رول عشان تشوف شاشاته — نظرة سريعة للمراجعة، مش جزء من
          تنقّل المنتج النهائي.
        </p>

        <div className="space-y-3">
          {groups.map((g, i) => {
            const isOpen = openIndex === i
            return (
              <Card key={g.title} className="overflow-hidden p-0">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-right hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${g.color}1A` }}
                    >
                      <g.icon className="w-4 h-4" style={{ color: g.color }} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{g.title}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {g.routes.length} صفحات
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-primary" />
                    ) : (
                      <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-border p-3 space-y-2 animate-in-up">
                    {g.routes.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border hover:bg-secondary/40 hover:border-primary/30 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-foreground truncate">
                            {r.label}
                            {r.note && (
                              <span className="text-[10px] text-muted-foreground mr-1.5">
                                ({r.note})
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate" dir="ltr">
                            {r.href}
                          </p>
                        </div>
                        <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
