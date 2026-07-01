import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ListChecks, RotateCcw } from "lucide-react"
import Link from "next/link"

// Blueprint (weights) — transparency = credibility
const blueprint = [
  { domain: "نظم المعلومات الصحية", weight: 22 },
  { domain: "التشغيل البيني والمعايير", weight: 20 },
  { domain: "الأمن والخصوصية (PDPL)", weight: 18 },
  { domain: "التحليلات والذكاء", weight: 16 },
  { domain: "القيادة الرقمية", weight: 14 },
  { domain: "إدارة التغيير", weight: 10 },
]

export default function AssessPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">تقييم الجاهزية الشامل</h1>
            <p className="text-sm text-muted-foreground mt-1">
              قياس موضوعي دقيق — الشفافية جزء من مصداقية الأداة
            </p>
          </div>

          {/* Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <Card className="p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">~٥٠ دقيقة</p>
                <p className="text-[11px] text-muted-foreground">المدة المتوقعة</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <ListChecks className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">٤٠ سؤالاً</p>
                <p className="text-[11px] text-muted-foreground">عبر ٦ مجالات</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">حفظ تلقائي</p>
                <p className="text-[11px] text-muted-foreground">أكمل لاحقاً</p>
              </div>
            </Card>
          </div>

          {/* Blueprint table — transparency */}
          <Card className="p-6 mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-1">مخطط التقييم</h3>
            <p className="text-xs text-muted-foreground mb-4">
              الوزن النسبي لكل مجال في الدرجة النهائية
            </p>
            <div className="space-y-3">
              {blueprint.map((b) => (
                <div key={b.domain}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{b.domain}</span>
                    <span className="text-xs font-mono text-muted-foreground">{b.weight}%</span>
                  </div>
                  <div className="progress-track h-2.5">
                    <div
                      className="progress-fill-gradient animate-pulse-glow"
                      style={{ width: `${b.weight * 4}%`, "--pulse-color": "rgba(20,184,166,.5)" } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Policy note */}
          <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
            النتيجة فورية عند الانتهاء. يمكنك إعادة التقييم لاحقاً لقياس تقدمك. التقييم
            الكامل مجاني — لا يُقفل أبداً.
          </p>

          <div className="flex items-center gap-3">
            <Link href="/assess/session/1">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                ابدأ التقييم
              </Button>
            </Link>
            <Link href="/assess/history">
              <Button size="lg" variant="outline">
                سجل التقييمات السابقة
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
