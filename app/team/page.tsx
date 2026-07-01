import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { TeamContent } from "@/components/team/team-content"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

export default function TeamPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-4 lg:p-6 lg:mr-56">
        <Header
          title="أعضاء الفريق"
          description="إدارة أعضاء المؤسسة ومتابعة جاهزيتهم."
          actions={
            <Button className="w-full sm:w-auto h-9 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <UserPlus className="w-4 h-4 ml-1.5" />
              دعوة أعضاء
            </Button>
          }
        />

        <div className="mt-6">
          <TeamContent />
        </div>
      </main>
    </div>
  )
}
