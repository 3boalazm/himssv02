/**
 * lib/motion.ts — shared Framer Motion variants, kept deliberately minimal.
 * HLOS's motion language is quiet by design (see globals.css reduced-motion
 * rules): short durations, small distances, no bounce/spring theatrics.
 * Used for modal enter/exit only — everything else stays on the existing
 * CSS animation system (progress-fill-gradient, animate-slide-in-up, etc).
 */

export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const modalPanelVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0 },
}

export const modalTransition = { duration: 0.18, ease: "easeOut" as const }

/** Zero-duration transition for prefers-reduced-motion — skips motion but
 * keeps the enter/exit lifecycle (still needed for AnimatePresence to work). */
export const reducedTransition = { duration: 0 }
