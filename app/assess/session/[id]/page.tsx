"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Flag, Save, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const question = {
  number: 12,
  total: 40,
  domain: "التشغيل البيني والمعايير",
  stem: "أي معيار يُستخدم بشكل أساسي لتبادل البيانات الصحية بين الأنظمة المختلفة في المستشفيات الحديثة، ويوفر بنية قائمة على معايير الويب (RESTful APIs)؟",
  options: [
    { id: "a", text: "HL7 v2.x الرسائل التقليدية" },
    { id: "b", text: "FHIR (Fast Healthcare Interoperability Resources)" },
    { id: "c", text: "DICOM لتبادل الصور الطبية" },
    { id: "d", text: "ICD-10 للترميز التشخيصي" },
  ],
}

export default function AssessSessionPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [flagged, setFlagged] = useState(false)
  const [seconds, setSeconds] = useState(2340) // mock: 39 min left

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const mm = Math.floor(seconds / 60)
  const ss = seconds % 60

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal exam header — no sidebar, distraction-free */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs font-mono">H</span>
            </div>
            <span className="text-sm font-medium text-foreground">تقييم الجاهزية</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-mono text-foreground bg-secondary px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-muted-foreground" />
            {mm}:{ss.toString().padStart(2, "0")}
          </div>
        </div>
        {/* Progress */}
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(question.number / question.total) * 100}%` }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Question meta */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground">
            السؤال {question.number} من {question.total} · {question.domain}
          </span>
          <button
            onClick={() => setFlagged((f) => !f)}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              flagged ? "text-[#B45309]" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${flagged ? "fill-[#B45309]" : ""}`} />
            {flagged ? "معلّم للمراجعة" : "تعليم للمراجعة"}
          </button>
        </div>

        {/* Question */}
        <Card className="p-6 mb-6">
          <p className="text-lg text-foreground leading-relaxed mb-6" style={{ lineHeight: 1.8 }}>
            {question.stem}
          </p>

          <div className="space-y-3">
            {question.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`w-full text-right p-4 rounded-lg border transition-colors flex items-center gap-3 ${
                  selected === opt.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-secondary/40"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    selected === opt.id
                      ? "border-primary bg-primary text-white"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {opt.id === "a" ? "أ" : opt.id === "b" ? "ب" : opt.id === "c" ? "ج" : "د"}
                </span>
                <span className="text-sm text-foreground">{opt.text}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Save indicator + nav */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Save className="w-3.5 h-3.5" />
            تم الحفظ تلقائياً
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4 ml-1" />
              السابق
            </Button>
            {question.number === question.total ? (
              <Link href="/assess/results/1">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  تسليم التقييم
                </Button>
              </Link>
            ) : (
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                التالي
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
