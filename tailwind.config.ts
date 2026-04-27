import type { Config } from 'tailwindcss';

// 공식 디폴트 테마 참조 : https://tailwindcss.com/docs/theme#default-theme-variable-reference
// 정의해놓은거 외에는 공식에서 정의해 놓은 것들 그대로 사용가능합니다.

// --radius-sm: 4px
// --radius-md: 6px
// --radius-lg: 8px

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['var(--font-pretendard)', 'sans-serif'],
      },
      fontSize: {
        'typo-big-title': [
          '1.75rem',
          {
            lineHeight: '2.275rem',
            fontWeight: '700',
            letterSpacing: '-0.03em',
          },
        ], //28px
        'typo-title': ['1.5rem', { lineHeight: '2rem', fontWeight: '600', letterSpacing: '-0.03em' }], //24px
        'typo-sub-title': [
          '1.25rem',
          {
            lineHeight: '1.875rem',
            fontWeight: '600',
            letterSpacing: '-0.03em',
          },
        ], //20px
        'typo-base': ['1rem', { lineHeight: '1.5rem', fontWeight: '400', letterSpacing: '-0.03em' }], //16px
        'typo-base-bold': ['1rem', { lineHeight: '1.5rem', fontWeight: '600', letterSpacing: '-0.03em' }], //16px
        'typo-description': [
          '0.875rem',
          {
            lineHeight: '1.25rem',
            fontWeight: '400',
            letterSpacing: '-0.03em',
          },
        ], //14px
        'typo-caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '400', letterSpacing: '-0.03em' }], //12px
      },
      colors: {
        'brand-blue': {
          50: '#EDF3FF',
          100: '#C9DCFF',
          200: '#A6C3FF',
          300: '#7AA3FD',
          400: '#5187FC',
          500: '#3676F5',
          600: '#3465D7',
          700: '#3A5EBB',
          800: '#264697',
          900: '#1C3575',
        },
        'brand-gray': {
          0: '#ffffff',
          50: '#F9F9FB',
          100: '#EFF1F5',
          200: '#E4E7EC',
          300: '#B9C0D4',
          400: '#7D89AF',
          500: '#5D6B98',
          600: '#4A5578',
          700: '#404968',
          800: '#30374F',
          900: '#111322',
        },
        'bg-sub-blue': '#466ABF',
        'neon-green': '#D0F65E',
        tag: {
          'red-text': '#E95C58',
          'red-stroke': '#FED4D2',
          'red-fill': '#FDF0F0',
          'green-text': '#29991F',
          'green-stroke': '#D7EFC2',
          'green-fill': '#F6FFE2',
          'yellow-text': '#FFAA0D',
          'yellow-stroke': '#FFF2BF',
          'yellow-fill': '#FFFFED',
          'purple-text': '#7968E8',
          'purple-stroke': '#D7C9FF',
          'purple-fill': '#F4F0FF',
          'hotpink-text': '#EF3DBA',
          'hotpink-stroke': '#FDCEF3',
          'hotpink-fill': '#FFEDFA',
        },
      },
      boxShadow: {
        'shadow-medium': '0 4px 8px -2px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.06);',
        'shadow-large': '0 12px 16px -4px #10182814, 0 4px 6px -2px rgba(16, 24, 40, 0.03)',
      },
    },
  },
  plugins: [],
} satisfies Config;
