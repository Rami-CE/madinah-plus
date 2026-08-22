import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { ThemeToggle, LanguageToggle } from '../components/ThemeToggle.jsx'
import { Button, Card } from '../components/ui.jsx'

export default function Login() {
  const { t, login } = useApp()
  const [role, setRole] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!role) return
    setSubmitting(true)
    setError('')
    const result = await login(email, password, role)
    if (!result.ok) setError(result.message || t({ ar: 'تعذر تسجيل الدخول', en: 'Login failed' }))
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f4f2ec_0%,#eef6f5_100%)] dark:bg-[linear-gradient(135deg,#0b1220_0%,#10222a_100%)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none city-grid" />
      <div className="relative max-w-lg mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-10">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-600 text-white font-display font-bold shadow-sm">م+</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>

        <h1 className="font-display text-4xl font-extrabold text-slate-900 dark:text-slate-100">{t({ ar: 'مدينة+', en: 'Madinah+' })}</h1>
        <p className="mt-2 text-xl text-slate-700 dark:text-slate-300 font-body">{t({ ar: 'مدينتك، أفضل للطلاب.', en: 'Your city, better for students.' })}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-body">
          {t({ ar: 'شهادة المدينة الصديقة للطلاب — نموذج أولي.', en: 'Student-Friendly City Certification — prototype.' })}
        </p>

        {!role ? (
          <div className="mt-8 space-y-4">
            <h2 className="font-display text-lg font-bold">{t({ ar: 'مرحبًا في مدينة+', en: 'Welcome to Madinah+' })}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t({ ar: 'اختر كيف تريد المتابعة:', en: 'Choose how you want to continue:' })}</p>
            <RoleCard
              title={t({ ar: '🎓 طالب', en: '🎓 Student' })}
              body={t({ ar: 'استكشف السكن المعتمد والمحال والمسارات ومعلومات المدينة.', en: 'Explore certified housing, businesses, routes, and city information.' })}
              onClick={() => setRole('Student')}
            />
            <RoleCard
              title={t({ ar: '🏛 بلدية', en: '🏛 Municipality' })}
              body={t({ ar: 'إدارة الفحوصات والاعتمادات ومؤشرات المدينة وأولويات التحسين.', en: 'Manage inspections, certifications, city metrics, and improvement priorities.' })}
              onClick={() => setRole('Municipality')}
            />
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <button
              type="button"
              className="text-sm font-semibold text-primary-600 dark:text-primary-400"
              onClick={() => { setRole(null); setError('') }}
              disabled={submitting}
            >
              ← {t({ ar: 'تغيير الدور', en: 'Change role' })}
            </button>
            <h2 className="font-display text-lg font-bold">
              {role === 'Student' ? t({ ar: 'دخول الطالب', en: 'Student login' }) : t({ ar: 'دخول البلدية', en: 'Municipality login' })}
            </h2>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {role === 'Student' ? t({ ar: 'البريد الإلكتروني', en: 'Email' }) : t({ ar: 'البريد الرسمي', en: 'Official Email' })}
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t({ ar: 'كلمة المرور', en: 'Password' })}</span>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm pe-12"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 end-0 px-3 text-xs text-slate-500"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? t({ ar: 'إخفاء', en: 'Hide' }) : t({ ar: 'إظهار', en: 'Show' })}
                </button>
              </div>
            </label>
            {error && <p className="text-sm font-semibold text-certred-600" role="alert">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? t({ ar: 'جارٍ الدخول…', en: 'Signing in…' }) : t({ ar: 'تسجيل الدخول', en: 'Login' })}
            </Button>
            <Card className="p-4 bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <div className="text-xs font-extrabold tracking-wide text-amber-700 dark:text-amber-400">
                {t({ ar: 'حسابات تجريبية (DEMO)', en: 'DEMO ACCOUNTS' })}
              </div>
              <p className="font-mono text-xs font-semibold mt-1">
                {role === 'Student' ? 'student@demo.com  ·  Demo123!' : 'municipality@demo.com  ·  Demo123!'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">{t({ ar: 'ليست حسابات حقيقية.', en: 'Not real credentials.' })}</p>
            </Card>
          </form>
        )}
      </div>
    </div>
  )
}

function RoleCard({ title, body, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-start rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
    >
      <div className="font-display font-extrabold text-base">{title}</div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{body}</p>
    </button>
  )
}
