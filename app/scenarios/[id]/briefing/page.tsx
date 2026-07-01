"use client"

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

// Static mock for the briefing — in production this would be fetched by [id]
const BRIEFING = {
  id: "emr-outage",
  title: "انقطاع EMR في قسم الطوارئ",
  role: "مدير تقنية المعلومات",
  badge: "سيناريو تجريبي مجاني",
  timestamp: "الساعة 02:40 · قسم الطوارئ",
  paragraphs: [
    "تلقّيت اتصالاً عاجلاً من مشرف قسم الطوارئ يُبلّغك بأن نظام السجل الطبي الإلكتروني (EMR) توقف عن الاستجابة منذ خمس عشرة دقيقة. الطاقم يعمل حالياً على نماذج ورقية يدوية، وثمة ثلاثة حالات حرجة قيد التوثيق في نفس الوقت.",
    "تُشير لوحة المراقبة إلى أن الخادم الرئيسي لا يستجيب لطلبات ping، في حين أن خادم قاعدة البيانات يُسجّل حمولة CPU بنسبة 98%. لم تكن هناك أي تحديثات أو صيانة مجدولة الليلة.",
    "مدير المناوبة يسألك: هل نُفعّل بروتوكول الفشل التلقائي (failover) الآن، أم ننتظر تشخيصاً أعمق؟ لديك نافذة قرار محدودة.",
    "الوقت يمر. كل دقيقة تأخير تعني بيانات مريض إضافية تُوثَّق خارج النظام وستحتاج إلى إدخال يدوي لاحق — مع ما يصاحب ذلك من مخاطر جودة البيانات.",
  ],
  objectives: [
    "تحديد أولوية الاستجابة: هل الأولوية للتشخيص أم للاستمرارية؟",
    "إدارة التواصل مع قسم الطوارئ والإدارة أثناء الأزمة",
    "تطبيق بروتوكولات BCP/DR المناسبة لهذا السيناريو",
    "توثيق الإجراءات لتقرير RCA بعد الأزمة",
  ],
}

export default function BriefingPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #16242F 0%, #1E1B2E 100%)",
        fontFamily: "'IBM Plex Sans Arabic', system-ui, sans-serif",
        padding: "0",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <button
            onClick={() => router.back()}
            style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
          >
            <ArrowRight size={14} />
            العودة للكتالوج
          </button>
          {/* Role badge — glass-panel, tight padding */}
          <div
            className="glass-panel"
            style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}
          >
            دورك: {BRIEFING.role}
            <span style={{ marginRight: 8, color: "rgba(127,119,221,0.7)", fontSize: 11 }}>· {BRIEFING.badge}</span>
          </div>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-.4px", lineHeight: 1.3, marginBottom: 8 }}>
          {BRIEFING.title}
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 28 }}>
          {BRIEFING.timestamp}
        </p>
      </div>

      {/* Briefing card — glass-panel-elevated (pinned/priority) */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px 48px" }}>
        <div className="glass-panel-elevated" style={{ padding: "32px 36px" }}>
          {/* Situation */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 18, fontFamily: "'IBM Plex Mono', monospace" }}>
            الموقف
          </p>
          {BRIEFING.paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.85, marginBottom: 18, fontWeight: 400 }}>
              {p}
            </p>
          ))}

          {/* Objectives */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8, paddingTop: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>
              أهداف التقييم
            </p>
            {BRIEFING.objectives.map((o, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(15,107,107,0.3)", border: "1px solid rgba(15,107,107,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#0F6B6B", flexShrink: 0, marginTop: 2, fontFamily: "'IBM Plex Mono',monospace" }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{o}</p>
              </div>
            ))}
          </div>

          {/* CTA — solid teal (intentional exception: primary action visible above glass) */}
          <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => router.push(`/scenarios/${params.id}/play`)}
              style={{ height: 46, padding: "0 32px", background: "#0F6B6B", color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'IBM Plex Sans Arabic', sans-serif", boxShadow: "0 4px 18px rgba(15,107,107,0.45)", transition: "background 150ms ease" }}
            >
              بدء السيناريو
            </button>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>30 دقيقة · 5 قرارات</span>
          </div>
        </div>
      </div>
    </div>
  )
}
