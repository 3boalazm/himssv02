"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { CapabilityRadar, type RadarDomain } from "@/components/learner/capability-radar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

const domains: RadarDomain[] = [
  { label: "نظم المعلومات الصحية", score: 78 },
  { label: "التشغيل البيني (NPHIES)", score: 65 },
  { label: "الأمن والخصوصية (PDPL)", score: 54 },
  { label: "التحليلات والذكاء", score: 42 },
  { label: "القيادة الرقمية", score: 69 },
  { label: "إدارة التغيير", score: 71 },
]

// Prose narrative per domain — advisory tone, not dry bullets (F.6)
const narratives: Record<string, string> = {
  "نظم المعلومات الصحية":
    "أساس متين في إدارة السجلات الصحية ودورة حياة البيانات. هذا المجال يمثل نقطة قوتك — ابنِ عليه في المجالات المجاورة.",
  "التشغيل البيني (NPHIES)":
    "إلمام جيد بمنصة NPHIES، لكن معايير HL7 FHIR R4 تحتاج تعميقاً. هذه فجوة عالية الأثر نظراً لمركزية التشغيل البيني في المشهد الصحي السعودي.",
  "الأمن والخصوصية (PDPL)":
    "الأساسيات حاضرة، غير أن تصنيف البيانات وضوابط PDPL التطبيقية تحتاج بناءً منهجياً — مجال حرج للامتثال المؤسسي.",
  "التحليلات والذكاء":
    "الفجوة الأعمق حالياً. نماذج التعلم الآلي السريرية مجال ناشئ عالي القيمة — الاستثمار هنا يفتح فرصاً مهنية متقدمة.",
  "القيادة الرقمية":
    "قدرة قيادية واعدة في التحول الرقمي الصحي، مع مساحة للنمو في حوكمة المبادرات واسعة النطاق.",
  "إدارة التغيير":
    "كفاءة راسخة في إدارة المشاريع والتغيير التنظيمي — أصل مهم يدعم بقية المجالات.",
}

function masteryColor(score: number): string {
  if (score >= 70) return "#0F6B6B"
  if (score >= 55) return "#3E8C7E"
  if (score >= 40) return "#C99A3A"
  return "#B45309"
}

export default function ResultsPage() {
  const overall = Math.round(domains.reduce((s, d) => s + d.score, 0) / domains.length)
  const gaps = [...domains].sort((a, b) => a.score - b.score).slice(0, 3)

  // 3-beat reveal (F.4): score → radar → gaps
  const [beat, setBeat] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setBeat(1), 400)
    const t2 = setTimeout(() => setBeat(2), 1400)
    const t3 = setTimeout(() => setBeat(3), 2400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <Link
          href="/matrix"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          عرض المصفوفة الكاملة
        </Link>

        {/* Beat 1 — score + level (hero) */}
        <div
          className="text-center mb-8"
          style={{ animation: "fadeInUp .6s ease-out both" }}
        >
          <p className="text-sm text-muted-foreground mb-2">نتيجة التقييم الشامل</p>
          <div className="text-6xl font-bold text-primary font-mono mb-2">{overall}%</div>
          <div className="text-2xl font-bold text-foreground">ممارس متقدم</div>
        </div>

        {/* Beat 2 — radar draws in */}
        <div
          className="flex justify-center mb-8"
          style={{ opacity: beat >= 1 ? 1 : 0, transition: "opacity .4s" }}
        >
          <Card className="p-6 flex flex-col items-center">
            <p className="text-sm font-semibold text-foreground mb-3">مصفوفة الأداء</p>
            {beat >= 1 && <CapabilityRadar domains={domains} size={360} animate />}
          </Card>
        </div>

        {/* Beat 3 — gaps slide up: "هذه خطتك تتشكل" */}
        <div
          style={{
            opacity: beat >= 2 ? 1 : 0,
            transform: beat >= 2 ? "translateY(0)" : "translateY(14px)",
            transition: "opacity .5s, transform .5s",
          }}
        >
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-foreground">هذه خطتك تتشكل</h2>
            <p className="text-xs text-muted-foreground mt-1">
              أهم {gaps.length} فجوات مرتبة حسب الأثر المهني
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-2 mb-8">
            {gaps.map((g, i) => (
              <Card key={g.label} className="p-4 flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: masteryColor(g.score) }}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{g.label}</p>
                </div>
                <span className="text-sm font-mono" style={{ color: masteryColor(g.score) }}>
                  {g.score}%
                </span>
              </Card>
            ))}
          </div>

          {/* Per-domain prose narrative (below the fold) */}
          <div
            style={{
              opacity: beat >= 3 ? 1 : 0,
              transition: "opacity .5s",
            }}
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 text-center">
              تفصيل المجالات
            </h3>
            <div className="max-w-3xl mx-auto space-y-4">
              {[...domains]
                .sort((a, b) => a.score - b.score)
                .map((d) => (
                  <Card key={d.label} className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground">{d.label}</h4>
                      <span
                        className="text-sm font-bold font-mono"
                        style={{ color: masteryColor(d.score) }}
                      >
                        {d.score}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {narratives[d.label]}
                    </p>
                  </Card>
                ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 max-w-md mx-auto">
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <FileText className="w-4 h-4 ml-1.5" />
              إنشاء تقرير
            </Button>
            <Link href="/paths" className="flex-1">
              <Button variant="outline" className="w-full">
                متابعة الخطة التعليمية
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
