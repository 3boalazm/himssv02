"use client"

import { useState } from "react"
import { Sidebar }       from "@/components/dashboard/sidebar"
import { ConfirmDialog } from "@/components/ui-patterns/ConfirmDialog"
import { Card }          from "@/components/ui/card"
import { Button }        from "@/components/ui/button"
import { Input }         from "@/components/ui/input"
import { cn }            from "@/lib/utils"
import { Building2, CreditCard, ClipboardList, Eye, Users, Download } from "lucide-react"

const TABS = [
  { id: "info",        icon: Building2,     label: "معلومات المؤسسة"   },
  { id: "plan",        icon: CreditCard,    label: "الاشتراك والمقاعد"  },
  { id: "campaigns",   icon: ClipboardList, label: "حملات التقييم"     },
  { id: "disclosure",  icon: Eye,           label: "سياسة الإفصاح"    },
  { id: "admins",      icon: Users,         label: "المشرفون المعاونون" },
  { id: "export",      icon: Download,      label: "تصدير البيانات"    },
]

function SH({ title }: { title: string }) {
  return <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-5 first:mt-0">{title}</h3>
}

export default function OrgSettingsPage() {
  const [tab,     setTab]     = useState("info")
  const [confirm, setConfirm] = useState<{ open: boolean; title: string; consequence: string; label: string } | null>(null)
  const [discl,   setDiscl]   = useState({ showAdmin: true, showPeers: false, autoExport: false })

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar variant="org" />

      <main className="flex-1 p-6 lg:mr-56 max-w-5xl">
        {/* Role badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-3 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          <span className="text-xs font-medium text-primary">أنت تعرض هذه الصفحة بوصفك: مشرف المؤسسة</span>
        </div>

        <div className="mb-5">
          <h1 className="text-lg font-bold text-foreground">إعدادات المؤسسة</h1>
          <p className="text-sm text-muted-foreground mt-1">مستشفى الملك فهد · 36 مقعداً نشطاً</p>
        </div>

        <div className="flex gap-6">
          <aside className="w-52 flex-shrink-0">
            <nav className="flex flex-col gap-0.5 bg-card border border-border rounded-xl p-2">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-right transition-colors duration-150 w-full",
                    tab === t.id ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:bg-secondary")}>
                  <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            <Card className="p-6">

              {tab === "info" && (
                <div>
                  <SH title="الهوية المؤسسية" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 mb-3"><label className="text-sm font-medium text-foreground">اسم المؤسسة</label><Input defaultValue="مستشفى الملك فهد" /></div>
                    <div className="space-y-1.5 mb-3"><label className="text-sm font-medium text-foreground">الاسم بالإنجليزية</label><Input defaultValue="King Fahad Hospital" dir="ltr" /></div>
                    <div className="space-y-1.5 mb-3"><label className="text-sm font-medium text-foreground">البريد الرسمي</label><Input defaultValue="admin@kfh.sa" dir="ltr" type="email" /></div>
                    <div className="space-y-1.5 mb-3"><label className="text-sm font-medium text-foreground">رقم الهاتف</label><Input defaultValue="+966 11 000 0000" dir="ltr" /></div>
                    <div className="col-span-2 space-y-1.5 mb-3"><label className="text-sm font-medium text-foreground">القطاع والتخصص</label><Input defaultValue="رعاية صحية · مستشفى حكومي" /></div>
                  </div>
                  <Button className="mt-2 bg-primary hover:bg-primary/90">حفظ التغييرات</Button>
                </div>
              )}

              {tab === "plan" && (
                <div>
                  <SH title="الخطة الحالية" />
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: "الخطة", value: "Enterprise" },
                      { label: "المقاعد المستخدمة", value: "36 / 50" },
                      { label: "تاريخ التجديد", value: "يونيو 2026" },
                    ].map(s => (
                      <div key={s.label} className="bg-secondary/50 rounded-lg p-4 border border-border">
                        <p className="text-xs text-muted-foreground mb-1.5">{s.label}</p>
                        <p className="text-lg font-bold text-foreground font-mono">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <SH title="إجراءات العقد" />
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">طلب زيادة مقاعد</Button>
                    <Button variant="outline" size="sm">تجديد العقد مبكراً</Button>
                    <Button size="sm" className="text-xs bg-[#A32D2D] hover:bg-[#8B2424] text-white border-0"
                      onClick={() => setConfirm({ open: true, title: "إلغاء الاشتراك", consequence: "ستفقد المؤسسة الوصول لجميع المقاعد في تاريخ انتهاء العقد الحالي يونيو 2026. لا يمكن الاسترداد.", label: "تأكيد الإلغاء" })}>
                      إلغاء الاشتراك
                    </Button>
                  </div>
                </div>
              )}

              {tab === "campaigns" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <SH title="حملات التقييم النشطة" />
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">+ حملة جديدة</Button>
                  </div>
                  {[
                    { name: "تقييم Q2 2026", started: "1 أبريل 2026", participants: "36", status: "نشطة" },
                    { name: "تقييم Q4 2025", started: "1 أكتوبر 2025", participants: "28", status: "مكتملة" },
                  ].map(c => (
                    <div key={c.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div><p className="text-sm font-medium text-foreground">{c.name}</p><p className="text-xs text-muted-foreground">{c.started} · {c.participants} مشاركاً</p></div>
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full", c.status === "نشطة" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground")}>{c.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "disclosure" && (
                <div>
                  <SH title="مرئية النتائج" />
                  <p className="text-sm text-muted-foreground mb-4">حدد من يمكنه رؤية نتائج تقييمات أعضاء الفريق.</p>
                  {([
                    { key: "showAdmin",   label: "نتائج الأعضاء مرئية للمشرف",        desc: "أنت ومشرفو المؤسسة يمكنهم رؤية نتائج جميع الأعضاء" },
                    { key: "showPeers",   label: "نتائج الأعضاء مرئية للزملاء",       desc: "الأعضاء يمكنهم رؤية نتائج بعضهم البعض في نفس الفريق" },
                    { key: "autoExport",  label: "تصدير تلقائي للتقارير الدورية",      desc: "إرسال تقرير أداء الفريق شهرياً إلى بريد المشرف" },
                  ] as const).map(d => (
                    <div key={d.key} className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
                      <div><p className="text-sm font-medium text-foreground">{d.label}</p><p className="text-xs text-muted-foreground mt-0.5">{d.desc}</p></div>
                      <button onClick={() => setDiscl(p => ({ ...p, [d.key]: !p[d.key] }))}
                        className="w-10 h-5.5 rounded-full flex items-center px-0.5 transition-colors duration-200 flex-shrink-0"
                        style={{ background: discl[d.key] ? "#0F6B6B" : "#334155" }}>
                        <span className="w-4 h-4 bg-white rounded-full transition-transform duration-200 block"
                          style={{ transform: discl[d.key] ? "translateX(18px)" : "translateX(0)" }} />
                      </button>
                    </div>
                  ))}
                  <Button className="mt-4 bg-primary hover:bg-primary/90">حفظ سياسة الإفصاح</Button>
                </div>
              )}

              {tab === "admins" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <SH title="المشرفون المعاونون" />
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">+ دعوة مشرف</Button>
                  </div>
                  {[
                    { name: "سارة المطيري", email: "s.almutairi@kfh.sa", role: "مشرف رئيسي" },
                    { name: "خالد العتيبي", email: "k.otaibi@kfh.sa",    role: "مشرف معاون" },
                  ].map(a => (
                    <div key={a.email} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold">{a.name.slice(0,2)}</div>
                        <div><p className="text-sm font-medium text-foreground">{a.name}</p><p className="text-xs text-muted-foreground font-mono">{a.email}</p></div>
                      </div>
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{a.role}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "export" && (
                <div>
                  <SH title="تقارير مجدولة" />
                  <div className="space-y-3 mb-4">
                    <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">تكرار الإرسال</label>
                      <select className="w-full h-9 px-3 bg-input border border-border rounded-md text-sm text-foreground">
                        <option>شهرياً</option><option>أسبوعياً</option><option>ربع سنوي</option>
                      </select>
                    </div>
                    <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">التنسيق</label>
                      <div className="flex gap-2">
                        {["PDF","Excel","JSON"].map(f => <Button key={f} variant="outline" size="sm" className={cn(f==="PDF" && "border-primary text-primary")}>{f}</Button>)}
                      </div>
                    </div>
                    <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">البريد المستقبِل</label><Input defaultValue="admin@kfh.sa" dir="ltr" /></div>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">حفظ إعدادات التصدير</Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      {confirm && (
        <ConfirmDialog
          open={confirm.open}
          onOpenChange={open => !open && setConfirm(null)}
          title={confirm.title}
          consequence={confirm.consequence}
          confirmLabel={confirm.label}
          variant="destructive"
          onConfirm={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
