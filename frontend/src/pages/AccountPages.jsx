import React from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Breadcrumb } from '../components/Layout.jsx'
import { Button, Card, SectionHeading, StatusBadge } from '../components/ui.jsx'

export function ProfilePage() {
  const { t, user, isMunicipality, isStudent, navigate, portal, logout } = useApp()
  return (
    <div>
      <SectionHeading
        eyebrow={{ ar: 'الحساب', en: 'Account' }}
        title={{ ar: 'الملف الشخصي', en: 'Profile' }}
        subtitle={isMunicipality ? { ar: 'بوابة البلدية', en: 'Municipality portal' } : { ar: 'بوابة الطالب', en: 'Student portal' }}
      />
      <Card className="p-6 mb-4">
        <h2 className="font-display text-2xl font-bold">{user?.name}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{user?.email}</p>
        <div className="mt-3">
          <StatusBadge status={isMunicipality ? 'CONDITIONAL' : 'CERTIFIED'} size="sm" />
        </div>
        <p className="mt-2 font-semibold text-sm">
          {isMunicipality ? t({ ar: 'دور: بلدية', en: 'Role: Municipality' }) : t({ ar: 'دور: طالب', en: 'Role: Student' })}
        </p>
      </Card>
      <button
        type="button"
        onClick={() => navigate(portal, 'accessibility')}
        className="w-full text-start"
      >
        <Card hover className="p-5 mb-4 flex items-center justify-between">
          <div>
            <div className="font-extrabold">{t({ ar: 'تسهيل الوصول', en: 'Accessibility' })}</div>
            <p className="text-xs text-slate-500 mt-1">{t({ ar: 'حجم النص، التباين، تقليل الحركة', en: 'Text size, contrast, reduce motion' })}</p>
          </div>
          <span aria-hidden>♿</span>
        </Card>
      </button>
      {isStudent && (
        <button type="button" onClick={() => navigate('student', 'feedback')} className="w-full text-start mb-6">
          <Card hover className="p-5 font-semibold">{t({ ar: 'إرسال ملاحظة', en: 'Send feedback' })}</Card>
        </button>
      )}
      <Button className="w-full !bg-certred-600 hover:!bg-certred-700" onClick={() => logout()}>
        {t({ ar: 'تسجيل الخروج', en: 'Logout' })}
      </Button>
    </div>
  )
}

export function AccessibilitySettingsPage() {
  const { t, navigate, portal, textSize, setTextSize, highContrast, setHighContrast, reduceMotion, setReduceMotion } = useApp()
  return (
    <div>
      <Breadcrumb
        items={[
          { label: { ar: 'الملف الشخصي', en: 'Profile' }, onClick: () => navigate(portal, 'profile') },
          { label: { ar: 'تسهيل الوصول', en: 'Accessibility' } },
        ]}
      />
      <SectionHeading
        eyebrow="♿"
        title={{ ar: 'تسهيل الوصول', en: 'Accessibility' }}
        subtitle={{ ar: 'خصّص الواجهة دون إنشاء تطبيق منفصل.', en: 'Adapt the existing interface. This is not a separate app.' }}
      />
      <Card className="p-6 mb-4">
        <div className="font-extrabold mb-3">{t({ ar: 'حجم النص', en: 'Text Size' })}</div>
        {[
          ['standard', { ar: 'عادي', en: 'Standard' }],
          ['large', { ar: 'كبير', en: 'Large' }],
          ['xlarge', { ar: 'كبير جدًا', en: 'Extra Large' }],
        ].map(([value, label]) => (
          <label key={value} className="flex items-center gap-3 py-2">
            <input type="radio" name="text-size" checked={textSize === value} onChange={() => setTextSize(value)} />
            <span>{t(label)}</span>
          </label>
        ))}
      </Card>
      <Card className="p-6 mb-4 flex items-center justify-between">
        <div>
          <div className="font-extrabold">{t({ ar: 'تباين مرتفع', en: 'High Contrast' })}</div>
          <p className="text-xs text-slate-500">{t({ ar: 'نص أوضح وحدود أقوى', en: 'Stronger text and borders' })}</p>
        </div>
        <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
      </Card>
      <Card className="p-6 mb-4 flex items-center justify-between">
        <div>
          <div className="font-extrabold">{t({ ar: 'تقليل الحركة', en: 'Reduce Motion' })}</div>
          <p className="text-xs text-slate-500">{t({ ar: 'إيقاف الحركات غير الضرورية', en: 'Disable decorative motion' })}</p>
        </div>
        <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} />
      </Card>
      <Card className="p-6">
        <div className="font-extrabold mb-2">{t({ ar: 'قارئ الشاشة', en: 'Screen Reader Support' })}</div>
        <p className="text-sm text-slate-500">
          {t({
            ar: 'استخدم قارئ الشاشة في النظام. العناصر المهمة تحمل تسميات واضحة.',
            en: 'Use the system screen reader. Important controls have meaningful labels.',
          })}
        </p>
      </Card>
    </div>
  )
}
