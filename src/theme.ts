// Enhanced theme for ChargeGuard with Insights screen support
export const theme = {
  colors: {
    // Core background colors
    background: '#1A1A1A',
    backgroundSecondary: '#121212',
    card: '#1A1A1A',
    
    // Primary charging theme colors
    primary: '#00D4FF',        // Electric blue (matches charging theme)
    primaryDark: '#0099CC',    // Darker variant
    primaryLight: '#33E0FF',   // Lighter variant
    
    // Secondary colors
    secondary: '#FF6B35',      // Warning orange
    accent: '#8A2BE2',         // Purple accent
    
    // Status colors
    success: '#00FF88',
    warning: '#FFD700',
    danger: '#FF4444',
    info: '#00D4FF',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textTertiary: '#999999',
    textMuted: '#666666',
    
    // Surface colors (translucent glass effects)
    surface: 'rgba(255, 255, 255, 0.1)',
    surfaceVariant: 'rgba(255, 255, 255, 0.05)',
    surfaceHighlight: 'rgba(0, 212, 255, 0.1)',
    
    // Border colors
    border: 'rgba(255, 255, 255, 0.12)',
    borderLight: 'rgba(255, 255, 255, 0.08)',
    
    // Glass effect colors
    glass: {
      background: 'rgba(24, 28, 36, 0.45)',
      border: 'rgba(255, 255, 255, 0.12)',
      shadow: '#38bdf8',
    },
    
    // Gradient definitions
    gradients: {
      primary: ['rgba(0, 212, 255, 0.2)', 'rgba(0, 212, 255, 0.05)'],
      secondary: ['rgba(255, 107, 53, 0.2)', 'rgba(255, 107, 53, 0.05)'],
      danger: ['rgba(255, 68, 68, 0.2)', 'rgba(255, 107, 53, 0.2)'],
      card: ['rgba(0, 212, 255, 0.1)', 'rgba(255, 107, 53, 0.1)'],
      background: ['#1A1A1A', '#2A2A2A'],
    },
    
    // Impact level colors
    impact: {
      low: '#00FF88',
      medium: '#FFD700', 
      high: '#FF4444',
    },
    
    // App category colors
    category: {
      user: '#00D4FF',
      system: '#8A2BE2',
    },
  },
  
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
    xxl: 48,
  },
  
  typography: {
    // Titles
    title: {
      fontSize: 32,
      fontWeight: 'bold' as 'bold',
      color: '#FFFFFF',
      lineHeight: 38,
    },
    
    // Headers
    h1: {
      fontSize: 28,
      fontWeight: '700' as '700',
      color: '#FFFFFF',
      lineHeight: 34,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as '700',
      color: '#FFFFFF',
      lineHeight: 30,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as '600',
      color: '#FFFFFF',
      lineHeight: 26,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as '600',
      color: '#FFFFFF',
      lineHeight: 24,
    },
    
    // Subtitles
    subtitle: {
      fontSize: 20,
      fontWeight: '600' as '600',
      color: '#E0E0E0',
      lineHeight: 26,
    },
    subtitle2: {
      fontSize: 16,
      fontWeight: '600' as '600',
      color: '#B3B3B3',
      lineHeight: 22,
    },
    
    // Body text
    body1: {
      fontSize: 16,
      fontWeight: '400' as '400',
      color: '#B3B3B3',
      lineHeight: 22,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400' as '400',
      color: '#999999',
      lineHeight: 20,
    },
    
    // Captions and small text
    caption: {
      fontSize: 12,
      fontWeight: '400' as '400',
      color: '#666666',
      lineHeight: 16,
    },
    overline: {
      fontSize: 10,
      fontWeight: '600' as '600',
      color: '#666666',
      lineHeight: 14,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as 'uppercase',
    },
    
    // Button text
    button: {
      fontSize: 14,
      fontWeight: '600' as '600',
      color: '#FFFFFF',
      lineHeight: 20,
    },
  },
  
  // Component-specific styles
  components: {
    glassCard: {
      backgroundColor: 'rgba(24, 28, 36, 0.45)',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.12)',
      shadowColor: '#38bdf8',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
    },
    
    searchBar: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    
    button: {
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    
    tag: {
      borderRadius: 10,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
  },
  
  // Animation configurations
  animations: {
    timing: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeInOut: 'ease-in-out',
      easeOut: 'ease-out',
      easeIn: 'ease-in',
    },
  },
  
  // Layout configurations
  layout: {
    headerHeight: 60,
    tabBarHeight: 80,
    cardSpacing: 12,
    sectionSpacing: 24,
  },
};