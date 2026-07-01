import { CapabilityRadar, type RadarDomain } from "@/components/learner/capability-radar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Target, TrendingUp, Award, ArrowLeft } from "lucide-react"
import Link from "next/link"

const sampleDomains: RadarDomain[] = [
  { label: "نظم", score: 78 },
  { label: "NPHIES", score: 65 },
  { label: "الأمن", score: 54 },
  { label: "التحليلات", score: 42 },
  { label: "القيادة", score: 69 },
  { label: "التغيير", score: 71 },
]

const pillars = [
  { icon: Target, title: "قِس", desc: "تقييم موضوعي لجاهزيتك عبر مجالات تقنية المعلومات الصحية بدقة قابلة للقياس" },
  { icon: TrendingUp, title: "ابنِ", desc: "خطة تعليمية مخصصة تُبنى من فجواتك الحقيقية، لا محتوى عام" },
  { icon: Award, title: "أثبِت", desc: "تقارير احترافية توثّق تقدمك وتصلح للعرض على قيادتك" },
]

// Public top nav — the landing has no app sidebar
function PublicNav() {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xs font-mono">H</span>
          </div>
          <span className="font-bold text-foreground">HLOS</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/capabilities" className="hover:text-foreground transition-colors">التصنيف</Link>
          <Link href="#methodology" className="hover:text-foreground transition-colors">المنهجية</Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">الأسعار</Link>
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
              أين أنت بالضبط في جاهزية تقنية المعلومات الصحية؟
            </h1>
            <p className="text-xl text-foreground/70 leading-relaxed mb-8">
              ليس تقديراً عاماً، بل قياس دقيق موضوعي لجاهزيتك عبر مجالات نظم المعلومات
              الصحية والتشغيل البيني والأمن — اعرفه بدقة قابلة للقياس.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  ابدأ التقييم المجاني
                </Button>
              </Link>
              <Link href="/assess">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  جرّب ٣ أسئلة بلا تسجيل
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              ٤٠ سؤالاً · ~٥٠ دقيقة · النتيجة فورية عند الانتهاء
            </p>
          </div>

          {/* Matrix visual — same CapabilityRadar (4th reuse) */}
          <div className="flex justify-center">
            <Card className="p-8 flex flex-col items-center">
              <CapabilityRadar domains={sampleDomains} size={340} />
              <p className="text-xs text-muted-foreground mt-3">نموذج لمصفوفة الجاهزية</p>
            </Card>
          </div>
        </div>
      </section>

      {/* 3 pillars */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <Card key={p.title} className="p-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Methodology teaser */}
      <section id="methodology" className="max-w-6xl mx-auto px-4 lg:px-6 py-20">
        <Card className="p-8 bg-secondary/40">
          <div className="max-w-3xl">
            <p className="text-xs text-primary font-medium mb-2">المنهجية</p>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              التقييم ليس محتوى تعليمياً — بل قياس دقيق
            </h2>
            <p className="text-base text-foreground/70 leading-relaxed">
              كل سؤال في هذا التقييم مبني من واقع العمل الميداني في تنفيذ أنظمة المعلومات
              الصحية في المنطقة. النتيجة فورية، والتقييم الكامل مجاني — تعرف موقعك الحقيقي
              قبل أن تبدأ رحلة التعلم.
            </p>
          </div>
        </Card>
      </section>

      {/* Author credibility */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-20">
        <Card className="p-8">
          <p className="text-xs text-primary font-medium mb-2">المؤلف والمنهج</p>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            بُني هذا التقييم من واقع خبرة تتجاوز عقداً في تنفيذ الأنظمة الصحية
          </h2>
          <p className="text-base text-foreground/70 leading-relaxed">
            خبرة ميدانية في مشاريع التشغيل البيني والامتثال ونظم المعلومات الصحية عبر
            منشآت الرعاية الصحية في المملكة والخليج.
          </p>
        </Card>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          جاهز لمعرفة موقعك الحقيقي؟
        </h2>
        <Link href="/dashboard">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            ابدأ التقييم المجاني
            <ArrowLeft className="w-4 h-4 mr-1.5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© ٢٠٢٦ HLOS</span>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">الخصوصية</Link>
            <Link href="#" className="hover:text-foreground transition-colors">الشروط والأحكام</Link>
            <Link href="#" className="hover:text-foreground transition-colors">تواصل معنا</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
