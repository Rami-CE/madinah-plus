import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext.jsx'
import {
  Card, Eyebrow, StatusBadge, ScoreRing, DimensionBar, Seal, SectionHeading,
  Button, PriorityCard, InspectionCriterion, MetricCard, MapFilterBar, CertificationCard,
} from '../components/ui.jsx'
import { Breadcrumb } from '../components/Layout.jsx'
import { CityMap } from '../components/CityMap.jsx'
import { PageTransition, FadeIn, AnimatedNumber } from '../components/Animated.jsx'
export function MunicipalityDashboard() {
  const { t, navigate, housing, businesses, routes, city, priorities, accessibilityStats } = useApp()
  const cityInfo = city || { overallScore: 0, dimensions: [] }
  const [mapFilters, setMapFilters] = useState({ housing: true, businesses: true, routes: true, problems: false })

  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'بلدية بيرزيت', en: 'Municipality of Birzeit' }}
        title={{ ar: 'لوحة تحكم المدينة الصديقة للطلاب', en: 'Student-Friendly City Dashboard' }}
        subtitle={{ ar: 'أين ينبغي أن تستثمر البلدية مواردها المحدودة؟ هذه اللوحة تحوّل الفحوصات الميدانية إلى أولويات واضحة.', en: 'Where should the municipality invest its limited resources? This dashboard turns field inspections into clear priorities.' }}
      />

      {/* Hero Score */}
      <FadeIn>
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 border-0 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 end-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <Eyebrow tone="muted" className="!text-primary-200">{t({ ar: 'درجة المدينة الصديقة للطلاب', en: 'Student-Friendly City Score' })}</Eyebrow>
              <div className="flex items-baseline gap-2 mt-2">
                <AnimatedNumber value={cityInfo.overallScore} className="font-display text-6xl md:text-7xl font-bold text-white" />
                <span className="text-2xl text-primary-200 font-body">/ 100</span>
              </div>
              <p className="text-primary-100 text-sm mt-2 font-body max-w-md">
                {t({ ar: 'تقييم شامل لجودة البيئة الطلابية في بيرزيت', en: 'Comprehensive assessment of the student environment in Birzeit' })}
              </p>
            </div>
            <div className="hidden md:block">
              <ScoreRing score={cityInfo.overallScore} size={120} stroke={10} tone="primary" />
            </div>
          </div>
        </Card>
      </FadeIn>

      {/* Dimension Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cityInfo.dimensions.map((d, i) => (
          <MetricCard
            key={d.key}
            label={d.label}
            value={`${d.score}%`}
            subtitle={{ ar: `${d.certifiedCount}/${d.totalCount} كيانات معتمدة`, en: `${d.certifiedCount}/${d.totalCount} entities certified` }}
            trend={d.trend}
            delay={i * 0.08}
          />
        ))}
      </div>

      <Card className="p-6 mb-8">
        <Eyebrow>{t({ ar: 'إتاحة السكن لذوي الإعاقة', en: 'Accessibility' })}</Eyebrow>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <AccessStat value={accessibilityStats.accessible || 0} label={{ ar: 'سكن مهيأ معتمد', en: 'Certified Accessible Housing' }} tone="text-certgreen-600" />
          <AccessStat value={accessibilityStats.partiallyAccessible || 0} label={{ ar: 'مهيأ جزئيًا', en: 'Partially Accessible' }} tone="text-certamber-600" />
          <AccessStat value={accessibilityStats.needImprovement || 0} label={{ ar: 'بحاجة لتحسين', en: 'Need Improvement' }} tone="text-certred-600" />
        </div>
      </Card>

      {/* Improvement Priorities */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <Eyebrow tone="danger">{t({ ar: 'أولويات التحسين', en: 'Improvement Priorities' })}</Eyebrow>
          <button
            onClick={() => navigate('municipality', 'housing-list')}
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 font-body hover:underline"
          >
            {t({ ar: 'عرض اعتمادات السكن', en: 'View housing certifications' })}
          </button>
        </div>
        <div className="space-y-3">
          {priorities.map((p, i) => (
            <PriorityCard key={p.id} priority={p} index={i} />
          ))}
        </div>
      </Card>

      {/* City Map */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <Eyebrow>{t({ ar: 'خريطة المدينة', en: 'City Map' })}</Eyebrow>
          <MapFilterBar filters={mapFilters} onChange={setMapFilters} />
        </div>
        <CityMap
          housing={housing}
          businesses={businesses}
          routes={routes}
          filters={mapFilters}
          height="420px"
          onMarkerClick={({ type, data }) => {
            if (type === 'housing') navigate('municipality', 'housing-inspection', { id: data.id })
          }}
        />
      </Card>

      {/* Trend Charts */}
      <Card className="p-6">
        <Eyebrow>{t({ ar: 'تطور الأبعاد', en: 'Dimension Trends' })}</Eyebrow>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
          {cityInfo.dimensions.map((d) => (
            <div key={d.key}>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 font-body mb-3">{t(d.label)}</div>
              <div className="flex items-end gap-1 h-16">
                {(d.spark?.length ? d.spark : sparkFor(d.key)).map((v, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-primary-200 dark:bg-primary-900 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${v}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                ))}
                <motion.div
                  className="flex-1 bg-primary-600 dark:bg-primary-500 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${d.score}%` }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-mono-data">{d.score}%</div>
            </div>
          ))}
        </div>
      </Card>
    </PageTransition>
  )
}

