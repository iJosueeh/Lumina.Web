/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Colores Tecnológicos Modernos
        'tech-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'tech-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        'tech-cyan': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Colores Base Mejorados
        primary: '#0EA5E9',
        'primary-focus': '#0284C7',
        secondary: '#8B5CF6',
        'secondary-focus': '#7C3AED',
        accent: '#06B6D4',
        'accent-focus': '#0891b2',
        neutral: '#1f2937',
        'base-100': '#ffffff',
        'base-200': '#f3f4f6',
        'base-300': '#e5e7eb',
        info: '#3b82f6',
        success: '#22c55e',
        warning: '#facc15',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-tech': 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #8B5CF6 100%)',
        'gradient-primary': 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
        'gradient-mesh':
          'radial-gradient(at 40% 20%, hsla(210, 100%, 60%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(270, 100%, 70%, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(190, 100%, 60%, 0.3) 0px, transparent 50%)',
        shimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 3s ease infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.5s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(14, 165, 233, 0.6)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(14, 165, 233, 0.3), 0 10px 40px rgba(14, 165, 233, 0.2)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3), 0 10px 40px rgba(139, 92, 246, 0.2)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3), 0 10px 40px rgba(6, 182, 212, 0.2)',
        'glow-blue-lg': '0 0 30px rgba(14, 165, 233, 0.4), 0 20px 60px rgba(14, 165, 233, 0.3)',
        'glow-purple-lg': '0 0 30px rgba(139, 92, 246, 0.4), 0 20px 60px rgba(139, 92, 246, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(14, 165, 233, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
