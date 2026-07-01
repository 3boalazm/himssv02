"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell } from "lucide-react"

const domains = [
  "نظم المعلومات الصحية",
  "التشغيل البيني والمعايير",
  "الأمن والخصوصية (PDPL)",
  "التحليلات والذكاء",
  "القيادة الرقمية",
  "إدارة التغيير",
]

const counts = [10, 20, 30]
const difficulties = ["متدرج", "سهل", "متوسط", "صعب"]

export default function PracticePage() {
  const [domain, setDomain] = useState(domains[1])
  const [count, setCount] = useState(20)
  const [difficulty, setDifficulty] = useState("متدرج")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">التدريب</h1>
            <p className="text-sm text-muted-foreground mt-1">
              تدرّب على مجال محدد لإغلاق فجواتك
            </p>
          </div>

          <Card className="p-6 space-y-6">
            {/* Domain picker */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">المجال</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {domains.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDomain(d)}
                    className={`text-right p-3 rounded-lg border text-sm transition-colors ${
                      domain === d
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question count */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">عدد الأسئلة</label>
              <div className="flex gap-2">
                {counts.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCount(c)}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-mono transition-colors ${
                      count === c
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">مستوى الصعوبة</label>
              <div className="flex gap-2 flex-wrap">
                {difficulties.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      difficulty === d
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary/40"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Quota indicator */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 text-xs">
              <span className="text-muted-foreground">الحصة المتبقية اليوم</span>
              <span className="font-mono font-bold text-foreground">٣ / ٥ جلسات</span>
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Dumbbell className="w-4 h-4 ml-1.5" />
              بدء التدريب
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
