"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "./mobile-nav"
import { NAV_BY_VARIANT, ROLE_META, type NavItem, type ShellVariant } from "./nav-config"

interface SidebarProps {
  /**
   * "org"     — full org-admin shell (default): 224px wide, generous spacing
   * "admin"   — super-admin shell: 208px wide, 25% tighter padding, smaller icons
   * "learner" — individual practitioner shell: learner nav, 224px wide
   */
  variant?: ShellVariant
  /** Override main nav items (rarely needed now — menus live in nav-config) */
  menuItems?: NavItem[]
}

/**
 * Sidebar — desktop shell (≥ lg) + mobile floating pill (< lg).
 * Menus come from nav-config (single source). Rendering <MobileNav/> here
 * means every page that mounts the sidebar gets mobile navigation with the
 * correct role variant automatically — no per-page wiring.
 */
export function Sidebar({ variant = "org", menuItems }: SidebarProps) {
  const [, setHoveredItem] = useState<string | null>(null)
  const pathname  = usePathname()
  const isAdmin   = variant === "admin"
  const isLearner = variant === "learner"

  // ── Variant-driven tokens ────────────────────────────────────────────────
  const sidebarWidth  = isAdmin ? "w-52"  : "w-56"       // 208px vs 224px
  const iconClass     = isAdmin ? "w-3.5 h-3.5" : "w-4 h-4"
  const itemPadding   = isAdmin ? "px-2.5 py-1.5" : "px-3 py-2"
  const itemText      = isAdmin ? "text-xs" : "text-sm"

  const nav       = NAV_BY_VARIANT[variant]
  const mainNav   = menuItems ?? nav.main
  const generalNav = nav.general
  const meta      = ROLE_META[variant]

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
    <>
      {/* Mobile floating pill nav (< lg) — same variant, same menus */}
      <MobileNav variant={variant} menuItems={menuItems} />

      {/* Desktop sidebar (≥ lg) */}
      <aside className={cn(
        `fixed top-0 right-0 ${sidebarWidth} bg-card border-l border-border p-4 h-screen overflow-y-auto lg:flex flex-col hidden`
      )}>
        {/* Brand */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">{meta.title}</p>
            <p className="text-[10px] text-muted-foreground">{meta.subtitle}</p>
          </div>
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
            aria-label="بحث"
            title="بحث (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>
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
    </>
  )
}
