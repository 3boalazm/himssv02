"use client"

/**
 * /admin/billing — E.13 من HLOS_PRODUCT_ARCHITECTURE_BLUEPRINT_v1.md:
 * "Users-billing view: subscription status, entitlements, grant trial (J8),
 * set/revoke entitlement, payment records (3A), plan list (read-mostly)."
 *
 * قصداً بلا أي رقم MRR/ARR/Churn/LTV/CAC مجمّع — البيع دلوقتي يدوي بالكامل
 * (ADR-18: manual entitlement before payment gateway)، والفوترة الذاتية
 * self-serve هتيجي لاحقاً في Sprint 3A. الشاشة دي أدوات تشغيل يدوية فقط.
 */

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useModalA11y } from "@/hooks/use-modal-a11y"
import { modalBackdropVariants, modalPanelVariants, modalTransition, reducedTransition } from "@/lib/motion"
import {
  Search, Gift, ShieldOff, ShieldCheck, Receipt, X, Building2, User,
} from "lucide-react"

type EntityType = "فرد" | "مؤسسة"
type Plan = "مجاني" | "احترافية" | "مؤسسة"
type SubStatus = "نشط" | "تجريبي" | "منتهي" | "ملغى"

interface BillingRow {
  id: string
  name: string
  email: string
  type: EntityType
  plan: Plan
  status: SubStatus
  since: string
  expires: string
  method: "تحويل بنكي" | "منح تجربة" | "—"
}

const rows: BillingRow[] = [
  { id: "1", name: "مستشفى الملك فهد", email: "ahmed.bedeer@kfsh.sa", type: "مؤسسة", plan: "مؤسسة", status: "نشط", since: "٢٠٢٦/٠١/١٠", expires: "٢٠٢٧/٠١/١٠", method: "تحويل بنكي" },
  { id: "2", name: "سارة المطيري", email: "sara@kfsh.sa", type: "فرد", plan: "احترافية", status: "نشط", since: "٢٠٢٦/٠١/١٥", expires: "٢٠٢٦/١٢/١٥", method: "تحويل بنكي" },
  { id: "3", name: "مركز النور الطبي", email: "info@alnour.sa", type: "مؤسسة", plan: "احترافية", status: "تجريبي", since: "٢٠٢٦/٠٦/٢٥", expires: "٢٠٢٦/٠٧/٠٩", method: "منح تجربة" },
  { id: "4", name: "خالد العتيبي", email: "k.o@sghgroup.sa", type: "فرد", plan: "مؤسسة", status: "نشط", since: "٢٠٢٥/٠٩/١٠", expires: "٢٠٢٦/٠٩/١٠", method: "تحويل بنكي" },
  { id: "5", name: "فيصل الدوسري", email: "f.d@kfsh.sa", type: "فرد", plan: "احترافية", status: "منتهي", since: "٢٠٢٥/٠٣/٠١", expires: "٢٠٢٦/٠٣/٠١", method: "تحويل بنكي" },
  { id: "6", name: "عيادات الشفاء", email: "contact@shifa.sa", type: "مؤسسة", plan: "مجاني", status: "ملغى", since: "٢٠٢٥/١١/٠٥", expires: "—", method: "—" },
]

const payments = [
  { id: "p1", entity: "مستشفى الملك فهد", amount: "—", note: "تحويل بنكي مؤكَّد يدوياً", date: "٢٠٢٦/٠١/١٠" },
  { id: "p2", entity: "سارة المطيري", amount: "—", note: "تحويل بنكي مؤكَّد يدوياً", date: "٢٠٢٦/٠١/١٥" },
  { id: "p3", entity: "خالد العتيبي", amount: "—", note: "تحويل بنكي مؤكَّد يدوياً", date: "٢٠٢٥/٠٩/١٠" },
]

const planStyle: Record<Plan, string> = {
  مجاني: "bg-secondary text-muted-foreground",
  احترافية: "bg-primary/10 text-primary",
  مؤسسة: "bg-[#14B8A6]/10 text-[#14B8A6]",
}
const statusStyle: Record<SubStatus, string> = {
  نشط: "bg-primary/10 text-primary",
  تجريبي: "bg-[#3B82F6]/10 text-[#3B82F6]",
  منتهي: "bg-secondary text-muted-foreground",
  ملغى: "bg-[#B45309]/10 text-[#B45309]",
}

