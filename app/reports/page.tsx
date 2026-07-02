import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Plus, Globe } from "lucide-react"

const reports = [
  { title: "تقرير الجاهزية المهنية", ref: "تقييم الجاهزية الشامل", date: "٢٠٢٦/٠٦/٢٨", lang: "العربية", status: "معتمد" },
  { title: "تقرير الجاهزية المهنية", ref: "التقييم المرجعي · الخط الأساسي", date: "٢٠٢٦/٠٥/١٥", lang: "العربية", status: "معتمد" },
  { title: "Professional Readiness Report", ref: "Comprehensive Assessment", date: "٢٠٢٦/٠٤/٠٢", lang: "English", status: "معتمد" },
]

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      {/* Generous spacing — F.6 executive report style, not admin density */}
      <main className="flex-1 p-4 lg:p-8 lg:mr-56">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-foreground">خزنة الأدلة المهنية</h1>
              <p className="text-sm text-muted-foreground mt-1">
                التقارير المعتمدة هنا توثّق مسارك المهني — توثيق موضوعي لإثبات التطوير
                المستمر أمام الجهات التنظيمية
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap">
              <Plus className="w-4 h-4 ml-1.5" />
              إنشاء تقرير جديد
            </Button>
          </div>

          {/* Report list — spacious cards */}
          <div className="mt-8 space-y-4">
            {reports.map((r, i) => (
              <Card key={i} className="p-6 hover:bg-secondary/20 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-foreground truncate" dir={r.lang === "English" ? "ltr" : "rtl"}>
                        {r.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">{r.ref}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground flex-wrap">
                        <span className="font-mono">{r.date}</span>
                        <span>·</span>
                        <span>{r.lang}</span>
                        <span>·</span>
                        <span className="text-primary">{r.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Globe className="w-3.5 h-3.5 ml-1.5" />
                      إعادة توليد
                    </Button>
                    <Button size="sm" className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Download className="w-3.5 h-3.5 ml-1.5" />
                      تنزيل
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground text-center mt-8">
            يستند التقرير إلى أحدث تقييم مكتمل · متاح بالعربية والإنجليزية
          </p>
        </div>
      </main>
    </div>
  )
}
