"use client"

/**
 * Briefing — data-driven from lib/scenarios (BRIEFINGS + SCENARIOS by id).
 *  · unknown id            → notFound()
 *  · locked (s.free=false) → CTA becomes "متاح في Pro — ترقية" → /pricing
 *  · playable + session in progress → CTA "متابعة من الخطوة N"
 *  · playable + no session          → CTA "بدء السيناريو"
 * Visual language unchanged (dark gradient + glass-panel-elevated card).
 */

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { ArrowRight, Lock } from "lucide-react"
import { getScenario, BRIEFINGS, PLAYABLE_ID, loadSession, type PlaySession } from "@/lib/scenarios"

export default function BriefingPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const scenario = getScenario(id)
  const briefing = BRIEFINGS[id]
  const [session, setSession] = useState<PlaySession | null>(null)

  useEffect(() => {
    if (id === PLAYABLE_ID) setSession(loadSession(PLAYABLE_ID))
  }, [id])

  if (!scenario || !briefing) notFound()

  const isPlayable = scenario.id === PLAYABLE_ID
  const hasSession = isPlayable && session && !session.completed
  const resumeStep = hasSession ? session!.answers.length + 1 : 1

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
      {/* Header */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <button
            onClick={() => router.push("/scenarios")}
            style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "'Zak', 'IBM Plex Sans Arabic', sans-serif" }}
          >
            <ArrowRight size={14} />
            العودة للكتالوج
          </button>
          {/* Role badge — glass-panel, tight padding */}
          <div
            className="glass-panel"
            style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}
          >
            دورك: {scenario.role}
            {isPlayable && briefing.badge && (
              <span style={{ marginRight: 8, color: "rgba(127,119,221,0.7)", fontSize: 11 }}>· {briefing.badge}</span>
            )}
          </div>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-.4px", lineHeight: 1.3, marginBottom: 8 }}>
          {scenario.title}
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 28 }}>
          {briefing.timestamp}
        </p>
      </div>

      {/* Briefing card — glass-panel-elevated (pinned/priority) */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px 48px" }}>
        <div className="glass-panel-elevated" style={{ padding: "32px 36px" }}>
          {/* Situation */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 18, fontFamily: "'IBM Plex Mono', monospace" }}>
            الموقف
          </p>
          {briefing.paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.85, marginBottom: 18, fontWeight: 400 }}>
              {p}
            </p>
          ))}

          {/* Objectives */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8, paddingTop: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14, fontFamily: "'IBM Plex Mono', monospace" }}>
              أهداف التقييم
            </p>
            {briefing.objectives.map((o, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(15,107,107,0.3)", border: "1px solid rgba(15,107,107,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#0F6B6B", flexShrink: 0, marginTop: 2, fontFamily: "'IBM Plex Mono',monospace" }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{o}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            {isPlayable ? (
              <>
                <button
                  onClick={() => router.push(`/scenarios/${scenario.id}/play`)}
                  style={{ height: 46, padding: "0 32px", background: "#0F6B6B", color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Zak', 'IBM Plex Sans Arabic', sans-serif", boxShadow: "0 4px 18px rgba(15,107,107,0.45)", transition: "background 150ms ease" }}
                >
                  {hasSession ? `متابعة من الخطوة ${resumeStep}` : "بدء السيناريو"}
                </button>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                  {scenario.durationMin} دقيقة · {scenario.steps} قرارات
                </span>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/pricing")}
                  style={{ height: 46, padding: "0 28px", display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Zak', 'IBM Plex Sans Arabic', sans-serif" }}
                >
                  <Lock size={14} />
                  متاح في Pro — ترقية
                </button>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                  {scenario.durationMin} دقيقة · {scenario.difficulty}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
