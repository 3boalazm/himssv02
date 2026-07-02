/**
 * lib/scenarios.ts — scenario zone data + play engine (frontend mock).
 *
 * One module feeds all four screens (catalog → briefing → play → summary)
 * so titles, step counts, and progress never drift between them.
 *
 * Scoring model (calibrated to the reference run: 88% = أداء قوي):
 *   best 20 · acceptable 14 · poor 8 · timeout 6 — per step, minus hint
 *   costs (-2 / -4 / -6). Reference: 4×best + 1×acceptable − 6 hints = 88.
 *
 * Persistence: sessionStorage per scenario id — enough to demo resume
 * (“قيد التقدم %N”) and completed states without a backend.
 */

/* ─── Catalog ─────────────────────────────────────────────────────────── */

export type Difficulty = "سهل" | "متوسط" | "صعب"
export type Domain = "نظم المعلومات" | "التشغيل البيني" | "الأمن والخصوصية" | "الحوكمة الرقمية"
export type PlayStatus = "لم يبدأ" | "قيد التقدم" | "مكتمل"

export interface ScenarioMeta {
  id: string
  title: string
  role: string
  setting: string
  difficulty: Difficulty
  durationMin: number
  domain: Domain
  free: boolean
  steps: number
}

export const SCENARIOS: ScenarioMeta[] = [
  { id: "emr-outage",      title: "انقطاع EMR في قسم الطوارئ", role: "مدير تقنية المعلومات",  setting: "قسم الطوارئ · الساعة 02:40",          difficulty: "سهل",   durationMin: 30, domain: "نظم المعلومات",    free: true,  steps: 5 },
  { id: "nphies-fail",     title: "فشل تكامل NPHIES",          role: "مهندس التشغيل البيني",  setting: "بيئة الإنتاج · قبيل موعد الإرسال",     difficulty: "متوسط", durationMin: 45, domain: "التشغيل البيني",   free: false, steps: 5 },
  { id: "pdpl-breach",     title: "خرق بيانات PDPL",           role: "مسؤول أمن المعلومات",   setting: "مركز البيانات · تنبيه الساعة 03:15",  difficulty: "صعب",   durationMin: 60, domain: "الأمن والخصوصية",  free: false, steps: 6 },
  { id: "data-migration",  title: "ترحيل بيانات مستشفى",       role: "مدير مشاريع تقنية",     setting: "مرحلة go-live · قاعدة بيانات قديمة",   difficulty: "متوسط", durationMin: 50, domain: "الحوكمة الرقمية",  free: false, steps: 5 },
  { id: "pharmacy-golive", title: "إطلاق نظام صيدلية",         role: "مسؤول نظم الصيدلة",     setting: "يوم الإطلاق · طاقم الليل",             difficulty: "متوسط", durationMin: 40, domain: "نظم المعلومات",    free: false, steps: 5 },
  { id: "ransomware",      title: "استعادة من هجوم فدية",      role: "مدير تقنية المعلومات",  setting: "أزمة كاملة · جميع الأنظمة متأثرة",     difficulty: "صعب",   durationMin: 75, domain: "الأمن والخصوصية",  free: false, steps: 7 },
]

export const DIFFICULTIES: Difficulty[] = ["سهل", "متوسط", "صعب"]
export const DOMAINS: Domain[] = ["نظم المعلومات", "التشغيل البيني", "الأمن والخصوصية", "الحوكمة الرقمية"]
export const STATUSES: PlayStatus[] = ["لم يبدأ", "قيد التقدم", "مكتمل"]

export const getScenario = (id: string) => SCENARIOS.find(s => s.id === id)

/* ─── Briefings ───────────────────────────────────────────────────────── */

export interface BriefingData {
  badge?: string
  timestamp: string
  paragraphs: string[]
  objectives: string[]
}