function AccessStat({ value, label, tone }) {
  const { t } = useApp()
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className={`font-mono-data text-3xl font-extrabold ${tone}`}>{value}</div>
      <div className="text-xs font-semibold mt-1">{t(label)}</div>
    </div>
  )
}

function sparkFor(key) {
  const seed = { housing: [58, 63, 70, 74, 79], economy: [50, 55, 60, 66, 70], safety: [60, 62, 63, 66, 68], community: [70, 74, 77, 80, 82] }
  return seed[key] || [60, 65, 68, 72, 75]
}

export function MunicipalityHousingList() {
  const { t, navigate, housing } = useApp()
  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'اعتمادات السكن', en: 'Housing Certifications' }}
        title={{ ar: 'اعتمادات السكن الطلابي', en: 'Housing Certifications' }}
        subtitle={{ ar: 'انقر على أي سكن لعرض تفاصيل الفحص وإدارة دورة الاعتماد.', en: 'Click any housing entry to view inspection details and manage the certification cycle.' }}
      />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">
                <th className="text-start px-5 py-3 font-semibold">{t({ ar: 'السكن', en: 'Housing' })}</th>
                <th className="text-start px-5 py-3 font-semibold">{t({ ar: 'الدرجة', en: 'Score' })}</th>
                <th className="text-start px-5 py-3 font-semibold">{t({ ar: 'الحالة', en: 'Status' })}</th>
                <th className="text-start px-5 py-3 font-semibold hidden md:table-cell">{t({ ar: 'الإتاحة', en: 'Accessibility' })}</th>
                <th className="text-start px-5 py-3 font-semibold hidden sm:table-cell">{t({ ar: 'آخر فحص', en: 'Last Inspection' })}</th>
              </tr>
            </thead>
            <tbody>
              {housing.map((h, i) => (
                <tr
                  key={h.id}
                  onClick={() => navigate('municipality', 'housing-inspection', { id: h.id })}
                  className={`cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors ${i !== housing.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{t(h.name)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t(h.provider)}</div>
                  </td>
                  <td className="px-5 py-3.5 font-mono-data text-slate-800 dark:text-slate-200 font-semibold">{h.score}/100</td>
                  <td className="px-5 py-3.5"><StatusBadge status={h.status} size="sm" /></td>
                  <td className="px-5 py-3.5 hidden md:table-cell"><StatusBadge status={h.accessibility?.status || 'NotAssessed'} size="sm" /></td>
                  <td className="px-5 py-3.5 font-mono-data text-slate-600 dark:text-slate-400 hidden sm:table-cell">{h.lastInspection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageTransition>
  )
}

export function MunicipalityHousingInspection() {
  const { t, navigate, params, housing, applyImprovement, updateInspectionItem, issueConditional } = useApp()
  const h = housing.find((x) => x.id === params.id) || housing[0]
  const [improving, setImproving] = useState(false)
  const [prevStatus, setPrevStatus] = useState(h?.status)

  if (!h) return null

  const failingCount = h.inspection.flatMap((c) => c.items).filter((i) => i.status !== 'PASS' && i.status !== 'NA').length
  const statusChanged = prevStatus !== h.status

  const handleSimulate = async () => {
    setImproving(true)
    await applyImprovement(h.id)
    setImproving(false)
  }

  const handleItemChange = async (itemKey, newStatus) => {
    if (h.status !== prevStatus) setPrevStatus(h.status)
    await updateInspectionItem(h.id, itemKey, newStatus)
  }

  const scoreTone = h.status === 'CERTIFIED' ? 'success' : h.status === 'CONDITIONAL' ? 'warning' : 'danger'

  return (
    <PageTransition>
      <Breadcrumb
        items={[
          { label: { ar: 'اعتمادات السكن', en: 'Housing Certifications' }, onClick: () => navigate('municipality', 'housing-list') },
          { label: h.name },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <Eyebrow>{t({ ar: 'تقرير فحص ميداني', en: 'Field Inspection Report' })}</Eyebrow>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{t(h.name)}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-body mt-1">{t(h.provider)} · {t({ ar: 'آخر فحص', en: 'Last inspection' })}: {h.lastInspection}</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={h.status}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <StatusBadge status={h.status} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid md:grid-cols-[240px,1fr] gap-6">
        <Card className="p-6 flex flex-col items-center text-center h-fit sticky top-24">
          <ScoreRing score={h.score} size={120} stroke={10} tone={scoreTone} />
          <AnimatePresence mode="wait">
            <motion.p
              key={h.score}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-slate-500 dark:text-slate-400 font-body mt-3"
            >
              {failingCount === 0
                ? t({ ar: 'كل المعايير مطابقة', en: 'All criteria pass' })
                : t({ ar: `${failingCount} معايير بحاجة لمعالجة`, en: `${failingCount} criteria need attention` })}
            </motion.p>
          </AnimatePresence>

          {statusChanged && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-4 p-3 rounded-lg bg-certgreen-50 dark:bg-certgreen-50/10 border border-certgreen-100 dark:border-certgreen-600/30 text-xs font-semibold text-certgreen-700 dark:text-certgreen-600"
            >
              {t({ ar: `✓ تغيّرت الحالة: ${prevStatus} → ${h.status}`, en: `✓ Status changed: ${prevStatus} → ${h.status}` })}
            </motion.div>
          )}

          {h.status === 'CONDITIONAL' && (
            <div className="w-full mt-5 pt-5 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <p className="text-xs text-certamber-700 dark:text-certamber-600 font-body font-semibold">
                {t({ ar: 'يجب معالجة المعايير خلال 30 يومًا', en: 'Issues must be resolved within 30 days' })}
              </p>
              {!h.conditionalIssued ? (
                <Button variant="warning" className="w-full" onClick={() => issueConditional(h.id)}>
                  {t({ ar: 'إصدار اعتماد مشروط', en: 'Issue conditional certification' })}
                </Button>
              ) : (
                <div className="text-xs font-semibold text-certamber-700 dark:text-certamber-600 bg-certamber-50 dark:bg-certamber-50/10 border border-certamber-100 dark:border-certamber-600/30 rounded-lg py-2 font-body">
                  {t({ ar: '✓ تم إصدار الاعتماد المشروط', en: '✓ Conditional certification issued' })}
                </div>
              )}
              <Button className="w-full" onClick={handleSimulate} disabled={improving}>
                {improving
                  ? t({ ar: 'جارٍ إعادة الفحص…', en: 'Re-inspecting…' })
                  : t({ ar: 'محاكاة التحسين وإعادة الفحص', en: 'Simulate improvement & re-inspect' })}
              </Button>
            </div>
          )}

          {h.status === 'CERTIFIED' && (
            <Button className="w-full mt-5" onClick={() => navigate('municipality', 'certification-result', { id: h.id })}>
              {t({ ar: 'إصدار الاعتماد', en: 'Issue certification' })}
            </Button>
          )}

          {h.status === 'NOT_CERTIFIED' && (
            <div className="w-full mt-5 pt-5 border-t border-slate-200 dark:border-slate-700 text-xs text-certred-700 dark:text-certred-600 font-body font-semibold">
              {t({ ar: 'لا يستوفي الحد الأدنى للاعتماد المشروط', en: 'Below the minimum for conditional certification' })}
            </div>
          )}
        </Card>

        <div className="space-y-4">
          {h.inspection.map((cat) => (
            <Card key={cat.key} className="p-5">
              <div className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 font-body mb-3">{t(cat.label)}</div>
              <div>
                {cat.items.map((item) => (
                  <InspectionCriterion
                    key={item.key}
                    item={item}
                    interactive
                    onChange={handleItemChange}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

export function MunicipalityCertificationResult() {
  const { t, navigate, params, housing, issueCertification } = useApp()
  const h = housing.find((x) => x.id === params.id) || housing[0]
  const [issued, setIssued] = useState(h?.status === 'CERTIFIED' && !!h?.certifiedDate)

  if (!h) return null

  const handleIssue = async () => {
    await issueCertification(h.id)
    setIssued(true)
  }

  return (
    <PageTransition>
      <Breadcrumb
        items={[
          { label: { ar: 'اعتمادات السكن', en: 'Housing Certifications' }, onClick: () => navigate('municipality', 'housing-list') },
          { label: h.name },
          { label: { ar: 'نتيجة الاعتماد', en: 'Certification Result' } },
        ]}
      />

      <div className="grid md:grid-cols-[1fr,320px] gap-6">
        <Card className="p-8 text-center flex flex-col items-center animate-scaleIn">
          <Eyebrow tone="success">{t({ ar: 'شهادة اعتماد السكن الطلابي', en: 'Student Housing Certification' })}</Eyebrow>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{t(h.name)}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-body mt-1">{t(h.provider)}</p>

          <div className="my-8">
            <Seal status="CERTIFIED" size={168} animate={issued} dateLabel={h.certifiedDate ? h.certifiedDate : undefined} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg border-t border-slate-200 dark:border-slate-700 pt-6">
            <CertStat label={{ ar: 'الحالة', en: 'Status' }} value={t({ ar: 'معتمد', en: 'CERTIFIED' })} highlight />
            <CertStat label={{ ar: 'الدرجة', en: 'Score' }} value={`${h.score}/100`} />
            <CertStat label={{ ar: 'صادر عن', en: 'Issued by' }} value={t({ ar: 'البلدية', en: 'Municipality' })} />
            <CertStat label={{ ar: 'صالح حتى', en: 'Valid until' }} value={h.expiryDate || '—'} />
          </div>

          {!issued ? (
            <Button size="lg" className="mt-8" onClick={handleIssue}>
              {t({ ar: 'تأكيد إصدار الشهادة', en: 'Confirm certificate issuance' })}
            </Button>
          ) : (
            <Button variant="secondary" size="lg" className="mt-8" onClick={() => navigate('municipality', 'dashboard')}>
              {t({ ar: 'العودة إلى اللوحة الرئيسية', en: 'Back to dashboard' })}
            </Button>
          )}
        </Card>

        <Card className="p-6 h-fit">
          <div className="mx-auto w-32 h-32 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
            <div className="grid grid-cols-5 gap-0.5 p-2">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 ${i % 3 === 0 ? 'bg-slate-800 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-500'}`} />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 font-mono-data mt-2">QR</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-body mt-4 leading-relaxed text-center">
            {t({
              ar: 'يتيح رمز الاستجابة السريعة للطالب التحقق فورًا من حالة الاعتماد، تاريخ آخر فحص، الدرجة، وصلاحية الشهادة.',
              en: 'The QR code lets students instantly verify certification status, last inspection date, score, and certificate validity.',
            })}
          </p>
        </Card>
      </div>
    </PageTransition>
  )
}

function CertStat({ label, value, highlight }) {
  const { t } = useApp()
  return (
    <div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-body">{t(label)}</div>
      <div className={`font-mono-data text-sm font-semibold mt-1 ${highlight ? 'text-certgreen-700 dark:text-certgreen-600' : 'text-slate-900 dark:text-slate-100'}`}>{value}</div>
    </div>
  )
}

export function MunicipalityDimensions() {
  const { t, city } = useApp()
  const cityInfo = city || { dimensions: [] }
  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'قياس المدينة', en: 'City measurement' }}
        title={{ ar: 'أبعاد المدينة الأربعة', en: 'City Dimensions' }}
        subtitle={{ ar: 'كل بُعد يُقاس عبر عدد من الكيانات المعتمدة والمشكلات المرصودة، ويُحدَّث بشكل دوري.', en: 'Each dimension is measured through certified entities and observed problems, updated on a regular cycle.' }}
      />
      <div className="grid md:grid-cols-2 gap-5">
        {cityInfo.dimensions.map((d, i) => (
          <motion.div
            key={d.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">{t(d.label)}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-body mt-1">
                    {d.certifiedCount}/{d.totalCount} {t({ ar: 'كيانات معتمدة', en: 'entities certified' })}
                  </div>
                </div>
                <ScoreRing score={d.score} size={64} stroke={6} tone="primary" />
              </div>
              <div className="mt-4">
                <DimensionBar label={d.label} score={d.score} trend={d.trend} />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-start gap-2">
                <span className="text-certred-600 text-sm">●</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-body">{t(d.problems)}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageTransition>
  )
}

export function MunicipalityMonitoring() {
  const { t, lang, monitoring } = useApp()
  const arrow = lang === 'ar' ? '←' : '→'
  if (!monitoring) return null
  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'الأثر طويل المدى', en: 'Long-term impact' }}
        title={{ ar: 'متابعة التحسين', en: 'Improvement Monitoring' }}
        subtitle={{ ar: 'الاعتماد ليس شارة تُمنح مرة واحدة — بل آلية تحسين مستمرة تُقاس نتائجها بمرور الوقت.', en: 'Certification is not a one-time badge — it is a continuous improvement mechanism whose results are measured over time.' }}
      />
      <div className="grid md:grid-cols-3 gap-5">
        <BeforeAfterCard
          title={{ ar: 'متوسط درجة اعتماد السكن', en: 'Average housing certification score' }}
          before={monitoring.housing.before}
          after={monitoring.housing.after}
          suffix="/100"
        />
        <BeforeAfterCard
          title={{ ar: 'الالتزام بمعيار الإضاءة (المسارات الآمنة)', en: 'Lighting standard compliance (safe routes)' }}
          before={monitoring.lighting.before}
          after={monitoring.lighting.after}
          suffix="%"
        />
        <BeforeAfterCard
          title={{ ar: 'عدد المحال المعتمدة', en: 'Certified businesses' }}
          before={monitoring.certifiedBusinesses.before}
          after={monitoring.certifiedBusinesses.after}
          suffix=""
        />
      </div>

      <Card className="p-6 mt-6">
        <Eyebrow>{t({ ar: 'دورة التحسين المستمر', en: 'The continuous improvement cycle' })}</Eyebrow>
        <div className="flex flex-wrap items-center gap-2 mt-4 font-body text-sm">
          {[
            { ar: 'معايير', en: 'Standards' },
            { ar: 'تقييم', en: 'Assessment' },
            { ar: 'شفافية', en: 'Transparency' },
            { ar: 'حافز', en: 'Incentive' },
            { ar: 'تحسين', en: 'Improvement' },
            { ar: 'إعادة تقييم', en: 'Re-assessment' },
            { ar: 'اعتماد', en: 'Certification' },
            { ar: 'متابعة', en: 'Monitoring' },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-800 dark:text-primary-300 font-medium border border-primary-100 dark:border-primary-800">{t(s)}</span>
              {i < arr.length - 1 && <span className="text-slate-400">{arrow}</span>}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </PageTransition>
  )
}

export function MunicipalityCertificationsPage() {
  const { housing, navigate } = useApp()
  const list = housing.filter((h) => h.status === 'CERTIFIED')
  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'الاعتمادات', en: 'Certifications' }}
        title={{ ar: 'السكن المعتمد', en: 'Certified housing' }}
      />
      <div className="space-y-4">
        {list.map((h) => (
          <button key={h.id} type="button" className="w-full text-start" onClick={() => navigate('municipality', 'housing-inspection', { id: h.id })}>
            <CertificationCard housing={h} />
          </button>
        ))}
      </div>
    </PageTransition>
  )
}

