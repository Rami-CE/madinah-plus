import React from 'react'
import { useApp } from '../context/AppContext.jsx'
import { AnimatedNumber } from './Animated.jsx'
import { motion } from 'framer-motion'

export function Card({ children, className = '', as: Tag = 'div', hover = false, ...rest }) {
  return (
    <Tag
      className={`bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-card dark:shadow-card-dark backdrop-blur-sm ${
        hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function Eyebrow({ children, tone = 'primary' }) {
  const tones = {
    primary: 'text-primary-600 dark:text-primary-400',
    success: 'text-certgreen-600 dark:text-certgreen-600',
    warning: 'text-certamber-600 dark:text-certamber-600',
    danger: 'text-certred-600 dark:text-certred-600',
    muted: 'text-slate-500 dark:text-slate-400',
  }
  return (
    <div className={`text-[11px] font-semibold tracking-[0.12em] uppercase ${tones[tone]} font-body`}>
      {children}
    </div>
  )
}

const STATUS_CONFIG = {
  CERTIFIED: {
    label: { ar: 'معتمد', en: 'Certified' },
    icon: '✓',
    classes: 'bg-certgreen-50 dark:bg-certgreen-50/10 text-certgreen-700 dark:text-certgreen-600 border-certgreen-100 dark:border-certgreen-600/30',
    dot: 'bg-certgreen-600',
  },
  CONDITIONAL: {
    label: { ar: 'اعتماد مشروط', en: 'Conditional' },
    icon: '!',
    classes: 'bg-certamber-50 dark:bg-certamber-50/10 text-certamber-700 dark:text-certamber-600 border-certamber-100 dark:border-certamber-600/30',
    dot: 'bg-certamber-600',
  },
  NOT_CERTIFIED: {
    label: { ar: 'غير معتمد', en: 'Not Certified' },
    icon: '×',
    classes: 'bg-certred-50 dark:bg-certred-50/10 text-certred-700 dark:text-certred-600 border-certred-100 dark:border-certred-600/30',
    dot: 'bg-certred-600',
  },
  Accessible: {
    label: { ar: 'مهيأ', en: 'Accessible' },
    icon: '♿',
    classes: 'bg-certgreen-50 dark:bg-certgreen-50/10 text-certgreen-700 dark:text-certgreen-600 border-certgreen-100 dark:border-certgreen-600/30',
    dot: 'bg-certgreen-600',
  },
  PartiallyAccessible: {
    label: { ar: 'جزئي', en: 'Partially Accessible' },
    icon: '♿',
    classes: 'bg-certamber-50 dark:bg-certamber-50/10 text-certamber-700 dark:text-certamber-600 border-certamber-100 dark:border-certamber-600/30',
    dot: 'bg-certamber-600',
  },
  NotAccessible: {
    label: { ar: 'غير مهيأ', en: 'Not Accessible' },
    icon: '♿',
    classes: 'bg-certred-50 dark:bg-certred-50/10 text-certred-700 dark:text-certred-600 border-certred-100 dark:border-certred-600/30',
    dot: 'bg-certred-600',
  },
  NotAssessed: {
    label: { ar: 'غير مقيّم', en: 'Not Assessed' },
    icon: '—',
    classes: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600',
    dot: 'bg-slate-400',
  },
  PASS: {
    label: { ar: 'مطابق', en: 'Pass' },
    icon: '✓',
    classes: 'bg-certgreen-50 dark:bg-certgreen-50/10 text-certgreen-700 dark:text-certgreen-600 border-certgreen-100 dark:border-certgreen-600/30',
    dot: 'bg-certgreen-600',
  },
  NEEDS: {
    label: { ar: 'تحسين', en: 'Needs' },
    icon: '!',
    classes: 'bg-certamber-50 dark:bg-certamber-50/10 text-certamber-700 dark:text-certamber-600 border-certamber-100 dark:border-certamber-600/30',
    dot: 'bg-certamber-600',
  },
  FAIL: {
    label: { ar: 'فشل', en: 'Fail' },
    icon: '×',
    classes: 'bg-certred-50 dark:bg-certred-50/10 text-certred-700 dark:text-certred-600 border-certred-100 dark:border-certred-600/30',
    dot: 'bg-certred-600',
  },
  NA: {
    label: { ar: 'لا ينطبق', en: 'N/A' },
    icon: '—',
    classes: 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-600',
    dot: 'bg-slate-400',
  },
}

export function StatusBadge({ status, className = '', size = 'md' }) {
  const { t } = useApp()
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.NOT_CERTIFIED
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold font-body ${cfg.classes} ${sizeClasses} ${className}`}>
      <span className="font-bold">{cfg.icon}</span>
      {t(cfg.label)}
    </span>
  )
}

