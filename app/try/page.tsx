"use client"

import { useState } from "react"
import Link from "next/link"
import { PublicNav } from "@/components/public-nav"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowLeft, RotateCcw } from "lucide-react"

interface TrialOption {
  id: string
  text: string
}
interface TrialQuestion {
  domain: string
  stem: string
  options: TrialOption[]
  correct: string
  rationale: string
}

const QUESTIONS: TrialQuestion[] = [
  {
    domain: "التشغيل البيني والمعايير",
    stem: "أي معيار صُمّم أساساً لتبادل البيانات الصحية عبر واجهات ويب حديثة (RESTful APIs) ويُعدّ الأساس في تكامل NPHIES؟",
    options: [
      { id: "a", text: "HL7 v2.x — الرسائل التقليدية" },
      { id: "b", text: "FHIR — Fast Healthcare Interoperability Resources" },
      { id: "c", text: "DICOM — تبادل الصور الطبية" },
      { id: "d", text: "ICD-10 — الترميز التشخيصي" },
    ],
    correct: "b",
    rationale:
      "FHIR هو المعيار الحديث القائم على REST/JSON وهو أساس تكامل NPHIES. HL7 v2 رسائل قديمة، وDICOM للصور، وICD-10 للترميز التشخيصي.",
  },
  {
    domain: "الأمن والخصوصية",
    stem: "عند اكتشاف وصول غير مصرّح به إلى بيانات مرضى، ما الإجراء الأول الأنسب وفق مبادئ الاستجابة للحوادث؟",
    options: [
      { id: "a", text: "حذف السجلّات المتأثرة فوراً لمنع التسرّب" },
      { id: "b", text: "احتواء الحادثة وعزل النظام مع الحفاظ على الأدلة" },
      { id: "c", text: "الانتظار حتى تأكيد حجم الضرر قبل أي إجراء" },
      { id: "d", text: "إبلاغ وسائل الإعلام فوراً لضمان الشفافية" },
    ],
    correct: "b",
    rationale:
      "الاحتواء مع حفظ الأدلة أولاً. الحذف الفوري يُتلف الأدلة، والانتظار يوسّع الضرر، والإبلاغ يتبع القنوات النظامية (PDPL) لا الإعلام.",
  },
  {
    domain: "نظم المعلومات الصحية",
    stem: "توقّف نظام السجل الطبي (EMR) في قسم الطوارئ ولا يستجيب. ما الأولوية الفورية الصحيحة؟",
    options: [
      { id: "a", text: "تشخيص السبب الجذري قبل أي إجراء آخر" },
      { id: "b", text: "تفعيل بروتوكول التوقّف المخطّط (downtime) لضمان استمرارية الرعاية" },
      { id: "c", text: "إعادة تشغيل الخوادم عشوائياً حتى يعمل النظام" },
      { id: "d", text: "تصعيد المشكلة وانتظار قرار الإدارة" },
    ],
    correct: "b",
    rationale:
      "استمرارية الرعاية أولاً عبر بروتوكول التوقّف المخطّط (BCP)، ثم التشخيص. إعادة التشغيل العشوائي أو الانتظار السلبي يزيدان المخاطر.",
  },
]

const arLetter = (id: string) => (id === "a" ? "أ" : id === "b" ? "ب" : id === "c" ? "ج" : "د")

