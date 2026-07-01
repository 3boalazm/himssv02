"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

function passwordStrength(pw: string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: "", color: "" }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { level: 1, label: "ضعيفة", color: "#3B82F6" }
  if (score <= 2) return { level: 2, label: "متوسطة", color: "#14B8A6" }
  if (score === 3) return { level: 3, label: "جيدة", color: "#14B8A6" }
  return { level: 4, label: "قوية", color: "#22C55E" }
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const strength = useMemo(() => passwordStrength(password), [password])

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
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-10 pl-10"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {/* Strength indicator — blue→teal→green, no red/amber */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-colors"
                        style={{
                          background: i <= strength.level ? strength.color : "var(--secondary)",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: strength.color }}>
                    قوة كلمة المرور: {strength.label}
                  </p>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-1.5">
                8 أحرف على الأقل، حرف كبير، رقم، ورمز خاص للحصول على أفضل حماية
              </p>
            </div>

            <Link href="/onboarding" className="block">
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
