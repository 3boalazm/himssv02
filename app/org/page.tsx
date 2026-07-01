import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Download, FileSpreadsheet, BookMarked, Bell, AlertTriangle } from "lucide-react"
import Link from "next/link"

// Org members — readiness data
const members = [
  { name: "سارة المطيري", score: 84, lessons: 12, lastActive: "اليوم", status: "مكتمل" },
  { name: "خالد العتيبي", score: 71, lessons: 8, lastActive: "أمس", status: "مكتمل" },
  { name: "نورة الحربي", score: 58, lessons: 3, lastActive: "منذ ٣ أيام", status: "جارٍ" },
  { name: "فيصل القحطاني", score: 0, lessons: 0, lastActive: "منذ أسبوع", status: "جديد" },
  { name: "ريم الشمري", score: 92, lessons: 18, lastActive: "اليوم", status: "مكتمل" },
  { name: "عبدالله الدوسري", score: 38, lessons: 2, lastActive: "منذ ٥ أيام", status: "جارٍ" },
]

// Team performance by domain
const teamDomains = [
  { label: "نظم المعلومات الصحية", score: 78 },
  { label: "التشغيل والحوكمة", score: 65 },
  { label: "التوافقية والمعايير", score: 54 },
  { label: "التحليلات والذكاء", score: 42 },
  { label: "القيادة الرقمية", score: 69 },
]

function masteryColor(score: number): string {
  if (score >= 70) return "#0F6B6B"
  if (score >= 55) return "#3E8C7E"
  if (score >= 40) return "#C99A3A"
  return "#B45309"
}

const statusStyle: Record<string, string> = {
  مكتمل: "bg-primary/10 text-primary",
  جارٍ: "bg-[#B45309]/10 text-[#B45309]",
  جديد: "bg-secondary text-muted-foreground",
}

export default function OrgDashboardPage() {
  const teamAvg = (teamDomains.reduce((s, d) => s + d.score, 0) / teamDomains.length).toFixed(1)
  const seatsUsed = 36
  const seatsTotal = 50
  const seatsPct = Math.round((seatsUsed / seatsTotal) * 100)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="org" />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
            <p className="text-sm text-muted-foreground mt-0.5">مستشفى الملك فهد · يونيو 2026</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <UserPlus className="w-4 h-4 ml-1.5" />
            دعوة أعضاء
          </Button>
        </div>

        {/* Alert bar */}
        <Card className="p-3 mb-5 animate-in-up bg-[#B45309]/5 border-[#B45309]/20 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-[#B45309]">
            <AlertTriangle className="w-4 h-4" />
            ٨ أعضاء لم يبدأوا التقييم بعد
          </span>
          <Button size="sm" variant="outline" className="text-xs border-[#B45309]/30 text-[#B45309]">
            إرسال تذكير
          </Button>
        </Card>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <Card className="p-4">
            <p className="text-[11px] text-muted-foreground mb-1">دروس مكتملة</p>
            <div className="text-2xl font-bold text-foreground font-mono">148</div>
            <p className="text-[10px] text-[#B45309] mt-1">↓ ١٢ عن الشهر الماضي</p>
          </Card>
          <Card className="p-4">
            <p className="text-[11px] text-muted-foreground mb-1">متوسط درجة الفريق</p>
            <div className="text-2xl font-bold text-foreground font-mono">71%</div>
            <p className="text-[10px] text-primary mt-1">↑ ٦٪ أعلى من الشهر الماضي</p>
          </Card>
          <Card className="p-4">
            <p className="text-[11px] text-muted-foreground mb-1">أكملوا التقييم</p>
            <div className="text-2xl font-bold text-foreground font-mono">24</div>
            <p className="text-[10px] text-muted-foreground mt-1">١٢ لم يبدأوا بعد</p>
          </Card>
          {/* Seats — the teal highlighted tile */}
          <Card className="p-4 bg-primary text-primary-foreground">
            <p className="text-[11px] opacity-90 mb-1">إجمالي الـ Seats</p>
            <div className="text-2xl font-bold font-mono">{seatsUsed}</div>
            <div className="h-1.5 rounded-full bg-white/20 mt-2 overflow-hidden">
              <div className="h-full rounded-full bg-white" style={{ width: `${seatsPct}%` }} />
            </div>
            <p className="text-[10px] opacity-90 mt-1">من {seatsTotal} مقعداً · {seatsPct}% مستخدم</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          {/* Quick actions */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">إجراءات سريعة</h3>
            <div className="space-y-2">
              {[
                { icon: UserPlus, label: "دعوة أعضاء جدد" },
                { icon: Download, label: "تصدير تقرير PDF" },
                { icon: FileSpreadsheet, label: "تصدير بيانات Excel" },
                { icon: BookMarked, label: "تعيين مسار تعليمي" },
                { icon: Bell, label: "تذكير غير النشطين", badge: "8" },
              ].map((a) => (
                <button
                  key={a.label}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-foreground border border-border hover:bg-secondary/40 transition-colors"
                >
                  <a.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="flex-1 text-right">{a.label}</span>
                  {a.badge && (
                    <span className="text-[10px] bg-[#B45309]/10 text-[#B45309] px-1.5 rounded-full">
                      {a.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Team performance by domain */}
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-foreground">أداء الفريق حسب المجال</h3>
              <span className="text-[11px] text-muted-foreground">متوسط الفريق: {teamAvg}%</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">متوسط درجات جميع الأعضاء</p>
            <div className="space-y-3">
              {teamDomains.map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground">{d.label}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: masteryColor(d.score) }}>
                      {d.score}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${d.score}%`, background: masteryColor(d.score) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent team activity */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">آخر نشاط الفريق</h3>
              <p className="text-[11px] text-muted-foreground">٣٦ عضو · ٢٤ أكملوا التقييم</p>
            </div>
            <Link href="/team" className="text-xs text-primary hover:underline">عرض الكل</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-muted-foreground border-b border-border">
                  <th className="text-right font-medium pb-2">العضو</th>
                  <th className="text-right font-medium pb-2">الدرجة</th>
                  <th className="text-right font-medium pb-2">الدروس</th>
                  <th className="text-right font-medium pb-2">آخر نشاط</th>
                  <th className="text-right font-medium pb-2">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.name} className="border-b border-border/50">
                    <td className="py-2.5 text-foreground">{m.name}</td>
                    <td className="py-2.5">
                      <span className="font-mono font-bold" style={{ color: masteryColor(m.score) }}>
                        {m.score === 0 ? "—" : `${m.score}%`}
                      </span>
                    </td>
                    <td className="py-2.5 text-foreground font-mono">{m.lessons}</td>
                    <td className="py-2.5 text-[11px] text-muted-foreground">{m.lastActive}</td>
                    <td className="py-2.5">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusStyle[m.status]}`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
