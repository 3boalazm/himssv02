import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { AnalyticsContent } from "@/components/analytics/analytics-content"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="org" />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <Header
          title="التقارير والأداء"
          description="متابعة أداء الفريق وإنتاجية التعلم."
          showOrgAlert={false}
          actions={
            <Button
              variant="outline"
              className="w-full sm:w-auto h-9 text-sm transition-colors bg-transparent"
            >
              <Download className="w-4 h-4 ml-1.5" />
              تصدير التقرير
            </Button>
          }
        />

        <div className="mt-6 animate-in-up">
          <AnalyticsContent />
        </div>
      </main>
    </div>
  )
}
