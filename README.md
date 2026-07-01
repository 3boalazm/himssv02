# HLOS — واجهة المستخدم (UI/UX)

مشروع Next.js 16 · واجهة HLOS كاملة · جاهزة للدمج مع الباك اند و Himss v02.

## ملاحظة أساسية

هذا المشروع **واجهة فقط (UI/UX)** — الباك اند منفصل تماماً. كل البيانات وهمية
(mock)، ولا يوجد نظام تسجيل دخول حقيقي أو قاعدة بيانات. صفحات `/login` و
`/register` واجهات بصرية فقط تنتقل مباشرة إلى `/dashboard` — الربط الفعلي بنظام
Argon2id sessions يتم عند دمج الباك اند.

## الشاشات (28 route)

### الموقع العام
- `/` — الصفحة الرئيسية (Landing) — مدخل القمع
- `/pricing` — الأسعار (التشخيص مجاني / العلاج مدفوع)
- `/capabilities` — معاينة التصنيف (شجرة تفاعلية)
- `/login` · `/register` — واجهات الدخول (بصرية فقط)

### رحلة المتعلم
- `/dashboard` — لوحة المتعلم (الخطوة التالية + mini radar)
- `/assess` — مقدمة التقييم (مخطط الأوزان)
- `/assess/session/[id]` — شاشة الامتحان (تايمر + حفظ تلقائي)
- `/assess/results/[id]` — النتيجة (reveal بثلاث نبضات)
- `/matrix` — مصفوفة القدرات (الرادار — الهوية البصرية)
- `/lessons/[id]` — قارئ الدرس
- `/practice` — التدريب
- `/paths` — المسارات (خط زمني)
- `/reports` — خزنة الأدلة (التقارير)

### الأدمن (super_admin)
- `/admin` — لوحة تحكم النظام
- `/admin/users` — إدارة المستخدمين
- `/admin/content` — إدارة المحتوى + قائمة المراجعة
- `/admin/settings` — إعدادات المنصة

### المؤسسة (org_admin)
- `/org` — لوحة المؤسسة
- `/org/settings` — إعدادات المؤسسة
- `/team` — أعضاء الفريق

### السيناريوهات (glassmorphism مخصص)
- `/scenarios` — كتالوج السيناريوهات
- `/scenarios/[id]/briefing` · `/scenarios/[id]/play`

### الإعدادات
- `/settings` — إعدادات المستخدم

## نظام التصميم

- الخلفية: `#FAF9F7` · الحبر: `#16242F` · التيل: `#0F6B6B`
- العنبري للفجوات (لا الأخطاء) · danger منفصل للأخطاء الحقيقية
- البنفسجي لوضع السيناريو حصراً
- مقياس الأداء: teal→amber sequential (لا أحمر/أخضر traffic-light)
- IBM Plex Sans Arabic · RTL كامل · light mode

## المكوّن المشترك

`components/learner/capability-radar.tsx` — الرادار الواحد، يُستخدم في
`/matrix` و `/dashboard` و `/assess/results` و `/` (Landing).

## Sidebar

`components/dashboard/sidebar.tsx` — مكوّن واحد بثلاث variants:
`variant="learner"` · `variant="org"` · `variant="admin"`.

## التشغيل

```bash
pnpm install
pnpm dev      # التطوير
pnpm build    # الإنتاج
```

## الدمج مع الباك اند (خطوات لاحقة)

1. استبدال البيانات الوهمية باستدعاءات API فعلية
2. ربط `/login` و `/register` بنظام الجلسات (Argon2id + CSRF)
3. ربط الرادار والدرجات ببيانات التقييم الحقيقية من `assessment` schema
4. توصيل presigned URLs للدروس والتقارير (MinIO)
5. تفعيل التايمر في `/assess/session` بـ `server_deadline` (ADR-17)
