"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Building2, MoreHorizontal } from "lucide-react"
import { LayoutDashboard, Users, FileText, Settings } from "lucide-react"

const adminMenu = [
  { icon: LayoutDashboard, label: "لوحة تحكم النظام", href: "/admin" },
  { icon: Users, label: "إدارة المستخدمين", href: "/admin/users" },
  { icon: Building2, label: "إدارة المؤسسات", href: "/admin/organizations" },
  { icon: FileText, label: "إدارة المحتوى", href: "/admin/content" },
  { icon: Settings, label: "إعدادات المنصة", href: "/admin/settings" },
]

interface Org {
  name: string
  plan: "مجاني" | "احترافية" | "مؤسسة"
  seatsUsed: number
  seatsTotal: number
  status: "نشط" | "تجريبي" | "معلّق"
  admin: string
  lastActivity: string
}

const orgs: Org[] = [
  { name: "مستشفى الملك فهد", plan: "مؤسسة", seatsUsed: 36, seatsTotal: 50, status: "نشط", admin: "ahmed.bedeer@kfsh.sa", lastActivity: "اليوم" },
  { name: "مجموعة الرعاية الصحية بدبي", plan: "احترافية", seatsUsed: 22, seatsTotal: 30, status: "نشط", admin: "admin@dhg.ae", lastActivity: "أمس" },
  { name: "مستشفى الرياض التخصصي", plan: "مؤسسة", seatsUsed: 88, seatsTotal: 100, status: "نشط", admin: "it@rsh.sa", lastActivity: "اليوم" },
  { name: "مركز النور الطبي", plan: "احترافية", seatsUsed: 4, seatsTotal: 15, status: "تجريبي", admin: "info@alnour.sa", lastActivity: "منذ 5 أيام" },
  { name: "عيادات الشفاء", plan: "مجاني", seatsUsed: 2, seatsTotal: 5, status: "معلّق", admin: "contact@shifa.sa", lastActivity: "منذ 3 أسابيع" },
]

const planStyle: Record<Org["plan"], string> = {
  مجاني: "bg-secondary text-muted-foreground",
  احترافية: "bg-primary/10 text-primary",
  مؤسسة: "bg-[#14B8A6]/10 text-[#14B8A6]",
}

const statusStyle: Record<Org["status"], string> = {
  نشط: "bg-primary/10 text-primary",
  تجريبي: "bg-[#3B82F6]/10 text-[#3B82F6]",
  معلّق: "bg-secondary text-muted-foreground",
}

export default function AdminOrganizationsPage() {
  const [query, setQuery] = useState("")
  const filtered = orgs.filter((o) => o.name.includes(query) || o.admin.includes(query))

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="admin" menuItems={adminMenu} />

      <main className="flex-1 p-4 lg:p-5 lg:mr-52">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-foreground">إدارة المؤسسات</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {orgs.length} مؤسسة مشتركة · {orgs.reduce((s, o) => s + o.seatsUsed, 0)} مستخدم نشط إجمالاً
          </p>
        </div>

        <Card className="p-3 mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث باسم المؤسسة أو إيميل المسؤول"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-9 h-9 text-sm"
            />
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-muted-foreground bg-secondary/40 border-b border-border">
                  <th className="text-right font-medium p-3">المؤسسة</th>
                  <th className="text-right font-medium p-3">الخطة</th>
                  <th className="text-right font-medium p-3">المقاعد</th>
                  <th className="text-right font-medium p-3">الحالة</th>
                  <th className="text-right font-medium p-3">آخر نشاط</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                      لا توجد نتائج مطابقة
                    </td>
                  </tr>
                ) : (
                  filtered.map((o) => {
                    const pct = Math.round((o.seatsUsed / o.seatsTotal) * 100)
                    return (
                      <tr key={o.name} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-foreground">{o.name}</div>
                              <div className="text-[11px] text-muted-foreground">{o.admin}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${planStyle[o.plan]}`}>
                            {o.plan}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="w-28">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-foreground font-mono">{o.seatsUsed}/{o.seatsTotal}</span>
                              <span className="text-muted-foreground">{pct}%</span>
                            </div>
                            <div className="progress-track h-1.5">
                              <div className="progress-fill-gradient" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusStyle[o.status]}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-muted-foreground">{o.lastActivity}</td>
                        <td className="p-3">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
