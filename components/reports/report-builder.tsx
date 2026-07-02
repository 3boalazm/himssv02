"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useModalA11y } from "@/hooks/use-modal-a11y"
import { modalBackdropVariants, modalPanelVariants, modalTransition, reducedTransition } from "@/lib/motion"
import {
  Table as TableIcon, BarChart3, LineChart as LineIcon, Radar as RadarIcon,
  ChevronUp, ChevronDown, X, Plus, Eye, Trash2,
} from "lucide-react"

interface Metric { id: string; name: string; selected: boolean }
interface Filter { id: string; type: string; value: string }

const ALL_METRICS: { id: string; name: string }[] = [
  { id: "completion", name: "معدل الإكمال" },
  { id: "score", name: "متوسط الدرجة" },
  { id: "users", name: "المستخدمون النشطون" },
  { id: "time", name: "وقت التعلّم" },
  { id: "assessments", name: "عدد التقييمات" },
  { id: "certificates", name: "عدد الشهادات" },
]

const VIS = [
  { v: "table", icon: TableIcon, label: "جدول" },
  { v: "bar", icon: BarChart3, label: "أعمدة" },
  { v: "line", icon: LineIcon, label: "خطّي" },
  { v: "radar", icon: RadarIcon, label: "راداري" },
]

const FILTER_TYPES: Record<string, string> = {
  department: "القسم",
  assessment: "نوع التقييم",
  score: "نطاق الدرجة",
  status: "الحالة",
}

