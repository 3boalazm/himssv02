"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Lock, CheckCircle2, PlayCircle, Search } from "lucide-react"
import Link from "next/link"

interface Lesson {
  id: string
  title: string
  titleEn: string
  domain: string
  topic: string
  duration: number // minutes
  tier: "مجاني" | "احترافية"
  status: "completed" | "in_progress" | "not_started" | "locked"
  progress: number // 0-100
}

// Real project data — same domain/topic names used in /capabilities and /matrix
const lessons: Lesson[] = [
  {
    id: "hl7-fhir-r4",
    title: "أساسيات معايير HL7 و FHIR",
    titleEn: "HL7 & FHIR Foundations",
    domain: "التشغيل البيني",
    topic: "معايير FHIR R4",
    duration: 28,
    tier: "مجاني",
    status: "completed",
    progress: 100,
  },
  {
    id: "nphies-integration",
    title: "تكامل منصة NPHIES مع الأنظمة",
    titleEn: "NPHIES Platform Integration",
    domain: "التشغيل البيني",
    topic: "منصة NPHIES والتكامل",
    duration: 34,
    tier: "احترافية",
    status: "in_progress",
    progress: 42,
  },
  {
    id: "pdpl-classification",
    title: "تصنيف بيانات PDPL وضوابطها",
    titleEn: "PDPL Data Classification",
    domain: "الأمن والخصوصية",
    topic: "تصنيف البيانات وضوابطها",
    duration: 25,
    tier: "احترافية",
    status: "in_progress",
    progress: 15,
  },
  {
    id: "pdpl-fundamentals",
    title: "نظام حماية البيانات الشخصية (PDPL)",
    titleEn: "Personal Data Protection Law",
    domain: "الأمن والخصوصية",
    topic: "نظام حماية البيانات الشخصية (PDPL)",
    duration: 22,
    tier: "مجاني",
    status: "not_started",
    progress: 0,
  },
  {
    id: "identity-access",
    title: "إدارة الوصول والهوية الرقمية",
    titleEn: "Identity & Access Management",
    domain: "الأمن والخصوصية",
    topic: "إدارة الوصول والهوية",
    duration: 30,
    tier: "احترافية",
    status: "locked",
    progress: 0,
  },
  {
    id: "clinical-ml",
    title: "نماذج التعلم الآلي السريرية",
    titleEn: "Clinical ML Models",
    domain: "التحليلات والذكاء",
    topic: "نماذج التعلم الآلي السريرية",
    duration: 40,
    tier: "احترافية",
    status: "not_started",
    progress: 0,
  },
  {
    id: "health-analytics",
    title: "تحليلات البيانات الصحية",
    titleEn: "Healthcare Data Analytics",
    domain: "التحليلات والذكاء",
    topic: "تحليلات البيانات الصحية",
    duration: 27,
    tier: "احترافية",
    status: "locked",
    progress: 0,
  },
  {
    id: "ehr-management",
    title: "إدارة السجل الصحي الإلكتروني",
    titleEn: "Electronic Health Record Management",
    domain: "نظم المعلومات الصحية",
    topic: "إدارة السجل الصحي الإلكتروني",
    duration: 32,
    tier: "مجاني",
    status: "completed",
    progress: 100,
  },
  {
    id: "data-lifecycle",
    title: "دورة حياة البيانات الصحية",
    titleEn: "Health Data Lifecycle",
    domain: "نظم المعلومات الصحية",
    topic: "دورة حياة البيانات الصحية",
    duration: 20,
    tier: "مجاني",
    status: "completed",
    progress: 100,
  },
  {
    id: "data-governance",
    title: "حوكمة البيانات الصحية",
    titleEn: "Health Data Governance",
    domain: "نظم المعلومات الصحية",
    topic: "حوكمة البيانات الصحية",
    duration: 24,
    tier: "احترافية",
    status: "not_started",
    progress: 0,
  },
  {
    id: "digital-governance",
    title: "حوكمة المبادرات الرقمية",
    titleEn: "Digital Initiative Governance",
    domain: "القيادة الرقمية",
    topic: "حوكمة المبادرات الرقمية",
    duration: 26,
    tier: "احترافية",
    status: "locked",
    progress: 0,
  },
  {
    id: "org-change",
    title: "إدارة التغيير التنظيمي",
    titleEn: "Organizational Change Management",
    domain: "إدارة التغيير",
    topic: "إدارة التغيير التنظيمي",
    duration: 23,
    tier: "مجاني",
    status: "not_started",
    progress: 0,
  },
]

const domains = ["الكل", "نظم المعلومات الصحية", "التشغيل البيني", "الأمن والخصوصية", "التحليلات والذكاء", "القيادة الرقمية", "إدارة التغيير"]

const statusMeta = {
  completed: { label: "مكتمل", icon: CheckCircle2, color: "#22C55E" },
  in_progress: { label: "جارٍ", icon: PlayCircle, color: "#3B82F6" },
  not_started: { label: "لم يبدأ", icon: BookOpen, color: undefined },
  locked: { label: "احترافية", icon: Lock, color: undefined },
}

export default function LessonsIndexPage() {
  const [domain, setDomain] = useState("الكل")
  const [query, setQuery] = useState("")

  const filtered = lessons.filter((l) => {
    const matchesDomain = domain === "الكل" || l.domain === domain
    const matchesQuery = l.title.includes(query) || l.titleEn.toLowerCase().includes(query.toLowerCase())
    return matchesDomain && matchesQuery
  })

  const completedCount = lessons.filter((l) => l.status === "completed").length

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="learner" />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">الدروس</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {completedCount} من {lessons.length} درساً مكتمل · محتوى مبني على فجواتك الحقيقية
          </p>
        </div>

        {/* Search + domain filter */}
        <Card className="p-3 mb-5">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="بحث عن درس"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-9 pr-9 pl-3 text-sm rounded-md border border-input bg-background text-foreground outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {domains.map((d) => (
                <button
                  key={d}
                  onClick={() => setDomain(d)}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                    domain === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Lessons grid */}
        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-sm text-muted-foreground">لا توجد دروس مطابقة — جرّب تعديل البحث أو الفلتر</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lesson, i) => {
              const meta = statusMeta[lesson.status]
              const isLocked = lesson.status === "locked"

              const card = (
                <Card
                  className={`p-5 h-full flex flex-col animate-in-up ${
                    isLocked ? "opacity-70" : "card-interactive cursor-pointer"
                  }`}
                  style={{ animationDelay: `${(i % 6) * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                      {lesson.domain}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        lesson.tier === "مجاني"
                          ? "bg-secondary text-muted-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {lesson.tier}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-foreground mb-1 leading-snug">
                    {lesson.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mb-4" dir="ltr">
                    {lesson.titleEn}
                  </p>

                  <div className="mt-auto space-y-3">
                    {lesson.status === "in_progress" && (
                      <div className="progress-track h-2">
                        <div
                          className="progress-fill-gradient animate-pulse-glow"
                          style={
                            {
                              width: `${lesson.progress}%`,
                              "--pulse-color": "rgba(59,130,246,.5)",
                            } as React.CSSProperties
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {lesson.duration} دقيقة
                      </span>
                      <span
                        className="flex items-center gap-1 font-medium"
                        style={{ color: meta.color ?? "var(--muted-foreground)" }}
                      >
                        <meta.icon className="w-3.5 h-3.5" />
                        {meta.label}
                      </span>
                    </div>
                  </div>
                </Card>
              )

              return isLocked ? (
                <div key={lesson.id}>{card}</div>
              ) : (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                  {card}
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
