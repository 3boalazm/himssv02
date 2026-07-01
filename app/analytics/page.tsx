import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { AnalyticsContent } from "@/components/analytics/analytics-content"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <Header
          title="Analytics"
          description="Track your performance and productivity metrics."
          actions={
            <Button
              variant="outline"
              className="w-full sm:w-auto h-9 text-sm transition-colors hover:shadow-md bg-transparent"
            >
              Export Report
            </Button>
          }
        />

        <div className="mt-6">
          <AnalyticsContent />
        </div>
      </main>
    </div>
  )
}
