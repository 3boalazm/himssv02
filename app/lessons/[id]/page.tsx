import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Bookmark, CheckCircle2, Lightbulb, Target } from "lucide-react"
import Link from "next/link"

export default function LessonReaderPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      <main className="flex-1 lg:mr-56">
        {/* Reading progress bar (top) */}
        <div className="sticky top-0 z-10 h-1 bg-secondary">
          <div className="h-full bg-primary" style={{ width: "35%" }} />
        </div>

        <div className="p-4 lg:p-6">
          {/* Prescription ribbon — appears only when reached via a gap */}
          <div className="max-w-[70ch] mx-auto mb-6">
            <div className="inline-flex items-center gap-2 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              <Target className="w-3.5 h-3.5" />
              متعلق بفجوتك: التشغيل البيني
            </div>
          </div>

          {/* Article */}
          <article className="max-w-[70ch] mx-auto">
            {/* Lesson meta */}
            <div className="mb-2 text-xs text-muted-foreground">
              المسارات التعليمية · الدرس رقم ٣ · الفصل الأول
            </div>

            <h1
              className="text-3xl font-bold text-foreground mb-6"
              style={{ lineHeight: 1.4 }}
            >
              أساسيات التشغيل البيني: معايير HL7 و FHIR
            </h1>

            {/* Body — 17-19px, line-height 1.8-1.9 */}
            <div style={{ fontSize: "18px", lineHeight: 1.85 }} className="text-foreground space-y-5">
              <p>
                يُعد التشغيل البيني الركيزة الاتصالية لتبادل البيانات الصحية في المستشفيات
                الحديثة. فبدون قدرة الأنظمة المختلفة على تبادل المعلومات بشكل موثوق، تتحول
                السجلات الصحية إلى جزر معزولة يصعب الاستفادة منها في الرعاية المتكاملة.
              </p>

              <p>
                يمثل معيار HL7 المعيار الأكثر انتشاراً في تبادل البيانات الصحية عالمياً،
                وهو ما يواجهه كثير من مختصي تقنية المعلومات الصحية في المنطقة عند العمل على
                مشاريع التكامل. يحمل كل رسالة هوية المريض بما تشمله من معرّفات، إضافة إلى
                بيانات الحدث السريري المرتبط بها.
              </p>

              {/* Callout — أهم نقطة */}
              <Card className="p-5 bg-primary/5 border-r-4 border-primary rounded-none rounded-l-lg my-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">أهم نقطة</p>
                    <p className="text-base text-foreground" style={{ lineHeight: 1.7 }}>
                      إتقان الاثنين معاً — HL7 التقليدي و FHIR الحديث — هو ما يميّز المختص
                      القادر على العمل في بيئات المستشفيات المختلطة، إذ تتعايش الأنظمة
                      القديمة والحديثة في معظم منشآت الرعاية الصحية بالمنطقة.
                    </p>
                  </div>
                </div>
              </Card>

              <h2 className="text-xl font-bold text-foreground pt-2" style={{ lineHeight: 1.5 }}>
                بنية الرسائل وأنواعها
              </h2>

              <p>
                تتكوّن رسائل HL7 من مجموعة من المقاطع، يحمل كل منها نوعاً محدداً من
                المعلومات. ومن أنواع الرسائل الرئيسية ما يرتبط بأحداث دخول المريض وخروجه
                ونقله، وما يتعلق بنتائج المختبرات والفحوصات.
              </p>

              {/* Figure placeholder with Arabic-first caption */}
              <figure className="my-6">
                <div className="w-full h-48 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    الشكل ١: بنية رسالة HL7 النموذجية
                  </span>
                </div>
                <figcaption className="text-xs text-muted-foreground text-center mt-2">
                  مخطط يوضح المقاطع الرئيسية في رسالة HL7 وتسلسلها
                </figcaption>
              </figure>

              {/* Key points box */}
              <Card className="p-5 my-6">
                <p className="text-sm font-semibold text-foreground mb-3">
                  النقاط المحورية لهذا الفصل
                </p>
                <ul className="space-y-2">
                  {[
                    "التشغيل البيني شرط أساسي للرعاية الصحية المتكاملة",
                    "HL7 هو المعيار الأكثر انتشاراً في تبادل البيانات الصحية",
                    "FHIR يمثل الجيل الحديث المبني على معايير الويب",
                    "بيئات المستشفيات تتطلب إتقان المعيارين معاً",
                  ].map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-base text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span style={{ lineHeight: 1.6 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-10 pt-6 border-t border-border">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <CheckCircle2 className="w-4 h-4 ml-1.5" />
                إكمال الدرس
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>

            {/* Prev / next within path */}
            <div className="flex items-center justify-between mt-6">
              <Link
                href="#"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                الدرس السابق
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                الدرس التالي: تكامل FHIR
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