export function MunicipalityMapPage() {
  const { t, navigate, housing, businesses, routes } = useApp()
  const [mapFilters, setMapFilters] = useState({ housing: true, businesses: true, routes: true, problems: false })
  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'الخريطة', en: 'Map' }}
        title={{ ar: 'خريطة المدينة', en: 'City map' }}
        subtitle={{ ar: 'فلتر الإتاحة: أخضر مهيأ، برتقالي جزئي، أحمر غير مهيأ.', en: 'Accessibility filter: green accessible, amber partial, red not accessible.' }}
      />
      <div className="mb-4">
        <MapFilterBar filters={mapFilters} onChange={setMapFilters} />
      </div>
      <CityMap
        housing={housing}
        businesses={businesses}
        routes={routes}
        filters={mapFilters}
        height="380px"
        onMarkerClick={({ type, data }) => {
          if (type === 'housing') navigate('municipality', 'housing-inspection', { id: data.id })
        }}
      />
      <div className="space-y-3 mt-6">
        {housing.map((h) => (
          <Card key={h.id} hover className="p-4 flex items-center gap-3" as="button" onClick={() => navigate('municipality', 'housing-inspection', { id: h.id })}>
            <StatusBadge status={h.accessibility?.status || 'NotAssessed'} size="sm" />
            <span className="flex-1 font-semibold text-start">{t(h.name)}</span>
            <span className="font-mono-data font-bold">{h.accessibility?.score ?? 0}/100</span>
          </Card>
        ))}
      </div>
    </PageTransition>
  )
}

