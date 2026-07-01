"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm font-mono">H</span>
          </div>
          <span className="text-xl font-bold text-foreground">HLOS</span>
        </div>

        <Card className="p-6">
          <h1 className="text-lg font-bold text-foreground mb-1">إنشاء حساب</h1>
          <p className="text-xs text-muted-foreground mb-6">ابدأ تقييم جاهزيتك المجاني</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-foreground mb-1.5 block">الاسم الكامل</label>
              <Input placeholder="أحمد بدير" className="h-10" />
            </div>
            <div>
              <label className="text-sm text-foreground mb-1.5 block">البريد الإلكتروني</label>
              <Input type="email" placeholder="you@example.com" className="h-10" dir="ltr" />
            </div>
            <div>
              <label className="text-sm text-foreground mb-1.5 block">كلمة المرور</label>
              <Input type="password" placeholder="••••••••" className="h-10" />
            </div>

            <Link href="/dashboard" className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                إنشاء الحساب
              </Button>
            </Link>
          </div>

          <p className="text-[11px] text-muted-foreground text-center mt-4 leading-relaxed">
            بإنشائك الحساب فإنك توافق على الشروط والأحكام وسياسة الخصوصية
          </p>

          <p className="text-xs text-muted-foreground text-center mt-4">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
