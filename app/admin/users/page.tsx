"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Users } from "lucide-react"

const users = [
  { name: "سارة المطيري", email: "sara@kfsh.sa", status: "نشط", level: "ممارس متقدم", plan: "احترافية", signup: "٢٠٢٦/٠١/١٥", lastActive: "اليوم" },
  { name: "محمد الزهراني", email: "m.z@moh.gov.sa", status: "نشط", level: "ممارس", plan: "مجاني", signup: "٢٠٢٦/٠٢/٠٣", lastActive: "أمس" },
  { name: "نورة القحطاني", email: "noura@nphies.sa", status: "نشط", level: "معماري", plan: "احترافية", signup: "٢٠٢٥/١١/٢٠", lastActive: "منذ ٣ أيام" },
  { name: "خالد العتيبي", email: "k.o@sghgroup.sa", status: "نشط", level: "تنفيذي", plan: "مؤسسة", signup: "٢٠٢٥/٠٩/١٠", lastActive: "اليوم" },
  { name: "فيصل الدوسري", email: "f.d@kfsh.sa", status: "معطل", level: "مبتدئ", plan: "مجاني", signup: "٢٠٢٦/٠٣/٠١", lastActive: "منذ أسبوع" },
]

const statusColor = (s: string) =>
  s === "نشط" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"

export default function AdminUsersPage() {
  const [query, setQuery] = useState("")
  const filtered = users.filter(
    (u) => u.name.includes(query) || u.email.includes(query)
  )

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="admin" />

      <main className="flex-1 p-4 lg:p-5 lg:mr-52">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-foreground">إدارة المستخدمين</h1>
          <p className="text-xs text-muted-foreground mt-0.5">أي مهمة دعم بدون SQL مباشر</p>
        </div>

        {/* Search + filters */}
        <Card className="p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الإيميل"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-9 h-9 text-sm"
              />
            </div>
            <select className="h-9 px-3 text-sm rounded-md border border-input bg-background text-foreground">
              <option>كل الحالات</option>
              <option>نشط</option>
              <option>معطل</option>
            </select>
            <select className="h-9 px-3 text-sm rounded-md border border-input bg-background text-foreground">
              <option>كل المستويات</option>
              <option>مبتدئ</option>
              <option>ممارس</option>
              <option>معماري</option>
              <option>تنفيذي</option>
            </select>
          </div>
        </Card>

        {/* Users table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-muted-foreground bg-secondary/40 border-b border-border">
                  <th className="text-right font-medium p-3">المستخدم</th>
                  <th className="text-right font-medium p-3">الحالة</th>
                  <th className="text-right font-medium p-3">المستوى</th>
                  <th className="text-right font-medium p-3">الباقة</th>
                  <th className="text-right font-medium p-3">التسجيل</th>
                  <th className="text-right font-medium p-3">آخر نشاط</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                      لا توجد نتائج — جرّب تعديل شرط البحث أو الفلتر
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.email} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="p-3">
                        <div className="text-foreground">{u.name}</div>
                        <div className="text-[11px] text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusColor(u.status)}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-foreground">{u.level}</td>
                      <td className="p-3">
                        <span className="text-[11px] bg-secondary px-2 py-0.5 rounded-full text-foreground">
                          {u.plan}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-muted-foreground font-mono">{u.signup}</td>
                      <td className="p-3 text-[11px] text-muted-foreground">{u.lastActive}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Note about destructive actions — two-step confirm pattern */}
        <p className="text-[11px] text-muted-foreground mt-3">
          الإجراءات الحساسة (تعطيل، حذف، تغيير دور، تسجيل خروج إجباري) تتطلب تأكيداً
          بنص العاقبة وتاريخ الانتهاء الفعلي.
        </p>
      </main>
    </div>
  )
}
