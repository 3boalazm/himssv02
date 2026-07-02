"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Mail, Check, BookMarked, UserX } from "lucide-react"

// HLOS org members — readiness-focused (not PM tasks)
const teamMembers = [
  { id: "sara",    name: "سارة الأحمدي",   email: "sara.ahmadi@kfsh.sa",  score: 87, lessons: 24, lastActive: "اليوم",       status: "completed",   initials: "سأ" },
  { id: "khaled",  name: "خالد العتيبي",   email: "k.otaibi@kfsh.sa",     score: 91, lessons: 30, lastActive: "اليوم",       status: "completed",   initials: "خع" },
  { id: "reem",    name: "ريم السلمي",     email: "reem.salmi@kfsh.sa",   score: 92, lessons: 18, lastActive: "اليوم",       status: "completed",   initials: "رس" },
  { id: "mohamed", name: "محمد الزهراني",  email: "m.zahrani@kfsh.sa",    score: 72, lessons: 18, lastActive: "أمس",         status: "in_progress", initials: "مز" },
  { id: "noura",   name: "نورة القحطاني",  email: "noura.q@kfsh.sa",      score: 58, lessons: 15, lastActive: "منذ 3 أيام",  status: "in_progress", initials: "نق" },
  { id: "faisal",  name: "فيصل الدوسري",   email: "f.aldosari@kfsh.sa",   score: 0,  lessons: 0,  lastActive: "—",           status: "new",         initials: "فد" },
]

// Sequential blue→green scale — matches site-wide performance scale
function scoreColor(score: number) {
  if (score === 0) return "text-muted-foreground"
  if (score >= 70) return "text-[#22C55E]"
  if (score >= 50) return "text-[#14B8A6]"
  return "text-[#3B82F6]"
}

const statusMap: Record<string, { label: string; cls: string }> = {
  completed:   { label: "أكمل التقييم", cls: "bg-primary/10 text-primary" },
  in_progress: { label: "جارٍ",          cls: "bg-[#3B82F6]/10 text-[#3B82F6]" },
  new:         { label: "جديد",          cls: "bg-muted text-muted-foreground" },
}

export function TeamContent() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const clearSelection = () => setSelected(new Set())
  const selectAll = () => setSelected(new Set(teamMembers.map((m) => m.id)))

  return (
    <div className="space-y-6">
      {/* Bulk action bar — appears only when members are selected */}
      {selected.size > 0 && (
        <Card className="p-3 flex items-center justify-between animate-in-up sticky top-2 z-10 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              {selected.size} عضو محدد
            </span>
            <button onClick={clearSelection} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              إلغاء التحديد
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              <Mail className="w-3.5 h-3.5 ml-1.5" />
              إرسال تذكير
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <BookMarked className="w-3.5 h-3.5 ml-1.5" />
              تعيين مسار تعليمي
            </Button>
            <Button size="sm" variant="outline" className="text-xs text-muted-foreground">
              <UserX className="w-3.5 h-3.5 ml-1.5" />
              تعطيل
            </Button>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{teamMembers.length} عضو</p>
        <button onClick={selectAll} className="text-xs text-primary hover:underline">
          تحديد الكل
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teamMembers.map((member) => {
          const status = statusMap[member.status]
          const isSelected = selected.has(member.id)
          return (
            <Card
              key={member.email}
              className={`p-6 transition-colors hover:bg-secondary/40 cursor-pointer ${
                isSelected ? "border-primary/50" : ""
              }`}
              onClick={() => toggle(member.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggle(member.id)
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                      isSelected ? "bg-primary border-primary" : "border-border"
                    }`}
                    aria-label="تحديد العضو"
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <Avatar className="w-14 h-14 border-2 border-primary/15">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-base text-foreground">{member.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>

                <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${status.cls}`}>
                  {status.label}
                </span>

                <div className="pt-3 border-t border-border grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className={`text-lg font-bold ${scoreColor(member.score)}`}>
                      {member.score === 0 ? "—" : `${member.score}%`}
                    </p>
                    <p className="text-[10px] text-muted-foreground">الدرجة</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{member.lessons}</p>
                    <p className="text-[10px] text-muted-foreground">الدروس</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground pt-1.5">{member.lastActive}</p>
                    <p className="text-[10px] text-muted-foreground">آخر نشاط</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="w-3.5 h-3.5 ml-1.5" />
                  إرسال تذكير
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
