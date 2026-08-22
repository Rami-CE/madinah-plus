import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { ThemeToggle, LanguageToggle } from './ThemeToggle.jsx'

const STUDENT_NAV = [
  { page: 'home', label: { ar: 'الرئيسية', en: 'Home' }, icon: '🏠' },
  { page: 'explore', label: { ar: 'استكشف', en: 'Explore' }, icon: '🧭' },
  { page: 'map', label: { ar: 'الخريطة', en: 'Map' }, icon: '🗺️' },
  { page: 'certifications', label: { ar: 'الاعتمادات', en: 'Certifications' }, icon: '✅' },
  { page: 'profile', label: { ar: 'الملف', en: 'Profile' }, icon: '👤' },
]

const MUNICIPALITY_NAV = [
  { page: 'dashboard', label: { ar: 'لوحة التحكم', en: 'Dashboard' } },
  { page: 'inspections', label: { ar: 'الفحوصات', en: 'Inspections' } },
  { page: 'certifications', label: { ar: 'الاعتمادات', en: 'Certifications' } },
  { page: 'map', label: { ar: 'الخريطة', en: 'Map' } },
  { page: 'reports', label: { ar: 'التقارير', en: 'Reports' } },
  { page: 'profile', label: { ar: 'الملف', en: 'Profile' } },
]

export function AppShell({ children }) {
  const { portal, page, isStudent, a11yActive, navigate, t, toast } = useApp()
  const nav = isStudent ? STUDENT_NAV : MUNICIPALITY_NAV

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 inset-x-0 z-50 flex justify-center px-4">
          <div className="rounded-full bg-slate-900 text-white text-sm font-semibold px-4 py-2 shadow-lg">{toast}</div>
        </div>
      )}
      <TopBar nav={nav} />
      {a11yActive && (
        <div className="bg-primary-600 text-white text-xs font-semibold px-4 py-2 flex items-center gap-2">
          <span aria-hidden>♿</span>
          <span className="flex-1">{t({ ar: 'تسهيل الوصول مفعّل.', en: 'Accessibility settings are on.' })}</span>
          <button className="underline font-extrabold" onClick={() => navigate(portal, 'accessibility')}>
            {t({ ar: 'إعدادات', en: 'Settings' })}
          </button>
        </div>
      )}
      <div className="flex">
        {!isStudent && <Sidebar />}
        <main className={`flex-1 min-w-0 ${isStudent ? 'pb-20 md:pb-8' : ''}`}>
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">{children}</div>
        </main>
      </div>
      {isStudent && <MobileBottomNav nav={nav} currentPage={page} />}
    </div>
  )
}

function TopBar({ nav }) {
  const { lang, portal, navigate, t, isStudent } = useApp()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate(portal, isStudent ? 'home' : 'dashboard')}
            className="flex items-center gap-3 shrink-0 group"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-600 text-white font-display font-bold text-sm shadow-sm group-hover:bg-primary-700 transition-colors">
              م+
            </span>
            <div className="hidden sm:block text-start">
              <span className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                {lang === 'ar' ? 'مدينة+' : 'Madinah+'}
              </span>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-body leading-none mt-0.5">
                {isStudent ? t({ ar: 'بوابة الطالب', en: 'Student portal' }) : t({ ar: 'بوابة البلدية', en: 'Municipality portal' })}
              </div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-0.5 font-body">
            {nav.map((item) => (
              <NavLink key={item.page} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700"
              onClick={() => navigate(portal, 'accessibility')}
              aria-label={t({ ar: 'تسهيل الوصول', en: 'Accessibility' })}
            >
              ♿
            </button>
            <ThemeToggle />
            <LanguageToggle />
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              onClick={() => setOpen((o) => !o)}
              aria-label="menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <nav className="lg:hidden flex flex-col gap-0.5 pb-4 font-body animate-slideUp">
            {nav.map((item) => (
              <NavLink key={item.page} item={item} onClick={() => setOpen(false)} />
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

function NavLink({ item, onClick }) {
  const { page, navigate, t, portal } = useApp()
  const active = page === item.page || related(page, item.page)
  return (
    <button
      onClick={() => { navigate(portal, item.page); onClick && onClick() }}
      className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400'
          : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      {t(item.label)}
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
      )}
    </button>
  )
}

function related(page, navPage) {
  if (navPage === 'explore') return ['housing', 'housing-detail', 'businesses', 'routes', 'feedback'].includes(page)
  if (navPage === 'inspections') return ['housing-list', 'housing-inspection', 'certification-result'].includes(page)
  if (navPage === 'profile') return page === 'accessibility'
  if (navPage === 'reports') return page === 'monitoring' || page === 'dimensions'
  return false
}

function Sidebar() {
  const { page, navigate, t } = useApp()
  return (
    <aside className="hidden md:block w-56 shrink-0 border-e border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 min-h-[calc(100vh-64px)] transition-colors">
      <div className="p-4 sticky top-16">
        <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-3 px-3 font-body">
          {t({ ar: 'بوابة البلدية', en: 'Municipality Portal' })}
        </div>
        <nav className="flex flex-col gap-0.5 font-body">
          {MUNICIPALITY_NAV.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate('municipality', item.page)}
              className={`text-start px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                page === item.page || related(page, item.page)
                  ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border-s-2 border-primary-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-s-2 border-transparent'
              }`}
            >
              {t(item.label)}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}

function MobileBottomNav({ nav, currentPage }) {
  const { navigate, t } = useApp()
  const mapped = related(currentPage, 'explore') ? 'explore' : related(currentPage, 'profile') ? 'profile' : currentPage

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {nav.map((item) => {
          const active = mapped === item.page
          return (
            <button
              key={item.page}
              onClick={() => navigate('student', item.page)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-[56px] ${
                active ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[10px] font-semibold font-body">{t(item.label)}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function Breadcrumb({ items }) {
  const { t, lang } = useApp()
  const sep = lang === 'ar' ? '←' : '→'
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-body mb-5 flex-wrap">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="opacity-40">{sep}</span>}
          {it.onClick ? (
            <button onClick={it.onClick} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t(it.label)}</button>
          ) : (
            <span className="text-slate-800 dark:text-slate-200 font-medium">{t(it.label)}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
