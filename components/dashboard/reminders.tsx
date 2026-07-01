"use client"

import { Card } from "@/components/ui/card"
import { Mail, Download, FileSpreadsheet, BookMarked, Bell } from "lucide-react"

const actions = [
  { icon: Mail,            label: "دعوة أعضاء جدد",       badge: null,  color: "text-primary" },
  { icon: Download,        label: "تصدير تقرير PDF",        badge: null,  color: "text-muted-foreground" },
  { icon: FileSpreadsheet, label: "تصدير بيانات Excel",     badge: null,  color: "text-muted-foreground" },
  { icon: BookMarked,      label: "تعيين مسار تعليمي",      badge: null,  color: "text-primary" },
  { icon: Bell,            label: "تذكير غير النشطين",      badge: "8",   color: "text-amber-400" },
]

export function Reminders() {
  return (
    <Card className="p-5 animate-slide-in-up" style={{ animationDelay: "500ms" }}>
      <h2 className="text-base font-semibold text-foreground mb-4">إجراءات سريعة</h2>
      <div className="space-y-1.5">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors duration-150 text-right"
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${action.color}`} />
              <span className="text-sm text-foreground flex-1">{action.label}</span>
              {action.badge && (
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {action.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
