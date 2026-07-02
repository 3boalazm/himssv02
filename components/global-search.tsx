"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Search, LayoutDashboard, Target, Grid3x3, Dumbbell, Route, BookOpen, FileText,
  Building2, Users, ShieldCheck, Sparkles, Bell, Settings, X,
} from "lucide-react"

interface SearchItem {
  label: string
  sublabel?: string
  href: string
  icon: React.ElementType
  group: string
}

// Static index — every page + notable content, grouped by role/area.
// Covers what a person would actually look for: pages, lessons, domains.
const index: SearchItem[] = [
  // Learner
  { label: "لوحتي", href: "/dashboard", icon: LayoutDashboard, group: "المتعلم" },
  { label: "التقييم", href: "/assess", icon: Target, group: "المتعلم" },
  { label: "سجل التقييمات", href: "/assess/history", icon: Target, group: "المتعلم" },
  { label: "مصفوفة القدرات", href: "/matrix", icon: Grid3x3, group: "المتعلم" },
  { label: "التدريب", href: "/practice", icon: Dumbbell, group: "المتعلم" },
  { label: "المسارات", href: "/paths", icon: Route, group: "المتعلم" },
  { label: "الدروس", href: "/lessons", icon: BookOpen, group: "المتعلم" },
  { label: "التقارير", href: "/reports", icon: FileText, group: "المتعلم" },
  { label: "الإشعارات", href: "/notifications", icon: Bell, group: "المتعلم" },
  { label: "الإعدادات الشخصية", href: "/settings", icon: Settings, group: "المتعلم" },

  // Lessons — real content titles from the lessons catalog
  { label: "أساسيات معايير HL7 و FHIR", sublabel: "درس · التشغيل البيني", href: "/lessons/hl7-fhir-r4", icon: BookOpen, group: "الدروس" },
  { label: "تكامل منصة NPHIES مع الأنظمة", sublabel: "درس · التشغيل البيني", href: "/lessons/nphies-integration", icon: BookOpen, group: "الدروس" },
  { label: "تصنيف بيانات PDPL وضوابطها", sublabel: "درس · الأمن والخصوصية", href: "/lessons/pdpl-classification", icon: BookOpen, group: "الدروس" },
  { label: "نماذج التعلم الآلي السريرية", sublabel: "درس · التحليلات والذكاء", href: "/lessons/clinical-ml", icon: BookOpen, group: "الدروس" },
  { label: "إدارة السجل الصحي الإلكتروني", sublabel: "درس · نظم المعلومات الصحية", href: "/lessons/ehr-management", icon: BookOpen, group: "الدروس" },

  // Org
  { label: "لوحة تحكم المؤسسة", href: "/org", icon: Building2, group: "المؤسسة" },
  { label: "أعضاء الفريق", href: "/team", icon: Users, group: "المؤسسة" },
  { label: "التقارير والأداء", href: "/analytics", icon: FileText, group: "المؤسسة" },
  { label: "إعدادات المؤسسة", href: "/org/settings", icon: Settings, group: "المؤسسة" },
  { label: "إعداد حساب المؤسسة", href: "/org/onboarding", icon: Building2, group: "المؤسسة" },

  // Admin
  { label: "لوحة تحكم النظام", href: "/admin", icon: ShieldCheck, group: "الأدمن" },
  { label: "إدارة المستخدمين", href: "/admin/users", icon: Users, group: "الأدمن" },
  { label: "إدارة المؤسسات", href: "/admin/organizations", icon: Building2, group: "الأدمن" },
  { label: "إدارة المحتوى", href: "/admin/content", icon: FileText, group: "الأدمن" },
  { label: "إعدادات المنصة", href: "/admin/settings", icon: Settings, group: "الأدمن" },

  // Public
  { label: "الصفحة الرئيسية", href: "/", icon: LayoutDashboard, group: "عام" },
  { label: "الأسعار", href: "/pricing", icon: FileText, group: "عام" },
  { label: "معاينة التصنيف", href: "/capabilities", icon: Grid3x3, group: "عام" },

  // Scenarios
  { label: "كتالوج السيناريوهات", href: "/scenarios", icon: Sparkles, group: "السيناريو" },
]

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()

  const results = useMemo(() => {
    if (!query.trim()) return index.slice(0, 8)
    const q = query.trim()
    return index.filter((item) => item.label.includes(q) || item.sublabel?.includes(q)).slice(0, 10)
  }, [query])

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const navigate = (href: string) => {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, results.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === "Enter" && results[activeIndex]) {
        navigate(results[activeIndex].href)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, results, activeIndex])

  return (
    <>
      {/* Trigger button — used by Header's search icon via a global event, and standalone */}
      <button
        onClick={() => setOpen(true)}
        data-global-search-trigger
        className="hidden"
        aria-hidden
      />

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
          style={{ background: "rgba(22,36,47,0.5)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-panel-elevated w-full max-w-lg animate-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن صفحة، درس، أو مجال..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">لا توجد نتائج مطابقة</p>
              ) : (
                results.map((item, i) => (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-right transition-colors ${
                      i === activeIndex ? "bg-primary/10" : "hover:bg-secondary/40"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground truncate">{item.label}</p>
                      {item.sublabel && (
                        <p className="text-[11px] text-muted-foreground truncate">{item.sublabel}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">{item.group}</span>
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
              <span>↑↓ للتنقل · Enter للفتح</span>
              <span>Esc للإغلاق</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Call from any click handler to open the global search — e.g. the Header search icon. */
export function openGlobalSearch() {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))
}
