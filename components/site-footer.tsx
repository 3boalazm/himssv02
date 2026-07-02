import Link from "next/link"

/**
 * SiteFooter — shared marketing footer. Previously inline in app/page.tsx with
 * dead `#` links; consolidated here so the legal/contact links resolve to real
 * pages from a single source.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>© ٢٠٢٦ HLOS</span>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-foreground transition-colors">الخصوصية</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">الشروط والأحكام</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">تواصل معنا</Link>
        </div>
      </div>
    </footer>
  )
}
