export const getColors = (theme) => {
  const isDark = theme === 'dark';
  return {
    bgPrimary: isDark ? '#090d16' : '#f8fafc',
    bgSecondary: isDark ? '#111827' : '#ffffff',
    bgTertiary: isDark ? '#1f2937' : '#f1f5f9',
    textPrimary: isDark ? '#f9fafb' : '#0f172a',
    textSecondary: isDark ? '#d1d5db' : '#475569',
    textMuted: isDark ? '#6b7280' : '#94a3b8',
    borderColor: isDark ? '#374151' : '#e2e8f0',
    accent: isDark ? '#818cf8' : '#6366f1',
    accentHover: isDark ? '#6366f1' : '#4f46e5',
    accentLight: isDark ? '#312e81' : '#e0e7ff',
    success: isDark ? '#34d399' : '#10b981',
    successLight: isDark ? '#064e3b' : '#d1fae5',
    warning: isDark ? '#fbbf24' : '#f59e0b',
    warningLight: isDark ? '#78350f' : '#fef3c7',
    danger: isDark ? '#f87171' : '#ef4444',
    dangerLight: isDark ? '#7f1d1d' : '#fee2e2',
  };
};

export const commonStyles = {
  fontHeading: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontBody: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};
