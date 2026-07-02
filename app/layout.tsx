import type { Metadata } from "next"
import "./globals.css"
import { SitemapFab } from "@/components/sitemap-fab"
import { GlobalSearch } from "@/components/global-search"

export const metadata: Metadata = {
  title: "HLOS — لوحة تحكم المؤسسة",
  description: "Healthcare IT Learning OS — منصة تعلّم تقنية المعلومات الصحية",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('hlos-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <SitemapFab />
        <GlobalSearch />
      </body>
    </html>
  )
}