export function StatusPill({ status, className = '' }) {
  return <StatusBadge status={status} className={className} />
}

export function CriterionRow({ label, met }) {
  const { t } = useApp()
  return (
    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-body">
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
        met ? 'bg-certgreen-50 dark:bg-certgreen-50/20 text-certgreen-700 dark:text-certgreen-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
      }`}>
        {met ? '✓' : '·'}
      </span>
      <span className={met ? '' : 'text-slate-400 dark:text-slate-500'}>{t(label)}</span>
    </div>
  )
}

const ITEM_STATUS_CONFIG = {
  PASS: { label: { ar: 'مطابق', en: 'PASS' }, classes: 'bg-certgreen-50 dark:bg-certgreen-50/15 text-certgreen-700 dark:text-certgreen-600', icon: '✓' },
  NEEDS: { label: { ar: 'بحاجة لتحسين', en: 'NEEDS IMPROVEMENT' }, classes: 'bg-certamber-50 dark:bg-certamber-50/15 text-certamber-700 dark:text-certamber-600', icon: '!' },
  FAIL: { label: { ar: 'غير مطابق', en: 'FAIL' }, classes: 'bg-certred-50 dark:bg-certred-50/15 text-certred-700 dark:text-certred-600', icon: '×' },
  NA: { label: { ar: 'لا ينطبق', en: 'N/A' }, classes: 'bg-slate-100 dark:bg-slate-700 text-slate-500', icon: '—' },
}

export function ItemStatusTag({ status }) {
  const { t } = useApp()
  const cfg = ITEM_STATUS_CONFIG[status] || ITEM_STATUS_CONFIG.FAIL
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold font-mono-data ${cfg.classes}`}>
      <span>{cfg.icon}</span>
      {t(cfg.label)}
    </span>
  )
}

export function ScoreRing({ score, size = 96, stroke = 9, tone = 'primary', animate = true }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (Math.max(0, Math.min(100, score)) / 100) * circumference
  const toneColors = {
    primary: '#4F46E5',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
  }
  const color = toneColors[tone] || toneColors.primary
  const trackColor = 'currentColor'

  return (
    <div className="relative shrink-0 text-slate-200 dark:text-slate-700" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} opacity={0.3} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={animate ? { strokeDasharray: `0 ${circumference}` } : { strokeDasharray: `${dash} ${circumference}` }}
          animate={{ strokeDasharray: `${dash} ${circumference}` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedNumber value={score} className="font-semibold text-slate-900 dark:text-slate-100" style={{ fontSize: size * 0.26 }} />
      </div>
    </div>
  )
}

export function DimensionBar({ label, score, trend, certifiedCount, totalCount }) {
  const { t } = useApp()
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'
  const trendColor = trend === 'up' ? 'text-certgreen-600' : trend === 'down' ? 'text-certred-600' : 'text-slate-400'
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-body">{t(label)}</span>
        <span className="flex items-center gap-1.5 font-mono-data text-sm text-slate-900 dark:text-slate-100">
          {score}%
          <span className={`text-xs ${trendColor}`}>{trendIcon}</span>
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary-600 dark:bg-primary-500 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ width: `${score}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {certifiedCount != null && (
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-body">
          {certifiedCount}/{totalCount} {t({ ar: 'معتمد', en: 'certified' })}
        </div>
      )}
    </div>
  )
}

export function MetricCard({ label, value, subtitle, trend, icon, onClick, delay = 0 }) {
  const { t } = useApp()
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card
        as={onClick ? 'button' : 'div'}
        onClick={onClick}
        hover={!!onClick}
        className="p-5 text-start w-full"
      >
        <div className="flex items-start justify-between">
          <Eyebrow tone="muted">{t(label)}</Eyebrow>
          {icon && <span className="text-lg opacity-60">{icon}</span>}
        </div>
        <div className="font-mono-data text-3xl font-bold text-primary-700 dark:text-primary-400 mt-2">{value}</div>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-body">{t(subtitle)}</p>}
        {trend && (
          <span className={`inline-block mt-2 text-xs font-semibold ${trend === 'up' ? 'text-certgreen-600' : 'text-slate-400'}`}>
            {trend === 'up' ? '↑' : '→'} {t({ ar: 'تحسّن', en: 'Improving' })}
          </span>
        )}
      </Card>
    </motion.div>
  )
}

export function Seal({ status = 'CERTIFIED', size = 128, animate = false, dateLabel }) {
  const { t } = useApp()
  const toneClass = status === 'CERTIFIED' ? 'seal-ink' : status === 'CONDITIONAL' ? 'seal-ink-amber' : 'seal-ink-red'
  const text = status === 'CERTIFIED'
    ? { ar: 'معتمد بلديًا', en: 'Municipality Certified' }
    : status === 'CONDITIONAL'
    ? { ar: 'اعتماد مشروط', en: 'Conditional' }
    : { ar: 'غير معتمد', en: 'Not Certified' }
  return (
    <div
      className={`seal ${toneClass} ${animate ? 'animate-stamp' : '-rotate-6'}`}
      style={{ width: size, height: size }}
    >
      <div className="flex flex-col items-center justify-center text-center px-3 leading-tight">
        <span className="font-display text-[10px] tracking-widest uppercase opacity-80">مدينة+</span>
        <span className="font-display font-bold" style={{ fontSize: size * 0.11 }}>{t(text)}</span>
        {dateLabel && <span className="font-mono-data mt-1 opacity-70" style={{ fontSize: size * 0.07 }}>{dateLabel}</span>}
      </div>
    </div>
  )
}

export function CertificationCard({ housing, onClose }) {
  const { t } = useApp()
  const h = housing
  if (!h) return null

  return (
    <Card className="p-6 md:p-8 animate-scaleIn">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow tone="success">{t({ ar: 'شهادة اعتماد', en: 'Certification' })}</Eyebrow>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">{t(h.name)}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t(h.provider)}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none" aria-label="Close">×</button>
        )}
      </div>

      <div className="flex flex-col items-center my-6">
        <Seal status={h.status} size={120} animate />
        <StatusBadge status={h.status} className="mt-4" />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <CertField label={{ ar: 'الدرجة', en: 'Score' }} value={`${h.score}/100`} />
        <CertField label={{ ar: 'صادر عن', en: 'Issued by' }} value={t({ ar: 'بلدية بيرزيت', en: 'Birzeit Municipality' })} />
        <CertField label={{ ar: 'آخر فحص', en: 'Last Inspection' }} value={h.lastInspection} />
        <CertField label={{ ar: 'صالح حتى', en: 'Valid Until' }} value={h.expiryDate || '—'} />
      </div>

      <div className="mt-6 mx-auto w-24 h-24 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-0.5 p-2">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 ${i % 3 === 0 ? 'bg-slate-800 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-500'}`} />
          ))}
        </div>
      </div>
      <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2 font-mono-data">QR</p>
    </Card>
  )
}

