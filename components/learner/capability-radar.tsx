"use client"

/**
 * CapabilityRadar — THE signature visual of HLOS.
 *
 * Single source of truth for the readiness radar. Reused in:
 *   - /matrix (full size)
 *   - /assess/results/[id] (with reveal animation)
 *   - /dashboard (mini variant)
 *
 * Design rules (locked — see F.3 / F.8):
 *   - Sequential teal fill — NEVER traffic-light red/green.
 *   - Dot color follows mastery on a teal→amber sequential scale:
 *       high mastery = deep teal, gap = warm amber. A gap is an
 *       opportunity, never a failure — no crimson anywhere.
 *   - IBM Plex Sans Arabic labels, IBM Plex Mono for the % scores.
 */

export interface RadarDomain {
  label: string
  score: number // 0-100
}

interface CapabilityRadarProps {
  domains: RadarDomain[]
  /** Overall px size of the square SVG. Default 380. Use ~180 for mini. */
  size?: number
  /** Show the domain text labels + score labels around the ring. */
  showLabels?: boolean
  /** Play the entrance animation (results reveal). */
  animate?: boolean
}

// Traffic-light scale (site-wide, by product decision — red/amber/green).
function masteryColor(score: number): string {
  if (score >= 70) return "#22C55E" // green — strong
  if (score >= 40) return "#F59E0B" // amber — mid
  return "#EF4444" // red — needs attention
}

const INK = "#16242F"

export function CapabilityRadar({
  domains,
  size = 380,
  showLabels = true,
  animate = false,
}: CapabilityRadarProps) {
  const n = domains.length
  const vb = 520 // internal viewBox — coordinates computed against this
  const cx = vb / 2
  const cy = vb / 2
  const maxR = 190 // radius at 100%
  const labelR = maxR + 34

  // Angle for each axis — start at top (-90°), go clockwise.
  const angleAt = (i: number) => (-90 + (360 / n) * i) * (Math.PI / 180)

  // Concentric grid hexagons at 25/50/75/100%.
  const gridRings = [0.25, 0.5, 0.75, 1].map((frac) => {
    const pts = Array.from({ length: n }, (_, i) => {
      const a = angleAt(i)
      const r = maxR * frac
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
    }).join(" ")
    return { points: pts, dash: frac === 1 ? "0" : "3 3" }
  })

  // Axis lines from center to each vertex.
  const axes = Array.from({ length: n }, (_, i) => {
    const a = angleAt(i)
    return {
      x2: (cx + maxR * Math.cos(a)).toFixed(1),
      y2: (cy + maxR * Math.sin(a)).toFixed(1),
    }
  })

  // The domain polygon.
  const dataPoints = domains
    .map((d, i) => {
      const a = angleAt(i)
      const r = maxR * (d.score / 100)
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
    })
    .join(" ")

  // Dots at each domain vertex.
  const dots = domains.map((d, i) => {
    const a = angleAt(i)
    const r = maxR * (d.score / 100)
    return {
      cx: cx + r * Math.cos(a),
      cy: cy + r * Math.sin(a),
      fill: masteryColor(d.score),
      delay: 0.3 + i * 0.08,
    }
  })

  // Label + score positions around the ring.
  const labels = domains.map((d, i) => {
    const a = angleAt(i)
    const x = cx + labelR * Math.cos(a)
    const y = cy + labelR * Math.sin(a)
    const cosv = Math.cos(a)
    const anchor = Math.abs(cosv) < 0.3 ? "middle" : cosv > 0 ? "start" : "end"
    return { x, y, anchor, label: d.label, score: d.score, color: masteryColor(d.score) }
  })

  return (
    <svg
      viewBox={`0 0 ${vb} ${vb}`}
      style={{ width: size, height: size, maxWidth: "100%" }}
      role="img"
      aria-label="مصفوفة الجاهزية المهنية عبر المجالات"
    >
      {/* Grid rings */}
      {gridRings.map((g, i) => (
        <polygon
          key={`ring-${i}`}
          points={g.points}
          fill="none"
          stroke="rgba(22,36,47,.15)"
          strokeWidth={0.8}
          strokeDasharray={g.dash}
        />
      ))}

      {/* Axis lines */}
      {axes.map((ax, i) => (
        <line
          key={`axis-${i}`}
          x1={cx}
          y1={cy}
          x2={ax.x2}
          y2={ax.y2}
          stroke="rgba(22,36,47,.08)"
          strokeWidth={1}
        />
      ))}

      {/* Domain polygon — glowing gradient stroke */}
      <defs>
        <linearGradient id="radarGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
        <filter id="radarGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points={dataPoints}
        fill="rgba(34,197,94,.14)"
        stroke="url(#radarGlowGrad)"
        strokeWidth={3}
        strokeLinejoin="round"
        filter="url(#radarGlow)"
        style={
          animate
            ? { animation: "radarIn .9s .3s ease-out both", transformOrigin: `${cx}px ${cy}px` }
            : undefined
        }
      />

      {/* Dots */}
      {dots.map((dot, i) => (
        <circle
          key={`dot-${i}`}
          cx={dot.cx}
          cy={dot.cy}
          r={5.5}
          fill={dot.fill}
          stroke="#FFFFFF"
          strokeWidth={2}
          style={
            animate
              ? { animation: `dotIn .4s ${dot.delay}s ease-out both`, transformOrigin: `${dot.cx}px ${dot.cy}px` }
              : undefined
          }
        />
      ))}

      {/* Labels + scores */}
      {showLabels &&
        labels.map((l, i) => (
          <g key={`label-${i}`}>
            <text
              x={l.x}
              y={l.y - 6}
              textAnchor={l.anchor}
              dominantBaseline="middle"
              fontSize={11}
              fill={INK}
              fontFamily="'IBM Plex Sans Arabic', sans-serif"
              fontWeight={600}
            >
              {l.label}
            </text>
            <text
              x={l.x}
              y={l.y + 9}
              textAnchor={l.anchor}
              dominantBaseline="middle"
              fontSize={10}
              fill={l.color}
              fontFamily="'IBM Plex Mono', monospace"
              fontWeight={700}
            >
              {l.score}%
            </text>
          </g>
        ))}
    </svg>
  )
}
