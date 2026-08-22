import React from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import { AppShell } from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import { ProfilePage, AccessibilitySettingsPage } from './pages/AccountPages.jsx'
import {
  StudentHome, StudentHousingList, StudentHousingDetail, StudentBusinesses, StudentRoutes, StudentFeedback,
  StudentExplore, StudentMapPage, StudentCertifications,
} from './pages/StudentPages.jsx'
import {
  MunicipalityDashboard, MunicipalityHousingList, MunicipalityHousingInspection,
  MunicipalityCertificationResult, MunicipalityDimensions, MunicipalityMonitoring,
  MunicipalityCertificationsPage, MunicipalityMapPage,
} from './pages/MunicipalityPages.jsx'

const STUDENT_PAGES = {
  home: StudentHome,
  explore: StudentExplore,
  housing: StudentHousingList,
  'housing-detail': StudentHousingDetail,
  businesses: StudentBusinesses,
  routes: StudentRoutes,
  feedback: StudentFeedback,
  map: StudentMapPage,
  certifications: StudentCertifications,
  profile: ProfilePage,
  accessibility: AccessibilitySettingsPage,
}

const MUNICIPALITY_PAGES = {
  dashboard: MunicipalityDashboard,
  inspections: MunicipalityHousingList,
  'housing-list': MunicipalityHousingList,
  'housing-inspection': MunicipalityHousingInspection,
  'certification-result': MunicipalityCertificationResult,
  certifications: MunicipalityCertificationsPage,
  dimensions: MunicipalityDimensions,
  monitoring: MunicipalityMonitoring,
  reports: MunicipalityMonitoring,
  map: MunicipalityMapPage,
  profile: ProfilePage,
  accessibility: AccessibilitySettingsPage,
}

function Router() {
  const { portal, page, authenticated, loading, error, refresh, t } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-surface-dark text-slate-500 font-body">
        {t({ ar: 'جارٍ التحميل…', en: 'Loading…' })}
      </div>
    )
  }

  if (!authenticated) return <Login />

  const registry = portal === 'student' ? STUDENT_PAGES : MUNICIPALITY_PAGES
  const Page = registry[page] || (portal === 'student' ? STUDENT_PAGES.home : MUNICIPALITY_PAGES.dashboard)

  return (
    <AppShell>
      {error && (
        <div className="mb-4 rounded-lg border border-certred-100 bg-certred-50 dark:bg-certred-50/10 px-4 py-3 text-sm text-certred-700 flex items-center justify-between">
          <span>{error}</span>
          <button className="font-semibold underline" onClick={refresh}>{t({ ar: 'إعادة المحاولة', en: 'Retry' })}</button>
        </div>
      )}
      <Page key={`${portal}-${page}`} />
      <DemoFooter />
    </AppShell>
  )
}

function DemoFooter() {
  const { t } = useApp()
  return (
    <div className="mt-16 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-body">
        {t({
          ar: 'مدينة+ — نموذج أولي. جميع البيانات افتراضية ولا تمثل إحصاءات بلدية حقيقية.',
          en: 'Madinah+ — a prototype. All data shown is fictional and does not represent real municipal statistics.',
        })}
      </p>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  )
}
