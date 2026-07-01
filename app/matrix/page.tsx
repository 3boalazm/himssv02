import { Sidebar } from "@/components/dashboard/sidebar"
import { CapabilityRadar, type RadarDomain } from "@/components/learner/capability-radar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, TrendingUp } from "lucide-react"

// HLOS domains — blueprint-confirmed. Sequential teal→amber, no traffic-light.
const domains: RadarDomain[] = [
  { label: "نظم المعلومات الصحية", score: 78 },
  { label: "التشغيل البيني (NPHIES)", score: 65 },
  { label: "الأمن والخصوصية (PDPL)", score: 54 },
  { label: "التحليلات والذكاء", score: 42 },
  { label: "القيادة الرقمية", score: 69 },
  { label: "إدارة التغيير", score: 71 },
]

// Concept heat list — the actionable layer. Ordered by gap severity.
const conceptHeat = [
  { concept: "معايير HL7 FHIR R4", domain: "التشغيل البيني", mastery: 38 },
  { concept: "تصنيف بيانات PDPL", domain: "الأمن والخصوصية", mastery: 44 },
  { concept: "نماذج التعلم الآلي السريرية", domain: "التحليلات والذكاء", mastery: 41 },
  { concept: "حوكمة البيانات الصحية", domain: "نظم المعلومات", mastery: 52 },
  { concept: "تكامل NPHIES مع الأنظمة", domain: "التشغيل البيني", mastery: 58 },
  { concept: "إدارة دورة حياة السجل الصحي", domain: "نظم المعلومات", mastery: 74 },
]

// Level bands
const levels = [
  { ar: "مبتدئ", en: "Beginner" },
  { ar: "ممارس", en: "Practitioner" },
  { ar: "معماري", en: "Architect" },
  { ar: "تنفيذي", en: "Executive" },
]

function levelFor(score: number) {
  if (score >= 80) return { ar: "تنفيذي", en: "Executive" }
  if (score >= 60) return { ar: "معماري", en: "Architect" }
  if (score >= 35) return { ar: "ممارس", en: "Practitioner" }
  return { ar: "مبتدئ", en: "Beginner" }
}

function masteryColor(score: number): string {
  if (score >= 70) return "#22C55E"
  if (score >= 40) return "#F59E0B"
  return "#EF4444"
}

export default function MatrixPage() {
  const overall = Math.round(domains.reduce((s, d) => s + d.score, 0) / domains.length)
  const overallLevel = levelFor(overall)
  // Top 3 gaps (free tier sees these by name)
  const gaps = [...domains].sort((a, b) => a.score - b.score).slice(0, 3)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">مصفوفة الجاهزية المهنية</h1>
          <p className="text-sm text-muted-foreground mt-1">
            تقييم شامل · {domains.length} مجالات · متوسط الجاهزية {overall}%
            <span className="text-muted-foreground/70"> · {overallLevel.en} Level</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Radar — the signature visual */}
          <Card className="lg:col-span-3 p-6 flex flex-col items-center justify-center">
            <div className="flex items-center gap-4 mb-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full glow-green" style={{ background: "#22C55E" }} />
                قوي · Strong
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full glow-amber" style={{ background: "#F59E0B" }} />
                متوسط · Moderate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full glow-red" style={{ background: "#EF4444" }} />
                ضعيف · Needs Focus
              </span>
            </div>
            <CapabilityRadar domains={domains} size={400} />
            <p className="text-[11px] text-muted-foreground mt-2">
              مقياس الجاهزية — أحمر → عنبري → أخضر
            </p>
          </Card>

          {/* Domain bars — secondary, primary on mobile */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-sm font-semibold text-foreground mb-1">الأداء حسب المجال</h3>
            <p className="text-xs text-muted-foreground mb-4">مرتبة من الأعلى إتقاناً</p>
            <div className="space-y-3">
              {[...domains]
                .sort((a, b) => b.score - a.score)
                .map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-foreground">{d.label}</span>
                      <span
                        className="text-xs font-bold font-mono"
                        style={{ color: masteryColor(d.score) }}
                      >
                        {d.score}%
                      </span>
                    </div>
                    <div className="progress-track h-3">
                      <div
                        className="progress-fill-gradient animate-pulse-glow"
                        style={
                          {
                            width: `${d.score}%`,
                            "--pulse-color":
                              masteryColor(d.score) === "#22C55E"
                                ? "rgba(34,197,94,.55)"
                                : masteryColor(d.score) === "#F59E0B"
                                  ? "rgba(245,158,11,.55)"
                                  : "rgba(239,68,68,.55)",
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                ))}
            </div>

            {/* Level bands legend */}
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-[10px] text-muted-foreground mb-2">مستويات الجاهزية</p>
              <div className="flex gap-1">
                {levels.map((lvl, i) => (
                  <div key={lvl.en} className="flex-1 text-center">
                    <div
                      className="h-1.5 rounded-full mb-1 glow-pulse"
                      style={{
                        background: [`#EF4444`, `#F59E0B`, `#F59E0B`, `#22C55E`][i],
                        // @ts-ignore custom property for glow color
                        "--pulse-color": [
                          "rgba(239,68,68,.5)",
                          "rgba(245,158,11,.5)",
                          "rgba(245,158,11,.5)",
                          "rgba(34,197,94,.5)",
                        ][i],
                      } as React.CSSProperties}
                    />
                    <span className="text-[9px] text-muted-foreground block">{lvl.ar}</span>
                    <span className="text-[8px] text-muted-foreground/60">{lvl.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Concept heat list — actionable */}
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">قائمة حرارة المفاهيم</h3>
              <p className="text-xs text-muted-foreground">مرتبة حسب الأثر المهني المتوقع</p>
            </div>
          </div>
          <div className="space-y-2">
            {conceptHeat.map((c) => (
              <div
                key={c.concept}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/40"
              >
                <div>
                  <p className="text-sm text-foreground">{c.concept}</p>
                  <p className="text-[11px] text-muted-foreground">{c.domain}</p>
                </div>
                <div className="flex items-center gap-2 min-w-[120px]">
                  <div className="flex-1 h-1.5 rounded-full bg-background overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${c.mastery}%`, background: masteryColor(c.mastery) }}
                    />
                  </div>
                  <span
                    className="text-xs font-bold font-mono w-9 text-left"
                    style={{ color: masteryColor(c.mastery) }}
                  >
                    {c.mastery}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Gap ranking — free sees top 3 by name; pro sees full + plan */}
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-foreground">ترتيب الفجوات</h3>
            <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              مجاني
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">الفجوة فرصة تطوير لا إخفاق</p>

          <div className="space-y-2">
            {gaps.map((g, i) => (
              <div
                key={g.label}
                className="flex items-center gap-3 p-3 rounded-lg border border-border"
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: masteryColor(g.score) }}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{g.label}</p>
                </div>
                <span className="text-xs font-mono" style={{ color: masteryColor(g.score) }}>
                  {g.score}%
                </span>
              </div>
            ))}
          </div>

          {/* Pro lock — specific, not generic (F.11) */}
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-3">
            <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-foreground font-medium">
                فجوتك الرابعة: حوكمة البيانات
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                التحليل الكامل والخطة المخصصة لكل فجوة متاح في الباقة الاحترافية
              </p>
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0">
              الترقية
            </Button>
          </div>
        </Card>

        {/* Trend teaser */}
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span>تحسّن الجاهزية بمقدار 6% منذ التقييم السابق (مايو 2026)</span>
        </div>
      </main>
    </div>
  )
}
