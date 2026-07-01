import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  /**
   * Optional Lucide icon — rendered at 48px, text-muted-foreground.
   * Do NOT pass decorative stock-art icons. If unsure, omit and rely on copy alone.
   */
  icon?: LucideIcon
  /** Orienting headline — tells the user where they are and what's possible. */
  title: string
  /**
   * Supporting copy — must guide the user toward action, not apologise.
   * e.g. "المسار الموصى بك مبني على فجوات تقييمك — ابدأ أول درس للبدء"
   * NOT: "لا توجد بيانات لعرضها"
   */
  description: string
  /** Optional primary CTA. label + onClick are both required if provided. */
  action?: { label: string; onClick: () => void }
  className?: string
}

/**
 * EmptyState — an orienting, forward-looking placeholder.
 *
 * Rule: copy must always point forward ("ابدأ…", "أضف…", "اختر…")
 * never backward or apologetic ("لا توجد…", "لا يوجد…" in isolation).
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-14 px-8 gap-4",
        className
      )}
      dir="rtl"
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-1">
          <Icon className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
        </div>
      )}

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base font-semibold text-foreground leading-snug">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {action && (
        <Button
          onClick={action.onClick}
          className="mt-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
