"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = typeof window !== "undefined" ? localStorage.getItem("hlos-theme") : null
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = stored ? stored === "dark" : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem("hlos-theme", next ? "dark" : "light")
    } catch {
      /* ignore */
    }
  }

  // Avoid hydration mismatch — render a placeholder until mounted
  if (!mounted) {
    return <div className={`w-9 h-9 ${className}`} aria-hidden />
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
      className={`w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ${className}`}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
