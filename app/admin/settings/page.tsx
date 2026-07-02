"use client"

import { useState } from "react"
import { Sidebar }       from "@/components/dashboard/sidebar"
import { ConfirmDialog } from "@/components/ui-patterns/ConfirmDialog"
import { Card }          from "@/components/ui/card"
import { Button }        from "@/components/ui/button"
import { Input }         from "@/components/ui/input"
import { cn }            from "@/lib/utils"
import { CreditCard, BarChart3, ClipboardList, Tag, Shield, FileText, Settings, LayoutDashboard, Users, Building2 } from "lucide-react"

const TABS = [
  { id: "payment",   icon: CreditCard,    label: "مزودو الدفع"        },
  { id: "plans",     icon: BarChart3,     label: "الخطط والأسعار"     },
  { id: "assess",    icon: ClipboardList, label: "إعدادات التقييم"   },
  { id: "taxonomy",  icon: Tag,           label: "إدارة التصنيف"      },
  { id: "limits",    icon: Shield,        label: "حدود الاستخدام"     },
  { id: "policies",  icon: FileText,      label: "سياسات وشروط"      },
]

const adminMenu = [
  { icon: LayoutDashboard, label: "لوحة تحكم النظام", href: "/admin" },
  { icon: Users, label: "إدارة المستخدمين", href: "/admin/users" },
  { icon: Building2, label: "إدارة المؤسسات", href: "/admin/organizations" },
  { icon: FileText, label: "إدارة المحتوى", href: "/admin/content" },
  { icon: Settings, label: "إعدادات المنصة", href: "/admin/settings" },
]

function SH({ title }: { title: string }) {
  return <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-5 first:mt-0">{title}</h3>
}

