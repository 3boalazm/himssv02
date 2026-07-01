import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, BookOpen, Dumbbell, Sparkles, Lock, Circle } from "lucide-react"
import Link from "next/link"

const pathItems = [
  { type: "lesson", title: "أساسيات HL7 و FHIR", target: "التشغيل البيني", status: "done", icon: BookOpen },
  { type: "practice", title: "تدريب: معايير التبادل", target: "التشغيل البيني", status: "done", icon: Dumbbell },
  { type: "lesson", title: "تصنيف بيانات PDPL", target: "الأمن والخصوصية", status: "current", icon: BookOpen },
  { type: "scenario", title: "سيناريو: خرق بيانات PDPL", target: "الأمن والخصوصية", status: "locked", icon: Sparkles },
  { type: "lesson", title: "نماذج التعلم الآلي السريرية", target: "التحليلات والذكاء", status: "locked", icon: BookOpen },
  { type: "practice", title: "تدريب: تحليلات البيانات", target: "التحليلات والذكاء", status: "locked", icon: Dumbbell },
]

const typeLabel: Record<string, string> = {
  lesson: "درس",
  practice: "تدريب",
  scenario: "سيناريو",
}

export default function PathsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">مسار الجاهزية</h1>
            <p className="text-sm text-muted-foreground mt-1">
              خطتك التعليمية المبنية على فجواتك · ٩ من ١٥ عنصر مكتمل
            </p>
          </div>

          {/* Vertical timeline (RTL) */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute right-[19px] top-4 bottom-4 w-0.5 bg-border" />

            <div className="space-y-4">
              {pathItems.map((item, i) => {
                const isDone = item.status === "done"
                const isCurrent = item.status === "current"
                const isLocked = item.status === "locked"

                return (
                  <div key={i} className="relative flex gap-4">
                    {/* Node */}
                    <div className="relative z-10 flex-shrink-0">
                      {isDone ? (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Card */}
                    <Card
                      className={`flex-1 p-4 ${isLocked ? "opacity-60" : ""} ${
                        isCurrent ? "border-primary/40" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                              {typeLabel[item.type]}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                التالي
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            يعالج فجوة: {item.target}
                          </p>
                        </div>
                        {isCurrent && (
                          <Link href="/lessons/pdpl">
                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                              متابعة
                            </Button>
                          </Link>
                        )}
                        {isDone && (
                          <span className="text-xs text-primary">مكتمل</span>
                        )}
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