export const BRIEFINGS: Record<string, BriefingData> = {
  "emr-outage": {
    badge: "سيناريو تجريبي مجاني",
    timestamp: "الساعة 02:40 · قسم الطوارئ",
    paragraphs: [
      "تلقّيت اتصالاً عاجلاً من مشرف قسم الطوارئ يُبلّغك بأن نظام السجل الطبي الإلكتروني (EMR) توقف عن الاستجابة منذ خمس عشرة دقيقة. الطاقم يعمل حالياً على نماذج ورقية يدوية، وثمة ثلاثة حالات حرجة قيد التوثيق في نفس الوقت.",
      "تُشير لوحة المراقبة إلى أن الخادم الرئيسي لا يستجيب لطلبات ping، في حين أن خادم قاعدة البيانات يُسجّل حمولة CPU بنسبة 98%. لم تكن هناك أي تحديثات أو صيانة مجدولة الليلة.",
      "مدير المناوبة يسألك: هل نُفعّل بروتوكول الفشل التلقائي (failover) الآن، أم ننتظر تشخيصاً أعمق؟ لديك نافذة قرار محدودة.",
      "الوقت يمر. كل دقيقة تأخير تعني بيانات مريض إضافية تُوثَّق خارج النظام وستحتاج إلى إدخال يدوي لاحق — مع ما يصاحب ذلك من مخاطر جودة البيانات.",
    ],
    objectives: [
      "تحديد أولوية الاستجابة: هل الأولوية للتشخيص أم للاستمرارية؟",
      "إدارة التواصل مع قسم الطوارئ والإدارة أثناء الأزمة",
      "تطبيق بروتوكولات BCP/DR المناسبة لهذا السيناريو",
      "توثيق الإجراءات لتقرير RCA بعد الأزمة",
    ],
  },
  "pdpl-breach": {
    timestamp: "مركز البيانات · تنبيه الساعة 03:15",
    paragraphs: [
      "تنبيه أمني في الساعة 03:15 يشير إلى وصول غير مصرّح به إلى قاعدة بيانات تحتوي على بيانات مرضى. عليك احتواء الحادثة وتقييم نطاق التأثير واتخاذ قرارات الإبلاغ وفق نظام حماية البيانات الشخصية (PDPL).",
      "كل قرار له بُعد تقني وقانوني وزمني — الاحتواء الخاطئ قد يُتلف الأدلة، والإبلاغ المتأخر قد يُخالف الالتزامات التنظيمية.",
    ],
    objectives: [
      "احتواء الحادثة دون إتلاف أدلة التحقيق",
      "تقدير نطاق البيانات المتأثرة",
      "تطبيق التزامات الإبلاغ ضمن مهل PDPL",
    ],
  },
  "nphies-fail": {
    timestamp: "بيئة الإنتاج · قبيل موعد الإرسال",
    paragraphs: [
      "قبل ثلاث ساعات من موعد الإرسال الدوري، بدأت مطالبات NPHIES تُرفَض بمعدل متصاعد برسائل خطأ في التحقّق من الأهلية. فريق الإيرادات يضغط، وقناة التكامل في الإنتاج لا يمكن إيقافها ببساطة.",
      "عليك عزل مصدر الفشل — تغيير في الواجهة، شهادة منتهية، أم بيانات مرجعية قديمة — واتخاذ قرار الإرسال قبل انقضاء المهلة.",
    ],
    objectives: [
      "عزل طبقة الفشل في سلسلة التكامل",
      "إدارة قرار الإرسال مقابل مخاطر الرفض",
      "التنسيق بين الإيرادات والتقنية تحت مهلة زمنية",
    ],
  },
  "data-migration": {
    timestamp: "ليلة go-live · نافذة توقف حتى 06:00",
    paragraphs: [
      "ليلة الـ go-live: ترحيل قاعدة بيانات المرضى من النظام القديم توقّف عند 62% بسبب سجلّات لا تجتاز قواعد الجودة. نافذة التوقف تنتهي السادسة صباحًا.",
      "القرار أمامك: إصلاح البيانات الآن، أم المتابعة الجزئية، أم التراجع الكامل — ولكل مسار كلفته التشغيلية.",
    ],
    objectives: [
      "تقييم خيارات المتابعة أو التراجع ضمن نافذة التوقف",
      "حماية اكتمال سجلّات المرضى الحرجة",
      "إدارة توقعات القيادة أثناء الليلة",
    ],
  },
  "pharmacy-golive": {
    timestamp: "يوم الإطلاق · وردية الليل",
    paragraphs: [
      "أول ليلة لنظام الصيدلية الجديد: طاقم الليل يُبلغ عن بطء في صرف الأدوية، وتحذيرات التفاعل الدوائي لا تظهر لبعض الأصناف.",
      "عليك الموازنة بين الاستمرار على النظام الجديد بمراقبة مشدّدة، أو التحويل المؤقت للإجراء اليدوي المعتمد لصرف الدواء.",
    ],
    objectives: [
      "تقييم مخاطر سلامة الدواء لحظيًا",
      "تفعيل إجراءات الطوارئ الدوائية عند الحاجة",
      "توثيق الملاحظات لفريق الإطلاق صباحًا",
    ],
  },
  "ransomware": {
    timestamp: "الساعة الأولى · عزل جزئي للشبكة",
    paragraphs: [
      "رسالة فدية على شاشات عدة أقسام، وأنظمة الملفات المشتركة مشفّرة. الشبكة معزولة جزئيًا، وآخر تحقّق من سلامة النسخ الاحتياطية كان قبل أسبوعين.",
      "أنت تقود الساعة الأولى: قرارات العزل، والتحقق من النسخ، والتشغيل الورقي، والتواصل مع الجهات المختصة.",
    ],
    objectives: [
      "احتواء الانتشار دون فقدان أدلة التحقيق",
      "التحقق من سلامة النسخ الاحتياطية قبل أي استعادة",
      "قرار التصعيد والإبلاغ للجهات المختصة",
    ],
  },
}

