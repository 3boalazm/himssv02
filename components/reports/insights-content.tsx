"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CapabilityRadar, type RadarDomain } from "@/components/learner/capability-radar"
import {
  TrendingUp, Target, Users, Clock, Award, Search, Download,
  ChevronDown, X, FileText, Table as TableIcon, Mail, CheckCircle2,
} from "lucide-react"

// ── palette (site-wide sequential: blue→teal→green; amber = gap only, never red) ──
const TEAL = "#0F6B6B"
const GREEN = "#22C55E"
const AMBER = "#B45309"
const perfColor = (s: number) => (s >= 70 ? GREEN : s >= 40 ? "#14B8A6" : "#3B82F6")

// ── mock data ──
const metrics = [
  { icon: Target, value: "85%", label: "معدل الإكمال", trend: "+8%", spark: [60, 64, 62, 70, 74, 78, 85] },
  { icon: TrendingUp, value: "72%", label: "متوسط الدرجة", trend: "+5%", spark: [58, 60, 63, 61, 66, 69, 72] },
  { icon: Users, value: "127", label: "المستخدمون النشطون", trend: "+12", spark: [98, 104, 110, 108, 118, 122, 127] },
  { icon: Clock, value: "45h", label: "إجمالي وقت التعلّم", trend: "+15h", spark: [22, 26, 30, 33, 38, 42, 45] },
  { icon: Award, value: "23", label: "الشهادات الصادرة", trend: "+5", spark: [12, 14, 15, 17, 19, 21, 23] },
]

const trendSets: Record<string, { labels: string[]; completion: number[]; score: number[] }> = {
  يومي: {
    labels: ["١", "٥", "١٠", "١٥", "٢٠", "٢٥", "٣٠"],
    completion: [62, 70, 66, 78, 74, 82, 85],
    score: [58, 63, 61, 69, 66, 70, 72],
  },
  أسبوعي: {
    labels: ["أ١", "أ٢", "أ٣", "أ٤"],
    completion: [68, 74, 80, 85],
    score: [61, 66, 69, 72],
  },
  شهري: {
    labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
    completion: [55, 60, 66, 72, 79, 85],
    score: [50, 55, 60, 64, 68, 72],
  },
}

interface Dept {
  name: string; current: number; last: number
  users: number; top: string; needsSupport: number
}
const departments: Dept[] = [
  { name: "تقنية المعلومات", current: 85, last: 78, users: 25, top: "أحمد م. (٩٥٪)", needsSupport: 3 },
  { name: "التمريض", current: 68, last: 60, users: 42, top: "فاطمة أ. (٩٢٪)", needsSupport: 9 },
  { name: "الإدارة", current: 72, last: 68, users: 18, top: "محمد ك. (٨٨٪)", needsSupport: 4 },
  { name: "الصيدلة", current: 82, last: 75, users: 15, top: "سارة م. (٩٠٪)", needsSupport: 2 },
]

const radarDomains: RadarDomain[] = [
  { label: "نظم", score: 78 },
  { label: "NPHIES", score: 85 },
  { label: "الأمن", score: 54 },
  { label: "التحليلات", score: 60 },
  { label: "القيادة", score: 78 },
  { label: "التغيير", score: 75 },
]

type Status = "completed" | "in-progress" | "overdue"
interface Row { id: number; name: string; email: string; dept: string; score: number; trend: number; date: string; status: Status }
const rows: Row[] = [
  { id: 1, name: "أحمد محمود", email: "ahmed@org.sa", dept: "تقنية المعلومات", score: 95, trend: 10, date: "٢٨ يونيو", status: "completed" },
  { id: 2, name: "فاطمة عبدالله", email: "fatima@org.sa", dept: "التمريض", score: 92, trend: 5, date: "٢٧ يونيو", status: "completed" },
  { id: 3, name: "محمد خالد", email: "mohamed@org.sa", dept: "الإدارة", score: 45, trend: -8, date: "٢٥ يونيو", status: "overdue" },
  { id: 4, name: "سارة مبارك", email: "sara@org.sa", dept: "الصيدلة", score: 78, trend: 3, date: "٢٤ يونيو", status: "completed" },
  { id: 5, name: "خالد الشمري", email: "khaled@org.sa", dept: "تقنية المعلومات", score: 61, trend: 2, date: "٢٣ يونيو", status: "in-progress" },
  { id: 6, name: "نورة القحطاني", email: "noura@org.sa", dept: "التمريض", score: 55, trend: -3, date: "٢٢ يونيو", status: "in-progress" },
]

