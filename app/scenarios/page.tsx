"use client"

/**
 * Scenario catalog — dark zone (F.5).
 * v2: live search + difficulty/domain/status filters, resume hero for an
 * in-progress run, and card states (free / Pro-locked / in-progress with
 * progress bar / completed) — all driven by lib/scenarios + the play
 * session in sessionStorage, so "قيد التقدم %N" here is the real run.
 */

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, Search, Play, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SCENARIOS, DIFFICULTIES, DOMAINS, STATUSES, PLAYABLE_ID,
  loadSession, sessionStatus, progressPct,
  type PlaySession, type PlayStatus,
} from "@/lib/scenarios"

const diffColor = (d: string) =>
  d === "سهل" ? "rgba(79,179,163,0.9)" : d === "متوسط" ? "rgba(217,138,43,0.9)" : "rgba(224,120,120,0.9)"

type Filter<T> = "الكل" | T

function FilterRow<T extends string>({
  label, options, value, onChange,
}: { label: string; options: readonly T[]; value: Filter<T>; onChange: (v: Filter<T>) => void }) {
  const all: Filter<T>[] = ["الكل", ...options]
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-[11px] font-mono text-white/40">{label}</span>
      <div className="flex flex-wrap gap-2">
        {all.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150",
              value === opt
                ? "border-white/25 bg-[#0D1620]/90 text-white/95"
                : "border-white/10 bg-white/[0.05] text-white/55 hover:text-white/85 hover:border-white/20",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ScenariosPage() {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [diff, setDiff] = useState<Filter<(typeof DIFFICULTIES)[number]>>("الكل")
  const [dom, setDom] = useState<Filter<(typeof DOMAINS)[number]>>("الكل")
  const [status, setStatus] = useState<Filter<PlayStatus>>("الكل")
  const [session, setSession] = useState<PlaySession | null>(null)

  /* sessionStorage is client-only — read after mount */
  useEffect(() => { setSession(loadSession(PLAYABLE_ID)) }, [])

  const statusOf = (id: string): PlayStatus =>
    id === PLAYABLE_ID ? sessionStatus(session) : "لم يبدأ"

  const filtered = useMemo(() => {
    const needle = q.trim()
    return SCENARIOS.filter(s => {
      if (diff !== "الكل" && s.difficulty !== diff) return false
      if (dom !== "الكل" && s.domain !== dom) return false
      if (status !== "الكل" && statusOf(s.id) !== status) return false
      if (needle && ![s.title, s.role, s.domain, s.setting].some(t => t.includes(needle))) return false
      return true
    })
  }, [q, diff, dom, status, session]) // eslint-disable-line react-hooks/exhaustive-deps

  const inProgress = session && !session.completed ? SCENARIOS.find(s => s.id === PLAYABLE_ID) : null
  const resumePct = progressPct(session, SCENARIOS.find(s => s.id === PLAYABLE_ID)!.steps)

  return (
    <div
      dir="rtl"
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #16242F 0%, #1E1B2E 100%)",
        fontFamily: "'Zak', 'IBM Plex Sans Arabic', system-ui, sans-serif",
      }}
    >
      {/* Hero */}
      <div className="mx-auto max-w-[1060px] px-6 pt-12 pb-8 sm:px-8">
        <p className="mb-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[rgba(127,119,221,0.75)]">
          <Link href="/dashboard" className="transition-colors hover:text-[rgba(127,119,221,1)]" title="العودة للوحتي">HLOS</Link>
          {" · وضع السيناريوهات"}
        </p>
        <h1 className="mb-3 text-[28px] font-bold leading-[1.2] tracking-[-0.5px] text-white/90 sm:text-[34px]">
          سيناريوهات هندسة تقنية المعلومات الصحية
        </h1>
        <p className="max-w-[540px] text-base leading-[1.75] text-white/[0.68]">
          قرارات حقيقية في مواقف مستشفياتنا — كل سيناريو يقيس استجابتك في ضغط وقت حقيقي.
        </p>
      </div>

      <div className="mx-auto max-w-[1060px] px-6 pb-16 sm:px-8">
        {/* Resume hero — appears only when a run is actually in progress */}
        {inProgress && (
          <div className="glass-panel-elevated animate-in-up mb-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="min-w-0">
              <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[rgba(127,119,221,0.75)]">
                سيناريو غير مكتمل
              </p>
              <p className="truncate text-[15px] font-bold text-white/90">
                {inProgress.title}
                <span className="mr-2 font-mono text-xs font-normal text-white/45">· {resumePct}% مكتمل</span>
              </p>
            </div>
            <button
              onClick={() => router.push(`/scenarios/${PLAYABLE_ID}/play`)}
              className="flex shrink-0 items-center gap-2 rounded-[11px] bg-[#0F6B6B] px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_18px_rgba(15,107,107,0.45)] transition-colors hover:bg-[#0d5f5f]"
            >
              <Play className="h-4 w-4" />
              استئناف
            </button>
          </div>
        )}

        {/* Search */}
        <div className="glass-panel mb-4 flex items-center gap-3 rounded-xl px-4 py-3">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="ابحث بالعنوان أو المجال أو الدور..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white/90 outline-none placeholder:text-white/35"
          />
          <Search className="h-4 w-4 shrink-0 text-white/35" />
        </div>

        {/* Filters */}
        <div className="mb-7 space-y-2.5">
          <FilterRow label="الصعوبة" options={DIFFICULTIES} value={diff}   onChange={setDiff} />
          <FilterRow label="المجال"  options={DOMAINS}      value={dom}    onChange={setDom} />
          <FilterRow label="الحالة"  options={STATUSES}     value={status} onChange={setStatus} />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="glass-panel px-6 py-14 text-center">
            <p className="mb-3 text-sm text-white/60">لا سيناريوهات تطابق هذه التصفية.</p>
            <button
              onClick={() => { setQ(""); setDiff("الكل"); setDom("الكل"); setStatus("الكل") }}
              className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white"
            >
              مسح التصفية
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s, i) => {
              const st = statusOf(s.id)
              const pct = s.id === PLAYABLE_ID ? progressPct(session, s.steps) : 0
              return (
                <button
                  key={s.id}
                  onClick={() => router.push(`/scenarios/${s.id}/briefing`)}
                  className={cn(
                    "animate-in-up relative cursor-pointer p-5 text-right",
                    s.free ? "glass-panel-elevated" : "glass-panel",
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Top-start badge: free / lock */}
                  {s.free ? (
                    <span className="absolute left-3.5 top-3.5 rounded-full bg-[#0F6B6B] px-2.5 py-[3px] text-[9px] font-bold tracking-[0.06em] text-white">
                      مجاني — جرّب الآن
                    </span>
                  ) : (
                    <span className="absolute left-3.5 top-3.5 flex items-center gap-1 text-[10px] text-white/35">
                      <Lock className="h-2.5 w-2.5" />
                      متاح في Pro
                    </span>
                  )}

                  {/* Top-end status */}
                  {st === "قيد التقدم" && (
                    <span className="absolute right-3.5 top-3.5 font-mono text-[10px] font-bold text-[#D98A2B]">
                      قيد التقدم %{pct}
                    </span>
                  )}
                  {st === "مكتمل" && (
                    <span className="absolute right-3.5 top-3.5 flex items-center gap-1 text-[10px] font-bold text-[#4FB3A3]">
                      <CheckCircle2 className="h-3 w-3" />
                      مكتمل
                    </span>
                  )}

                  <div className="mb-3 mt-7">
                    <h3 className="mb-1.5 text-[15px] font-bold leading-[1.35] text-white/90">{s.title}</h3>
                    <p className="mb-0.5 text-xs text-white/[0.68]">دورك: {s.role}</p>
                    <p className="font-mono text-[11px] text-white/45">{s.setting}</p>
                  </div>

                  {/* In-progress bar */}
                  {st === "قيد التقدم" && (
                    <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-[#D98A2B]" style={{ width: `${pct}%` }} />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-white/[0.08] px-2.5 py-[3px] text-[10px] font-bold" style={{ color: diffColor(s.difficulty) }}>
                      {s.difficulty}
                    </span>
                    <span className="rounded-full bg-white/[0.08] px-2.5 py-[3px] font-mono text-[10px] text-white/60">
                      {s.durationMin} د
                    </span>
                    <span className="rounded-full bg-white/[0.08] px-2.5 py-[3px] text-[10px] text-white/55">
                      {s.domain}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
