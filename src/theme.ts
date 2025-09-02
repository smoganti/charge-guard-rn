const colors = {
  background: '#121212',
  card: '#1F2937',
  primary: '#3949ab',
  secondary: '#03DAC6',
  success: '#00695c',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#FFFFFF',
  textSecondary: '#A0AEC0',
  border: 'rgba(255, 255, 255, 0.2)',
};

const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold' as 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600' as '600',
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.textSecondary,
  },
};

export const theme = {
  colors,
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  typography,
};