function CertField({ label, value }) {
  const { t } = useApp()
  return (
    <div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-body">{t(label)}</div>
      <div className="font-mono-data text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{value}</div>
    </div>
  )
}

export function InspectionCriterion({ item, onChange, interactive = false }) {
  const { t } = useApp()
  const statuses = ['PASS', 'NEEDS', 'FAIL', 'NA']

  return (
    <div className="flex items-center justify-between py-2.5 text-sm font-body border-b border-slate-100 dark:border-slate-700/50 last:border-0">
      <span className="text-slate-800 dark:text-slate-200">{t(item.label)}</span>
      {interactive ? (
        <div className="flex gap-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => onChange?.(item.key, s)}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all duration-150 ${
                item.status === s
                  ? ITEM_STATUS_CONFIG[s].classes + ' ring-2 ring-offset-1 ring-primary-400 dark:ring-offset-slate-800'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {ITEM_STATUS_CONFIG[s].icon}
            </button>
          ))}
        </div>
      ) : (
        <ItemStatusTag status={item.status} />
      )}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, subtitle, tone = 'primary' }) {
  const { t } = useApp()
  return (
    <div className="mb-8">
      {eyebrow && <Eyebrow tone={tone}>{t(eyebrow)}</Eyebrow>}
      <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1.5 tracking-tight">{t(title)}</h1>
      {subtitle && <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl font-body leading-relaxed text-[15px]">{t(subtitle)}</p>}
    </div>
  )
}

export function EmptyEdge({ children }) {
  return <div className="text-center py-10 text-slate-500 dark:text-slate-400 font-body text-sm">{children}</div>
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...rest }) {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-sm',
    secondary: 'border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 bg-white dark:bg-slate-800',
    success: 'bg-certgreen-600 hover:bg-certgreen-700 text-white',
    warning: 'bg-certamber-600 hover:bg-certamber-700 text-white',
    ghost: 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800',
  }
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-sm px-6 py-3',
  }
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 active:scale-[0.98] font-body ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function PriorityCard({ priority, index }) {
  const { t } = useApp()
  const severityColors = {
    high: 'border-s-certred-600 bg-certred-50/50 dark:bg-certred-50/5',
    medium: 'border-s-certamber-600 bg-certamber-50/50 dark:bg-certamber-50/5',
    low: 'border-s-primary-500 bg-primary-50/50 dark:bg-primary-50/5',
  }
  const severity = priority.severity || 'high'
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={`flex items-start gap-4 border border-slate-200 dark:border-slate-700 border-s-4 ${severityColors[severity]} rounded-xl p-4`}
    >
      <div className="font-display text-2xl font-bold text-slate-400 dark:text-slate-500 shrink-0 w-8">{priority.rank}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-certred-600 dark:text-certred-600 mb-1">
          {t({ ar: 'أولوية عالية', en: 'High Priority' })}
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 font-body">{t(priority.text)}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-body mt-1">{t(priority.impact)}</p>
        {priority.action && (
          <p className="text-xs text-primary-600 dark:text-primary-400 font-body mt-2 font-medium">{t(priority.action)}</p>
        )}
      </div>
    </motion.div>
  )
}

