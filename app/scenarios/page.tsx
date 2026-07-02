"use client"

/**
 * Scenario catalog — restyled to the core HLOS identity (Sidebar + light
 * tokens + Card), per product decision: /scenarios is a learner page like
 * any other, not a separate dark zone. The immersive dark treatment stays
 * inside the run itself (briefing/play/summary).
 * Logic unchanged: live search + difficulty/domain/status filters, resume
 * hero, card states (free / Pro-locked / in-progress / completed) driven by
 * lib/scenarios + sessionStorage.
 */

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Search, Play, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  SCENARIOS, DIFFICULTIES, DOMAINS, STATUSES, PLAYABLE_ID,
  loadSession, sessionStatus, progressPct,
  type PlaySession, type PlayStatus,
} from "@/lib/scenarios"

/* Difficulty accents on the site palette — no red anywhere (locked rule):
   easy = teal, medium = blue, hard = amber (challenge, not failure). */
const diffColor = (d: string) =>
  d === "سهل" ? "#14B8A6" : d === "متوسط" ? "#3B82F6" : "#B45309"

type Filter<T> = "الكل" | T

function FilterRow<T extends string>({
  label, options, value, onChange,
}: { label: string; options: readonly T[]; value: Filter<T>; onChange: (v: Filter<T>) => void }) {
  const all: Filter<T>[] = ["الكل", ...options]
  return (
    <div className="flex items-start gap-3">
      <span className="w-14 shrink-0 pt-1.5 text-[11px] text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2 min-w-0">
        {all.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150",
              value === opt
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
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
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      <main className="flex-1 min-w-0 p-4 lg:p-6 lg:mr-56">
        {/* Page heading */}
        <div className="mb-6">
          <p className="text-xs text-primary font-medium mb-1.5">وضع السيناريوهات</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            سيناريوهات هندسة تقنية المعلومات الصحية
          </h1>
          <p className="max-w-[540px] text-sm text-foreground/70 leading-relaxed">
            قرارات حقيقية في مواقف مستشفياتنا — كل سيناريو يقيس استجابتك في ضغط وقت حقيقي.
          </p>
        </div>

        {/* Resume hero — appears only when a run is actually in progress */}
        {inProgress && (
          <Card className="animate-in-up mb-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 border-primary/30">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-primary">
                سيناريو غير مكتمل
              </p>
              <p className="truncate text-[15px] font-bold text-foreground">
                {inProgress.title}
                <span className="mr-2 font-mono text-xs font-normal text-muted-foreground">· {resumePct}% مكتمل</span>
              </p>
            </div>
            <Button
              onClick={() => router.push(`/scenarios/${PLAYABLE_ID}/play`)}
              className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Play className="h-4 w-4 ml-1.5" />
              استئناف
            </Button>
          </Card>
        )}

        {/* Search */}
        <Card className="mb-4 flex flex-row items-center gap-3 rounded-xl px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="ابحث بالعنوان أو المجال أو الدور..."
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </Card>

        {/* Filters */}
        <div className="mb-7 space-y-2.5">
          <FilterRow label="الصعوبة" options={DIFFICULTIES} value={diff}   onChange={setDiff} />
          <FilterRow label="المجال"  options={DOMAINS}      value={dom}    onChange={setDom} />
          <FilterRow label="الحالة"  options={STATUSES}     value={status} onChange={setStatus} />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Card className="px-6 py-14 text-center">
            <p className="mb-3 text-sm text-muted-foreground">لا سيناريوهات تطابق هذه التصفية.</p>
            <div>
              <button
                onClick={() => { setQ(""); setDiff("الكل"); setDom("الكل"); setStatus("الكل") }}
                className="rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                مسح التصفية
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((s, i) => {
              const st = statusOf(s.id)
              const pct = s.id === PLAYABLE_ID ? progressPct(session, s.steps) : 0
              return (
                <Card
                  key={s.id}
                  onClick={() => router.push(`/scenarios/${s.id}/briefing`)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(`/scenarios/${s.id}/briefing`) } }}
                  className={cn(
                    "animate-in-up relative cursor-pointer p-5 text-right transition-colors hover:bg-secondary/20",
                    s.free && "border-primary/30",
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Top-start badge: free / lock */}
                  {s.free ? (
                    <span className="absolute left-3.5 top-3.5 rounded-full bg-primary px-2.5 py-[3px] text-[9px] font-bold tracking-[0.06em] text-primary-foreground">
                      مجاني — جرّب الآن
                    </span>
                  ) : (
                    <span className="absolute left-3.5 top-3.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Lock className="h-2.5 w-2.5" />
                      متاح في Pro
                    </span>
                  )}

                  {/* Top-end status */}
                  {st === "قيد التقدم" && (
                    <span className="absolute right-3.5 top-3.5 font-mono text-[10px] font-bold text-[#B45309]">
                      قيد التقدم %{pct}
                    </span>
                  )}
                  {st === "مكتمل" && (
                    <span className="absolute right-3.5 top-3.5 flex items-center gap-1 text-[10px] font-bold text-[#22C55E]">
                      <CheckCircle2 className="h-3 w-3" />
                      مكتمل
                    </span>
                  )}

                  <div className="mb-3 mt-7">
                    <h3 className="mb-1.5 text-[15px] font-bold leading-[1.35] text-foreground">{s.title}</h3>
                    <p className="mb-0.5 text-xs text-foreground/70">دورك: {s.role}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{s.setting}</p>
                  </div>

                  {/* In-progress bar */}
                  {st === "قيد التقدم" && (
                    <div className="mb-3 h-1 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-[#B45309]" style={{ width: `${pct}%` }} />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-secondary px-2.5 py-[3px] text-[10px] font-bold" style={{ color: diffColor(s.difficulty) }}>
                      {s.difficulty}
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-[3px] font-mono text-[10px] text-muted-foreground">
                      {s.durationMin} د
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-[3px] text-[10px] text-muted-foreground">
                      {s.domain}
                    </span>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
