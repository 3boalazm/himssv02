"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, FileText, Clock, LayoutDashboard, Users } from "lucide-react"

const adminMenu = [
  { icon: LayoutDashboard, label: "لوحة تحكم النظام", href: "/admin" },
  { icon: Users, label: "إدارة المستخدمين", href: "/admin/users" },
  { icon: FileText, label: "إدارة المحتوى", href: "/admin/content" },
]

// Status badges — amber for review, teal for published, neutral for draft. NO red for returned.
const statusStyle: Record<string, string> = {
  مسودة: "bg-secondary text-muted-foreground",
  "قيد المراجعة": "bg-[#B45309]/10 text-[#B45309]",
  منشور: "bg-primary/10 text-primary",
}

const lessons = [
  { title: "أساسيات HL7 و FHIR", titleEn: "HL7 & FHIR Basics", status: "منشور", tier: "مجاني", domain: "التشغيل البيني", updated: "٢٠٢٦/٠٦/٢٠", reviewer: "مراجع المحتوى" },
  { title: "تصنيف بيانات PDPL", titleEn: "PDPL Data Classification", status: "قيد المراجعة", tier: "احترافية", domain: "الأمن والخصوصية", updated: "٢٠٢٦/٠٦/٢٨", reviewer: null },
  { title: "نماذج التعلم الآلي السريرية", titleEn: "Clinical ML Models", status: "مسودة", tier: "احترافية", domain: "التحليلات", updated: "٢٠٢٦/٠٦/٣٠", reviewer: null },
  { title: "تكامل NPHIES", titleEn: "NPHIES Integration", status: "منشور", tier: "احترافية", domain: "التشغيل البيني", updated: "٢٠٢٦/٠٥/١٥", reviewer: "مراجع المحتوى" },
]

const reviewQueue = [
  { title: "تصنيف بيانات PDPL", domain: "الأمن والخصوصية", submitted: "منذ يومين" },
  { title: "حوكمة البيانات الصحية", domain: "نظم المعلومات", submitted: "منذ ٤ أيام" },
]

export default function AdminContentPage() {
  const [tab, setTab] = useState<"content" | "review">("content")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="admin" menuItems={adminMenu} />

      <main className="flex-1 p-4 lg:p-5 lg:mr-52">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-foreground">إدارة المحتوى</h1>
            <p className="text-xs text-muted-foreground mt-0.5">من مسودة إلى مراجعة إلى نشر</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-3.5 h-3.5 ml-1.5" />
              استيراد
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="w-3.5 h-3.5 ml-1.5" />
              درس جديد
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-border">
          <button
            onClick={() => setTab("content")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === "content"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            الدروس
          </button>
          <button
            onClick={() => setTab("review")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              tab === "review"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            قائمة المراجعة
            <span className="text-[10px] bg-[#B45309]/10 text-[#B45309] px-1.5 rounded-full">
              {reviewQueue.length}
            </span>
          </button>
        </div>

        {tab === "content" ? (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] text-muted-foreground bg-secondary/40 border-b border-border">
                    <th className="text-right font-medium p-3">العنوان</th>
                    <th className="text-right font-medium p-3">الحالة</th>
                    <th className="text-right font-medium p-3">الباقة</th>
                    <th className="text-right font-medium p-3">التصنيف</th>
                    <th className="text-right font-medium p-3">آخر تحديث</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((l) => (
                    <tr key={l.titleEn} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="p-3">
                        <div className="text-foreground flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                          {l.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground mr-6" dir="ltr">
                          {l.titleEn}
                        </div>
                        {l.reviewer && (
                          <div className="text-[10px] text-muted-foreground mr-6">
                            روجع بواسطة {l.reviewer}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusStyle[l.status]}`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] bg-secondary px-2 py-0.5 rounded-full text-foreground">
                          {l.tier}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-foreground">{l.domain}</td>
                      <td className="p-3 text-[11px] text-muted-foreground font-mono">{l.updated}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                          تحرير
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">بنود تنتظر المراجعة · مرتبة حسب الأقدم أولاً</p>
            {reviewQueue.map((r) => (
              <Card key={r.title} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#B45309]" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.title}</p>
                    <p className="text-[11px] text-muted-foreground">{r.domain} · {r.submitted}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    إرجاع للمراجعة
                  </Button>
                  <Button size="sm" className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    الموافقة على النشر
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
