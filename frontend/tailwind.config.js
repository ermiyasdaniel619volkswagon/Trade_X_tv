
// // /** @type {import('tailwindcss').Config} */
// // export default {
// //   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
// //   darkMode: 'class',
// //   theme: {
// //     extend: {
// //       colors: {
// //         brand: {
// //           50: '#f5f3ff',
// //           100: '#ede9fe',
// //           200: '#ddd6fe',
// //           300: '#c4b5fd',
// //           400: '#a78bfa',
// //           500: '#8b5cf6',
// //           600: '#7c3aed',
// //           700: '#6d28d9',
// //           800: '#5b21b6',
// //           900: '#4c1d95',
// //           950: '#2e1065',
// //         },
// //       },
// //       fontFamily: {
// //         sans: ['Inter', 'system-ui', 'sans-serif'],
// //       },
// //     },
// //   },
// //   plugins: [],
// // };

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   darkMode: 'class',
//   theme: {
//     extend: {
//       // =============================================
//       // BRAND COLORS - Emerald/Teal Theme
//       // =============================================
//       colors: {
//         brand: {
//           50: '#ecfdf5',
//           100: '#d1fae5',
//           200: '#a7f3d0',
//           300: '#6ee7b7',
//           400: '#34d399',
//           500: '#10b981',
//           600: '#059669',
//           700: '#047857',
//           800: '#065f46',
//           900: '#064e3b',
//           950: '#022c22',
//         },
//         emerald: {
//           50: '#ecfdf5',
//           100: '#d1fae5',
//           200: '#a7f3d0',
//           300: '#6ee7b7',
//           400: '#34d399',
//           500: '#10b981',
//           600: '#059669',
//           700: '#047857',
//           800: '#065f46',
//           900: '#064e3b',
//           950: '#022c22',
//         },
//         teal: {
//           50: '#f0fdfa',
//           100: '#ccfbf1',
//           200: '#99f6e4',
//           300: '#5eead4',
//           400: '#2dd4bf',
//           500: '#14b8a6',
//           600: '#0d9488',
//           700: '#0f766e',
//           800: '#115e59',
//           900: '#134e4a',
//           950: '#042f2e',
//         },
//         // Custom TradeExTV colors
//         tradex: {
//           navy: '#1A3258',
//           navyLight: '#2A4A78',
//           maroon: '#A53D32',
//           maroonLight: '#C54D42',
//           gold: '#B69F60',
//           goldLight: '#C6AF70',
//           dark: '#01110a',
//           light: '#f5f5f0',
//         }
//       },
      
//       // =============================================
//       // FONT FAMILY
//       // =============================================
//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//         display: ['Inter', 'system-ui', 'sans-serif'],
//       },

//       // =============================================
//       // ANIMATIONS
//       // =============================================
//       animation: {
//         // Fade animations
//         'fade-in': 'fadeIn 0.6s ease-out',
//         'fade-in-up': 'fadeInUp 0.6s ease-out',
//         'fade-in-down': 'fadeInDown 0.6s ease-out',
//         'fade-in-left': 'fadeInLeft 0.6s ease-out',
//         'fade-in-right': 'fadeInRight 0.6s ease-out',
        
//         // Slide animations
//         'slide-up': 'slideUp 0.6s ease-out',
//         'slide-down': 'slideDown 0.6s ease-out',
//         'slide-left': 'slideLeft 0.6s ease-out',
//         'slide-right': 'slideRight 0.6s ease-out',
        
//         // Scale animations
//         'scale-in': 'scaleIn 0.4s ease-out',
//         'scale-up': 'scaleUp 0.4s ease-out',
        
//         // Bounce animations
//         'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
//         'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
        
//         // Pulse animations
//         'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
//         'pulse-gentle': 'pulseGentle 4s ease-in-out infinite',
        
//         // Special animations
//         'float': 'float 4s ease-in-out infinite',
//         'spin-slow': 'spin 8s linear infinite',
//         'marquee': 'marquee 25s linear infinite',
//         'glow': 'glow 2s ease-in-out infinite',
        
