"use client"

/**
 * Summary / debrief — the payoff screen the flow was missing.
 * Reads the completed session, computes scoring via lib/scenarios, and
 * shows: score card (kicker + big % + label), hint-cost note if any, then
 * a per-decision review with quality badges — matching the reference
 * screenshot (88% أداء قوي · 5 قرارات مُراجَعة، "الأمثل كان" على غير الأمثل).
 *
 * No session yet (never played) → back to briefing.
 */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, RotateCcw, ArrowLeft } from "lucide-react"
import {
  PLAYABLE_ID, EMR_STEPS, loadSession, clearSession, computeResults, scoreLabel,
  type PlaySession, type StepResult,
} from "@/lib/scenarios"

const QUALITY_BADGE: Record<StepResult["quality"], { label: string; bg: string; fg: string; border: string }> = {
  best:       { label: "✓ الاختيار الأمثل", bg: "rgba(15,107,107,0.18)",  fg: "#4FB3A3", border: "rgba(15,107,107,0.4)" },
  acceptable: { label: "بديل مقبول",         bg: "rgba(217,138,43,0.14)", fg: "#D98A2B", border: "rgba(217,138,43,0.35)" },
  poor:       { label: "فرصة تعلّم",         bg: "rgba(217,138,43,0.14)", fg: "#D98A2B", border: "rgba(217,138,43,0.35)" },
  timeout:    { label: "انتهى الوقت",        bg: "rgba(255,255,255,0.08)", fg: "rgba(255,255,255,0.55)", border: "rgba(255,255,255,0.15)" },
}

export default function SummaryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [session, setSession] = useState<PlaySession | null | undefined>(undefined)

  useEffect(() => {
    const s = loadSession(PLAYABLE_ID)
    if (!s || s.answers.length === 0) {
      router.replace(`/scenarios/${params.id}/briefing`)
      return
    }
    setSession(s)
  }, [params.id, router])

  if (session === undefined || !session) return null

  const { results, total, hintTotal } = computeResults(session.answers)
  const maxScore = EMR_STEPS.length * 20
  const pct = Math.round((total / maxScore) * 100)
  const label = scoreLabel(pct)

  const retry = () => {
    clearSession(PLAYABLE_ID)
    router.push(`/scenarios/${PLAYABLE_ID}/play`)
  }

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
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 32px 64px" }}>
        {/* Kicker */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(127,119,221,0.75)", marginBottom: 20, fontFamily: "'IBM Plex Mono', monospace" }}>
          اكتمل السيناريو · انقطاع EMR في قسم الطوارئ
        </p>

        {/* Score card */}
        <div className="glass-panel-elevated" style={{ padding: "36px 32px", textAlign: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 56, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: "#4FB3A3", lineHeight: 1, marginBottom: 10 }}>
            {pct}%
          </p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.88)", marginBottom: 6 }}>
            {label}
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
            {EMR_STEPS.length} قرارات مُراجَعة
            {hintTotal > 0 && ` · خُصم ${hintTotal} نقطة لاستخدام التلميحات`}
          </p>
        </div>

        {/* Decision review */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "32px 0 14px", fontFamily: "'IBM Plex Mono', monospace" }}>
          مراجعة القرارات
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {results.map((r, i) => {
            const badge = QUALITY_BADGE[r.quality]
            return (
              <div key={i} className="glass-panel" style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                  <p style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "rgba(255,255,255,0.4)" }}>
                    {r.step.kicker} · {r.step.timeLabel}
                  </p>
                  <span
                    style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                      background: badge.bg, color: badge.fg, border: `1px solid ${badge.border}`,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>

                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: r.quality !== "best" ? 8 : 0 }}>
                  قرارك: {r.chosen ? r.chosen.label : "لم يُتَّخذ قرار قبل انتهاء الوقت"}
                </p>

                {r.quality !== "best" && (
                  <p style={{ fontSize: 13, color: "rgba(79,179,163,0.85)", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8 }}>
                    الأمثل كان: {r.best.label}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={retry}
            style={{ height: 46, padding: "0 28px", display: "flex", alignItems: "center", gap: 8, background: "#0F6B6B", color: "#fff", border: "none", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Zak', 'IBM Plex Sans Arabic', sans-serif", boxShadow: "0 4px 18px rgba(15,107,107,0.45)" }}
          >
            <RotateCcw size={15} />
            إعادة المحاولة
          </button>
          <button
            onClick={() => router.push("/scenarios")}
            style={{ height: 46, padding: "0 24px", display: "flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 11, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Zak', 'IBM Plex Sans Arabic', sans-serif" }}
          >
            <ArrowLeft size={15} />
            الرجوع للكتالوج
          </button>
        </div>
      </div>
    </div>
  )
}
