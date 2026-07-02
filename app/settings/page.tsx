"use client"

import { useState } from "react"
import { Sidebar }        from "@/components/dashboard/sidebar"
import { ConfirmDialog }  from "@/components/ui-patterns/ConfirmDialog"
import { Card }           from "@/components/ui/card"
import { Button }         from "@/components/ui/button"
import { Input }          from "@/components/ui/input"
import { cn }             from "@/lib/utils"
import { User, Shield, Bell, Globe, CreditCard, Lock } from "lucide-react"

const TABS = [
  { id: "profile",     icon: User,       label: "الملف الشخصي"     },
  { id: "security",    icon: Shield,     label: "الأمان والدخول"    },
  { id: "notif",       icon: Bell,       label: "الإشعارات"         },
  { id: "lang",        icon: Globe,      label: "اللغة والمظهر"     },
  { id: "billing",     icon: CreditCard, label: "الفوترة"           },
  { id: "privacy",     icon: Lock,       label: "الخصوصية"          },
]

function SectionHeader({ title }: { title: string }) {
  return <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-5 first:mt-0">{title}</h3>
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 mb-4">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}
function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
      <div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-xs text-muted-foreground mt-0.5">{desc}</p></div>
      {children}
    </div>
  )
}

export default function UserSettingsPage() {
  const [tab,     setTab]     = useState("profile")
  const [notifs,  setNotifs]  = useState({ path: true, weekly: false, content: true })
  const [confirm, setConfirm] = useState<{ open: boolean; type: "export" | "delete" | null }>({ open: false, type: null })

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar variant="learner" />

      <main className="flex-1 p-6 lg:mr-56 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-foreground">إعدادات الحساب</h1>
          <p className="text-sm text-muted-foreground mt-1">أحمد البديري · ahmed.bedeer@kfh.sa</p>
        </div>

        <div className="flex gap-6">
          {/* Tab sidebar (right in RTL) */}
          <aside className="w-48 flex-shrink-0">
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

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Card className="p-6">

              {tab === "profile" && (
                <div>
                  <SectionHeader title="المعلومات الأساسية" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="الاسم الكامل"><Input defaultValue="أحمد البديري" /></Field>
                    <Field label="البريد الإلكتروني"><Input defaultValue="ahmed.bedeer@kfh.sa" type="email" dir="ltr" /></Field>
                    <Field label="المسمى الوظيفي"><Input defaultValue="مدير تقنية المعلومات الصحية" /></Field>
                    <Field label="المؤسسة"><Input defaultValue="مستشفى الملك فهد" disabled /></Field>
                  </div>
                  <SectionHeader title="هدف التعلم" />
                  <Field label="ما الذي تريد تحقيقه على المنصة؟">
                    <Input defaultValue="إغلاق فجوة التشغيل البيني والتحضير لاختبار FHIR R4" />
                  </Field>
                  <SectionHeader title="الإعدادات الإضافية" />
                  <Field label="مستوى الجاهزية الحالي (من التقييم)">
                    <div className="h-9 px-3 flex items-center bg-secondary rounded-md text-sm text-muted-foreground">ممارس متقدم · 71%</div>
                  </Field>
                  <Button className="mt-2 bg-primary hover:bg-primary/90">حفظ التغييرات</Button>
                </div>
              )}

              {tab === "security" && (
                <div>
                  <SectionHeader title="كلمة المرور" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="كلمة المرور الحالية"><Input type="password" placeholder="••••••••" /></Field>
                    <Field label="كلمة المرور الجديدة"><Input type="password" placeholder="••••••••" /></Field>
                  </div>
                  <Button variant="outline" className="mb-6">تحديث كلمة المرور</Button>

                  <SectionHeader title="الجلسات النشطة" />
                  {[
                    { device: "Chrome · macOS · الرياض", time: "نشط الآن" },
                    { device: "Safari · iPhone · الرياض", time: "أمس 20:11" },
                  ].map(s => (
                    <div key={s.device} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div><p className="text-sm text-foreground">{s.device}</p><p className="text-xs text-muted-foreground">{s.time}</p></div>
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">إلغاء الجلسة</Button>
                    </div>
                  ))}

                  <SectionHeader title="المصادقة الثنائية" />
                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                    <div><p className="text-sm font-medium text-foreground">المصادقة الثنائية (2FA)</p><p className="text-xs text-muted-foreground mt-0.5">طبقة حماية إضافية لحسابك</p></div>
                    <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border">قريباً</span>
                  </div>
                </div>
              )}

              {tab === "notif" && (
                <div>
                  <SectionHeader title="إشعارات التعلم" />
                  {([
                    { key: "path",    label: "تذكير المسار",       desc: "تذكير يومي بالدروس المستحقة" },
                    { key: "weekly",  label: "تقارير أسبوعية",     desc: "ملخص أسبوعي يُرسل كل إثنين" },
                    { key: "content", label: "تحديثات المحتوى",    desc: "عند إضافة محتوى جديد في مجالاتك" },
                  ] as const).map(n => (
                    <Row key={n.key} label={n.label} desc={n.desc}>
                      <button onClick={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))}
                        className="w-10 h-5.5 rounded-full flex items-center px-0.5 transition-colors duration-200"
                        style={{ background: notifs[n.key] ? "#0F6B6B" : "#334155" }}>
                        <span className="w-4 h-4 bg-white rounded-full transition-transform duration-200 block"
                          style={{ transform: notifs[n.key] ? "translateX(18px)" : "translateX(0)" }} />
                      </button>
                    </Row>
                  ))}
                </div>
              )}

              {tab === "lang" && (
                <div>
                  <SectionHeader title="اللغة" />
                  <Row label="لغة الواجهة" desc="اللغة المستخدمة في لوحة التحكم">
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-primary text-white">العربية</Button>
                      <Button size="sm" variant="outline">English</Button>
                    </div>
                  </Row>
                  <SectionHeader title="المظهر" />
                  <Row label="وضع العرض" desc="فاتح / داكن — يُطبّق على جميع الشاشات">
                    <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border">قريباً</span>
                  </Row>
                </div>
              )}

              {tab === "billing" && (
                <div>
                  <SectionHeader title="خطتك الحالية" />
                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div><p className="font-semibold text-primary">Pro ✦</p><p className="text-xs text-muted-foreground mt-0.5">اشتراك سنوي · يتجدد 1 يناير 2027</p></div>
                      <span className="text-sm font-mono text-foreground">XXX ريال/شهر</span>
                    </div>
                  </div>
                  <SectionHeader title="الفواتير" />
                  <p className="text-sm text-muted-foreground">عرض الفواتير السابقة — <span className="text-xs bg-secondary px-2 py-0.5 rounded-full border border-border">قريباً</span></p>
                </div>
              )}

              {tab === "privacy" && (
                <div>
                  <SectionHeader title="بياناتك" />
                  <Row label="تصدير بياناتي" desc="تنزيل نسخة كاملة من بيانات حسابك (JSON)">
                    <Button variant="outline" size="sm" onClick={() => setConfirm({ open: true, type: "export" })}>تصدير</Button>
                  </Row>
                  <Row label="حذف الحساب" desc="إزالة حسابك وجميع بياناتك بشكل نهائي">
                    <Button size="sm"
                      className="bg-[#A32D2D] hover:bg-[#8B2424] text-white border-0"
                      onClick={() => setConfirm({ open: true, type: "delete" })}>
                      حذف الحساب
                    </Button>
                  </Row>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={open => setConfirm(p => ({ ...p, open }))}
        title={confirm.type === "delete" ? "حذف الحساب نهائياً" : "تصدير بيانات الحساب"}
        consequence={confirm.type === "delete"
          ? "سيُحذف حسابك وجميع بياناتك بشكل نهائي ولا يمكن التراجع عن هذا الإجراء."
          : "سيتم إنشاء ملف JSON يحتوي على جميع بياناتك وإرساله إلى بريدك الإلكتروني."}
        confirmLabel={confirm.type === "delete" ? "حذف الحساب" : "تصدير البيانات"}
        variant={confirm.type === "delete" ? "destructive" : "default"}
        onConfirm={() => setConfirm({ open: false, type: null })}
      />
    </div>
  )
}
