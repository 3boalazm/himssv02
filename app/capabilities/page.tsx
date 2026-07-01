"use client"
import { ThemeToggle } from "@/components/theme-toggle"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronLeft } from "lucide-react"
import Link from "next/link"

function PublicNav() {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link href="/landing" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xs font-mono">H</span>
          </div>
          <span className="font-bold text-foreground">HLOS</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/capabilities" className="text-foreground">التصنيف</Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">الأسعار</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/dashboard">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              ابدأ مجاناً
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

// Taxonomy: domain → topic → subtopic, with concept counts
const taxonomy = [
  {
    domain: "نظم المعلومات الصحية",
    concepts: 42,
    topics: [
      { name: "إدارة السجل الصحي الإلكتروني", concepts: 14 },
      { name: "دورة حياة البيانات الصحية", concepts: 12 },
      { name: "حوكمة البيانات الصحية", concepts: 16 },
    ],
  },
  {
    domain: "التشغيل البيني والمعايير",
    concepts: 38,
    topics: [
      { name: "معايير HL7 الإصدار الثاني", concepts: 11 },
      { name: "معايير FHIR R4", concepts: 15 },
      { name: "منصة NPHIES والتكامل", concepts: 12 },
    ],
  },
  {
    domain: "الأمن والخصوصية",
    concepts: 34,
    topics: [
      { name: "نظام حماية البيانات الشخصية (PDPL)", concepts: 13 },
      { name: "تصنيف البيانات وضوابطها", concepts: 10 },
      { name: "إدارة الوصول والهوية", concepts: 11 },
    ],
  },
  {
    domain: "التحليلات والذكاء الاصطناعي",
    concepts: 28,
    topics: [
      { name: "نماذج التعلم الآلي السريرية", concepts: 15 },
      { name: "تحليلات البيانات الصحية", concepts: 13 },
    ],
  },
  {
    domain: "القيادة الرقمية وإدارة التغيير",
    concepts: 31,
    topics: [
      { name: "حوكمة المبادرات الرقمية", concepts: 12 },
      { name: "إدارة التغيير التنظيمي", concepts: 10 },
      { name: "إدارة المشاريع الصحية", concepts: 9 },
    ],
  },
]

export default function CapabilitiesPage() {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true })
  const totalConcepts = taxonomy.reduce((s, d) => s + d.concepts, 0)

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <section className="max-w-4xl mx-auto px-4 lg:px-6 py-16">
        <div className="text-center mb-4">
          <p className="text-xs text-primary font-medium mb-2">معاينة التصنيف</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
            تصنيف مجالات الجاهزية
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            {totalConcepts} مفهوماً عبر {taxonomy.length} مجالات. كل الشجرة مفتوحة للزوار
            بلا تسجيل — الشفافية جزء من مصداقية الأداة.
          </p>
        </div>

        {/* Taxonomy tree */}
        <div className="mt-10 space-y-3">
          {taxonomy.map((d, i) => (
            <Card key={d.domain} className="overflow-hidden">
              <button
                onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
                className="w-full flex items-center justify-between p-5 text-right hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {open[i] ? (
                    <ChevronDown className="w-4 h-4 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className="font-semibold text-foreground">{d.domain}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                  {d.concepts} مفهوم
                </span>
              </button>

              {open[i] && (
                <div className="border-t border-border">
                  {d.topics.map((t) => (
                    <div
                      key={t.name}
                      className="flex items-center justify-between px-5 py-3 pr-12 hover:bg-secondary/20 transition-colors"
                    >
                      <span className="text-sm text-foreground">{t.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {t.concepts}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-secondary/40">
            <h2 className="text-xl font-bold text-foreground mb-2">
              التقييم يكشف أين أنت فعلياً في هذه الشجرة
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
              يكشف التقييم موقعك الدقيق على فجواتك الحقيقية، ويبني خطتك بناءً عليها.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                ابدأ التقييم المجاني
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  )
}
