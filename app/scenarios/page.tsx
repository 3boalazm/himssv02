"use client"

import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

const SCENARIOS = [
  {
    id: "emr-outage",
    title: "انقطاع EMR في قسم الطوارئ",
    role: "مدير تقنية المعلومات",
    setting: "قسم الطوارئ · الساعة 02:40",
    difficulty: "سهل",
    duration: "30 د",
    domain: "نظم المعلومات",
    free: true,
  },
  {
    id: "nphies-fail",
    title: "فشل تكامل NPHIES",
    role: "مهندس التشغيل البيني",
    setting: "بيئة الإنتاج · قبيل موعد الإرسال",
    difficulty: "متوسط",
    duration: "45 د",
    domain: "التشغيل البيني",
    free: false,
  },
  {
    id: "pdpl-breach",
    title: "خرق بيانات PDPL",
    role: "مسؤول أمن المعلومات",
    setting: "مركز البيانات · تنبيه الساعة 03:15",
    difficulty: "صعب",
    duration: "60 د",
    domain: "الأمن والخصوصية",
    free: false,
  },
  {
    id: "data-migration",
    title: "ترحيل بيانات مستشفى",
    role: "مدير مشاريع تقنية",
    setting: "مرحلة go-live · قاعدة بيانات قديمة",
    difficulty: "متوسط",
    duration: "50 د",
    domain: "الحوكمة الرقمية",
    free: false,
  },
  {
    id: "pharmacy-golive",
    title: "إطلاق نظام صيدلية",
    role: "مسؤول نظم الصيدلة",
    setting: "يوم الإطلاق · طاقم الليل",
    difficulty: "متوسط",
    duration: "40 د",
    domain: "نظم المعلومات",
    free: false,
  },
  {
    id: "ransomware",
    title: "استعادة من هجوم فدية",
    role: "مدير تقنية المعلومات",
    setting: "أزمة كاملة · جميع الأنظمة متأثرة",
    difficulty: "صعب",
    duration: "75 د",
    domain: "الأمن والخصوصية",
    free: false,
  },
]

const diffColor = (d: string) =>
  d === "سهل" ? "rgba(15,107,107,0.8)" : d === "متوسط" ? "rgba(180,83,9,0.8)" : "rgba(163,45,45,0.8)"

export default function ScenariosPage() {
  const router = useRouter()

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #16242F 0%, #1E1B2E 100%)",
        fontFamily: "'Zak', 'IBM Plex Sans Arabic', system-ui, sans-serif",
        padding: "0",
      }}
    >
      {/* Hero — plain text on backdrop, no glass */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "52px 32px 36px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(127,119,221,0.75)", marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>
          HLOS · وضع السيناريوهات
        </p>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: "var(--scenario-text-primary, rgba(255,255,255,0.92))", letterSpacing: "-.5px", lineHeight: 1.2, marginBottom: 12 }}>
          سيناريوهات هندسة تقنية المعلومات الصحية
        </h1>
        <p style={{ fontSize: 16, color: "var(--scenario-text-secondary, rgba(255,255,255,0.68))", lineHeight: 1.75, maxWidth: 540 }}>
          قرارات حقيقية في مواقف مستشفياتنا — كل سيناريو يقيس استجابتك في ضغط وقت حقيقي.
        </p>
      </div>

      {/* Scenarios grid */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 32px 64px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {SCENARIOS.map((s, i) => (
          <div
            key={s.id}
            onClick={() => { console.log(`navigate to /scenarios/${s.id}`); router.push(`/scenarios/${s.id}/briefing`) }}
            className={s.free ? "glass-panel-elevated" : "glass-panel"}
            style={{ padding: "20px 22px", cursor: "pointer", position: "relative", animationDelay: `${i * 60}ms` }}
          >
            {/* Free badge */}
            {s.free && (
              <div style={{ position: "absolute", top: 14, left: 14, background: "#0F6B6B", color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: ".06em" }}>
                مجاني — جرّب الآن
              </div>
            )}

            {/* Lock */}
            {!s.free && (
              <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.35)", fontSize: 10 }}>
                <Lock size={10} />
                <span>متاح في Pro</span>
              </div>
            )}

            <div style={{ marginTop: s.free ? 28 : 28, marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--scenario-text-primary, rgba(255,255,255,0.92))", lineHeight: 1.35, marginBottom: 6 }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 12, color: "var(--scenario-text-secondary, rgba(255,255,255,0.68))", marginBottom: 3 }}>
                دورك: {s.role}
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "'IBM Plex Mono', monospace" }}>
                {s.setting}
              </p>
            </div>

            {/* Badges — solid bg, no nested glass */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(255,255,255,0.08)", color: diffColor(s.difficulty), fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>
                {s.difficulty}
              </span>
              <span style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", padding: "3px 9px", borderRadius: 20 }}>
                {s.duration}
              </span>
              <span style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)", fontSize: 10, padding: "3px 9px", borderRadius: 20 }}>
                {s.domain}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