const statusMeta: Record<Status, { label: string; color: string }> = {
  completed: { label: "مكتمل", color: GREEN },
  "in-progress": { label: "قيد التقدم", color: TEAL },
  overdue: { label: "متأخر", color: AMBER },
}

// ── tiny sparkline ──
function Sparkline({ points, color }: { points: number[]; color: string }) {
  const w = 64, h = 28, min = Math.min(...points), max = Math.max(...points)
  const range = max - min || 1
  const path = points
    .map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / range) * (h - 4) - 2}`)
    .join(" ")
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── custom two-series line chart ──
function LineChart({ set }: { set: { labels: string[]; completion: number[]; score: number[] } }) {
  const W = 720, H = 240, padX = 36, padY = 20
  const n = set.labels.length
  const x = (i: number) => padX + (i / (n - 1)) * (W - padX * 2)
  const y = (v: number) => padY + (1 - v / 100) * (H - padY * 2)
  const line = (arr: number[]) => arr.map((v, i) => `${x(i)},${y(v)}`).join(" ")
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="overflow-visible">
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={padX} x2={W - padX} y1={y(g)} y2={y(g)} stroke="rgba(22,36,47,.08)" strokeWidth={1} />
          <text x={W - padX + 6} y={y(g) + 3} fontSize={9} fill="rgba(22,36,47,.4)" fontFamily="monospace">{g}</text>
        </g>
      ))}
      <polyline points={line(set.completion)} fill="none" stroke={TEAL} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={line(set.score)} fill="none" stroke={GREEN} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {set.completion.map((v, i) => <circle key={`c${i}`} cx={x(i)} cy={y(v)} r={3} fill={TEAL} />)}
      {set.score.map((v, i) => <circle key={`s${i}`} cx={x(i)} cy={y(v)} r={3} fill={GREEN} />)}
      {set.labels.map((l, i) => (
        <text key={i} x={x(i)} y={H - 2} fontSize={10} fill="rgba(22,36,47,.5)" textAnchor="middle">{l}</text>
      ))}
    </svg>
  )
}

export function InsightsContent() {
  const [period, setPeriod] = useState<keyof typeof trendSets>("يومي")
  const [openDept, setOpenDept] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState<"score" | "name">("score")
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all")
  const [showExport, setShowExport] = useState(false)
  const [tick, setTick] = useState(0)

  // live-snapshot tick (visual only — no backend/websocket)
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 4000)
    return () => clearInterval(t)
  }, [])

  const liveUsers = 105 + (tick % 6)

  const filteredRows = useMemo(() => {
    return rows
      .filter((r) => (statusFilter === "all" ? true : r.status === statusFilter))
      .filter((r) => (query.trim() ? `${r.name} ${r.email} ${r.dept}`.includes(query.trim()) : true))
      .sort((a, b) => (sortBy === "score" ? b.score - a.score : a.name.localeCompare(b.name)))
  }, [query, sortBy, statusFilter])

  const chip = (active: boolean) =>
    `px-3 py-1 text-xs rounded-full border transition-colors ${
      active ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:bg-secondary/40"
    }`

  return (
    <div className="space-y-6">
      {/* Live snapshot strip */}
      <Card className="p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: GREEN }} />
          <span className="text-sm font-medium text-foreground">لقطة مباشرة</span>
          <span className="text-xs text-muted-foreground">· تُحدَّث الآن</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="text-muted-foreground">نشطون الآن: <strong className="text-foreground font-mono">{liveUsers}</strong></span>
          <span className="text-muted-foreground">جلسات تقييم جارية: <strong className="text-foreground font-mono">{8 + (tick % 3)}</strong></span>
          <span className="text-muted-foreground hidden sm:inline">٣ مناطق</span>
        </div>
      </Card>

      {/* KPI metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <m.icon className="w-4 h-4 text-primary" />
              </div>
              <Sparkline points={m.spark} color={perfColor(m.spark[m.spark.length - 1] > 40 ? 75 : 30)} />
            </div>
            <div className="text-3xl font-bold text-foreground font-mono leading-none mb-1.5">{m.value}</div>
            <div className="text-xs text-muted-foreground mb-2">{m.label}</div>
            <div className="text-xs font-semibold flex items-center gap-1" style={{ color: GREEN }}>
              <TrendingUp className="w-3 h-3" /> {m.trend}
              <span className="text-muted-foreground font-normal">مقابل الشهر السابق</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Trends line chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h3 className="text-base font-bold text-foreground">اتجاهات الإكمال والدرجات</h3>
          <div className="flex items-center gap-3">
            <div className="flex border border-border rounded-lg overflow-hidden">
              {(Object.keys(trendSets) as (keyof typeof trendSets)[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 text-xs transition-colors ${period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/40"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <LineChart set={trendSets[period]} />
        <div className="flex items-center gap-5 mt-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: TEAL }} /> معدل الإكمال</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: GREEN }} /> متوسط الدرجة</span>
        </div>
      </Card>

      {/* Department comparison (drill-down) + Domain radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-base font-bold text-foreground mb-1">الأداء حسب القسم</h3>
          <p className="text-xs text-muted-foreground mb-5">اضغط على قسم لعرض التفاصيل</p>
          <div className="space-y-4">
            {departments.map((d) => (
              <div key={d.name}>
                <button onClick={() => setOpenDept(openDept === d.name ? null : d.name)} className="w-full text-right group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                      {d.name}
                      <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${openDept === d.name ? "rotate-180" : ""}`} />
                    </span>
                    <span className="text-sm font-mono font-bold" style={{ color: perfColor(d.current) }}>{d.current}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary overflow-hidden mb-1">
                    <div className="h-full rounded-full transition-all" style={{ width: `${d.current}%`, background: perfColor(d.current) }} />
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div className="h-full rounded-full opacity-40" style={{ width: `${d.last}%`, background: perfColor(d.current) }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">الحالي مقابل الشهر السابق ({d.last}%)</p>
                </button>
                {openDept === d.name && (
                  <div className="mt-3 p-4 rounded-lg bg-secondary/40 grid grid-cols-3 gap-3 animate-slide-in-up">
                    <div><p className="text-[10px] text-muted-foreground">المستخدمون</p><p className="text-lg font-bold font-mono text-foreground">{d.users}</p></div>
                    <div><p className="text-[10px] text-muted-foreground">الأعلى أداءً</p><p className="text-xs font-semibold text-foreground mt-1">{d.top}</p></div>
                    <div><p className="text-[10px] text-muted-foreground">يحتاجون دعماً</p><p className="text-lg font-bold font-mono" style={{ color: AMBER }}>{d.needsSupport}</p></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 flex flex-col items-center">
          <h3 className="text-base font-bold text-foreground mb-4 self-start">توزّع الأداء حسب المجال</h3>
          <CapabilityRadar domains={radarDomains} size={300} />
          <p className="text-xs text-muted-foreground mt-3">متوسط الفريق عبر مجالات الجاهزية</p>
        </Card>
      </div>

      {/* Results table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h3 className="text-base font-bold text-foreground">النتائج التفصيلية</h3>
            <Button variant="outline" size="sm" onClick={() => setShowExport(true)}>
              <Download className="w-4 h-4 ml-1.5" /> تصدير
            </Button>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 h-9 border border-border rounded-lg">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث بالاسم أو القسم…" className="flex-1 bg-transparent outline-none text-sm text-foreground" />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "score" | "name")} className="h-9 px-3 border border-border rounded-lg text-sm text-foreground bg-background">
              <option value="score">ترتيب حسب الدرجة</option>
              <option value="name">ترتيب حسب الاسم</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {([["all", "الكل"], ["completed", "مكتمل"], ["in-progress", "قيد التقدم"], ["overdue", "متأخر"]] as [("all" | Status), string][]).map(([v, l]) => (
              <button key={v} className={chip(statusFilter === v)} onClick={() => setStatusFilter(v)}>{l}</button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredRows.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة للبحث أو الفلاتر.</div>
          ) : filteredRows.map((r) => {
            const sm = statusMeta[r.status]
            return (
              <div key={r.id} className="p-4 flex items-center gap-4 hover:bg-secondary/20 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm">{r.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground truncate" dir="ltr" style={{ textAlign: "right" }}>{r.email}</p>
                </div>
                <span className="text-sm text-muted-foreground hidden sm:block w-28">{r.dept}</span>
                <div className="flex items-center gap-2 w-20">
                  <span className="text-sm font-mono font-bold text-foreground">{r.score}%</span>
                  <span className="text-xs font-mono" style={{ color: r.trend >= 0 ? GREEN : AMBER }}>{r.trend >= 0 ? "↑" : "↓"}{Math.abs(r.trend)}</span>
                </div>
                <span className="text-xs text-muted-foreground hidden md:block w-16">{r.date}</span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: `${sm.color}1a`, color: sm.color }}>{sm.label}</span>
              </div>
            )
          })}
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>عرض {filteredRows.length} من {rows.length}</span>
          <div className="flex gap-1.5">
            <button className="px-2.5 py-1 border border-border rounded hover:bg-secondary/40 transition-colors">السابق</button>
            <button className="px-2.5 py-1 rounded bg-primary text-primary-foreground">١</button>
            <button className="px-2.5 py-1 border border-border rounded hover:bg-secondary/40 transition-colors">٢</button>
            <button className="px-2.5 py-1 border border-border rounded hover:bg-secondary/40 transition-colors">التالي</button>
          </div>
        </div>
      </Card>

      {/* Export dialog (UI-only) */}
      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
    </div>
  )
}

function ExportDialog({ onClose }: { onClose: () => void }) {
  const [format, setFormat] = useState("pdf")
  const [fileName, setFileName] = useState("HLOS_Report_2026-07")
  const [done, setDone] = useState(false)
  const formats = [
    { v: "pdf", icon: FileText, label: "PDF" },
    { v: "excel", icon: TableIcon, label: "Excel" },
    { v: "csv", icon: TableIcon, label: "CSV" },
    { v: "email", icon: Mail, label: "بريد" },
  ]
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-lg w-full p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">تصدير التقرير</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        {done ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-7 h-7 text-primary" /></div>
            <p className="text-base font-bold text-foreground mb-1">تم تجهيز الملف</p>
            <p className="text-sm text-muted-foreground mb-6">{fileName}.{format === "excel" ? "xlsx" : format} — جاهز للتنزيل عند ربط الخدمة.</p>
            <Button variant="outline" onClick={onClose}>تم</Button>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">الصيغة</p>
              <div className="grid grid-cols-4 gap-2">
                {formats.map((f) => (
                  <button key={f.v} onClick={() => setFormat(f.v)} className={`p-3 border-2 rounded-lg text-center transition-colors ${format === f.v ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}>
                    <f.icon className="w-5 h-5 mx-auto mb-1 text-foreground" />
                    <span className="text-xs text-foreground">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">المحتوى</p>
              <div className="space-y-2">
                {["ملخص تنفيذي", "المؤشرات الرئيسية", "الرسوم البيانية", "جدول النتائج"].map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm text-foreground/80"><input type="checkbox" defaultChecked className="accent-primary" /> {c}</label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">اسم الملف</label>
              <input value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background outline-none focus:border-primary" dir="ltr" style={{ textAlign: "right" }} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={() => setDone(true)} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Download className="w-4 h-4 ml-1.5" /> تنزيل
              </Button>
              <Button variant="outline" onClick={onClose}>إلغاء</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