export default function TryPage() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  const q = QUESTIONS[current]
  const total = QUESTIONS.length

  const check = () => {
    if (!selected || revealed) return
    if (selected === q.correct) setCorrectCount((c) => c + 1)
    setRevealed(true)
  }

  const next = () => {
    if (current < total - 1) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      setDone(true)
    }
  }

  const restart = () => {
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setCorrectCount(0)
    setDone(false)
  }

  // ── Result ──
  if (done) {
    const band =
      correctCount === 3 ? "أداء قوي" : correctCount === 2 ? "أداء جيد" : "بداية جيدة"
    const bandColor = correctCount >= 2 ? "#0F6B6B" : "#B45309"
    const msg =
      correctCount === 3
        ? "أساس متين. التقييم الكامل هيقيس عمقك عبر كل المجالات بدقة."
        : correctCount === 2
          ? "قاعدة جيدة وفيه مجال للتطوير. التقييم الكامل هيوريك فجواتك بالظبط."
          : "دي ٣ أسئلة بس — التقييم الكامل (٤٠ سؤال) هيرسم صورة دقيقة لمستواك ونقاط قوتك."

    return (
      <div className="min-h-screen bg-background">
        <PublicNav />
        <main className="max-w-2xl mx-auto px-4 lg:px-6 py-12 lg:py-20">
          <p className="text-xs text-primary font-medium mb-2 text-center">انتهت التجربة</p>
          <Card className="p-8 text-center mb-6">
            <p className="text-sm text-muted-foreground mb-3">نتيجتك في التجربة</p>
            <p className="text-6xl font-bold font-mono leading-none" style={{ color: bandColor }}>
              {correctCount}<span className="text-3xl text-muted-foreground">/{total}</span>
            </p>
            <p className="text-base font-semibold mt-3" style={{ color: bandColor }}>{band}</p>
            <p className="text-sm text-foreground/70 leading-relaxed mt-4 max-w-md mx-auto" style={{ lineHeight: 1.8 }}>
              {msg}
            </p>
          </Card>

          <Card className="p-6 bg-secondary/40 mb-8">
            <p className="text-sm text-foreground/80 leading-relaxed" style={{ lineHeight: 1.8 }}>
              التقييم الكامل مجاني بالكامل — <strong className="text-foreground">التشخيص مجاني</strong>، وتبدأ رحلة
              التعلّم من فجواتك الحقيقية. ٤٠ سؤالاً، والنتيجة فورية عند الانتهاء.
            </p>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                أنشئ حساب وابدأ التقييم الكامل
                <ArrowLeft className="w-4 h-4 mr-1.5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                شوف الباقات
              </Button>
            </Link>
          </div>

          <div className="text-center mt-6">
            <button onClick={restart} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة التجربة
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  // ── Question ──
  const optionClass = (id: string) => {
    if (!revealed) {
      return selected === id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/40"
    }
    if (id === q.correct) return "border-primary bg-primary/10"
    if (id === selected) return "border-[#B45309] bg-[#B45309]/[0.08]"
    return "border-border opacity-60"
  }
  const circleClass = (id: string) => {
    if (!revealed) {
      return selected === id ? "border-primary bg-primary text-white" : "border-muted-foreground/30 text-muted-foreground"
    }
    if (id === q.correct) return "border-primary bg-primary text-white"
    if (id === selected) return "border-[#B45309] bg-[#B45309] text-white"
    return "border-muted-foreground/30 text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="max-w-2xl mx-auto px-4 lg:px-6 py-10 lg:py-14">
        {/* Intro (Q1 only) */}
        {current === 0 && !revealed && (
          <div className="mb-8">
            <p className="text-xs text-primary font-medium mb-2">جرّب بلا تسجيل</p>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">٣ أسئلة من التقييم الحقيقي</h1>
            <p className="text-sm text-foreground/70 leading-relaxed">
              جاوب وشوف الإجابة الصحيحة والتعليل فوراً — من غير حساب. دي عيّنة من أسئلة تقييم الجاهزية.
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">السؤال {current + 1} من {total} · {q.domain}</span>
        </div>
        <div className="progress-track h-1.5 rounded-full mb-6 overflow-hidden">
          <div
            className="progress-fill-gradient"
            style={{ width: `${((current + (revealed ? 1 : 0)) / total) * 100}%`, "--pulse-color": "rgba(20,184,166,.5)" } as React.CSSProperties}
          />
        </div>

        {/* Question card */}
        <Card className="p-6 mb-5">
          <p className="text-lg text-foreground leading-relaxed mb-6" style={{ lineHeight: 1.8 }}>{q.stem}</p>
          <div className="space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => !revealed && setSelected(opt.id)}
                disabled={revealed}
                className={`w-full text-right p-4 rounded-lg border transition-colors flex items-center gap-3 ${optionClass(opt.id)}`}
              >
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${circleClass(opt.id)}`}>
                  {revealed && opt.id === q.correct ? <CheckCircle2 className="w-4 h-4" /> : arLetter(opt.id)}
                </span>
                <span className="text-sm text-foreground">{opt.text}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Rationale after reveal */}
        {revealed && (
          <Card className="p-5 mb-5 bg-secondary/40" role="status" aria-live="polite">
            <p className="text-xs font-bold text-primary mb-2">
              {selected === q.correct ? "إجابة صحيحة ✓" : "الإجابة الأمثل"}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed" style={{ lineHeight: 1.8 }}>{q.rationale}</p>
          </Card>
        )}

        {/* Action */}
        <div className="flex items-center justify-end gap-3">
          {!revealed ? (
            <Button onClick={check} disabled={!selected} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
              تحقّق
            </Button>
          ) : (
            <Button onClick={next} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              {current < total - 1 ? "التالي" : "شوف النتيجة"}
              <ArrowLeft className="w-4 h-4 mr-1.5" />
            </Button>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
