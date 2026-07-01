import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card } from "@/components/ui/card"
import { Check, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

function PublicNav() {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link href="/landing" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xs font-mono">H</span>
          </div>
          <span className="font-bold text-foreground">HLOS</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/capabilities" className="hover:text-foreground transition-colors">التصنيف</Link>
          <Link href="/pricing" className="text-foreground">الأسعار</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/dashboard">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              ابدأ مجاناً
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

const freeFeatures = [
  "التقييم الكامل عبر جميع المجالات",
  "النتيجة الفورية ومصفوفة الجاهزية",
  "أعلى ٣ فجوات بالاسم",
  "معاينة التصنيف الكامل",
]

const proFeatures = [
  "كل ما في الباقة المجانية",
  "القائمة الكاملة للفجوات + خطة مخصصة لكل فجوة",
  "الوصول الكامل لجميع الدروس",
  "أرشيف التقارير الاحترافية (PDF)",
  "وضع السيناريوهات التفاعلي",
  "التدريب غير المحدود",
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <section className="max-w-5xl mx-auto px-4 lg:px-6 py-16">
        {/* Framing: diagnosis free / treatment paid */}
        <div className="text-center mb-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
            التشخيص مجاني · العلاج مدفوع
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            التقييم الكامل لا يُقفل أبداً. القفل يظهر فقط على فجوتك الحقيقية — لا رسالة
            عامة، بل الفجوة الفعلية بالاسم.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-3xl mx-auto">
          {/* Free */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-foreground">مجاني</h2>
            <p className="text-sm text-muted-foreground mt-1">للتشخيص الكامل</p>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-bold text-foreground font-mono">٠</span>
              <span className="text-sm text-muted-foreground mr-1">ريال · بلا بطاقة</span>
            </div>
            <ul className="space-y-3 mb-6">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">ابدأ مجاناً</Button>
            </Link>
          </Card>

          {/* Pro — most chosen */}
          <Card className="p-6 border-primary/40 relative">
            <span className="absolute -top-3 right-6 bg-primary text-primary-foreground text-[11px] font-medium px-3 py-1 rounded-full">
              الأكثر اختياراً
            </span>
            <h2 className="text-lg font-bold text-foreground">الاحترافية</h2>
            <p className="text-sm text-muted-foreground mt-1">للعلاج الكامل والخطة المخصصة</p>
            <div className="mt-4 mb-1">
              <span className="text-3xl font-bold text-primary font-mono">٨٩</span>
              <span className="text-sm text-muted-foreground mr-1">ريال / شهرياً</span>
            </div>
            {/* Placeholder price disclaimer (blueprint requirement) */}
            <p className="text-[11px] text-[#B45309] mb-5">سعر توضيحي مؤقت · غير معتمد نهائياً</p>
            <ul className="space-y-3 mb-6">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              اشترك في الاحترافية
            </Button>
          </Card>
        </div>

        {/* Detailed feature comparison table */}
        <div className="max-w-3xl mx-auto mt-8">
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-right font-semibold text-foreground p-4">الميزة</th>
                    <th className="text-center font-semibold text-foreground p-4 w-28">مجاني</th>
                    <th className="text-center font-semibold text-primary p-4 w-28">احترافية</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "عدد الأسئلة في التقييم", free: "40 سؤالاً", pro: "40 سؤالاً" },
                    { label: "مصفوفة الجاهزية الكاملة", free: true, pro: true },
                    { label: "الفجوات الظاهرة بالاسم", free: "أعلى 3", pro: "غير محدود" },
                    { label: "الخطة المخصصة لكل فجوة", free: false, pro: true },
                    { label: "الوصول لكل الدروس", free: false, pro: true },
                    { label: "التقارير (PDF عربي/إنجليزي)", free: false, pro: true },
                    { label: "أرشيف التقارير", free: false, pro: true },
                    { label: "وضع السيناريوهات", free: false, pro: true },
                    { label: "التدريب", free: "محدود", pro: "غير محدود" },
                  ].map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "" : "bg-secondary/10"}>
                      <td className="p-4 text-foreground">{row.label}</td>
                      <td className="p-4 text-center">
                        {typeof row.free === "boolean" ? (
                          row.free ? (
                            <Check className="w-4 h-4 text-[#22C55E] mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">{row.free}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? (
                            <Check className="w-4 h-4 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="text-xs font-medium text-primary">{row.pro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Specific gap lock illustration */}
        <div className="max-w-3xl mx-auto mt-6">
          <Card className="p-5 bg-primary/5 border-primary/20 flex items-start gap-3">
            <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                فجوتك الرابعة: حوكمة البيانات
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                القفل يظهر على فجوتك الحقيقية بالاسم — التحليل الكامل والخطة المخصصة متاحان
                في الباقة الاحترافية
              </p>
            </div>
          </Card>
        </div>

        {/* Org / enterprise block — routes to contact, not checkout */}
        <div className="max-w-3xl mx-auto mt-10">
          <Card className="p-8 bg-secondary/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  للمؤسسات والمستشفيات
                </h3>
                <p className="text-sm text-muted-foreground max-w-lg">
                  تتبع أداء الفريق، تقارير مجمّعة على مستوى المؤسسة، عقود مرنة. التسعير
                  يعتمد على عدد المقاعد ونطاق الخدمة.
                </p>
              </div>
              <Button variant="outline" className="whitespace-nowrap flex-shrink-0">
                تواصل معنا
                <ArrowLeft className="w-4 h-4 mr-1.5" />
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
