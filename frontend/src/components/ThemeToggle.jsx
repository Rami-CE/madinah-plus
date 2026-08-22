import React from 'react'
import { useApp } from '../context/AppContext.jsx'

export function ThemeToggle() {
  const { theme, toggleTheme } = useApp()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
    >
      <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>
      <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  )
}

export function LanguageToggle() {
  const { lang, setLang } = useApp()

  return (
    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 text-xs font-semibold font-body">
      <button
        onClick={() => setLang('ar')}
        className={`px-2.5 py-1.5 rounded-md transition-all duration-200 ${
          lang === 'ar'
            ? 'bg-primary-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-primary-600'
        }`}
      >
        العربية
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1.5 rounded-md transition-all duration-200 ${
          lang === 'en'
            ? 'bg-primary-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-primary-600'
        }`}
      >
        English
      </button>
    </div>
  )
}