export default function AdminSettingsPage() {
  const [tab,     setTab]     = useState("payment")
  const [confirm, setConfirm] = useState<{ open: boolean; title: string; consequence: string; label: string } | null>(null)

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <div className="hidden lg:block"><Sidebar variant="admin" menuItems={adminMenu as any} /></div>

      <main className="flex-1 p-6 lg:mr-52 max-w-5xl">
        <div className="inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-3 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          <span className="text-xs font-medium text-muted-foreground">أنت تعرض هذه الصفحة بوصفك: مدير المنصة (super_admin)</span>
        </div>

        <div className="mb-5">
          <h1 className="text-lg font-bold text-foreground">إعدادات المنصة</h1>
          <p className="text-sm text-muted-foreground mt-1">إعدادات النظام العامة · HLOS Platform</p>
        </div>

        <div className="flex gap-6">
          <aside className="w-52 flex-shrink-0">
            <nav className="flex flex-col gap-0.5 bg-card border border-border rounded-xl p-2">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={cn("flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-right transition-colors duration-150 w-full",
                    tab === t.id ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:bg-secondary")}>
                  <t.icon className="w-3 h-3 flex-shrink-0" />
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            <Card className="p-6">

              {tab === "payment" && (
                <div>
                  <SH title="مزودو الدفع" />
                  {[
                    { name: "Moyasar", status: "نشط", hint: "SK_TEST_..." },
                    { name: "Tap Payments", status: "معطّل", hint: "sk_live_..." },
                  ].map(p => (
                    <div key={p.name} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-foreground font-mono">{p.name}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Input defaultValue={p.hint} dir="ltr" className="h-7 text-xs w-52 font-mono" />
                          <Button variant="outline" size="sm" className="h-7 text-xs">تحديث</Button>
                        </div>
                      </div>
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full", p.status === "نشط" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground")}>{p.status}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-3">⚠ مفاتيح الـ API الحقيقية تُضاف عبر environment variables فقط — لا تُحفظ في قاعدة البيانات.</p>
                </div>
              )}

              {tab === "plans" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <SH title="الخطط المتاحة" />
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">+ خطة جديدة</Button>
                  </div>
                  {[
                    { name: "مجاني",      price: "0 ريال",     status: "نشطة", users: 812  },
                    { name: "Pro شهري",   price: "XXX ريال [مؤقت]", status: "نشطة", users: 201 },
                    { name: "Pro سنوي",   price: "XXX ريال [مؤقت]", status: "نشطة", users: 156 },
                    { name: "Enterprise", price: "custom",      status: "نشطة", users: 47   },
                  ].map(pl => (
                    <div key={pl.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div><p className="text-sm font-semibold text-foreground">{pl.name}</p><p className="text-xs text-muted-foreground font-mono">{pl.price} · {pl.users} مستخدم</p></div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{pl.status}</span>
                        <Button variant="ghost" size="sm" className="text-xs h-7">تعديل</Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-[#A32D2D]"
                          onClick={() => setConfirm({ open:true, title:`تعطيل خطة "${pl.name}"`, consequence:`سيفقد المستخدمون الحاليون على هذه الخطة إمكانية التجديد — لا يُلغى وصولهم الحالي.`, label:"تعطيل الخطة" })}>
                          تعطيل
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === "assess" && (
                <div>
                  <SH title="مخططات التقييم (Blueprints)" />
                  <p className="text-sm text-muted-foreground mb-3">عدد الأسئلة الافتراضي للتقييم الشامل.</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="space-y-1.5"><label className="text-xs text-muted-foreground">أسئلة التقييم الشامل</label><Input defaultValue="40" type="number" dir="ltr" /></div>
                    <div className="space-y-1.5"><label className="text-xs text-muted-foreground">وقت التقييم (دقيقة)</label><Input defaultValue="50" type="number" dir="ltr" /></div>
                  </div>
                  <SH title="حصص المستخدم المجاني" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><label className="text-xs text-muted-foreground">عدد التقييمات الشاملة</label><Input defaultValue="3" type="number" dir="ltr" /></div>
                    <div className="space-y-1.5"><label className="text-xs text-muted-foreground">الفجوات المرئية مجاناً</label><Input defaultValue="3" type="number" dir="ltr" /></div>
                  </div>
                  <Button className="mt-4 bg-primary hover:bg-primary/90">حفظ الإعدادات</Button>
                </div>
              )}

              {tab === "taxonomy" && (
                <div>
                  <SH title="إدارة التصنيف" />
                  <div className="p-4 bg-secondary/50 border border-border rounded-lg flex items-center justify-between">
                    <div><p className="text-sm font-medium text-foreground">محرر التصنيف الكامل</p><p className="text-xs text-muted-foreground mt-0.5">إضافة وتعديل وإعادة ترتيب المجالات والموضوعات</p></div>
                    <Button variant="outline" size="sm" asChild><a href="/admin/taxonomy">فتح المحرر ←</a></Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">التصنيف يؤثر مباشرة على بنية التقييمات ومصفوفة الجاهزية.</p>
                </div>
              )}

              {tab === "limits" && (
                <div>
                  <SH title="حدود الاستخدام" />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "الطلبات في الدقيقة (مجاني)", val: "30" },
                      { label: "الطلبات في الدقيقة (Pro)",    val: "300" },
                      { label: "حد الأجهزة المتزامنة",        val: "3" },
                      { label: "حجم ملف التصدير (MB)",        val: "50" },
                    ].map(l => (
                      <div key={l.label} className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">{l.label}</label>
                        <Input defaultValue={l.val} dir="ltr" />
                      </div>
                    ))}
                  </div>
                  <Button className="mt-4 bg-primary hover:bg-primary/90">تطبيق الحدود</Button>
                </div>
              )}

              {tab === "policies" && (
                <div>
                  <SH title="النصوص القانونية" />
                  {[
                    { label: "سياسة حماية البيانات (PDPL)",  id: "pdpl"    },
                    { label: "شروط الاستخدام",                id: "terms"   },
                    { label: "سياسة الخصوصية",                id: "privacy" },
                  ].map(doc => (
                    <div key={doc.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <p className="text-sm font-medium text-foreground">{doc.label}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs">تحرير</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">معاينة</Button>
                      </div>
                    </div>
                  ))}
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