function BeforeAfterCard({ title, before, after, suffix }) {
  const { t } = useApp()
  const max = Math.max(before, after) * 1.15
  return (
    <Card className="p-5">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-body mb-4 min-h-[2.5rem]">{t(title)}</div>
      <div className="flex items-end gap-4 h-28">
        <div className="flex-1 flex flex-col items-center justify-end h-full">
          <span className="font-mono-data text-sm text-slate-600 dark:text-slate-400 mb-1">{before}{suffix}</span>
          <motion.div
            className="w-full bg-slate-300 dark:bg-slate-600 rounded-t"
            initial={{ height: 0 }}
            animate={{ height: `${(before / max) * 100}%` }}
            transition={{ duration: 0.6 }}
          />
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-body mt-1.5">{t({ ar: 'قبل', en: 'Before' })}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-end h-full">
          <span className="font-mono-data text-sm text-certgreen-700 dark:text-certgreen-600 font-semibold mb-1">{after}{suffix}</span>
          <motion.div
            className="w-full bg-certgreen-600 dark:bg-certgreen-600 rounded-t"
            initial={{ height: 0 }}
            animate={{ height: `${(after / max) * 100}%` }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-body mt-1.5">{t({ ar: 'بعد', en: 'After' })}</span>
        </div>
      </div>
    </Card>
  )
}
