"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, UserPlus, ClipboardList, Bell, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

const steps = [
  { icon: Building2, title: "معلومات المؤسسة", desc: "اسم المؤسسة، القطاع، وشعارها" },
  { icon: UserPlus, title: "دعوة الأعضاء", desc: "أضف أول 10 أعضاء من فريقك" },
  { icon: ClipboardList, title: "تعيين أول تقييم", desc: "حدّد التقييم الإلزامي وموعده" },
  { icon: Bell, title: "تفعيل التذكيرات", desc: "تذكيرات تلقائية للأعضاء غير النشطين" },
]

export default function OrgOnboardingPage() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState<Set<number>>(new Set())

  const markDone = () => {
    setDone((prev) => new Set(prev).add(step))
    if (step < steps.length - 1) setStep((s) => s + 1)
  }

  const allDone = done.size === steps.length

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm font-mono">H</span>
          </div>
          <span className="text-xl font-bold text-foreground">HLOS</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-foreground">إعداد حساب المؤسسة</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {done.size} من {steps.length} خطوات مكتملة — يمكنك إكمال الإعداد لاحقاً في أي وقت
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Checklist sidebar */}
          <div className="space-y-2">
            {steps.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setStep(i)}
                className={`w-full text-right p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                  i === step
                    ? "border-primary bg-primary/5"
                    : done.has(i)
                      ? "border-border bg-secondary/30"
                      : "border-border"
                }`}
              >
                {done.has(i) ? (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <s.icon
                    className={`w-5 h-5 flex-shrink-0 ${i === step ? "text-primary" : "text-muted-foreground"}`}
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{s.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active step detail */}
          <Card className="p-6 flex flex-col animate-in-up">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              {(() => {
                const Icon = steps[step].icon
                return <Icon className="w-5 h-5 text-primary" />
              })()}
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1">{steps[step].title}</h2>
            <p className="text-sm text-muted-foreground mb-5 flex-1">{steps[step].desc}</p>

            {step === 0 && (
              <p className="text-xs text-muted-foreground mb-4">
                يمكنك تعديل هذه البيانات لاحقاً من إعدادات المؤسسة.
              </p>
            )}
            {step === 1 && (
              <p className="text-xs text-muted-foreground mb-4">
                يمكنك دعوة الأعضاء واحداً تلو الآخر أو رفع قائمة بريدية دفعة واحدة.
              </p>
            )}
            {step === 2 && (
              <p className="text-xs text-muted-foreground mb-4">
                التقييم الإلزامي يظهر لكل الأعضاء تلقائياً بمجرد التفعيل.
              </p>
            )}
            {step === 3 && (
              <p className="text-xs text-muted-foreground mb-4">
                التذكيرات تُرسل تلقائياً للأعضاء غير النشطين كل أسبوع.
              </p>
            )}

            <Button
              onClick={markDone}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mt-auto"
            >
              {done.has(step) ? "تم" : "إكمال هذه الخطوة"}
              <ArrowLeft className="w-4 h-4 mr-1.5" />
            </Button>
          </Card>
        </div>

        <div className="flex items-center justify-between mt-6">
          <Link href="/org" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            تخطّي والذهاب للوحة التحكم
          </Link>
          {allDone && (
            <Link href="/org">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                الذهاب إلى لوحة التحكم
                <ArrowRight className="w-4 h-4 mr-1.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
