"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Activity, ClipboardCheck, CreditCard, RefreshCw, LayoutDashboard, FileText, Settings } from "lucide-react"
import Link from "next/link"

// Admin nav — different routes for the admin variant
const adminMenu = [
  { icon: LayoutDashboard, label: "لوحة تحكم النظام", href: "/admin" },
  { icon: Users, label: "إدارة المستخدمين", href: "/admin/users" },
  { icon: FileText, label: "إدارة المحتوى", href: "/admin/content" },
  { icon: Settings, label: "إعدادات المنصة", href: "/admin/settings" },
]

const stats = [
  { icon: Users, label: "إجمالي المستخدمين", value: "1,284", sub: "حسابات نشطة" },
  { icon: Activity, label: "جلسات نشطة الآن", value: "47", sub: "متزامنة" },
  { icon: ClipboardCheck, label: "محاولات التقييم اليوم", value: "132", sub: "خلال ٢٤ ساعة" },
  { icon: CreditCard, label: "اشتراكات نشطة", value: "318", sub: "احترافية + مؤسسات" },
]

const recentSignups = [
  { name: "سارة المطيري", email: "sara@kfsh.sa", plan: "احترافية", time: "منذ ٥ دقائق" },
  { name: "محمد الزهراني", email: "m.z@moh.gov.sa", plan: "مجاني", time: "منذ ١٢ دقيقة" },
  { name: "نورة القحطاني", email: "noura@nphies.sa", plan: "احترافية", time: "منذ ٣٤ دقيقة" },
  { name: "خالد العتيبي", email: "k.o@sghgroup.sa", plan: "مؤسسة", time: "منذ ساعة" },
]

const adminActions = [
  { action: "الموافقة على نشر درس: تصنيف PDPL", admin: "مراجع المحتوى", time: "منذ ١٠ دقائق" },
  { action: "منح صلاحية احترافية لمستخدم", admin: "المشرف العام", time: "منذ ٢٥ دقيقة" },
  { action: "تحديث مخطط التقييم", admin: "المشرف العام", time: "منذ ساعتين" },
]

const contentStatus = [
  { label: "مسودة", count: 12, color: "#5C6B73" },
  { label: "قيد المراجعة", count: 5, color: "#B45309" },
  { label: "منشور", count: 148, color: "#0F6B6B" },
]

// System health — the ONE place amber/green/red is acceptable (system status, not human progress)
const health = [
  { service: "API", status: "ok" },
  { service: "قاعدة البيانات", status: "ok" },
  { service: "Redis", status: "ok" },
  { service: "MinIO", status: "warn" },
]

function healthColor(s: string) {
  if (s === "ok") return "#0F6B6B"
  if (s === "warn") return "#B45309"
  return "#A32D2D"
}

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="admin" menuItems={adminMenu} />

      <main className="flex-1 p-4 lg:p-5 lg:mr-52">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-foreground">لوحة تحكم النظام</h1>
            <p className="text-xs text-muted-foreground mt-0.5">نظرة عامة على صحة النظام والنشاط</p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-3.5 h-3.5 ml-1.5" />
            فحص الآن
          </Button>
        </div>

        {/* Stat tiles — dense */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {stats.map((s) => (
            <Card key={s.label} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
                <s.icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground font-mono">{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{s.sub}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent signups — table */}
          <Card className="lg:col-span-2 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">التسجيلات الحديثة</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] text-muted-foreground border-b border-border">
                    <th className="text-right font-medium pb-2">المستخدم</th>
                    <th className="text-right font-medium pb-2">الباقة</th>
                    <th className="text-left font-medium pb-2">التسجيل</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSignups.map((u) => (
                    <tr key={u.email} className="border-b border-border/50">
                      <td className="py-2.5">
                        <div className="text-foreground">{u.name}</div>
                        <div className="text-[11px] text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="py-2.5">
                        <span className="text-[11px] bg-secondary px-2 py-0.5 rounded-full text-foreground">
                          {u.plan}
                        </span>
                      </td>
                      <td className="py-2.5 text-left text-[11px] text-muted-foreground">{u.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* System health */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">صحة النظام</h3>
              <span className="text-[10px] text-muted-foreground">آخر فحص: الآن</span>
            </div>
            <div className="space-y-2.5">
              {health.map((h) => (
                <div key={h.service} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{h.service}</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: healthColor(h.status) }}
                    />
                    <span className="text-[11px]" style={{ color: healthColor(h.status) }}>
                      {h.status === "ok" ? "سليم" : "تحذير نشط"}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Admin action log */}
          <Card className="lg:col-span-2 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">سجل الإجراءات الإدارية</h3>
              <Link href="#" className="text-[11px] text-primary hover:underline">السجل الكامل</Link>
            </div>
            <div className="space-y-2.5">
              {adminActions.map((a, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{a.action}</span>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap mr-3">
                    {a.admin} · {a.time}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Content status summary */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">حالة المحتوى</h3>
            <div className="space-y-3">
              {contentStatus.map((c) => (
                <div key={c.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    {c.label}
                  </span>
                  <span className="text-sm font-mono font-bold" style={{ color: c.color }}>
                    {c.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
