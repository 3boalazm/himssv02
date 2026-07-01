"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const SITUATION = {
  timestamp: "02:52 · تحديث الموقف",
  update: "بعد استجابتك الأولية، تعذّر إعادة تشغيل خادم EMR الرئيسي عبر واجهة إدارة النظام. فريق البنية التحتية يُفيد بأن مشكلة محتملة في مساحة القرص أدت إلى تعطّل خدمة قاعدة البيانات. خادم الـ failover جاهز لكنه لم يُفعَّل بعد.",
  role: "دورك الآن",
  roleDesc: "مدير الشبكة يسألك: هل نُفعّل الخادم البديل فوراً مع احتمال فقدان آخر 8 دقائق من البيانات — أم نواصل المحاولة لاستعادة الخادم الرئيسي؟",
}

const OPTIONS = [
  {
    id: "a",
    label: "تفعيل failover فوراً وقبول فقدان بيانات الـ 8 دقائق",
    rationale: "الاستمرارية الكاملة للطوارئ أهم — الـ 8 دقائق يمكن استرجاعها من النماذج الورقية لاحقاً.",
  },
  {
    id: "b",
    label: "إعطاء 10 دقائق إضافية لمحاولة استعادة الخادم الرئيسي",
    rationale: "إن نجح، نتجنب أي فقدان للبيانات — لكن الضغط على الطوارئ يزداد.",
  },
  {
    id: "c",
    label: "تفعيل failover مع إيقاف أي كتابة جديدة ريثما يعود الخادم الرئيسي",
    rationale: "حل وسط: استمرارية القراءة + حماية اتساق البيانات.",
  },
  {
    id: "d",
    label: "تصعيد فوري لمدير المستشفى وانتظار القرار",
    rationale: "القرار يتجاوز صلاحياتك التقنية ويتطلب موافقة إدارية.",
  },
]

export default function PlayPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [selected,  setSelected]  = useState<string | null>(null)
  const [timeLeft,  setTimeLeft]  = useState(180) // 3 minute decision timer
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (submitted || timeLeft <= 0) return
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, submitted])

  const isWarning   = timeLeft <= 10 && !submitted
  const timerColor  = isWarning ? "var(--scenario-accent-warning, #B45309)" : "rgba(255,255,255,0.55)"
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const secs = String(timeLeft % 60).padStart(2, "0")

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #16242F 0%, #1E1B2E 100%)",
        fontFamily: "'Zak', 'IBM Plex Sans Arabic', system-ui, sans-serif",
      }}
    >
      {/* Progress bar — glass-panel, thin */}
      <div
        className="glass-panel"
        style={{ borderRadius: 0, padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: "'IBM Plex Mono', monospace" }}>
          خطوة 2 من 5 · انقطاع EMR
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Step dots */}
          {[1,2,3,4,5].map(n => (
            <span key={n} style={{ width: 8, height: 8, borderRadius: "50%", background: n <= 2 ? "#0F6B6B" : "rgba(255,255,255,0.18)", display: "inline-block" }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 32px 60px" }}>

        {/* Situation update — glass-panel-elevated */}
        <div className="glass-panel-elevated" style={{ padding: "24px 28px", marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
            {SITUATION.timestamp}
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.82)", lineHeight: 1.8, marginBottom: 18 }}>
            {SITUATION.update}
          </p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
              {SITUATION.role}
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>{SITUATION.roleDesc}</p>
          </div>
        </div>

        {/* Timer */}
        <div
          className="glass-panel"
          style={{ padding: "8px 16px", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10 }}
        >
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>وقت القرار</span>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: timerColor, transition: "color 500ms ease" }}>
            {mins}:{secs}
          </span>
        </div>

        {/* Choices */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {OPTIONS.map(opt => {
            const isSelected = selected === opt.id
            return (
              <div
                key={opt.id}
                onClick={() => !submitted && setSelected(opt.id)}
                className="glass-panel"
                style={{
                  padding: "16px 20px",
                  cursor: submitted ? "default" : "pointer",
                  borderColor: isSelected ? "rgba(15,107,107,0.6)" : undefined,
                  background: isSelected ? "rgba(15,107,107,0.15)" : undefined,
                  transition: "opacity 150ms ease, border-color 150ms ease, background 150ms ease",
                }}
              >
                <p style={{ fontSize: 14, fontWeight: isSelected ? 600 : 400, color: "rgba(255,255,255,0.88)", lineHeight: 1.5, marginBottom: 8 }}>
                  {opt.label}
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  {opt.rationale}
                </p>
              </div>
            )
          })}
        </div>

        {/* Submit — solid teal (primary action over glass) */}
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <button
            disabled={!selected || submitted}
            onClick={() => setSubmitted(true)}
            style={{
              height: 44, padding: "0 28px",
              background: selected && !submitted ? "#0F6B6B" : "rgba(255,255,255,0.1)",
              color: selected && !submitted ? "#fff" : "rgba(255,255,255,0.3)",
              border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
              cursor: selected && !submitted ? "pointer" : "not-allowed",
              fontFamily: "'Zak', 'IBM Plex Sans Arabic', sans-serif",
              transition: "background 150ms ease, color 150ms ease",
            }}
          >
            {submitted ? "تم تسجيل قرارك ✓" : "تأكيد القرار"}
          </button>
          {submitted && (
            <button
              onClick={() => router.push(`/scenarios/${params.id}/play`)}
              style={{ height: 44, padding: "0 20px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 13, cursor: "pointer", fontFamily: "'Zak', 'IBM Plex Sans Arabic', sans-serif" }}
            >
              الخطوة التالية ←
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
