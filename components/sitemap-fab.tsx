import Link from "next/link"
import { Map } from "lucide-react"

/**
 * Floating dev-nav button — appears on every screen (public, learner, org, admin)
 * so you can jump straight to the full page index instead of guessing URLs.
 * This is a project-navigation aid, not part of the product IA — it doesn't
 * count as a "screen" and should be removed before a real production launch.
 */
export function SitemapFab() {
  return (
    <Link
      href="/all-pages"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-3.5 py-2.5 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      title="كل صفحات المشروع"
    >
      <Map className="w-4 h-4" />
      كل الصفحات
    </Link>
  )
}
