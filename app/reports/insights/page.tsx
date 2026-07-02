import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react"
import Link from "next/link"
import { InsightsContent } from "@/components/reports/insights-content"

export default function InsightsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="org" />

      <main className="flex-1 min-w-0 p-4 lg:p-6 lg:mr-56">
        <Header
          title="لوحة التقارير التحليلية"
          description="أداء الفريق والاتجاهات عبر مجالات الجاهزية."
          showOrgAlert={false}
          actions={
            <Link href="/reports/builder">
              <Button variant="outline" className="w-full sm:w-auto h-9 text-sm transition-colors bg-transparent">
                <Wrench className="w-4 h-4 ml-1.5" />
                منشئ التقارير
              </Button>
            </Link>
          }
        />
        <InsightsContent />
      </main>
    </div>
  )
}