//         // Loading
//         'shimmer': 'shimmer 2s linear infinite',
//       },

//       // =============================================
//       // KEYFRAMES
//       // =============================================
//       keyframes: {
//         // Fade Animations
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         fadeInUp: {
//           '0%': { opacity: '0', transform: 'translateY(20px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//         fadeInDown: {
//           '0%': { opacity: '0', transform: 'translateY(-20px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//         fadeInLeft: {
//           '0%': { opacity: '0', transform: 'translateX(-20px)' },
//           '100%': { opacity: '1', transform: 'translateX(0)' },
//         },
//         fadeInRight: {
//           '0%': { opacity: '0', transform: 'translateX(20px)' },
//           '100%': { opacity: '1', transform: 'translateX(0)' },
//         },

//         // Slide Animations
//         slideUp: {
//           '0%': { transform: 'translateY(20px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//         slideDown: {
//           '0%': { transform: 'translateY(-20px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//         slideLeft: {
//           '0%': { transform: 'translateX(20px)', opacity: '0' },
//           '100%': { transform: 'translateX(0)', opacity: '1' },
//         },
//         slideRight: {
//           '0%': { transform: 'translateX(-20px)', opacity: '0' },
//           '100%': { transform: 'translateX(0)', opacity: '1' },
//         },

//         // Scale Animations
//         scaleIn: {
//           '0%': { transform: 'scale(0.95)', opacity: '0' },
//           '100%': { transform: 'scale(1)', opacity: '1' },
//         },
//         scaleUp: {
//           '0%': { transform: 'scale(0.8)', opacity: '0' },
//           '100%': { transform: 'scale(1)', opacity: '1' },
//         },

//         // Bounce Animations
//         bounceSoft: {
//           '0%, 100%': { transform: 'translateY(0)' },
//           '50%': { transform: 'translateY(-8px)' },
//         },
//         bounceGentle: {
//           '0%, 100%': { transform: 'translateY(0)' },
//           '50%': { transform: 'translateY(-4px)' },
//         },

//         // Pulse Animations
//         pulseSoft: {
//           '0%, 100%': { opacity: '1' },
//           '50%': { opacity: '0.6' },
//         },
//         pulseGentle: {
//           '0%, 100%': { opacity: '1' },
//           '50%': { opacity: '0.8' },
//         },

//         // Special Animations
//         float: {
//           '0%, 100%': { transform: 'translateY(0px)' },
//           '50%': { transform: 'translateY(-10px)' },
//         },
//         marquee: {
//           '0%': { transform: 'translateX(100%)' },
//           '100%': { transform: 'translateX(-100%)' },
//         },
//         glow: {
//           '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' },
//           '50%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' },
//         },
//         shimmer: {
//           '0%': { backgroundPosition: '-1000px 0' },
//           '100%': { backgroundPosition: '1000px 0' },
//         },
//       },

//       // =============================================
//       // BOX SHADOW EXTENSIONS
//       // =============================================
//       boxShadow: {
//         'glow': '0 0 30px rgba(16, 185, 129, 0.15)',
//         'glow-lg': '0 0 50px rgba(16, 185, 129, 0.25)',
//         'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
//         'card-hover': '0 8px 40px rgba(0, 0, 0, 0.1)',
//         'nav': '0 4px 30px rgba(0, 0, 0, 0.05)',
//         'nav-dark': '0 4px 30px rgba(0, 0, 0, 0.2)',
//       },

//       // =============================================
//       // BACKGROUND GRADIENTS
//       // =============================================
//       backgroundImage: {
//         'gradient-brand': 'linear-gradient(135deg, #10b981, #0d9488)',
//         'gradient-brand-hover': 'linear-gradient(135deg, #059669, #0f766e)',
//         'gradient-dark': 'linear-gradient(135deg, #01110a, #022c22)',
//         'gradient-gold': 'linear-gradient(135deg, #B69F60, #C6AF70)',
//         'gradient-hero': 'linear-gradient(135deg, rgba(1,17,10,0.8), rgba(2,44,34,0.6))',
//       },

//       // =============================================
//       // SPACING EXTENSIONS
//       // =============================================
//       spacing: {
//         '18': '4.5rem',
//         '88': '22rem',
//         '128': '32rem',
//       },

//       // =============================================
//       // Z-INDEX EXTENSIONS
//       // =============================================
//       zIndex: {
//         '60': '60',
//         '70': '70',
//         '80': '80',
//         '90': '90',
//         '100': '100',
//       },

//       // =============================================
//       // TRANSITION TIMING
//       // =============================================
//       transitionTimingFunction: {
//         'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
//         'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
//       },

//       // =============================================
//       // TRANSITION DURATION
//       // =============================================
//       transitionDuration: {
//         '2000': '2000ms',
//         '3000': '3000ms',
//       },
//     },
//   },
//   plugins: [],
// };

// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      // =============================================
      // ✅ SCREEN BREAKPOINTS - FULLY RESPONSIVE
      // =============================================
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      // =============================================
      // BRAND COLORS - Emerald/Teal Theme + TradeX
      // =============================================
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Custom TradeExTV colors
        tradex: {
          navy: '#1A3258',
          navyLight: '#2A4A78',
          maroon: '#A53D32',
          maroonLight: '#C54D42',
          gold: '#B69F60',
          goldLight: '#C6AF70',
          dark: '#01110a',
          light: '#f5f5f0',
        }
      },
      
      // =============================================
      // FONT FAMILY
      // =============================================
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },

      // =============================================
      // ANIMATIONS
      // =============================================
      animation: {
        // Fade animations
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'fade-in-left': 'fadeInLeft 0.6s ease-out',
        'fade-in-right': 'fadeInRight 0.6s ease-out',
        
        // Slide animations
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'slide-left': 'slideLeft 0.6s ease-out',
        'slide-right': 'slideRight 0.6s ease-out',
        
        // Scale animations
        'scale-in': 'scaleIn 0.4s ease-out',
        'scale-up': 'scaleUp 0.4s ease-out',
        
        // Bounce animations
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
        
        // Pulse animations
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 4s ease-in-out infinite',
        
        // Special animations
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'marquee': 'marquee 25s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        
        // Loading
        'shimmer': 'shimmer 2s linear infinite',
      },

      // =============================================
      // KEYFRAMES
      // =============================================
      keyframes: {
        // Fade Animations
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },

        // Slide Animations
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },

        // Scale Animations
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },

        // Bounce Animations
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },

        // Pulse Animations
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },

        // Special Animations
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      // =============================================
      // BOX SHADOW EXTENSIONS
      // =============================================
      boxShadow: {
        'glow': '0 0 30px rgba(16, 185, 129, 0.15)',
        'glow-lg': '0 0 50px rgba(16, 185, 129, 0.25)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.1)',
        'nav': '0 4px 30px rgba(0, 0, 0, 0.05)',
        'nav-dark': '0 4px 30px rgba(0, 0, 0, 0.2)',
      },

      // =============================================
      // BACKGROUND GRADIENTS
      // =============================================
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #10b981, #0d9488)',
        'gradient-brand-hover': 'linear-gradient(135deg, #059669, #0f766e)',
        'gradient-dark': 'linear-gradient(135deg, #01110a, #022c22)',
        'gradient-gold': 'linear-gradient(135deg, #B69F60, #C6AF70)',
        'gradient-hero': 'linear-gradient(135deg, rgba(1,17,10,0.8), rgba(2,44,34,0.6))',
      },

      // =============================================
      // SPACING EXTENSIONS
      // =============================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // =============================================
      // Z-INDEX EXTENSIONS
      // =============================================
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // =============================================
      // TRANSITION TIMING
      // =============================================
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // =============================================
      // TRANSITION DURATION
      // =============================================
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
    },
  },
  plugins: [],
};