/* ─── EMR play engine data (the free, fully playable case) ───────────── */

export type Quality = "best" | "acceptable" | "poor"

export interface StepOption {
  id: string
  label: string
  rationale: string
  quality: Quality
}

export interface StepHint {
  text: string
  cost: number
}

export interface ScenarioStep {
  kicker: string
  timeLabel: string
  situation: string
  prompt: string
  options: StepOption[]
  hints: StepHint[]
  timerSec: number
}

export const EMR_STEPS: ScenarioStep[] = [
  {
    kicker: "القرار الأول",
    timeLabel: "02:41",
    situation:
      "الطاقم على النماذج الورقية، وثلاث حالات حرجة قيد التوثيق. الخادم الرئيسي لا يستجيب لطلبات ping وخادم قاعدة البيانات على حمولة 98%. لم يبدأ أي تشخيص عميق بعد.",
    prompt: "ما أول إجراء تتّخذه في هذه اللحظة؟",
    options: [
      { id: "a", quality: "best",       label: "إعلان بروتوكول التوقف المخطط (downtime) وإبلاغ الطوارئ فورًا، ثم البدء في التشخيص", rationale: "تُثبِّت استمرارية العمل أولًا — الطاقم يعرف الإجراء البديل بينما تُشخِّص أنت بلا ضغط." },
      { id: "b", quality: "acceptable", label: "الدخول إلى خادم قاعدة البيانات لتحليل سبب الـ CPU قبل أي شيء", rationale: "التشخيص مهم، لكن تقديمه على الاستمرارية يترك الطوارئ بلا توجيه في أخطر لحظة." },
      { id: "c", quality: "poor",       label: "إعادة تشغيل الخادم الرئيسي فورًا على أمل عودته", rationale: "إعادة تشغيل عمياء دون تشخيص قد تُفاقم تلف البيانات أو تُطيل الانقطاع." },
      { id: "d", quality: "poor",       label: "الانتظار خمس دقائق لعلّ النظام يتعافى تلقائيًا", rationale: "الانتظار السلبي يزيد حجم البيانات الورقية ومخاطرها دون معالجة السبب." },
    ],
    hints: [
      { text: "فكِّر في أولوية الاستمرارية قبل التشخيص التقني.", cost: 2 },
      { text: "المريض الحرج لا ينتظر إصلاح الخادم — ما البروتوكول المُعَدّ سلفًا لهذه الحالة؟", cost: 4 },
      { text: "أعلِن الحالة رسميًا أولًا: بروتوكول downtime يمنح الطاقم إطارًا واضحًا ويمنحك أنت مساحة التشخيص.", cost: 6 },
    ],
    timerSec: 180,
  },
  {
    kicker: "القرار الثاني",
    timeLabel: "02:52",
    situation:
      "بعد استجابتك الأولية، تعذّر إعادة تشغيل خادم EMR الرئيسي عبر واجهة إدارة النظام. فريق البنية التحتية يُفيد بأن مشكلة محتملة في مساحة القرص أدت إلى تعطّل خدمة قاعدة البيانات. خادم الـ failover جاهز لكنه لم يُفعَّل بعد.",
    prompt: "مدير الشبكة يسألك: هل نُفعّل الخادم البديل فورًا مع احتمال فقدان آخر 8 دقائق من البيانات — أم نواصل المحاولة لاستعادة الخادم الرئيسي؟",
    options: [
      { id: "a", quality: "acceptable", label: "تفعيل failover فورًا وقبول فقدان بيانات الـ 8 دقائق", rationale: "الاستمرارية الكاملة للطوارئ أهم — الـ 8 دقائق يمكن استرجاعها من النماذج الورقية لاحقًا." },
      { id: "b", quality: "acceptable", label: "إعطاء 10 دقائق إضافية لمحاولة استعادة الخادم الرئيسي", rationale: "إن نجح، نتجنّب أي فقدان للبيانات — لكن الضغط على الطوارئ يزداد." },
      { id: "c", quality: "best",       label: "تفعيل failover مع إيقاف أي كتابة جديدة ريثما يعود الخادم الرئيسي", rationale: "حل وسط: استمرارية القراءة + حماية اتساق البيانات." },
      { id: "d", quality: "poor",       label: "تصعيد فوري لمدير المستشفى وانتظار القرار", rationale: "القرار ضمن صلاحياتك التقنية — التصعيد هنا تأجيل لا يُغيّر المعطيات." },
    ],
    hints: [
      { text: "اسأل: هل يمكن الحصول على الاستمرارية وحماية الاتساق معًا بدل المفاضلة بينهما؟", cost: 2 },
      { text: "فقدان البيانات ليس ثنائية «كل شيء أو لا شيء» — التحكم في الكتابة أثناء التبديل يُغيّر المعادلة.", cost: 4 },
    ],
    timerSec: 180,
  },
  {
    kicker: "القرار الثالث",
    timeLabel: "03:20",
    situation:
      "الخادم البديل يعمل والطوارئ عادت للنظام. فحص السجلات كشف السبب الجذري: خدمة تدوير السجلّات (log rotation) متوقفة منذ أيام حتى امتلأ قرص قاعدة البيانات. لديك الآن نحو 40 نموذجًا ورقيًا تحتاج إدخالًا يدويًا، وإصلاح التدوير ما يزال معلّقًا.",
    prompt: "كيف تُوزِّع الجهد في الساعة القادمة؟",
    options: [
      { id: "a", quality: "best",       label: "تكليف شخص بالإدخال اليدوي بالتوازي مع إصلاحك لتدوير السجلّات", rationale: "معالجة الدَّين التشغيلي والسبب الجذري معًا — لا يؤجَّل أحدهما على حساب الآخر." },
      { id: "b", quality: "acceptable", label: "إصلاح تدوير السجلّات أولًا ثم البدء في الإدخال اليدوي بنفسك", rationale: "السبب الجذري أولوية، لكن تأخير الإدخال يُراكم مخاطر جودة البيانات." },
      { id: "c", quality: "poor",       label: "تأجيل الإدخال اليدوي كاملًا إلى وردية الصباح", rationale: "كل ساعة تأخير تزيد فجوة السجل الطبي وتُعقِّد المطابقة لاحقًا." },
      { id: "d", quality: "poor",       label: "الإدخال اليدوي بنفسك الآن وترك إصلاح التدوير لوقت لاحق", rationale: "ترك السبب الجذري دون إصلاح يُبقي خطر تكرار الانقطاع قائمًا." },
    ],
    hints: [
      { text: "هل المهمتان تتطلبان الشخص نفسه فعلًا؟", cost: 2 },
      { text: "فرِّق بين ما يحتاج صلاحياتك أنت وما يمكن تفويضه فورًا.", cost: 4 },
    ],
    timerSec: 180,
  },
  {
    kicker: "القرار الرابع",
    timeLabel: "04:30",
    situation:
      "فريق البنية أنهى إصلاح القرص وتدوير السجلّات، والخادم الرئيسي جاهز للعودة. في اللحظة نفسها ظهر تحذير سعة على العنقود الثاني (نسخة التقارير). الوقت 04:30 والطوارئ مستقرة على البديل.",
    prompt: "ما خطوتك الآن؟",
    options: [
      { id: "a", quality: "best",       label: "البقاء على البديل خلال الليل مع تخطيط عودة مُتحكَّم بها صباحًا، ومعالجة تحذير العنقود الثاني الآن", rationale: "لا تُبدِّل نظامًا مستقرًّا في ذروة الإرهاق — وعالِج الإنذار قبل أن يتحوّل انقطاعًا ثانيًا." },
      { id: "b", quality: "acceptable", label: "العودة للخادم الرئيسي فورًا ما دام جاهزًا، ثم النظر في التحذير", rationale: "العودة الليلية ممكنة لكنها تضيف مخاطرة بلا ضرورة تشغيلية." },
      { id: "c", quality: "poor",       label: "تجاهل تحذير العنقود الثاني — الأولوية للراحة قبل وردية الصباح", rationale: "إنذار السعة هو نفس نمط العطل الذي بدأ الليلة — تجاهله يُعيد السيناريو." },
      { id: "d", quality: "poor",       label: "العودة للرئيسي وإيقاف البديل نهائيًا لتوفير الموارد", rationale: "إيقاف البديل بعد ليلة كهذه يُفقدك خط الدفاع الوحيد المُجرَّب." },
    ],
    hints: [
      { text: "أي التغييرين أخطر في الرابعة فجرًا: البقاء على وضع مستقر أم التبديل؟", cost: 2 },
      { text: "التحذير الجديد يشبه بداية القصة — ماذا تفعل هذه المرة مبكرًا؟", cost: 4 },
    ],
    timerSec: 180,
  },
  {
    kicker: "القرار الخامس",
    timeLabel: "07:00",
    situation:
      "الصباح. الإدارة تطلب تقريرًا خلال ساعتين، ومدير الجودة يسأل عن سلامة السجلّات أثناء فترة الإدخال اليدوي. أمامك صياغة تقرير ما بعد الحادثة (RCA).",
    prompt: "ماذا يتضمّن تقريرك؟",
    options: [
      { id: "a", quality: "best",       label: "توثيق التسلسل الزمني + السبب الجذري (تدوير السجلّات) + حالة مطابقة الإدخال اليدوي + إجراءات وقائية", rationale: "تقرير RCA مكتمل الأركان: ماذا حدث، ولماذا، وأثر البيانات، وكيف لا يتكرّر." },
      { id: "b", quality: "acceptable", label: "التسلسل الزمني والسبب الجذري فقط — المطابقة شأن فريق الجودة", rationale: "يغطي الحادثة تقنيًا لكنه يترك سؤال سلامة السجلّ الطبي معلّقًا." },
      { id: "c", quality: "poor",       label: "ملخّص تنفيذي مُطمئن دون تفاصيل تقنية «حتى لا تقلق الإدارة»", rationale: "التقارير المُجمَّلة تمنع التعلّم المؤسسي وتُفقدك المصداقية عند أول تدقيق." },
      { id: "d", quality: "poor",       label: "تأجيل التقرير حتى اكتمال كل إصلاحات البنية", rationale: "المهلة الإدارية والتنظيمية لا تنتظر اكتمال الأعمال التقنية." },
    ],
    hints: [
      { text: "تقرير الحادثة الجيّد يجيب عن أربعة أسئلة، لا سؤالين.", cost: 2 },
      { text: "من دون المطابقة، كيف تُثبت سلامة السجل الطبي أمام الجودة؟", cost: 4 },
    ],
    timerSec: 180,
  },
]

