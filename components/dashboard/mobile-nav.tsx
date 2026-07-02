"use client"

/**
 * MobileNav — floating glass pill (mobile only, < lg).
 *
 * Ported pattern from the C4 floating-pill nav review, rebuilt on HLOS
 * tokens (teal / warm ink / glass-panel) and this project's motion
 * utilities — no framer-motion:
 *  · centered fixed pill: brand orb · role identity · search · theme · ☰
 *  · ☰ toggles a glass panel under the pill with the FULL role link set
 *    (القائمة + عام), staggered reveal, active state matches the sidebar
 *  · variant-aware — learner / org / admin each get their own menus
 *    (previously the single MobileNav always rendered the org sidebar)
 *  · closes on route change; transparent backdrop closes on outside tap
 *
 * Rendered by <Sidebar/> so every page that has the desktop sidebar gets
 * mobile navigation for free. The [data-hlos-mobile-nav] attribute drives
 * the main-content top clearance rule in globals.css.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { NAV_BY_VARIANT, ROLE_META, type NavItem, type ShellVariant } from "./nav-config"

interface MobileNavProps {
  variant?: ShellVariant
  /** Optional override for the main section (mirrors Sidebar's menuItems) */
  menuItems?: NavItem[]
}

export function MobileNav({ variant = "org", menuItems }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  /* Close the panel on route change */
  useEffect(() => setOpen(false), [pathname])

  const { main, general } = NAV_BY_VARIANT[variant]
  const mainNav = menuItems ?? main
  const meta = ROLE_META[variant]

  const link = (item: NavItem, i: number) => {
    const active = pathname === item.href
    return (
      <Link
        key={item.href + item.label}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "animate-in-up flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
          active
            ? "bg-primary/15 text-primary border-r-2 border-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
        style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
      >
        {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="bg-warning/20 text-warning text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <div
      data-hlos-mobile-nav
      className="fixed left-1/2 top-2 z-50 w-[calc(100vw-24px)] max-w-md -translate-x-1/2 lg:hidden"
    >
      {/* Pill */}
      <div
        className={cn(
          "glass-panel rounded-full flex items-center gap-1.5 py-1.5 pr-2 pl-1.5",
          "transition-shadow duration-200",
          open && "shadow-lg",
        )}
      >
        <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs">H</span>
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[13px] font-semibold text-foreground truncate">{meta.title}</p>
          <p className="text-[10px] text-muted-foreground truncate">{meta.subtitle}</p>
        </div>
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
          aria-label="بحث (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>
        <ThemeToggle className="!w-8 !h-8 !rounded-full flex-shrink-0" />
        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls="hlos-mobile-menu"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
            open ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
          )}
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Backdrop — closes on outside tap, no dimming (matches the pill reference) */}
      {open && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 -z-10 cursor-default"
        />
      )}

      {/* Panel */}
      {open && (
        <nav
          id="hlos-mobile-menu"
          aria-label="التنقل الرئيسي"
          className="glass-panel-elevated mt-1.5 max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <p className="px-3 pt-1.5 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            القائمة
          </p>
          <div className="space-y-0.5">{mainNav.map((it, i) => link(it, i))}</div>

          <p className="px-3 pt-3 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            عام
          </p>
          <div className="space-y-0.5">{general.map((it, i) => link(it, mainNav.length + i))}</div>
        </nav>
      )}
    </div>
  )
}
