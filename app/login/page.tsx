"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm font-mono">H</span>
          </div>
          <span className="text-xl font-bold text-foreground">HLOS</span>
        </div>

        <Card className="p-6">
          <h1 className="text-lg font-bold text-foreground mb-1">تسجيل الدخول</h1>
          <p className="text-xs text-muted-foreground mb-6">أدخل بياناتك للوصول إلى حسابك</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-foreground mb-1.5 block">البريد الإلكتروني</label>
              <Input type="email" placeholder="you@example.com" className="h-10" dir="ltr" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-foreground">كلمة المرور</label>
                <Link href="#" className="text-xs text-primary hover:underline">نسيت كلمة المرور؟</Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-10 pl-10"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Link href="/dashboard" className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                تسجيل الدخول
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="text-primary hover:underline">
              إنشاء حساب
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
