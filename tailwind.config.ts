import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
    './app/app.vue'
  ],
  theme: {
    container: { center: true, padding: { DEFAULT: '1.25rem', md: '2rem', lg: '3rem' } },
    extend: {
      colors: {
        paper: { DEFAULT: '#FBF7F1', 2: '#F5ECE0', 3: '#EFE3D3' },
        line: { DEFAULT: '#E6D6C3', strong: '#D7C0A5' },
        ink: { DEFAULT: '#2E1F15', soft: '#4A3426', muted: '#73563F' },
        caramel: { DEFAULT: '#A36B43', light: '#C49067', pale: '#EAD5C0' },
        copper: '#8A5530',
        umber: '#714324',
        gold: { DEFAULT: '#B08A45', light: '#D9BF86', deep: '#94702F' },
        ok: '#4E7A4A',
        danger: '#A43A2C'
      },
      fontFamily: {
        display: ['"Cormorant Garamond Variable"', '"Cormorant Garamond"', '"EB Garamond Variable"', 'Georgia', 'serif'],
        serif: ['"EB Garamond Variable"', '"EB Garamond"', 'Georgia', 'serif'],
        sans: ['"Jost Variable"', 'Jost', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'display-xl': ['clamp(3.4rem, 9vw, 9.5rem)', { lineHeight: '0.92', letterSpacing: '0.02em' }],
        'display-lg': ['clamp(2.6rem, 6vw, 5.6rem)', { lineHeight: '1', letterSpacing: '-0.005em' }],
        'display-md': ['clamp(2rem, 4.2vw, 3.6rem)', { lineHeight: '1.05' }],
        'display-sm': ['clamp(1.6rem, 2.6vw, 2.3rem)', { lineHeight: '1.15' }]
      },
      letterSpacing: { label: '0.28em' },
      boxShadow: {
        book: '0 30px 60px -20px rgba(113, 67, 36, 0.45), 0 12px 24px -12px rgba(113, 67, 36, 0.35)',
        soft: '0 1px 2px rgba(46,31,21,.04), 0 8px 24px -8px rgba(113,67,36,.14)',
        lift: '0 2px 4px rgba(46,31,21,.04), 0 24px 48px -16px rgba(113,67,36,.22)'
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)'
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(calc(-100% - var(--gap)))' } },
        'marquee-rev': { from: { transform: 'translateX(calc(-100% - var(--gap)))' }, to: { transform: 'translateX(0)' } },
        sheen: { '0%': { transform: 'translateX(-120%) skewX(-20deg)' }, '60%, 100%': { transform: 'translateX(220%) skewX(-20deg)' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } }
      },
      animation: {
        marquee: 'marquee var(--duration, 60s) linear infinite',
        'marquee-rev': 'marquee-rev var(--duration, 60s) linear infinite',
        sheen: 'sheen 3.6s cubic-bezier(.4,0,.2,1) infinite',
        'spin-slow': 'spin-slow 90s linear infinite',
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config
