"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Dialog heading */
  title: string
  /**
   * The specific consequence of this action — MANDATORY, never optional.
   * Must describe what will happen in concrete terms:
   *   ✅ "سيفقد المستخدم الوصول فورًا ويُحتفظ بجميع بياناته."
   *   ✅ "ستُحذف هذه الجلسة ولا يمكن استعادتها."
   *   ❌ "هل أنت متأكد؟" — too vague, always rejected in code review
   */
  consequence: string
  /**
   * Confirm button label — must be action-specific, never generic.
   *   ✅ "تعطيل الحساب"  ✅ "حذف الدرس"  ✅ "إرسال التذكير"
   *   ❌ "تأكيد"  ❌ "نعم" — caller must provide meaningful verb
   */
  confirmLabel: string
  /** Default: "إلغاء" */
  cancelLabel?: string
  /**
   * "default"     — neutral confirm button (primary teal)
   * "destructive" — uses --color-danger token (#A32D2D quiet crimson).
   *                 Reserved for irreversible actions only.
   */
  variant?: "default" | "destructive"
  onConfirm: () => void
}

/**
 * ConfirmDialog — a two-step confirmation gate for consequential actions.
 *
 * Design rules:
 * - `consequence` is always shown in a highlighted box — never hidden
 * - `confirmLabel` is always action-specific — generic "تأكيد" is a code smell
 * - `variant="destructive"` uses the danger token, NOT amber (amber = gap/opportunity)
 * - RTL + logical properties throughout
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  consequence,
  confirmLabel,
  cancelLabel = "إلغاء",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md" dir="rtl">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle className="text-base font-semibold text-foreground">
            {title}
          </AlertDialogTitle>
        </AlertDialogHeader>

        {/* Consequence box — always visible, always explicit */}
        <div
          className={cn(
            "rounded-lg px-4 py-3 text-sm font-medium leading-relaxed border",
            isDestructive
              ? "border-[#A32D2D]/30 bg-[#A32D2D]/10 text-[#A32D2D]"
              : "border-warning/30 bg-warning/10 text-warning"
          )}
        >
          {consequence}
        </div>

        <AlertDialogDescription className="text-sm text-muted-foreground text-right">
          هل تريد المتابعة؟
        </AlertDialogDescription>

        <AlertDialogFooter className="flex-row-reverse gap-2 sm:flex-row-reverse">
          <AlertDialogCancel className="mt-0">
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "font-semibold transition-colors duration-150",
              isDestructive
                ? "bg-[#A32D2D] hover:bg-[#8B2424] text-white border-[#A32D2D] focus:ring-[#A32D2D]/30"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
