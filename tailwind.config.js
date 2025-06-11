module.exports = {
  darkMode: 'class', // تفعيل الوضع الليلي بالـ class وليس بالـ media
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // اللون الأساسي الأزرق
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',  // لون ثانوي رمادي أزرق
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // أخضر النجاح
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // أصفر تحذيري
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // أحمر الخطأ
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        backgroundLight: '#f9fafb',  // لون خلفية فاتح مخصص (اختياري)
        backgroundDark: '#121212',    // خلفية داكنة مخصصة (اختياري)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],       // مناسب للكتابة العامة
        display: ['Poppins', 'sans-serif'],  // عناوين
        mono: ['Fira Code', 'monospace'],    // للـ code أو الأكواد
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',  // ظل ناعم
        'hard': '0 4px 20px rgba(0, 0, 0, 0.1)',   // ظل أقوى
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)', // ظل داخلي
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',      // حركة تعويم لطيفة
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',  // نبضة بطيئة
        'bounce-slow': 'bounceSlow 3s infinite',       // ارتداد بطيء (لو حبيت تستخدمه)
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),         // تحسين الفورمات
    require('@tailwindcss/typography'),   // نصوص مُنسقة
    require('@tailwindcss/aspect-ratio'), // النسبة العرضية للصور والفيديو
    require('tailwindcss-text-fill'),     // لتلوين النصوص بشكل متقدم
  ],
}
