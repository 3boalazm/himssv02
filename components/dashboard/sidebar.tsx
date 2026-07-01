"use client"

import { LayoutDashboard, Users, BarChart3, Settings, Mail, LogOut, LucideIcon, Target, Grid3x3, Dumbbell, Route, BookOpen, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

// ─── Default nav for org variant ──────────────────────────────────────────────
const defaultOrgMenu: NavItem[] = [
  { icon: LayoutDashboard, label: "لوحة التحكم",       href: "/org"        },
  { icon: Users,           label: "أعضاء الفريق",      href: "/team"       },
  { icon: BarChart3,       label: "التقارير",           href: "/analytics"  },
]
// /tasks removed (PM scaffold) — learning paths live in HLOS DC platform

// ─── Learner variant nav ──────────────────────────────────────────────────────
const learnerMenu: NavItem[] = [
  { icon: LayoutDashboard, label: "لوحتي",              href: "/dashboard"  },
  { icon: Target,          label: "التقييم",            href: "/assess"     },
  { icon: Grid3x3,         label: "مصفوفة القدرات",     href: "/matrix"     },
  { icon: Dumbbell,        label: "التدريب",            href: "/practice"   },
  { icon: Route,           label: "المسارات",           href: "/paths"      },
  { icon: BookOpen,        label: "الدروس",             href: "/lessons"    },
  { icon: FileText,        label: "التقارير",           href: "/reports"    },
]

const defaultGeneralItems: NavItem[] = [
  { icon: Settings, label: "إعدادات المؤسسة", href: "/settings"           },
  { icon: Mail,     label: "الدعوات المعلقة", href: "#",      badge: "3"  },
  { icon: LogOut,   label: "تسجيل الخروج",    href: "/logout"             },
]

const learnerGeneralItems: NavItem[] = [
  { icon: Settings, label: "الإعدادات",     href: "/settings" },
  { icon: LogOut,   label: "تسجيل الخروج",  href: "/logout"   },
]

interface NavItem {
  icon?: LucideIcon
  label: string
  href: string
  badge?: string
}

interface SidebarProps {
  /**
   * "org"     — full org-admin shell (default): 224px wide, generous spacing
   * "admin"   — super-admin shell: 208px wide, 25% tighter padding, smaller icons
   * "learner" — individual practitioner shell: learner nav, 224px wide
   */
  variant?: "org" | "admin" | "learner"
  /** Override main nav items (useful for admin variant with different routes) */
  menuItems?: NavItem[]
}

export function Sidebar({ variant = "org", menuItems }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const pathname  = usePathname()
  const isAdmin   = variant === "admin"
  const isLearner = variant === "learner"

  // ── Variant-driven tokens ────────────────────────────────────────────────
  const sidebarWidth  = isAdmin ? "w-52"  : "w-56"       // 208px vs 224px
  const iconClass     = isAdmin ? "w-3.5 h-3.5" : "w-4 h-4"
  const itemPadding   = isAdmin ? "px-2.5 py-1.5" : "px-3 py-2"
  const itemText      = isAdmin ? "text-xs" : "text-sm"

  const mainNav     = menuItems ?? (isLearner ? learnerMenu : defaultOrgMenu)
  const generalNav  = isLearner ? learnerGeneralItems : defaultGeneralItems

  const navLink = (item: NavItem) => {
    const isActive = pathname === item.href
    return (
      <Link
        key={item.label}
        href={item.href}
        onMouseEnter={() => setHoveredItem(item.label)}
        onMouseLeave={() => setHoveredItem(null)}
        className={cn(
          `w-full flex items-center gap-2.5 ${itemPadding} rounded-lg ${itemText} font-medium transition-colors duration-150`,
          isActive
            ? "bg-primary/15 text-primary border-r-2 border-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        {item.icon && <item.icon className={cn(iconClass, "flex-shrink-0")} />}
        <span className={cn(itemText, "flex-1")}>{item.label}</span>
        {item.badge && (
          <span className="bg-warning/20 text-warning text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <aside className={cn(
      `fixed top-0 right-0 ${sidebarWidth} bg-card border-l border-border p-4 h-screen overflow-y-auto lg:flex flex-col hidden`
    )}>
      {/* Brand */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">H</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">
            {isAdmin ? "HLOS" : isLearner ? "أحمد بدير" : "مستشفى الملك فهد"}
          </p>
          {/* admin: no org subtitle — just role label */}
          <p className="text-[10px] text-muted-foreground">
            {isAdmin ? "لوحة الإدارة" : isLearner ? "ممارس متقدم" : "org_admin · 36 / 50 seat"}
          </p>
        </div>
        <ThemeToggle className="flex-shrink-0" />
      </div>

      {/* Main nav */}
      <div className="space-y-4 flex-1">
        <div>
          <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">القائمة</p>
          <nav className="space-y-0.5">
            {mainNav.map(navLink)}
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">عام</p>
          <nav className="space-y-0.5">
            {generalNav.map(navLink)}
          </nav>
        </div>
      </div>

      {/* Contract expiry (org only) */}
      {!isAdmin && !isLearner && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="bg-warning/10 border border-warning/30 rounded-lg px-3 py-2">
            <p className="text-[10px] text-warning font-medium">العقد ينتهي: يونيو 2026</p>
          </div>
        </div>
      )}
    </aside>
  )
}
