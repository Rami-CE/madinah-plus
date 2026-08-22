import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, ApiError, setToken } from '../api.js'

const AppContext = createContext(null)
const TOKEN_KEY = 'madinah-token'
const USER_KEY = 'madinah-user'

function readStoredTheme() {
  if (typeof window === 'undefined') return 'system'
  return localStorage.getItem('madinah-theme') || 'system'
}

function resolveTheme(mode) {
  if (mode === 'dark' || mode === 'light') return mode
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialLang() {
  if (typeof window === 'undefined') return 'ar'
  return localStorage.getItem('madinah-lang') || 'ar'
}

function localAccessStats(housing) {
  const statuses = housing.map((h) => h.accessibility?.status)
  return {
    accessible: statuses.filter((s) => s === 'Accessible').length,
    partiallyAccessible: statuses.filter((s) => s === 'PartiallyAccessible').length,
    notAccessible: statuses.filter((s) => s === 'NotAccessible').length,
    notAssessed: statuses.filter((s) => s === 'NotAssessed').length,
    needImprovement: statuses.filter((s) => s === 'PartiallyAccessible' || s === 'NotAccessible').length,
  }
}

export function AppProvider({ children }) {
  const [themeMode, setThemeModeState] = useState(readStoredTheme)
  const [theme, setTheme] = useState(() => resolveTheme(readStoredTheme()))
  const [lang, setLangState] = useState(getInitialLang)
  const [portal, setPortal] = useState('student')
  const [page, setPage] = useState('home')
  const [params, setParams] = useState({})
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [city, setCity] = useState(null)
  const [priorities, setPriorities] = useState([])
  const [monitoring, setMonitoring] = useState(null)
  const [housing, setHousing] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [routes, setRoutes] = useState([])
  const [feedbackCategories, setFeedbackCategories] = useState([])
  const [feedbackLog, setFeedbackLog] = useState([])
  const [accessibilityStats, setAccessibilityStats] = useState({})
  const [textSize, setTextSizeState] = useState(() => localStorage.getItem('madinah-text-size') || 'standard')
  const [highContrast, setHighContrastState] = useState(() => localStorage.getItem('madinah-high-contrast') === '1')
  const [reduceMotion, setReduceMotionState] = useState(() => localStorage.getItem('madinah-reduce-motion') === '1')
  const [a11y, setA11yState] = useState(() => localStorage.getItem('madinah-a11y') === '1')

  const isStudent = user?.role?.toLowerCase() === 'student'
  const isMunicipality = user?.role?.toLowerCase() === 'municipality'
  const authenticated = Boolean(user && apiTokenPresent())
  const a11yActive = highContrast || reduceMotion || textSize !== 'standard' || a11y

  const applyTheme = useCallback((mode) => {
    const resolved = resolveTheme(mode)
    setTheme(resolved)
    document.documentElement.classList.add('theme-transition')
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    setTimeout(() => document.documentElement.classList.remove('theme-transition'), 350)
  }, [])

  const setThemeMode = useCallback((mode) => {
    setThemeModeState(mode)
    localStorage.setItem('madinah-theme', mode)
    applyTheme(mode)
  }, [applyTheme])

  const toggleTheme = useCallback(() => {
    setThemeMode(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setThemeMode])

  const setLang = useCallback((next) => {
    setLangState(next)
    localStorage.setItem('madinah-lang', next)
  }, [])

  const t = useCallback((field) => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[lang] ?? field.ar ?? field.en ?? ''
  }, [lang])

  const flash = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2400)
  }, [])

  const logout = useCallback((silent = false) => {
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    setCity(null)
    setHousing([])
    setBusinesses([])
    setRoutes([])
    setPortal('student')
    setPage('home')
    if (!silent) {
      setLoading(false)
      setError(null)
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const me = await api.me()
      setUser(me)
      const [cityData, priorityData, monitoringData, housingData, businessData, routeData, feedbackData] = await Promise.all([
        api.getCity(),
        api.getPriorities(),
        api.getMonitoring(),
        api.getHousing(),
        api.getBusinesses(),
        api.getRoutes(),
        api.getFeedback(),
      ])
      setCity(cityData)
      setPriorities(priorityData)
      setMonitoring(monitoringData)
      setHousing(housingData)
      setBusinesses(businessData)
      setRoutes(routeData)
      setFeedbackCategories(feedbackData.categories || [])
      setFeedbackLog(feedbackData.items || [])

      const muni = me.role?.toLowerCase() === 'municipality'
      if (muni) {
        try {
          setAccessibilityStats(await api.getAccessibilityStats())
        } catch {
          setAccessibilityStats(localAccessStats(housingData))
        }
      } else {
        setAccessibilityStats(localAccessStats(housingData))
      }
      setPortal(muni ? 'municipality' : 'student')
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout(true)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [logout])

  const login = useCallback(async (email, password, role) => {
    try {
      const result = await api.login(email.trim(), password, role)
      setToken(result.token)
      localStorage.setItem(TOKEN_KEY, result.token)
      localStorage.setItem(USER_KEY, JSON.stringify(result.user))
      setUser(result.user)
      const muni = result.user.role?.toLowerCase() === 'municipality'
      setPortal(muni ? 'municipality' : 'student')
      setPage(muni ? 'dashboard' : 'home')
      await refresh()
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  }, [refresh])

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored) {
      setToken(stored)
      refresh()
    } else {
      setLoading(false)
    }
  }, [refresh])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  useEffect(() => {
    applyTheme(themeMode)
  }, [themeMode, applyTheme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (themeMode === 'system') applyTheme('system')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [themeMode, applyTheme])

  useEffect(() => {
    document.documentElement.dataset.textSize = textSize
    document.documentElement.classList.toggle('high-contrast', highContrast)
    document.documentElement.classList.toggle('reduce-motion', reduceMotion)
  }, [textSize, highContrast, reduceMotion])

  const navigate = useCallback((nextPortal, nextPage, nextParams = {}) => {
    if (isStudent && nextPortal !== 'student') return
    if (isMunicipality && nextPortal !== 'municipality') return
    setPortal(nextPortal)
    setPage(nextPage)
    setParams(nextParams)
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [isStudent, isMunicipality, reduceMotion])

  const replaceHousing = useCallback((updated) => {
    setHousing((prev) => {
      const next = prev.map((h) => (h.id === updated.id ? updated : h))
      setAccessibilityStats(localAccessStats(next))
      return next
    })
  }, [])

  const syncCity = useCallback(async () => {
    try {
      setCity(await api.getCity())
      setPriorities(await api.getPriorities())
    } catch {
      /* keep last city snapshot */
    }
  }, [])

  const updateInspectionItem = useCallback(async (id, itemKey, status) => {
    replaceHousing(await api.updateInspection(id, itemKey, status))
    await syncCity()
  }, [replaceHousing, syncCity])

  const applyImprovement = useCallback(async (id) => {
    replaceHousing(await api.improve(id))
    await syncCity()
  }, [replaceHousing, syncCity])

  const issueCertification = useCallback(async (id) => {
    replaceHousing(await api.certify(id))
    await syncCity()
  }, [replaceHousing, syncCity])

  const issueConditional = useCallback(async (id) => {
    replaceHousing(await api.issueConditional(id))
    await syncCity()
  }, [replaceHousing, syncCity])

  const submitFeedback = useCallback(async (category, text) => {
    const item = await api.submitFeedback(category, text)
    setFeedbackLog((prev) => [item, ...prev])
  }, [])

  const setTextSize = useCallback((size) => {
    setTextSizeState(size)
    localStorage.setItem('madinah-text-size', size)
    flash(size === 'large'
      ? t({ ar: 'تم تفعيل النص الكبير', en: 'Large text enabled' })
      : size === 'xlarge'
        ? t({ ar: 'تم تفعيل النص الكبير جدًا', en: 'Extra large text enabled' })
        : t({ ar: 'حجم النص العادي', en: 'Standard text size' }))
  }, [flash, t])

  const setHighContrast = useCallback((enabled) => {
    setHighContrastState(enabled)
    localStorage.setItem('madinah-high-contrast', enabled ? '1' : '0')
    flash(enabled ? t({ ar: 'تم تفعيل التباين المرتفع', en: 'High contrast enabled' }) : t({ ar: 'تم إيقاف التباين المرتفع', en: 'High contrast off' }))
  }, [flash, t])

  const setReduceMotion = useCallback((enabled) => {
    setReduceMotionState(enabled)
    localStorage.setItem('madinah-reduce-motion', enabled ? '1' : '0')
    flash(enabled ? t({ ar: 'تم تفعيل تقليل الحركة', en: 'Reduce motion enabled' }) : t({ ar: 'تم إيقاف تقليل الحركة', en: 'Reduce motion off' }))
  }, [flash, t])

  const setA11y = useCallback((enabled) => {
    setA11yState(enabled)
    localStorage.setItem('madinah-a11y', enabled ? '1' : '0')
    if (enabled) {
      setHighContrastState(true)
      setReduceMotionState(true)
      localStorage.setItem('madinah-high-contrast', '1')
      localStorage.setItem('madinah-reduce-motion', '1')
      setTextSizeState((current) => {
        const next = current === 'standard' ? 'large' : current
        localStorage.setItem('madinah-text-size', next)
        return next
      })
    }
  }, [])

  const housingById = useCallback((id) => housing.find((h) => h.id === id) || housing[0], [housing])

  const value = useMemo(() => ({
    theme, themeMode, setThemeMode, toggleTheme,
    lang, setLang, t,
    portal, page, params, navigate,
    user, authenticated, isStudent, isMunicipality, login, logout, refresh,
    loading, error, toast,
    city, priorities, monitoring, housing, businesses, routes,
    feedbackCategories, feedbackLog, accessibilityStats, housingById,
    applyImprovement, updateInspectionItem, issueCertification, issueConditional, submitFeedback,
    textSize, setTextSize, highContrast, setHighContrast, reduceMotion, setReduceMotion, a11y, setA11y, a11yActive,
  }), [
    theme, themeMode, setThemeMode, toggleTheme, lang, setLang, t, portal, page, params, navigate,
    user, authenticated, isStudent, isMunicipality, login, logout, refresh, loading, error, toast,
    city, priorities, monitoring, housing, businesses, routes, feedbackCategories, feedbackLog,
    accessibilityStats, housingById, applyImprovement, updateInspectionItem, issueCertification,
    issueConditional, submitFeedback, textSize, setTextSize, highContrast, setHighContrast,
    reduceMotion, setReduceMotion, a11y, setA11y, a11yActive,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

function apiTokenPresent() {
  return Boolean(localStorage.getItem(TOKEN_KEY))
}
