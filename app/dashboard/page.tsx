import { Sidebar } from "@/components/dashboard/sidebar"
import { CapabilityRadar, type RadarDomain } from "@/components/learner/capability-radar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, BookOpen, Target, Lock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const domains: RadarDomain[] = [
  { label: "نظم", score: 78 },
  { label: "التشغيل البيني", score: 65 },
  { label: "الأمن", score: 54 },
  { label: "التحليلات", score: 42 },
  { label: "القيادة", score: 69 },
  { label: "التغيير", score: 71 },
]

const recentActivity = [
  { icon: CheckCircle2, label: "أكملت درس: أساسيات HL7 FHIR", time: "اليوم", done: true },
  { icon: Target, label: "جلسة تدريب: التشغيل البيني", time: "أمس", done: true },
  { icon: BookOpen, label: "بدأت درس: تصنيف بيانات PDPL", time: "منذ يومين", done: false },
]

// Readiness trend (sparkline points) — last assessments
const trend = [51, 55, 58, 63]

export default function LearnerDashboardPage() {
  const overall = Math.round(domains.reduce((s, d) => s + d.score, 0) / domains.length)

  // sparkline path
  const w = 120
  const h = 36
  const max = Math.max(...trend)
  const min = Math.min(...trend)
  const pts = trend
    .map((v, i) => {
      const x = (i / (trend.length - 1)) * w
      const y = h - ((v - min) / (max - min || 1)) * h
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">لوحة المتعلم</h1>
          <p className="text-sm text-muted-foreground mt-1">
            سارة المطيري · مسؤول نظم المعلومات
          </p>
        </div>

        {/* Next-best-action hero — the single most important element */}
        <Card className="p-6 mb-6 border-primary/30 bg-primary/5 animate-in-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-primary font-medium mb-1">الخطوة التالية</p>
              <h2 className="text-lg font-bold text-foreground">
                أكمل خطتك: إغلاق فجوة التشغيل البيني
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                الدرس التالي: معايير HL7 FHIR R4 · ~25 دقيقة
              </p>
            </div>
            <Link href="/lessons/fhir-r4">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap">
                متابعة
              </Button>
            </Link>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Readiness score + sparkline */}
          <Card className="p-6 animate-in-up stagger-1 card-interactive">
            <p className="text-xs text-muted-foreground mb-1">الجاهزية الحالية</p>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-primary font-mono">{overall}%</span>
              <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }}>
                <polyline
                  points={pts}
                  fill="none"
                  stroke="#0F6B6B"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-primary">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+6% منذ التقييم السابق</span>
            </div>
          </Card>

          {/* Mini matrix — same CapabilityRadar component, no labels */}
          <Card className="p-6 flex flex-col items-center justify-center animate-in-up stagger-2 card-interactive">
            <p className="text-xs text-muted-foreground mb-2 self-start">مصفوفة الجاهزية</p>
            <CapabilityRadar domains={domains} size={150} showLabels={false} />
            <Link
              href="/matrix"
              className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1"
            >
              عرض المصفوفة الكاملة
              <ArrowLeft className="w-3 h-3" />
            </Link>
          </Card>

          {/* Path progress ring */}
          <Card className="p-6 animate-in-up stagger-3 card-interactive">
            <p className="text-xs text-muted-foreground mb-3">مسار الجاهزية</p>
            <div className="flex items-center justify-center">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#F0EEEA" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#0F6B6B"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - 0.6)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-foreground font-mono">60%</span>
                  <span className="text-[10px] text-muted-foreground">مكتمل</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              9 من 15 عنصر المسار
            </p>
          </Card>
        </div>

        {/* Recent activity */}
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">النشاط الأخير</h3>
            <Link href="/paths" className="text-xs text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <a.icon
                  className={`w-4 h-4 flex-shrink-0 ${a.done ? "text-primary" : "text-muted-foreground"}`}
                />
                <span className="flex-1 text-sm text-foreground">{a.label}</span>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Free-tier upsell — specific to real gap (F.11) */}
        <Card className="mt-6 p-6 bg-secondary/40">
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                أنت تعرف الآن وجود الفجوة — الباقة الاحترافية تعطيك الخطوات الدقيقة لإغلاقها
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                فجوتك الرابعة: حوكمة البيانات — التحليل الكامل والخطة المخصصة في الباقة الاحترافية
              </p>
            </div>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
            >
              استكشف الاحترافية
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
