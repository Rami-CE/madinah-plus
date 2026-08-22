import React, { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import {
  Card, Eyebrow, StatusBadge, ScoreRing, DimensionBar, Seal, SectionHeading,
  Button, HousingCard, BusinessCard, RouteCard, CertificationCard, MapFilterBar,
} from '../components/ui.jsx'
import { Breadcrumb } from '../components/Layout.jsx'
import { CityMap } from '../components/CityMap.jsx'
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, Modal } from '../components/Animated.jsx'
export function StudentHome() {
  const { t, navigate, housing, businesses, routes, city } = useApp()
  const cityInfo = city || { name: { ar: '', en: '' }, tagline: { ar: '', en: '' }, overallScore: 0, dimensions: [] }
  const certifiedHousing = housing.filter((h) => h.status === 'CERTIFIED').length
  const certifiedBiz = businesses.filter((b) => b.certified).length
  const certifiedRoutes = routes.filter((r) => r.status === 'CERTIFIED').length
  const [mapFilters, setMapFilters] = useState({ housing: true, businesses: true, routes: true, problems: false })
  const [selectedHousing, setSelectedHousing] = useState(null)

  return (
    <PageTransition>
      <div className="grid lg:grid-cols-[1.4fr,1fr] gap-8 items-start mb-10">
        <FadeIn>
          <Eyebrow>{t({ ar: `مدينة ${t(cityInfo.name)}`, en: `${t(cityInfo.name)} City` })}</Eyebrow>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mt-2 leading-tight tracking-tight">
            {t({ ar: 'مدينتي الصديقة للطلاب', en: 'My Student-Friendly City' })}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-4 font-body leading-relaxed max-w-xl text-[15px]">
            {t(cityInfo.tagline)}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={() => navigate('student', 'housing')}>
              {t({ ar: 'استكشاف السكن المعتمد', en: 'Explore certified housing' })}
            </Button>
            <Button variant="secondary" onClick={() => navigate('student', 'routes')}>
              {t({ ar: 'عرض المسارات الآمنة', en: 'View safe routes' })}
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card className="p-6 flex flex-col items-center text-center">
            <Eyebrow tone="primary">{t({ ar: 'درجة المدينة الصديقة للطلاب', en: 'Student-Friendly City Score' })}</Eyebrow>
            <div className="mt-4">
              <ScoreRing score={cityInfo.overallScore} size={148} stroke={11} tone="primary" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-body">{t({ ar: 'من أصل 100', en: 'out of 100' })}</p>
          </Card>
        </FadeIn>
      </div>

      <Card className="p-6 mb-10">
        <Eyebrow>{t({ ar: 'أبعاد المدينة الأربعة', en: 'The four city dimensions' })}</Eyebrow>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mt-5">
          {cityInfo.dimensions.map((d, i) => (
            <DimensionBar key={d.key} label={d.label} score={d.score} trend={d.trend} certifiedCount={d.certifiedCount} totalCount={d.totalCount} />
          ))}
        </div>
      </Card>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <Eyebrow>{t({ ar: 'خريطة المدينة', en: 'City Map' })}</Eyebrow>
          <MapFilterBar filters={mapFilters} onChange={setMapFilters} />
        </div>
        <CityMap
          housing={housing}
          businesses={businesses}
          routes={routes}
          filters={mapFilters}
          height="380px"
          onMarkerClick={({ type, data }) => {
            if (type === 'housing') setSelectedHousing(data)
          }}
        />
      </div>

      <StaggerContainer className="grid sm:grid-cols-3 gap-4">
        <StaggerItem>
          <QuickCard
            title={{ ar: 'سكن طلابي معتمد', en: 'Certified Student Housing' }}
            value={`${certifiedHousing}/${housing.length}`}
            desc={{ ar: 'وحدات سكنية معتمدة من البلدية', en: 'housing units certified by the municipality' }}
            onClick={() => navigate('student', 'housing')}
          />
        </StaggerItem>
        <StaggerItem>
          <QuickCard
            title={{ ar: 'محال صديقة للطلاب', en: 'Student-Friendly Businesses' }}
            value={`${certifiedBiz}/${businesses.length}`}
            desc={{ ar: 'محال تجارية حاصلة على الاعتماد', en: 'local businesses hold certification' }}
            onClick={() => navigate('student', 'businesses')}
          />
        </StaggerItem>
        <StaggerItem>
          <QuickCard
            title={{ ar: 'مسارات آمنة معتمدة', en: 'Certified Safe Routes' }}
            value={`${certifiedRoutes}/${routes.length}`}
            desc={{ ar: 'مسارات تربط السكن بالجامعة ووسط البلد', en: 'routes linking housing, university and downtown' }}
            onClick={() => navigate('student', 'routes')}
          />
        </StaggerItem>
      </StaggerContainer>

      <Modal open={!!selectedHousing} onClose={() => setSelectedHousing(null)}>
        <CertificationCard
          housing={selectedHousing}
          onClose={() => setSelectedHousing(null)}
        />
      </Modal>
    </PageTransition>
  )
}

