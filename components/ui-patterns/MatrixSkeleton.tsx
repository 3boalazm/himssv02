import { cn } from "@/lib/utils"

interface MatrixSkeletonProps {
  /** Additional wrapper className */
  className?: string
  /**
   * Number of domain bar skeletons.
   * Should match the actual domain count in the Matrix/Results screen. Default: 5.
   */
  barCount?: number
}

/**
 * MatrixSkeleton — latency-theater placeholder for the radar + domain bars.
 *
 * PURPOSE: Prepare the user's eye for the incoming radar animation.
 * This skeleton should show for 300–600ms before the real chart mounts,
 * giving the radar's entrance animation a clean visual handoff instead of
 * an abrupt appearance.
 *
 * ANIMATION: Subtle directional shimmer (not Tailwind pulse).
 * The shimmer moves left→right at low opacity so it reads as "loading"
 * without the aggressive throb of animate-pulse.
 *
 * SIZING: The radar circle is 240×240px to match the real SVG viewBox.
 * Domain bars match the actual bar track height (10px) and approximate widths.
 */
export function MatrixSkeleton({ className, barCount = 5 }: MatrixSkeletonProps) {
  // Varying widths simulate the different domain lengths
  const barWidths = ["78%", "62%", "55%", "70%", "48%", "65%", "42%"]

  return (
    <div className={cn("flex flex-col items-center gap-8", className)} dir="rtl">
      <style>{`
        @keyframes hlos-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .hlos-shimmer {
          background: linear-gradient(
            90deg,
            var(--secondary) 0%,
            color-mix(in srgb, var(--secondary) 70%, var(--muted-foreground) 30%) 50%,
            var(--secondary) 100%
          );
          background-size: 600px 100%;
          animation: hlos-shimmer 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Radar placeholder — circular, 240×240 */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="hlos-shimmer rounded-full opacity-60"
          style={{ width: 240, height: 240 }}
        />
        {/* Inner ring overlay (creates ring shape) */}
        <div
          className="absolute rounded-full bg-background"
          style={{ width: 168, height: 168 }}
        />
        {/* Center dot */}
        <div
          className="absolute hlos-shimmer rounded-full opacity-40"
          style={{ width: 32, height: 32 }}
        />
      </div>

      {/* Domain bar skeletons */}
      <div className="w-full max-w-sm flex flex-col gap-4 px-2">
        {Array.from({ length: barCount }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            {/* Label skeleton */}
            <div className="flex items-center justify-between">
              <div
                className="hlos-shimmer rounded-sm h-3 opacity-50"
                style={{
                  width: `${45 + (i % 3) * 15}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
              <div
                className="hlos-shimmer rounded-sm h-3 opacity-50"
                style={{ width: 36, animationDelay: `${i * 0.1 + 0.05}s` }}
              />
            </div>
            {/* Bar track skeleton */}
            <div className="relative h-[10px] rounded-full bg-secondary overflow-hidden">
              <div
                className="hlos-shimmer absolute inset-y-0 left-0 rounded-full opacity-70"
                style={{
                  width: barWidths[i % barWidths.length],
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
