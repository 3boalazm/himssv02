import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import Link from "next/link"
import { ReportBuilder } from "@/components/reports/report-builder"

export default function ReportBuilderPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="org" />

      <main className="flex-1 min-w-0 p-4 lg:p-6 lg:mr-56">
        <Header
          title="منشئ التقارير"
          description="ابنِ تقريراً مخصّصاً بالمؤشرات والفلاتر التي تريدها."
          showOrgAlert={false}
          actions={
            <Link href="/reports/insights">
              <Button variant="outline" className="w-full sm:w-auto h-9 text-sm transition-colors bg-transparent">
                <BarChart3 className="w-4 h-4 ml-1.5" />
                لوحة التقارير
              </Button>
            </Link>
          }
        />
        <div className="max-w-3xl">
          <ReportBuilder />
        </div>
      </main>
    </div>
  )
}
