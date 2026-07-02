import { PublicNav } from "@/components/public-nav"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"

const updated = "٢ يوليو ٢٠٢٦"

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "قبول الشروط",
    body: [
      "باستخدامك منصّة HLOS فإنك توافق على هذه الشروط والأحكام. إن كنت تستخدم المنصّة نيابةً عن منشأة، فأنت تُقرّ بأنك مخوّل بقبول هذه الشروط عنها.",
    ],
  },
  {
    heading: "الحساب والاستخدام",
    body: [
      "أنت مسؤول عن سرّية بيانات دخولك وعن النشاط الذي يجري عبر حسابك. تلتزم باستخدام المنصّة لأغراضها المشروعة فقط، وبعدم محاولة الوصول غير المصرّح به إلى أي جزء منها أو الإخلال بعملها.",
      "المحتوى التعليمي وأدوات التقييم مخصّصة للتطوير المهني الفردي والمؤسسي، ولا يجوز إعادة بيعها أو توزيعها دون إذن كتابي.",
    ],
  },
  {
    heading: "الاشتراكات والباقات",
    body: [
      "تعمل المنصّة بنموذج «التشخيص مجاني، والعلاج مدفوع»: التقييم الأساسي ونتيجته متاحان مجاناً، بينما تتطلّب المسارات التعليمية والمزايا المتقدّمة اشتراكاً في باقات Pro أو Premium أو باقة المنشآت.",
      "تُعرض أسعار الباقات وتفاصيلها في صفحة الأسعار. تُدار عمليات الدفع والتجديد وفق شروط الباقة المختارة، ويحقّ لك إلغاء التجديد وفق السياسة المعلنة.",
    ],
  },
  {
    heading: "الملكية الفكرية",
    body: [
      "جميع حقوق المحتوى والمنهجية والتصميم والعلامة التجارية لمنصّة HLOS محفوظة. يمنحك اشتراكك حقّ استخدام المنصّة لأغراضك الخاصة دون نقل أي حقوق ملكية.",
    ],
  },
  {
    heading: "إخلاء المسؤولية",
    body: [
      "تُقدَّم نتائج التقييم بوصفها أداة قياس للجاهزية المهنية، ولا تُشكّل شهادة اعتماد رسمية ولا استشارة قانونية أو تنظيمية. القرارات المبنية على هذه النتائج تقع على مسؤولية المستخدم أو منشأته.",
      "تُقدَّم المنصّة «كما هي» بأفضل جهد لضمان دقّتها واستمراريتها، دون ضمانات صريحة تتجاوز ما ينصّ عليه النظام.",
    ],
  },
  {
    heading: "الاختصاص القضائي",
    body: [
      "تخضع هذه الشروط لأنظمة المملكة العربية السعودية وتُفسَّر وفقاً لها، وتختص الجهات القضائية المختصة في المملكة بالنظر في أي نزاع ينشأ عنها.",
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <main className="max-w-3xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <p className="text-xs text-primary font-medium mb-2">قانوني</p>
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3">الشروط والأحكام</h1>
        <p className="text-sm text-muted-foreground mb-8">آخر تحديث: {updated}</p>

        <Card className="p-6 mb-6 bg-secondary/40">
          <p className="text-base text-foreground/80 leading-relaxed" style={{ lineHeight: 1.9 }}>
            توضّح هذه الشروط قواعد استخدام منصّة HLOS وحقوق الطرفين والتزاماتهما. يُرجى قراءتها
            بعناية. هذه الصفحة تعريفية ولا تُغني عن الاتفاقية النظامية الكاملة مع المنشأة عند
            التعاقد.
          </p>
        </Card>

        <div className="space-y-6">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-lg font-bold text-foreground mb-3 flex items-baseline gap-2">
                <span className="text-primary font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="text-[15px] text-foreground/75 leading-relaxed mb-3" style={{ lineHeight: 1.9 }}>
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
