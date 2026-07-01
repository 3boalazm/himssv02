"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, Target, Users, Clock } from "lucide-react"

const stats = [
  { title: "دروس مكتملة هذا الشهر", value: "148", change: "↓ 12 عن الشهر الماضي", icon: CheckCircle },
  { title: "معدل الإنجاز", value: "67%", change: "↑ 8% عن الشهر الماضي", icon: Target },
  { title: "أعضاء نشطون", value: "24", change: "↑ 6% عن الشهر الماضي", icon: Users },
  { title: "وقت التعلم اليومي", value: "1.4h", change: "↓ 12د عن الشهر الماضي", icon: Clock },
]

// Performance distribution by domain (blue→teal→green — no red/amber)
const domainPerf = [
  { label: "نظم المعلومات الصحية", score: 78 },
  { label: "التشغيل البيني", score: 65 },
  { label: "التوافقية والمعايير", score: 54 },
  { label: "الذكاء الاصطناعي والتحليلات", score: 42 },
  { label: "الحوكمة الرقمية", score: 69 },
]

// Monthly completion rate trend
const monthly = [
  { month: "يناير", pct: 35 },
  { month: "فبراير", pct: 48 },
  { month: "مارس", pct: 55 },
  { month: "أبريل", pct: 62 },
  { month: "مايو", pct: 69 },
  { month: "يونيو", pct: 78 },
]

const leaderboard = [
  { name: "ريم الشمري", lessons: 18, score: 92 },
  { name: "سارة المطيري", lessons: 12, score: 84 },
  { name: "لمياء القرني", lessons: 11, score: 79 },
  { name: "خالد العتيبي", lessons: 8, score: 71 },
]

function tierColor(score: number): string {
  if (score >= 70) return "#22C55E"
  if (score >= 40) return "#14B8A6"
  return "#3B82F6"
}

export function AnalyticsContent() {
  return (
    <div className="space-y-6">
      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-4 animate-in-up card-interactive">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground">{stat.title}</span>
              <stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground font-mono">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{stat.change}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance by domain */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-1">توزيع الأداء</h3>
          <p className="text-xs text-muted-foreground mb-4">حسب المجال التعليمي</p>
          <div className="space-y-3">
            {domainPerf.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground">{d.label}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: tierColor(d.score) }}>
                    {d.score}%
                  </span>
                </div>
                <div className="progress-track h-2.5">
                  <div
                    className="progress-fill-gradient animate-pulse-glow"
                    style={
                      {
                        width: `${d.score}%`,
                        "--pulse-color": "rgba(20,184,166,.5)",
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly trend */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-1">الإنجاز الشهري</h3>
          <p className="text-xs text-muted-foreground mb-4">نسبة إتمام التقييمات</p>
          <div className="space-y-3">
            {monthly.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-14 flex-shrink-0">{m.month}</span>
                <div className="progress-track h-2.5 flex-1">
                  <div
                    className="progress-fill-gradient animate-pulse-glow"
                    style={
                      {
                        width: `${m.pct}%`,
                        "--pulse-color": "rgba(34,197,94,.5)",
                      } as React.CSSProperties
                    }
                  />
                </div>
                <span className="text-xs font-mono font-bold text-foreground w-9 text-left">{m.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">ترتيب الأعضاء</h3>
          <span className="text-[11px] text-muted-foreground">مرتّب حسب الدرجة</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-muted-foreground border-b border-border">
                <th className="text-right font-medium pb-2">#</th>
                <th className="text-right font-medium pb-2">العضو</th>
                <th className="text-right font-medium pb-2">الدروس</th>
                <th className="text-right font-medium pb-2">الدرجة</th>
                <th className="text-right font-medium pb-2">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((m, i) => (
                <tr key={m.name} className="border-b border-border/50">
                  <td className="py-2.5 text-muted-foreground font-mono">{i + 1}</td>
                  <td className="py-2.5 text-foreground">{m.name}</td>
                  <td className="py-2.5 text-foreground font-mono">{m.lessons}</td>
                  <td className="py-2.5">
                    <span className="font-mono font-bold" style={{ color: tierColor(m.score) }}>
                      {m.score}%
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">نشط</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
