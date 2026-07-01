# باتش الاستايل — تطبيق على مشروع Claude Code

هذا الباتش يصلّح الاستايل بس — **مفيش أي تغيير في الراوتس أو الصفحات أو المكونات
الوظيفية**. 3 خطوات فقط.

---

## الخطوة 1 — استبدل globals.css بالكامل

احذف محتوى `app/globals.css` عندك، والصق فيه محتوى `globals.css` المرفق هنا
كامل (استبدال تام، مش دمج يدوي).

هذا الملف بيصلّح:
- `:root` من الكحلي الغامق `#0f172a` إلى نظام HLOS الفاتح (`#FAF9F7` / `#16242F` / `#0F6B6B`)
- `.dark` block بقيم dark mode احترافية دافئة (مش رمادي بارد)
- طبقة "الحياة": ظلال ناعمة على الكروت + animations دخول + hover أغنى

---

## الخطوة 2 — عدّل app/layout.tsx (3 أسطر بس)

**احذف** `className="dark"` من الـ `<html>` تاج — ده كان بيفرض الدارك مود دايماً.

استبدل الملف بالكامل بهذا:

```tsx
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HLOS — لوحة تحكم المؤسسة",
  description: "Healthcare IT Learning OS — منصة تعلّم تقنية المعلومات الصحية",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('hlos-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

هذا السكريبت بيمنع "وميض" الفاتح قبل ما الدارك مود يتحمّل، وبيحفظ اختيار
المستخدم.

---

## الخطوة 3 — أضف theme-toggle.tsx

انسخ ملف `theme-toggle.tsx` المرفق إلى `components/theme-toggle.tsx` عندك
(ملف جديد، مش استبدال).

بعدين — اختياري تماماً — لو عايز زرار تبديل الوضع يظهر، ضيف في أي مكان في
الواجهة (مثلاً جنب اللوجو):

```tsx
import { ThemeToggle } from "@/components/theme-toggle"
// ...
<ThemeToggle />
```

لو مش عايز الزرار دلوقتي، تجاهل الخطوة دي — النظام هيشتغل بالفاتح افتراضياً
بدون الزرار.

---

## بعد التطبيق

```bash
pnpm dev
```

المفروض الاستايل يبقى مطابق تماماً للي شفته في المعاينة هنا — فاتح افتراضياً،
teal + amber بس (مفيش أحمر/أخضر)، وdark mode احترافي لو فعّلته.

**ملاحظة:** الملفات دي عامة (design tokens) مش خاصة بصفحة معينة — يعني هتشتغل
على أي صفحة عندك بنفس المكونات (Card, Button) بدون أي تعديل تاني.
