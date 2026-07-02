"use client"

/**
 * Play — the 5-step EMR decision engine (lib/scenarios.EMR_STEPS).
 *  · id !== PLAYABLE_ID          → redirect to briefing (only emr-outage plays)
 *  · per-step 180s timer, amber warning ≤10s, auto-submit as timedOut at 0
 *  · progressive hints: cost shown before reveal, capped at hints.length
 *  · confirm locks the choice, shows "تم تسجيل قرارك ✓", then advances
 *  · last step → persist session (completed) → push to summary
 */

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Lightbulb } from "lucide-react"
import {
  EMR_STEPS, PLAYABLE_ID,
  loadSession, saveSession, clearSession,
  type PlaySession, type StepAnswer,
} from "@/lib/scenarios"

export default function PlayPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isPlayable = id === PLAYABLE_ID

  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<StepAnswer[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [hintsShown, setHintsShown] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180)
  const [submitted, setSubmitted] = useState(false)
  const [ready, setReady] = useState(false)

  /* Redirect off unsupported ids; resume an existing session for the playable one */
  useEffect(() => {
    if (!isPlayable) { router.replace(`/scenarios/${id}/briefing`); return }
    const s = loadSession(PLAYABLE_ID)
    if (s && !s.completed && s.answers.length > 0) {
      setAnswers(s.answers)
      setStepIndex(s.answers.length)
    }
    setReady(true)
  }, [isPlayable, id, router])

  const step = EMR_STEPS[stepIndex]

  /* Reset per-step UI state whenever the step changes */
  useEffect(() => {
    setSelected(null)
    setHintsShown(0)
    setSubmitted(false)
    setTimeLeft(step?.timerSec ?? 180)
  }, [stepIndex, step])

  const hintCostSoFar = step ? step.hints.slice(0, hintsShown).reduce((s, h) => s + h.cost, 0) : 0

  const commitAnswer = useCallback((optionId: string | null, timedOut: boolean) => {
    const ans: StepAnswer = { optionId, hintsUsed: hintsShown, hintCost: hintCostSoFar, timedOut }
    const nextAnswers = [...answers, ans]
    setAnswers(nextAnswers)

    const session: PlaySession = {
      scenarioId: PLAYABLE_ID,
      current: nextAnswers.length,
      answers: nextAnswers,
      completed: nextAnswers.length >= EMR_STEPS.length,
    }
    saveSession(session)

    if (nextAnswers.length >= EMR_STEPS.length) {
      router.push(`/scenarios/${PLAYABLE_ID}/summary`)
    } else {
      setSubmitted(true)
    }
  }, [answers, hintsShown, hintCostSoFar, router])

  /* Countdown */
  useEffect(() => {
    if (!ready || submitted || !step) return
    if (timeLeft <= 0) { commitAnswer(null, true); return }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [ready, submitted, timeLeft, step, commitAnswer])

  if (!isPlayable || !ready || !step) return null

  const isWarning  = timeLeft <= 10 && !submitted
  const timerColor = isWarning ? "var(--scenario-accent-warning, #B45309)" : "rgba(255,255,255,0.55)"
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const secs = String(timeLeft % 60).padStart(2, "0")

  const nextHint = step.hints[hintsShown]
  const canConfirm = !!selected && !submitted

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #16242F 0%, #1E1B2E 100%)",
        fontFamily: "'Zak', 'IBM Plex Sans Arabic', system-ui, sans-serif",
      }}
    >
      {/* Progress bar */}
      <div
        className="glass-panel"
        style={{ borderRadius: 0, padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: "'IBM Plex Mono', monospace" }}>
          خطوة {stepIndex + 1} من {EMR_STEPS.length} · {step.kicker}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {EMR_STEPS.map((_, n) => (
              <span key={n} style={{ width: 8, height: 8, borderRadius: "50%", background: n <= stepIndex ? "#0F6B6B" : "rgba(255,255,255,0.18)", display: "inline-block" }} />
            ))}
          </div>
          <button
            onClick={() => { clearSession(PLAYABLE_ID); router.push("/scenarios") }}
            style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Zak', 'IBM Plex Sans Arabic', sans-serif" }}
          >
            حفظ والخروج
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 32px 60px" }}>

        {/* Situation update */}
        <div className="glass-panel-elevated" style={{ padding: "24px 28px", marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
            {step.timeLabel} · تحديث الموقف
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.82)", lineHeight: 1.8, marginBottom: 18 }}>
            {step.situation}
          </p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
              دورك الآن
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>{step.prompt}</p>
          </div>
        </div>

        {/* Timer + hint trigger */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div
            className="glass-panel"
            style={{ padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10 }}
          >
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>وقت القرار</span>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: timerColor, transition: "color 500ms ease" }}>
              {mins}:{secs}
            </span>
          </div>

          {!submitted && hintsShown < step.hints.length && (
            <button
              onClick={() => setHintsShown(h => h + 1)}
              className="glass-panel"
              style={{ padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 10, background: "rgba(127,119,221,0.12)", border: "1px solid rgba(127,119,221,0.3)", color: "rgba(200,195,240,0.9)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Zak', 'IBM Plex Sans Arabic', sans-serif" }}
            >
              <Lightbulb size={13} />
              {hintsShown === 0 ? "تلميح" : `تلميح إضافي (${hintsShown}/${step.hints.length})`}
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", opacity: 0.75 }}>−{nextHint?.cost}</span>
            </button>
          )}
        </div>

        {/* Revealed hints */}
        {hintsShown > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {step.hints.slice(0, hintsShown).map((h, i) => (
              <div
                key={i}
                className="animate-in fade-in slide-in-from-top-2"
                style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(127,119,221,0.08)", border: "1px solid rgba(127,119,221,0.25)" }}
              >
                <p style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "rgba(127,119,221,0.85)", marginBottom: 4 }}>
                  تلميح {i + 1} · −{h.cost} نقطة
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{h.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Choices */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {step.options.map(opt => {
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

        {/* Submit */}
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <button
            disabled={!canConfirm}
            onClick={() => commitAnswer(selected, false)}
            style={{
              height: 44, padding: "0 28px",
              background: canConfirm ? "#0F6B6B" : "rgba(255,255,255,0.1)",
              color: canConfirm ? "#fff" : "rgba(255,255,255,0.3)",
              border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
              cursor: canConfirm ? "pointer" : "not-allowed",
              fontFamily: "'Zak', 'IBM Plex Sans Arabic', sans-serif",
              transition: "background 150ms ease, color 150ms ease",
            }}
          >
            {submitted ? "تم تسجيل قرارك ✓" : "تأكيد القرار"}
          </button>
          {submitted && (
            <button
              onClick={() => setStepIndex(i => i + 1)}
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
