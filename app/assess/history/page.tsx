import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

// Same trend data used elsewhere in the product (dashboard sparkline, matrix caption)
const attempts = [
  {
    id: "3",
    label: "التقييم الشامل #3",
    date: "٢٠٢٦/٠٦/٢٨",
    score: 63,
    prevScore: 55,
    domains: [
      { label: "نظم المعلومات الصحية", score: 78 },
      { label: "التشغيل البيني", score: 65 },
      { label: "الأمن والخصوصية", score: 54 },
      { label: "التحليلات والذكاء", score: 42 },
    ],
  },
  {
    id: "2",
    label: "التقييم الشامل #2",
    date: "٢٠٢٦/٠٥/١٥",
    score: 55,
    prevScore: 42,
    domains: [
      { label: "نظم المعلومات الصحية", score: 70 },
      { label: "التشغيل البيني", score: 58 },
      { label: "الأمن والخصوصية", score: 46 },
      { label: "التحليلات والذكاء", score: 35 },
    ],
  },
  {
    id: "1",
    label: "التقييم المرجعي — الخط الأساسي",
    date: "٢٠٢٦/٠١/١٠",
    score: 42,
    prevScore: null,
    domains: [
      { label: "نظم المعلومات الصحية", score: 55 },
      { label: "التشغيل البيني", score: 44 },
      { label: "الأمن والخصوصية", score: 38 },
      { label: "التحليلات والذكاء", score: 28 },
    ],
  },
]

function tierColor(score: number): string {
  if (score >= 70) return "#22C55E"
  if (score >= 40) return "#14B8A6"
  return "#3B82F6"
}

export default function AssessmentHistoryPage() {
  const trend = [...attempts].reverse()
  const w = 560
  const h = 90
  const max = Math.max(...trend.map((t) => t.score))
  const min = Math.min(...trend.map((t) => t.score))
  const pts = trend
    .map((t, i) => {
      const x = (i / (trend.length - 1)) * w
      const y = h - ((t.score - min) / (max - min || 1)) * (h - 20) - 10
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  const first = trend[0].score
  const last = trend[trend.length - 1].score

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <Link
          href="/matrix"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          مصفوفة القدرات
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">سجل التقييمات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            تتبّع تقدمك عبر كل محاولات التقييم منذ البداية
          </p>
        </div>

        {/* Trend chart */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">التقدم الكلي</p>
              <p className="text-3xl font-bold text-foreground font-mono">{last}%</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#22C55E]">
              <TrendingUp className="w-4 h-4" />
              <span>
                من {first}% إلى {last}% (+{last - first} نقطة)
              </span>
            </div>
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
            <polyline
              points={pts}
              fill="none"
              stroke="#22C55E"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {trend.map((t, i) => {
              const x = (i / (trend.length - 1)) * w
              const y = h - ((t.score - min) / (max - min || 1)) * (h - 20) - 10
              return <circle key={t.id} cx={x} cy={y} r={4} fill="#22C55E" stroke="white" strokeWidth={2} />
            })}
          </svg>
          <div className="flex justify-between mt-2">
            {trend.map((t) => (
              <span key={t.id} className="text-[10px] text-muted-foreground">{t.date}</span>
            ))}
          </div>
        </Card>

        {/* Past attempts list */}
        <div className="space-y-4">
          {attempts.map((a) => (
            <Card key={a.id} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{a.label}</h3>
                  <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{a.date}</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold font-mono" style={{ color: tierColor(a.score) }}>
                    {a.score}%
                  </p>
                  {a.prevScore !== null && (
                    <p className="text-[11px] text-[#22C55E]">
                      ↑ {a.score - a.prevScore}% عن المحاولة السابقة
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {a.domains.map((d) => (
                  <div key={d.label}>
                    <p className="text-[10px] text-muted-foreground truncate mb-1">{d.label}</p>
                    <div className="progress-track h-1.5">
                      <div
                        className="progress-fill-gradient"
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-mono mt-1" style={{ color: tierColor(d.score) }}>
                      {d.score}%
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Link href={`/assess/results/${a.id}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    عرض التفاصيل
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="text-xs">
                  <FileText className="w-3.5 h-3.5 ml-1.5" />
                  تحميل التقرير
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