export function ReportBuilder() {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [metrics, setMetrics] = useState<Metric[]>([
    { id: "completion", name: "معدل الإكمال", selected: true },
    { id: "score", name: "متوسط الدرجة", selected: true },
    { id: "users", name: "المستخدمون النشطون", selected: true },
  ])
  const [filters, setFilters] = useState<Filter[]>([])
  const [vis, setVis] = useState("bar")
  const [layout, setLayout] = useState("two")
  const [showHeader, setShowHeader] = useState(true)
  const [showFooter, setShowFooter] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [asTemplate, setAsTemplate] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [preview, setPreview] = useState(false)

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= metrics.length) return
    const copy = [...metrics]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    setMetrics(copy)
  }
  const addMetric = (id: string) => {
    const m = ALL_METRICS.find((x) => x.id === id)
    if (m && !metrics.find((x) => x.id === id)) setMetrics([...metrics, { ...m, selected: true }])
  }
  const removeMetric = (id: string) => setMetrics(metrics.filter((m) => m.id !== id))
  const addFilter = (type: string) => setFilters([...filters, { id: `f-${Date.now()}`, type, value: "all" }])
  const removeFilter = (id: string) => setFilters(filters.filter((f) => f.id !== id))

  const inputClass = "w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-background outline-none focus:border-primary transition-colors"
  const label = "block text-sm font-medium text-foreground mb-2"

  return (
    <Card className="p-6 lg:p-8 space-y-8">
      {/* Report info */}
      <section>
        <label className={label}>معلومات التقرير</label>
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم التقرير" className={inputClass} />
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="وصف مختصر" className={inputClass} />
        </div>
      </section>

      {/* Date range */}
      <section>
        <label className={label}>النطاق الزمني</label>
        <div className="flex gap-2 mb-3">
          <input type="date" defaultValue="2026-06-01" className={inputClass} dir="ltr" style={{ textAlign: "right" }} />
          <span className="flex items-center text-muted-foreground">→</span>
          <input type="date" defaultValue="2026-06-30" className={inputClass} dir="ltr" style={{ textAlign: "right" }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["اليوم", "هذا الأسبوع", "هذا الشهر", "الربع الأخير"].map((r) => (
            <button key={r} className="px-3 py-1 text-xs border border-border rounded-lg text-muted-foreground hover:bg-secondary/40 transition-colors">{r}</button>
          ))}
        </div>
      </section>

      {/* Metrics with reorder */}
      <section>
        <label className={label}>المؤشرات <span className="text-muted-foreground font-normal">(رتّب بالأسهم)</span></label>
        <div className="space-y-2 mb-3">
          {metrics.map((m, i) => (
            <div key={m.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                  <button onClick={() => move(i, 1)} disabled={i === metrics.length - 1} className="text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                </div>
                <input
                  type="checkbox"
                  checked={m.selected}
                  onChange={(e) => setMetrics(metrics.map((x) => (x.id === m.id ? { ...x, selected: e.target.checked } : x)))}
                  className="accent-primary"
                />
                <span className="text-sm text-foreground">{m.name}</span>
              </div>
              <button onClick={() => removeMetric(m.id)} className="text-muted-foreground hover:text-[#B45309] transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <select onChange={(e) => { if (e.target.value) { addMetric(e.target.value); e.target.value = "" } }} className={inputClass}>
          <option value="">+ إضافة مؤشر</option>
          {ALL_METRICS.filter((m) => !metrics.find((cm) => cm.id === m.id)).map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </section>

      {/* Filters */}
      <section>
        <label className={label}>الفلاتر</label>
        <div className="space-y-2 mb-3">
          {filters.map((f) => (
            <div key={f.id} className="flex items-center gap-2 p-3 border border-border rounded-lg">
              <span className="text-sm font-medium text-foreground">{FILTER_TYPES[f.type]}:</span>
              <select value={f.value} onChange={(e) => setFilters(filters.map((x) => (x.id === f.id ? { ...x, value: e.target.value } : x)))} className="flex-1 px-2 py-1 border border-border rounded text-sm text-foreground bg-background">
                <option value="all">الكل</option>
                <option value="it">تقنية المعلومات</option>
                <option value="nursing">التمريض</option>
                <option value="admin">الإدارة</option>
              </select>
              <button onClick={() => removeFilter(f.id)} className="text-muted-foreground hover:text-[#B45309] transition-colors"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <select onChange={(e) => { if (e.target.value) { addFilter(e.target.value); e.target.value = "" } }} className={inputClass}>
          <option value="">+ إضافة فلتر</option>
          {Object.entries(FILTER_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </section>

      {/* Visualization */}
      <section>
        <label className={label}>طريقة العرض</label>
        <div className="grid grid-cols-4 gap-2">
          {VIS.map((x) => (
            <button key={x.v} onClick={() => setVis(x.v)} className={`p-3 border-2 rounded-lg text-center transition-colors ${vis === x.v ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}>
              <x.icon className="w-5 h-5 mx-auto mb-1 text-foreground" />
              <span className="text-xs text-foreground">{x.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Layout */}
      <section>
        <label className={label}>التخطيط</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[["single", "عمود واحد"], ["two", "عمودان"], ["three", "ثلاثة أعمدة"]].map(([v, l]) => (
            <button key={v} onClick={() => setLayout(v)} className={`p-3 border-2 rounded-lg text-center text-sm transition-colors ${layout === v ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-muted-foreground/30"}`}>{l}</button>
          ))}
        </div>
        <div className="space-y-2">
          {[["الترويسة", showHeader, setShowHeader], ["التذييل", showFooter, setShowFooter], ["وسيلة الإيضاح", showLegend, setShowLegend]].map(([l, val, set]) => (
            <label key={l as string} className="flex items-center gap-2 text-sm text-foreground/80">
              <input type="checkbox" checked={val as boolean} onChange={(e) => (set as (b: boolean) => void)(e.target.checked)} className="accent-primary" />
              {l as string}
            </label>
          ))}
        </div>
      </section>

      {/* Save as template */}
      <section>
        <label className="flex items-center gap-2 text-sm text-foreground/80 mb-2">
          <input type="checkbox" checked={asTemplate} onChange={(e) => setAsTemplate(e.target.checked)} className="accent-primary" />
          حفظ كقالب
        </label>
        {asTemplate && <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="اسم القالب" className={inputClass} />}
      </section>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <Button onClick={() => setPreview(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Eye className="w-4 h-4 ml-1.5" /> معاينة التقرير
        </Button>
        <Button variant="outline">إنشاء التقرير</Button>
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <PreviewModal
            name={name}
            metricsSelected={metrics.filter((m) => m.selected).length}
            filtersCount={filters.length}
            visLabel={VIS.find((x) => x.v === vis)?.label ?? ""}
            layout={layout}
            onClose={() => setPreview(false)}
          />
        )}
      </AnimatePresence>
    </Card>
  )
}

function PreviewModal({
  name, metricsSelected, filtersCount, visLabel, layout, onClose,
}: {
  name: string
  metricsSelected: number
  filtersCount: number
  visLabel: string
  layout: string
  onClose: () => void
}) {
  const modalRef = useModalA11y(onClose)
  const prefersReduced = useReducedMotion()
  const transition = prefersReduced ? reducedTransition : modalTransition
  return (
    <motion.div
      variants={modalBackdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={transition}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalPanelVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-modal-title"
        className="max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="p-0 overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 id="preview-modal-title" className="text-lg font-bold text-foreground">معاينة الإعداد</h2>
            <button onClick={onClose} aria-label="إغلاق" className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">الاسم</span><span className="text-foreground font-medium">{name || "— بدون اسم —"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">المؤشرات المختارة</span><span className="text-foreground font-medium">{metricsSelected}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">الفلاتر</span><span className="text-foreground font-medium">{filtersCount}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">طريقة العرض</span><span className="text-foreground font-medium">{visLabel}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">التخطيط</span><span className="text-foreground font-medium">{layout === "single" ? "عمود واحد" : layout === "two" ? "عمودان" : "ثلاثة أعمدة"}</span></div>
            <div className="mt-4 p-4 rounded-lg bg-secondary/40 text-center text-muted-foreground text-xs leading-relaxed">
              سيُولَّد التقرير بالمؤشرات والفلاتر المختارة عند ربط خدمة التوليد.
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
