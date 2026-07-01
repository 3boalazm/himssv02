import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface TableSkeletonProps {
  /**
   * Must match the actual table's row count so there is no layout shift
   * when real data arrives. Default: 6.
   */
  rows?: number
  /**
   * Must match the actual table's column count.
   * Column widths mimic the real grid: first col wider, rest equal.
   * Default: 5.
   */
  columns?: number
  /** Additional wrapper className */
  className?: string
}

/**
 * TableSkeleton — pixel-accurate placeholder for the team/data tables.
 *
 * Sizing contract: match the parent table's grid exactly so the
 * transition from skeleton → real content causes zero layout shift.
 * Default values (rows=6, columns=5) match TeamCollaboration.
 */
export function TableSkeleton({ rows = 6, columns = 5, className }: TableSkeletonProps) {
  // Col widths mirror the real grid-cols-12 split used in TeamCollaboration
  const colWidths = [
    "col-span-4", // العضو — wider (avatar + name)
    ...Array(columns - 1).fill("col-span-2"), // remaining cols equal
  ]

  return (
    <div className={cn("space-y-0.5", className)} dir="rtl" aria-busy="true" aria-label="جارٍ التحميل">
      {/* Header row skeleton */}
      <div className="grid grid-cols-12 gap-2 px-2 pb-2 border-b border-border">
        {colWidths.map((w, i) => (
          <Skeleton key={i} className={cn(w, "h-3 rounded-sm opacity-50")} />
        ))}
      </div>

      {/* Data rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid grid-cols-12 gap-2 items-center px-2 py-2.5"
          style={{ animationDelay: `${rowIdx * 40}ms` }}
        >
          {/* First col: avatar circle + name bar */}
          <div className="col-span-4 flex items-center gap-2.5">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <Skeleton className="h-3.5 flex-1 rounded-sm" />
          </div>

          {/* Remaining cols */}
          {Array.from({ length: columns - 1 }).map((_, colIdx) => (
            <div key={colIdx} className="col-span-2 flex justify-center">
              <Skeleton
                className="h-3.5 rounded-sm"
                style={{
                  width: colIdx === columns - 2 ? "52px" : "32px", // last col = status pill
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
