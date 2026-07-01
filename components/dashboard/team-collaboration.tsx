"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus, MoreVertical } from "lucide-react"

const members = [
  { name: "سارة المطيري",     initials: "سم", score: 84, lessons: 12, lastActive: "اليوم",        status: "مكتمل",  statusClass: "bg-primary/10 text-primary" },
  { name: "خالد العتيبي",     initials: "خع", score: 71, lessons: 8,  lastActive: "أمس",           status: "مكتمل",  statusClass: "bg-primary/10 text-primary" },
  { name: "نورة الحربي",      initials: "نح", score: 58, lessons: 3,  lastActive: "منذ 3 أيام",   status: "جارٍ",   statusClass: "bg-amber-500/10 text-amber-600" },
  { name: "فيصل القحطاني",    initials: "فق", score: 0,  lessons: 0,  lastActive: "منذ أسبوع",    status: "جديد",   statusClass: "bg-secondary text-muted-foreground" },
  { name: "ريم الشمري",       initials: "رش", score: 92, lessons: 18, lastActive: "اليوم",        status: "مكتمل",  statusClass: "bg-primary/10 text-primary" },
  { name: "عبدالله الدوسري",  initials: "عد", score: 38, lessons: 2,  lastActive: "منذ 5 أيام",   status: "جارٍ",   statusClass: "bg-amber-500/10 text-amber-600" },
]

// Sequential scale — teal (إتقان) → amber (فجوة). No red: gaps are opportunities, not failures.
function scoreColor(score: number) {
  if (score === 0)   return "text-muted-foreground"
  if (score >= 70)   return "text-primary"     // deep teal — mastery
  if (score >= 50)   return "text-amber-500"   // amber mid — progressing
  return "text-amber-700"                       // amber dark — gap (NOT red)
}

export function TeamCollaboration() {
  return (
    <Card className="p-6 animate-slide-in-up" style={{ animationDelay: "600ms" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-foreground">آخر نشاط الفريق</h2>
          <p className="text-xs text-muted-foreground mt-0.5">36 عضو · 24 أكملوا التقييم</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 bg-transparent border-border">
            <UserPlus className="w-3.5 h-3.5" />
            دعوة أعضاء
          </Button>
          <a href="/team" className="text-xs text-primary hover:underline">عرض الكل</a>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-12 gap-2 px-2 pb-2 border-b border-border text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
        <div className="col-span-4">العضو</div>
        <div className="col-span-2 text-center">الدرجة</div>
        <div className="col-span-2 text-center">الدروس</div>
        <div className="col-span-2 text-center">آخر نشاط</div>
        <div className="col-span-2 text-center">الحالة</div>
      </div>

      <div className="space-y-0.5 mt-1">
        {members.map((m, i) => (
          <div
            key={m.name}
            className="grid grid-cols-12 gap-2 items-center px-2 py-2.5 rounded-lg hover:bg-secondary transition-colors duration-150 cursor-pointer"
          >
            <div className="col-span-4 flex items-center gap-2.5">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                  {m.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground truncate">{m.name}</span>
            </div>
            <div className={`col-span-2 text-center text-sm font-semibold ${scoreColor(m.score)}`}>
              {m.score === 0 ? "—" : `${m.score}%`}
            </div>
            <div className="col-span-2 text-center text-sm text-muted-foreground">{m.lessons}</div>
            <div className="col-span-2 text-center text-xs text-muted-foreground">{m.lastActive}</div>
            <div className="col-span-2 flex justify-center">
              <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${m.statusClass}`}>
                {m.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
