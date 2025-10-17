export const theme = {
  colors: {
    // Dark theme base colors
    background: '#000000',
    surface: '#121212',
    elevation1: '#1E1E1E',
    elevation2: '#222222',
    elevation3: '#282828',
    card: '#1A1A1A',
    
    // Primary colors
    primary: '#4F46E5',
    primaryVariant: '#6366F1',
    secondary: '#10B981',
    
    // Accent colors
    accent1: '#3B82F6',
    accent2: '#8B5CF6',
    
    // Status colors
    success: '#059669',
    warning: '#D97706', 
    danger: '#DC2626',
    
    // Text colors
    text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
    border: 'rgba(255, 255, 255, 0.1)',
    gradientStart: '#1F2937', // For card backgrounds
    gradientEnd: '#121212',   // For card backgrounds
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  typography: {
    title: {
      fontSize: 32, // Larger title
      fontWeight: 'bold' as 'bold',
      color: '#FFFFFF',
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600' as '600',
      color: '#E0E0E0',
    },
    body: {
      fontSize: 16,
      color: '#A0AEC0',
    },
  },
};