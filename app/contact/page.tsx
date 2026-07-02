"use client"

import { useState } from "react"
import { PublicNav } from "@/components/public-nav"
import { SiteFooter } from "@/components/site-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Building2, Clock, CheckCircle2 } from "lucide-react"

const channels = [
  { icon: Mail, label: "البريد", value: "support@hlos.sa" },
  { icon: Building2, label: "للمنشآت", value: "partners@hlos.sa" },
  { icon: Clock, label: "أوقات الرد", value: "خلال يوم عمل واحد" },
]

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const canSend = name.trim() && email.trim() && message.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return
    // UI-only: no backend is wired yet, so we just confirm receipt locally.
    setSent(true)
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:border-primary transition-colors"

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <main className="max-w-4xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <p className="text-xs text-primary font-medium mb-2">تواصل</p>
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3">تواصل معنا</h1>
        <p className="text-base text-foreground/70 leading-relaxed mb-10 max-w-2xl">
          عندك سؤال عن المنصّة أو مهتم بتفعيلها لمنشأتك؟ اكتب لنا وسنرد عليك في أقرب وقت.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Channels */}
          <div className="space-y-4">
            {channels.map((c) => (
              <Card key={c.label} className="p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                <p className="text-sm font-medium text-foreground" dir="ltr" style={{ textAlign: "right" }}>{c.value}</p>
              </Card>
            ))}
          </div>

          {/* Form */}
          <Card className="p-6 lg:col-span-2">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-12" role="status" aria-live="polite">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">تم استلام رسالتك</h2>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
                  شكراً {name.trim()} — وصلتنا رسالتك وسنرد على {email.trim()} خلال يوم عمل واحد.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSent(false)
                    setName("")
                    setEmail("")
                    setMessage("")
                  }}
                >
                  إرسال رسالة أخرى
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">الاسم</label>
                  <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="اسمك الكامل" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">البريد الإلكتروني</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" dir="ltr" style={{ textAlign: "right" }} />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">الرسالة</label>
                  <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className={inputClass} placeholder="اكتب سؤالك أو طلبك هنا…" style={{ resize: "vertical" }} />
                </div>
                <Button type="submit" disabled={!canSend} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                  إرسال الرسالة
                </Button>
              </form>
            )}
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