function QuickCard({ title, value, desc, onClick }) {
  const { t } = useApp()
  return (
    <Card as="button" onClick={onClick} hover className="p-5 text-start w-full">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-body">{t(title)}</div>
      <div className="font-mono-data text-3xl font-bold text-primary-700 dark:text-primary-400 mt-2">{value}</div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-body leading-relaxed">{t(desc)}</p>
    </Card>
  )
}

export function StudentHousingList() {
  const { t, navigate, housing } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [accessFilter, setAccessFilter] = useState('all')

  const sorted = useMemo(() => {
    let list = [...housing].sort((a, b) => b.score - a.score)
    if (filter !== 'all') list = list.filter((h) => h.status === filter)
    if (accessFilter !== 'all') list = list.filter((h) => h.accessibility?.status === accessFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((h) => t(h.name).toLowerCase().includes(q) || t(h.provider).toLowerCase().includes(q))
    }
    return list
  }, [housing, filter, accessFilter, search, t])

  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'السكن الطلابي', en: 'Student Housing' }}
        title={{ ar: 'السكن الطلابي المعتمد', en: 'Certified Student Housing' }}
        subtitle={{ ar: 'كل سكن يظهر هنا خضع لفحص ميداني من البلدية وفق معايير موحدة.', en: 'Every listing here has undergone a municipal field inspection against unified standards.' }}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t({ ar: 'ابحث عن سكن...', en: 'Search housing...' })}
          className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
        />
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: { ar: 'الكل', en: 'All' } },
            { key: 'CERTIFIED', label: { ar: 'معتمد', en: 'Certified' } },
            { key: 'CONDITIONAL', label: { ar: 'مشروط', en: 'Conditional' } },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs font-semibold px-3 py-2 rounded-full border transition-all ${
                filter === f.key
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {t(f.label)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        <span className="text-xs font-bold self-center">{t({ ar: 'سكن مهيأ لذوي الإعاقة', en: 'Accessible Housing' })}</span>
        {[
          { key: 'all', label: { ar: 'الكل', en: 'All' } },
          { key: 'Accessible', label: { ar: 'مهيأ', en: 'Accessible' } },
          { key: 'PartiallyAccessible', label: { ar: 'جزئي', en: 'Partially Accessible' } },
          { key: 'NotAccessible', label: { ar: 'غير مهيأ', en: 'Not Accessible' } },
          { key: 'NotAssessed', label: { ar: 'غير مقيّم', en: 'Not Assessed' } },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setAccessFilter(f.key)}
            className={`text-xs font-semibold px-3 py-2 rounded-full border transition-all ${
              accessFilter === f.key
                ? 'bg-primary-600 text-white border-primary-600'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {t(f.label)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sorted.map((h) => (
          <HousingCard
            key={h.id}
            housing={h}
            onClick={() => navigate('student', 'housing-detail', { id: h.id })}
          />
        ))}
      </div>
    </PageTransition>
  )
}

export function StudentHousingDetail() {
  const { t, navigate, params, housing } = useApp()
  const h = housing.find((x) => x.id === params.id) || housing[0]
  if (!h) return null

  return (
    <PageTransition>
      <Breadcrumb
        items={[
          { label: { ar: 'السكن المعتمد', en: 'Certified Housing' }, onClick: () => navigate('student', 'housing') },
          { label: h.name },
        ]}
      />
      <div className="grid md:grid-cols-[1fr,320px] gap-6">
        <Card className="p-6 md:p-8 animate-scaleIn">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Eyebrow tone="success">{t({ ar: 'شهادة اعتماد السكن الطلابي', en: 'Student Housing Certification' })}</Eyebrow>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{t(h.name)}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-body mt-1">{t(h.provider)}</p>
            </div>
            <StatusBadge status={h.status} />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Stat label={{ ar: 'الدرجة الإجمالية', en: 'Overall score' }} value={`${h.score}/100`} />
            <Stat label={{ ar: 'آخر فحص', en: 'Last inspection' }} value={formatDate(h.lastInspection, t)} />
            <Stat label={{ ar: 'صالح حتى', en: 'Valid until' }} value={h.expiryDate ? formatDate(h.expiryDate, t) : t({ ar: 'غير معتمد بعد', en: 'Not yet certified' })} />
          </div>

          {h.accessibility && (
            <div className="mt-8">
              <Eyebrow>{t({ ar: 'إتاحة السكن لذوي الإعاقة', en: 'Accessibility for People with Disabilities' })}</Eyebrow>
              <p className="font-mono-data font-extrabold mt-2">
                {t({ ar: 'الإتاحة الإجمالية', en: 'Overall Accessibility' })}: {h.accessibility.score} / 100
              </p>
              <div className="mt-3 space-y-1">
                {(h.accessibility.criteria?.length ? h.accessibility.criteria : (h.inspection.find((c) => c.key === 'accessibility')?.items || [])).map((item) => (
                  <div key={item.key} className="flex items-center justify-between text-sm py-1">
                    <span>♿ {t(item.label)}</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 space-y-5">
            <Eyebrow>{t({ ar: 'الفئات ودرجاتها', en: 'Categories & scores' })}</Eyebrow>
            {h.inspection.map((cat) => (
              <CategoryScoreRow key={cat.key} cat={cat} />
            ))}
          </div>
        </Card>

        <div className="flex flex-col items-center gap-4">
          <Card className="p-6 flex flex-col items-center w-full animate-scaleIn">
            <Seal status={h.status} size={140} dateLabel={h.certifiedDate ? formatDate(h.certifiedDate, t) : undefined} animate />
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-body mt-4 leading-relaxed">
              {t({
                ar: 'هذا الختم صادر عن بلدية بيرزيت بناءً على فحص ميداني موثّق.',
                en: 'This seal is issued by the Municipality of Birzeit based on a documented field inspection.',
              })}
            </p>
          </Card>
          <div className="w-full">
            <CityMap housing={[h]} filters={{ housing: true, businesses: false, routes: false, problems: false }} height="200px" showLegend={false} demoLabel={false} />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

function Stat({ label, value }) {
  const { t } = useApp()
  return (
    <div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-body">{t(label)}</div>
      <div className="font-mono-data text-lg text-slate-900 dark:text-slate-100 mt-0.5 font-semibold">{value}</div>
    </div>
  )
}

function CategoryScoreRow({ cat }) {
  const { t } = useApp()
  const passCount = cat.items.filter((i) => i.status === 'PASS').length
  const pct = Math.round((passCount / cat.items.length) * 100)
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 font-body">{t(cat.label)}</span>
        <span className="font-mono-data text-sm text-slate-700 dark:text-slate-300">{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <div className="h-full rounded-full bg-primary-600 dark:bg-primary-500 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function formatDate(iso, t) {
  if (!iso) return '—'
  const d = new Date(iso)
  const monthsAr = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول']
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return t({ ar: `${d.getDate()} ${monthsAr[d.getMonth()]} ${d.getFullYear()}`, en: `${monthsEn[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` })
}

export function StudentBusinesses() {
  const { t, businesses } = useApp()
  const [filter, setFilter] = useState('all')
  const filtered = businesses.filter((b) => filter === 'all' || (filter === 'certified' ? b.certified : !b.certified))

  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'الاقتصاد الطلابي', en: 'Student Economy' }}
        title={{ ar: 'المحال الصديقة للطلاب', en: 'Student-Friendly Businesses' }}
        subtitle={{
          ar: 'الاعتماد لا يعني أن البلدية تموّل الخصومات — بل أن المحل التزم بمعايير شفافية وخدمة موجّهة للطلبة.',
          en: 'Certification does not mean the municipality funds these discounts — it means the business meets transparency and student-service standards.',
        }}
      />

      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: { ar: 'الكل', en: 'All' } },
          { key: 'certified', label: { ar: 'معتمد', en: 'Certified' } },
          { key: 'uncertified', label: { ar: 'غير معتمد', en: 'Not certified' } },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              filter === f.key ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {t(f.label)}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <BusinessCard key={b.id} business={b} />
        ))}
      </div>
    </PageTransition>
  )
}

export function StudentRoutes() {
  const { t, routes } = useApp()
  const [selectedRoute, setSelectedRoute] = useState(null)

  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'السلامة والتنقل', en: 'Safety & Mobility' }}
        title={{ ar: 'المسارات الآمنة', en: 'Safe Routes' }}
        subtitle={{ ar: 'مسارات تربط السكن الطلابي بالجامعة ووسط البلد، مقيّمة وفق معايير الإضاءة والأرصفة وسهولة الوصول.', en: 'Routes linking student housing, the university and downtown, assessed against lighting, sidewalk and accessibility standards.' }}
      />

      <div className="mb-8">
        <CityMap
          routes={selectedRoute ? [selectedRoute] : routes}
          housing={[]}
          businesses={[]}
          filters={{ housing: false, businesses: false, routes: true, problems: false }}
          height="420px"
        />
      </div>

      <div className="space-y-4">
        {routes.map((r) => (
          <div key={r.id} onClick={() => setSelectedRoute(r)} className="cursor-pointer">
            <RouteCard route={r} />
          </div>
        ))}
      </div>
    </PageTransition>
  )
}

export function StudentFeedback() {
  const { t, feedbackCategories, feedbackLog, submitFeedback } = useApp()
  const [category, setCategory] = useState('safety')
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    await submitFeedback(category, text.trim())
    setText('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'صوت الطالب', en: 'Student voice' }}
        title={{ ar: 'إرسال ملاحظة', en: 'Submit Feedback' }}
        subtitle={{ ar: 'كل ملاحظة تُربط مباشرة بمعيار اعتماد محدد لدعم دورة التحسين — وليست شكوى عامة.', en: 'Every note is linked directly to a certification standard to support the improvement cycle — this is not a general complaints inbox.' }}
      />

      <div className="grid md:grid-cols-[1fr,1.1fr] gap-6">
        <Card className="p-6 h-fit">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-body">{t({ ar: 'الفئة', en: 'Category' })}</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {feedbackCategories.map((c) => (
                  <button
                    type="button"
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`text-xs font-semibold font-body px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      category === c.key ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-400'
                    }`}
                  >
                    {t(c.label)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-body">{t({ ar: 'الملاحظة', en: 'Feedback' })}</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder={t({ ar: 'مثال: الإضاءة غير كافية في الطريق بين السكن والجامعة.', en: 'e.g. Lighting is insufficient on the road between housing and the university.' })}
                className="mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
              />
            </div>
            <Button type="submit">{t({ ar: 'إرسال الملاحظة', en: 'Submit feedback' })}</Button>
            {submitted && (
              <p className="text-xs text-certgreen-600 font-semibold animate-slideUp">
                {t({ ar: '✓ تم إرسال الملاحظة بنجاح', en: '✓ Feedback submitted successfully' })}
              </p>
            )}
          </form>
        </Card>

        <div className="space-y-3">
          <Eyebrow>{t({ ar: 'أحدث الملاحظات', en: 'Recent feedback' })}</Eyebrow>
          {feedbackLog.map((f, i) => (
            <Card key={f.id} className="p-4 animate-riseIn" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 font-body uppercase tracking-wide">
                  {t(feedbackCategories.find((c) => c.key === f.category)?.label || { ar: '', en: '' })}
                </span>
                <span className="text-[11px] text-slate-400 font-mono-data">{f.date}</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 font-body mt-1.5">{t(f.text)}</p>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-body mt-2">{t(f.linkedTo)}</p>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

export function StudentExplore() {
  const { t, navigate } = useApp()
  return (
    <PageTransition>
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="secondary" onClick={() => navigate('student', 'businesses')}>{t({ ar: 'المحال', en: 'Businesses' })}</Button>
        <Button variant="secondary" onClick={() => navigate('student', 'routes')}>{t({ ar: 'المسارات', en: 'Routes' })}</Button>
        <Button variant="secondary" onClick={() => navigate('student', 'feedback')}>{t({ ar: 'ملاحظة', en: 'Feedback' })}</Button>
      </div>
      <StudentHousingList />
    </PageTransition>
  )
}

export function StudentMapPage() {
  const { t, navigate, housing, businesses, routes } = useApp()
  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'الخريطة', en: 'Map' }}
        title={{ ar: 'خريطة المدينة', en: 'City map' }}
        subtitle={{ ar: 'يمكن عرض القائمة إذا كان التفاعل مع الخريطة صعبًا.', en: 'Use List if the map is hard to use.' }}
      />
      <CityMap
        housing={housing}
        businesses={businesses}
        routes={routes}
        height="380px"
        onMarkerClick={({ type, data }) => {
          if (type === 'housing') navigate('student', 'housing-detail', { id: data.id })
        }}
      />
      <div className="space-y-3 mt-6">
        {housing.map((h) => (
          <Card key={h.id} hover className="p-4 flex items-center gap-3" as="button" onClick={() => navigate('student', 'housing-detail', { id: h.id })}>
            <StatusBadge status={h.status} size="sm" />
            <span className="flex-1 font-semibold text-start">{t(h.name)}</span>
            <span className="font-mono-data font-bold">{h.score}/100</span>
          </Card>
        ))}
      </div>
    </PageTransition>
  )
}

export function StudentCertifications() {
  const { housing } = useApp()
  const list = housing.filter((h) => h.status === 'CERTIFIED')
  return (
    <PageTransition>
      <SectionHeading
        eyebrow={{ ar: 'الاعتمادات', en: 'Certifications' }}
        title={{ ar: 'السكن المعتمد بلديًا', en: 'Municipality-certified housing' }}
      />
      <div className="space-y-4">
        {list.map((h) => (
          <CertificationCard key={h.id} housing={h} />
        ))}
      </div>
    </PageTransition>
  )
}