/** The only fully playable case in the mock build */
export const PLAYABLE_ID = "emr-outage"

/* ─── Scoring ─────────────────────────────────────────────────────────── */

export const OPTION_POINTS: Record<Quality, number> = { best: 20, acceptable: 14, poor: 8 }
export const TIMEOUT_POINTS = 6

export function scoreLabel(pct: number): string {
  if (pct >= 85) return "أداء قوي"
  if (pct >= 70) return "أداء جيد"
  if (pct >= 50) return "أساس يحتاج تثبيتًا"
  return "ابدأ من الأساسيات"
}

export interface StepResult {
  step: ScenarioStep
  chosen: StepOption | null
  best: StepOption
  quality: Quality | "timeout"
  points: number
  hintCost: number
}

export function computeResults(answers: StepAnswer[]): { results: StepResult[]; total: number; hintTotal: number } {
  const results: StepResult[] = EMR_STEPS.map((step, i) => {
    const ans = answers[i]
    const best = step.options.find(o => o.quality === "best")!
    const chosen = ans?.optionId ? step.options.find(o => o.id === ans.optionId) ?? null : null
    const quality: Quality | "timeout" = chosen ? chosen.quality : "timeout"
    const base = chosen ? OPTION_POINTS[chosen.quality] : TIMEOUT_POINTS
    const hintCost = ans?.hintCost ?? 0
    return { step, chosen, best, quality, points: Math.max(0, base - hintCost), hintCost }
  })
  const total = results.reduce((s, r) => s + r.points, 0)
  const hintTotal = results.reduce((s, r) => s + r.hintCost, 0)
  return { results, total, hintTotal }
}

