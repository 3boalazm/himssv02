"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Target, Sparkles, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

const roles = ["مسؤول نظم معلومات", "مسؤول أمن معلومات", "مدير تقنية", "محلل بيانات صحية", "أخرى"]
const experience = ["أقل من سنتين", "٢–٥ سنوات", "٦–١٠ سنوات", "أكثر من ١٠ سنوات"]
const goals = [
  "أعرف موقعي الحقيقي في السوق",
  "أسد فجوة معرفية محددة",
  "أستعد لدور أعلى",
  "متطلب من مؤسستي",
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState("")
  const [exp, setExp] = useState("")
  const [goal, setGoal] = useState("")

  const canContinue = step === 1 ? role && exp : step === 2 ? !!goal : true

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm font-mono">H</span>
          </div>
          <span className="text-xl font-bold text-foreground">HLOS</span>
        </div>

        {/* Step indicator — plain numbered dots, no gamified progress ring */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  s === step
                    ? "bg-primary text-primary-foreground"
                    : s < step
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className={`w-8 h-0.5 ${s < step ? "bg-primary/40" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <Card className="p-6 animate-in-up">
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-primary" />
                <h1 className="text-lg font-bold text-foreground">عرّفنا بنفسك</h1>
              </div>
              <p className="text-xs text-muted-foreground mb-5">
                يساعدنا هذا في تخصيص التقييم والمحتوى المناسب لخبرتك
              </p>

              <p className="text-sm font-medium text-foreground mb-2">دورك الوظيفي</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`text-sm text-right p-3 rounded-lg border transition-colors ${
                      role === r
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <p className="text-sm font-medium text-foreground mb-2">سنوات الخبرة</p>
              <div className="grid grid-cols-2 gap-2">
                {experience.map((e) => (
                  <button
                    key={e}
                    onClick={() => setExp(e)}
                    className={`text-sm text-right p-3 rounded-lg border transition-colors ${
                      exp === e
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-primary" />
                <h1 className="text-lg font-bold text-foreground">ما هدفك من المنصة؟</h1>
              </div>
              <p className="text-xs text-muted-foreground mb-5">
                يحدد هذا كيف نرتب أولويات خطتك التعليمية بعد التقييم
              </p>

              <div className="space-y-2">
                {goals.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`w-full text-sm text-right p-3.5 rounded-lg border transition-colors ${
                      goal === g
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <h1 className="text-lg font-bold text-foreground">جاهز تبدأ</h1>
              </div>
              <p className="text-xs text-muted-foreground mb-5">
                التقييم الكامل قدامك — ٤٠ سؤالاً موضوعياً عبر ٧ مجالات، والنتيجة فورية عند الانتهاء
              </p>

              <Card className="p-4 bg-secondary/30 space-y-2 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">الدور</span>
                  <span className="text-foreground font-medium">{role || "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">الخبرة</span>
                  <span className="text-foreground font-medium">{exp || "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">الهدف</span>
                  <span className="text-foreground font-medium">{goal || "—"}</span>
                </div>
              </Card>

              <Link href="/dashboard" className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  ابدأ التقييم المجاني
                </Button>
              </Link>
            </div>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                السابق
              </button>
            ) : (
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                تخطّي الآن
              </Link>
            )}

            {step < 3 && (
              <Button
                size="sm"
                disabled={!canContinue}
                onClick={() => setStep((s) => s + 1)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                التالي
                <ArrowLeft className="w-4 h-4 mr-1.5" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
