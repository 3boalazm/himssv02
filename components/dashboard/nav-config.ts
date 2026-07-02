import {
  LayoutDashboard, Users, BarChart3, Settings, Mail, LogOut, Bell,
  Target, Grid3x3, Dumbbell, Route, BookOpen, FileText, Waypoints,
  Building2, TrendingUp, Receipt, type LucideIcon,
} from "lucide-react"

/**
 * nav-config — the ONE place role navigation lives.
 * Previously: adminMenu was copy-pasted in 5 admin pages, PublicNav in 4
 * public pages, and the admin variant silently inherited the ORG general
 * items (org settings + invites). All consumers now read from here.
 */

export interface NavItem {
  icon?: LucideIcon
  label: string
  href: string
  badge?: string
}

export type ShellVariant = "org" | "admin" | "learner"

/* ─── Learner ──────────────────────────────────────────────────────────── */
export const learnerMenu: NavItem[] = [
  { icon: LayoutDashboard, label: "لوحتي",          href: "/dashboard"  },
  { icon: Target,          label: "التقييم",         href: "/assess"     },
  { icon: Grid3x3,         label: "مصفوفة القدرات",  href: "/matrix"     },
  { icon: Dumbbell,        label: "التدريب",         href: "/practice"   },
  { icon: Route,           label: "المسارات",        href: "/paths"      },
  { icon: Waypoints,       label: "السيناريوهات",    href: "/scenarios"  },
  { icon: BookOpen,        label: "الدروس",          href: "/lessons"    },
  { icon: FileText,        label: "التقارير",        href: "/reports"    },
]

export const learnerGeneralItems: NavItem[] = [
  { icon: Bell,     label: "الإشعارات",     href: "/notifications" },
  { icon: Settings, label: "الإعدادات",     href: "/settings"      },
  { icon: LogOut,   label: "تسجيل الخروج",  href: "/logout"        },
]

/* ─── Org admin ───────────────────────────────────────────────────────── */
export const orgMenu: NavItem[] = [
  { icon: LayoutDashboard, label: "لوحة التحكم",  href: "/org"              },
  { icon: Users,           label: "أعضاء الفريق", href: "/team"             },
  { icon: BarChart3,       label: "التقارير",      href: "/analytics"        },
  { icon: TrendingUp,      label: "التحليلات",     href: "/reports/insights" },
]

export const orgGeneralItems: NavItem[] = [
  { icon: Settings, label: "إعدادات المؤسسة", href: "/org/settings"      },
  { icon: Mail,     label: "الدعوات المعلقة", href: "#",     badge: "3"  },
  { icon: LogOut,   label: "تسجيل الخروج",    href: "/logout"            },
]

/* ─── Super admin ─────────────────────────────────────────────────────── */
export const adminMenu: NavItem[] = [
  { icon: LayoutDashboard, label: "لوحة تحكم النظام",  href: "/admin"               },
  { icon: Users,           label: "إدارة المستخدمين",  href: "/admin/users"         },
  { icon: Building2,       label: "إدارة المؤسسات",    href: "/admin/organizations" },
  { icon: FileText,        label: "إدارة المحتوى",     href: "/admin/content"       },
  { icon: Receipt,         label: "الفوترة",           href: "/admin/billing"       },
  { icon: Settings,        label: "إعدادات المنصة",    href: "/admin/settings"      },
]

export const adminGeneralItems: NavItem[] = [
  { icon: LogOut, label: "تسجيل الخروج", href: "/logout" },
]

/* ─── Lookup tables ───────────────────────────────────────────────────── */
export const NAV_BY_VARIANT: Record<ShellVariant, { main: NavItem[]; general: NavItem[] }> = {
  learner: { main: learnerMenu, general: learnerGeneralItems },
  org:     { main: orgMenu,     general: orgGeneralItems     },
  admin:   { main: adminMenu,   general: adminGeneralItems   },
}

export const ROLE_META: Record<ShellVariant, { title: string; subtitle: string }> = {
  learner: { title: "أحمد بدير",        subtitle: "ممارس متقدم"           },
  org:     { title: "مستشفى الملك فهد", subtitle: "org_admin · 36 / 50 seat" },
  admin:   { title: "HLOS",             subtitle: "لوحة الإدارة"           },
}

/* ─── Public (visitor) ────────────────────────────────────────────────── */
export const publicLinks = [
  { href: "/capabilities",  label: "التصنيف"   },
  { href: "/#methodology",  label: "المنهجية"  },
  { href: "/pricing",       label: "الأسعار"   },
] as const
