import { Sidebar }           from "@/components/dashboard/sidebar"
import { Header }            from "@/components/dashboard/header"
import { StatsCards }        from "@/components/dashboard/stats-cards"
import { TeamCollaboration } from "@/components/dashboard/team-collaboration"
import { Reminders }         from "@/components/dashboard/reminders"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <Header />

        <div className="space-y-4">
          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TeamCollaboration />
            </div>
            <div>
              <Reminders />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
