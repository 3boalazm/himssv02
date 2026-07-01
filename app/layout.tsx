import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HLOS — لوحة تحكم المؤسسة",
  description: "Healthcare IT Learning OS — منصة تعلّم تقنية المعلومات الصحية",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body>{children}</body>
    </html>
  )
}
