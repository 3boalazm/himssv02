"use client"

/**
 * PublicNav — the visitor-role header, shared across /, /landing,
 * /capabilities and /pricing (previously four drifted inline copies).
 *
 * Floating glass pill (C4 reference pattern) on HLOS tokens:
 *  · brand orb + wordmark → /
 *  · desktop links (md+) with active state from the pathname
 *  · ThemeToggle + solid-teal CTA
 *  · mobile ☰ → glass panel: links + دخول/إنشاء حساب (public pages had
 *    NO mobile menu at all before — links were simply hidden < sm)
 *
 * Renders its own in-flow spacer so page content clears the fixed pill.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { publicLinks } from "@/components/dashboard/nav-config"

export function PublicNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  const isActive = (href: string) =>
    !href.includes("#") && (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <>
      {/* In-flow spacer — content clears the fixed pill */}
      <div className="h-16" aria-hidden />

      <div className="fixed left-1/2 top-2 z-50 w-[calc(100vw-24px)] max-w-3xl -translate-x-1/2">
        <div
          className={cn(
            "glass-panel rounded-full flex items-center gap-1.5 py-1.5 pr-2 pl-1.5 md:gap-2",
            "transition-shadow duration-200",
            open && "shadow-lg",
          )}
        >
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="HLOS — الرئيسية">
            <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </span>
            <span className="font-bold text-foreground hidden sm:block">HLOS</span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center" aria-label="التنقل العام">
            {publicLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-colors duration-150",
                  isActive(link.href)
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 md:hidden" />

          <ThemeToggle className="!w-8 !h-8 !rounded-full flex-shrink-0" />
          <Link href="/dashboard" className="flex-shrink-0">
            <Button size="sm" className="h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap">
              ابدأ مجاناً
            </Button>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls="hlos-public-menu"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 md:hidden",
              open ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
            )}
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {open && (
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 -z-10 cursor-default md:hidden"
          />
        )}

        {/* Mobile panel */}
        {open && (
          <nav
            id="hlos-public-menu"
            aria-label="التنقل العام"
            className="glass-panel-elevated mt-1.5 rounded-2xl p-2 md:hidden animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {publicLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "animate-in-up block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                style={{ animationDelay: `${i * 35}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border mt-1.5 pt-1.5 grid grid-cols-2 gap-1.5">
              <Link
                href="/login"
                className="animate-in-up rounded-lg px-3 py-2.5 text-center text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                style={{ animationDelay: "105ms" }}
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="animate-in-up rounded-lg px-3 py-2.5 text-center text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                style={{ animationDelay: "140ms" }}
              >
                إنشاء حساب
              </Link>
            </div>
          </nav>
        )}
      </div>
    </>
  )
}
