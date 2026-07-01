"use client"

import { Bell, UserPlus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MobileNav } from "./mobile-nav"
import { useState } from "react"

export function Header() {
  const [showInvite, setShowInvite] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between gap-3 mb-6 animate-slide-in-up">
        <div className="flex items-center gap-3">
          <MobileNav />
          <div>
            <h1 className="text-xl font-bold text-foreground">لوحة التحكم</h1>
            <p className="text-xs text-muted-foreground">مستشفى الملك فهد · يونيو 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-secondary">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-secondary relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
          </Button>
          <Button
            onClick={() => setShowInvite(true)}
            className="h-9 text-sm bg-primary hover:bg-primary/90 text-white gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            دعوة أعضاء
          </Button>
          <div className="flex items-center gap-2 pr-2 border-r border-border">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">م.ع</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Alert banner */}
      <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5 mb-5 animate-slide-in-up">
        <p className="text-sm text-amber-400">
          ⚠️ <span className="font-medium">8 أعضاء</span> لم يبدأوا التقييم بعد
        </p>
        <Button size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-black font-medium">
          إرسال تذكير
        </Button>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-base font-semibold text-foreground">دعوة أعضاء إلى مستشفى الملك فهد</h3>
              <button onClick={() => setShowInvite(false)} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">البريد الإلكتروني</label>
                <div className="flex flex-wrap gap-2 bg-secondary border border-border rounded-lg p-2 min-h-[42px]">
                  <span className="flex items-center gap-1.5 bg-primary/20 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                    s.ali@kfh.sa <button className="opacity-60 hover:opacity-100">✕</button>
                  </span>
                  <input className="bg-transparent text-sm text-foreground outline-none flex-1 min-w-[120px] placeholder:text-muted-foreground"
                    placeholder="أضف بريد إلكتروني..." />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">14 مقعد متاح · اضغط Enter لإضافة آخر</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">الدور</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border-2 border-primary bg-primary/10 rounded-lg p-3 cursor-pointer">
                    <p className="text-sm font-medium text-primary">عضو</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">يتعلم ويكمل التقييمات</p>
                  </div>
                  <div className="border border-border rounded-lg p-3 cursor-pointer hover:border-border/80">
                    <p className="text-sm font-medium text-foreground">مدير</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">يرى تقارير فريقه</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/50 rounded-b-xl">
              <p className="text-[11px] text-muted-foreground">سيصل بريد الدعوة خلال دقائق</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowInvite(false)} className="h-8 text-xs bg-transparent">إلغاء</Button>
                <Button size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 text-white">إرسال الدعوة (1)</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