export function HousingCard({ housing: h, onClick }) {
  const { t } = useApp()
  const passCriteria = h.inspection?.flatMap((c) => c.items).filter((i) => i.status === 'PASS').slice(0, 4) || []

  return (
    <Card hover className="p-5 cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">{t(h.name)}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-body mt-0.5">{t(h.provider)}</div>
        </div>
        <StatusBadge status={h.status} size="sm" />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <ScoreRing score={h.score} size={52} stroke={5} tone={h.status === 'CERTIFIED' ? 'success' : h.status === 'CONDITIONAL' ? 'warning' : 'danger'} />
        <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
          {h.price && (
            <div>
              <span className="text-slate-400">{t({ ar: 'الإيجار', en: 'Rent' })}</span>
              <div className="font-mono-data font-semibold text-slate-800 dark:text-slate-200">{t(h.price)}</div>
            </div>
          )}
          {h.distance && (
            <div>
              <span className="text-slate-400">{t({ ar: 'من الجامعة', en: 'From uni' })}</span>
              <div className="font-mono-data font-semibold text-slate-800 dark:text-slate-200">{t(h.distance)}</div>
            </div>
          )}
        </div>
      </div>

      {h.facilities && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {h.facilities.map((f, i) => (
            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
              {t(f)}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3">
        {passCriteria.map((item) => (
          <CriterionRow key={item.key} label={item.label} met />
        ))}
      </div>
    </Card>
  )
}

export function BusinessCard({ business: b }) {
  const { t } = useApp()
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-display font-semibold text-slate-900 dark:text-slate-100">{t(b.name)}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-body mt-0.5">{t(b.category)}</div>
        </div>
        {b.certified ? (
          <span className="seal seal-ink shrink-0" style={{ width: 36, height: 36 }}>
            <span className="font-display text-[8px] font-bold">✓</span>
          </span>
        ) : (
          <StatusBadge status="NOT_CERTIFIED" size="sm" />
        )}
      </div>
      <div className="space-y-1.5 mt-3">
        {b.criteria.map((c, i) => (
          <CriterionRow key={i} label={c.label} met={c.met} />
        ))}
      </div>
    </Card>
  )
}

export function RouteCard({ route: r, showMap = true }) {
  const { t, lang } = useApp()
  const arrow = lang === 'ar' ? '←' : '→'
  return (
    <Card className="p-5 md:p-6">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">{t(r.name)}</span>
        <StatusBadge status={r.status} size="sm" />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-body">{t(r.label)}</p>
      <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300 font-body mt-3 flex-wrap">
        <span>{t(r.from)}</span>
        <span className="text-slate-400">{arrow}</span>
        <span>{t(r.via)}</span>
        <span className="text-slate-400">{arrow}</span>
        <span>{t(r.to)}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4">
        {r.criteria.map((c, i) => (
          <CriterionRow key={i} label={c.label} met={c.met} />
        ))}
      </div>
    </Card>
  )
}

export function MapFilterBar({ filters, onChange }) {
  const { t } = useApp()
  const options = [
    { key: 'housing', label: { ar: 'السكن', en: 'Housing' } },
    { key: 'businesses', label: { ar: 'المحال', en: 'Businesses' } },
    { key: 'routes', label: { ar: 'المسارات', en: 'Routes' } },
    { key: 'problems', label: { ar: 'المشكلات', en: 'Problems' } },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange({ ...filters, [opt.key]: !filters[opt.key] })}
          className={`text-xs font-semibold font-body px-3 py-1.5 rounded-full border transition-all duration-200 ${
            filters[opt.key]
              ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
              : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-primary-400'
          }`}
        >
          {t(opt.label)}
        </button>
      ))}
    </div>
  )
}
