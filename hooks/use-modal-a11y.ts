"use client"

import { useEffect, useRef } from "react"

/**
 * useModalA11y — shared accessibility behavior for custom modals across
 * the app (export dialogs, confirm dialogs, preview dialogs, etc.).
 *
 * Handles:
 *  - Escape key closes the modal
 *  - Focus moves into the modal on open (first focusable element)
 *  - Focus returns to the trigger element on close
 *
 * Usage: const modalRef = useModalA11y(onClose)
 * Attach `ref={modalRef}` to the modal's outer container.
 */
export function useModalA11y(onClose: () => void) {
  const modalRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement

    const focusable = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      triggerRef.current?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return modalRef
}