/* ─── Session persistence (mock — sessionStorage) ─────────────────────── */

export interface StepAnswer {
  optionId: string | null
  hintsUsed: number
  hintCost: number
  timedOut: boolean
}

export interface PlaySession {
  scenarioId: string
  /** index of the NEXT unanswered step (== answers.length while playing) */
  current: number
  answers: StepAnswer[]
  completed: boolean
  score?: number
}

const KEY = (id: string) => `hlos-scn-${id}`

export function loadSession(id: string): PlaySession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(KEY(id))
    return raw ? (JSON.parse(raw) as PlaySession) : null
  } catch {
    return null
  }
}

export function saveSession(s: PlaySession) {
  try { sessionStorage.setItem(KEY(s.scenarioId), JSON.stringify(s)) } catch { /* ignore */ }
}

export function clearSession(id: string) {
  try { sessionStorage.removeItem(KEY(id)) } catch { /* ignore */ }
}

export function sessionStatus(s: PlaySession | null): PlayStatus {
  if (!s) return "لم يبدأ"
  return s.completed ? "مكتمل" : "قيد التقدم"
}

export function progressPct(s: PlaySession | null, steps: number): number {
  if (!s) return 0
  if (s.completed) return 100
  return Math.round((s.answers.length / steps) * 100)
}