export default function AdminBillingPage() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"الكل" | SubStatus>("الكل")
  const [data, setData] = useState(rows)
  const [grantTarget, setGrantTarget] = useState<BillingRow | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ row: BillingRow; action: "revoke" | "activate" } | null>(null)

  const filtered = data.filter(
    (r) =>
      (statusFilter === "الكل" || r.status === statusFilter) &&
      (r.name.includes(query) || r.email.includes(query))
  )

  const applyStatus = (id: string, status: SubStatus) => {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    setConfirmAction(null)
  }

  const grantTrial = (id: string) => {
    setData((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "تجريبي", plan: r.plan === "مجاني" ? "احترافية" : r.plan, method: "منح تجربة" } : r
      )
    )
    setGrantTarget(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="admin" />

      <main className="flex-1 p-4 lg:p-5 lg:mr-52">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-foreground">الفوترة والاشتراكات</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            إدارة يدوية للاشتراكات والصلاحيات — البيع الذاتي عبر بوابة الدفع لسه مش مفعّل
          </p>
        </div>

        {/* Search + filter */}
        <Card className="p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الإيميل"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-9 h-9 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "الكل" | SubStatus)}
              className="h-9 px-3 text-sm rounded-md border border-input bg-background text-foreground"
            >
              {(["الكل", "نشط", "تجريبي", "منتهي", "ملغى"] as const).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Subscriptions table */}
        <Card className="p-0 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-muted-foreground bg-secondary/40 border-b border-border">
                  <th className="text-right font-medium p-3">الجهة</th>
                  <th className="text-right font-medium p-3">النوع</th>
                  <th className="text-right font-medium p-3">الباقة</th>
                  <th className="text-right font-medium p-3">الحالة</th>
                  <th className="text-right font-medium p-3">بداية الاشتراك</th>
                  <th className="text-right font-medium p-3">الانتهاء</th>
                  <th className="text-right font-medium p-3">طريقة التفعيل</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">
                      لا توجد نتائج — جرّب تعديل شرط البحث أو الفلتر
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {r.type === "مؤسسة" ? (
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          )}
                          <div>
                            <div className="text-foreground">{r.name}</div>
                            <div className="text-[11px] text-muted-foreground" dir="ltr" style={{ textAlign: "right" }}>{r.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{r.type}</td>
                      <td className="p-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${planStyle[r.plan]}`}>{r.plan}</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusStyle[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="p-3 text-[11px] text-muted-foreground font-mono">{r.since}</td>
                      <td className="p-3 text-[11px] text-muted-foreground font-mono">{r.expires}</td>
                      <td className="p-3 text-[11px] text-muted-foreground">{r.method}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary"
                            title="منح تجربة"
                            onClick={() => setGrantTarget(r)}
                          >
                            <Gift className="w-3.5 h-3.5" />
                          </Button>
                          {r.status === "نشط" || r.status === "تجريبي" ? (
                            <Button
                              variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-[#B45309]"
                              title="إلغاء الصلاحية"
                              onClick={() => setConfirmAction({ row: r, action: "revoke" })}
                            >
                              <ShieldOff className="w-3.5 h-3.5" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary"
                              title="تفعيل الصلاحية"
                              onClick={() => setConfirmAction({ row: r, action: "activate" })}
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Payment records — read-mostly per E.13 */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Receipt className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-bold text-foreground">سجل المدفوعات</h2>
            <span className="text-[11px] text-muted-foreground">— للاطلاع فقط، التسجيل يدوي حتى تفعيل بوابة الدفع</span>
          </div>
          <div className="divide-y divide-border/50">
            {payments.map((p) => (
              <div key={p.id} className="p-3 flex items-center justify-between text-sm">
                <div>
                  <span className="text-foreground">{p.entity}</span>
                  <span className="text-[11px] text-muted-foreground mr-2">{p.note}</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">{p.date}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Grant trial modal */}
        <AnimatePresence>
          {grantTarget && (
            <GrantTrialModal target={grantTarget} onClose={() => setGrantTarget(null)} onConfirm={grantTrial} />
          )}
        </AnimatePresence>

        {/* Revoke/activate confirm modal */}
        <AnimatePresence>
          {confirmAction && (
            <ConfirmActionModal
              data={confirmAction}
              onClose={() => setConfirmAction(null)}
              onConfirm={(id, status) => applyStatus(id, status)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

/* ─── Accessible modal subcomponents ─────────────────────────────────────
 * Each calls useModalA11y so it gets Escape-to-close, initial focus, and
 * focus-return on close. Kept as separate components (not inline JSX) so
 * the hook mounts/unmounts cleanly with the modal itself. */

function GrantTrialModal({ target, onClose, onConfirm }: { target: BillingRow; onClose: () => void; onConfirm: (id: string) => void }) {
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
        aria-labelledby="grant-trial-title"
        className="max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 id="grant-trial-title" className="text-sm font-bold text-foreground">منح تجربة</h2>
            <button onClick={onClose} aria-label="إغلاق" className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm text-foreground/80">
              هيتم منح <strong className="text-foreground">{target.name}</strong> تجربة ١٤ يوم لباقة احترافية.
            </p>
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={() => onConfirm(target.id)} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                تأكيد المنح
              </Button>
              <Button size="sm" variant="outline" onClick={onClose}>إلغاء</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

function ConfirmActionModal({
  data, onClose, onConfirm,
}: {
  data: { row: BillingRow; action: "revoke" | "activate" }
  onClose: () => void
  onConfirm: (id: string, status: SubStatus) => void
}) {
  const modalRef = useModalA11y(onClose)
  const isRevoke = data.action === "revoke"
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
        aria-labelledby="confirm-action-title"
        className="max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 id="confirm-action-title" className="text-sm font-bold text-foreground">
              {isRevoke ? "إلغاء الصلاحية" : "تفعيل الصلاحية"}
            </h2>
            <button onClick={onClose} aria-label="إغلاق" className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm text-foreground/80">
              {isRevoke
                ? <>هيتم إلغاء صلاحية <strong className="text-foreground">{data.row.name}</strong> فوراً.</>
                : <>هيتم تفعيل صلاحية <strong className="text-foreground">{data.row.name}</strong> من جديد.</>}
            </p>
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                onClick={() => onConfirm(data.row.id, isRevoke ? "ملغى" : "نشط")}
                className={isRevoke ? "bg-[#B45309] text-white hover:bg-[#B45309]/90 transition-colors" : "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"}
              >
                تأكيد
              </Button>
              <Button size="sm" variant="outline" onClick={onClose}>تراجع</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
