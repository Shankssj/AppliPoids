export const colors = {
  primary: {
    50: '#F0F7F4',
    100: '#D4EDDA',
    200: '#A8D5BA',
    300: '#7EC8A0',
    400: '#5CB885',
    500: '#3A9D6B',
  },
  secondary: {
    50: '#F0F5FA',
    100: '#D6E4F0',
    200: '#B0CCE0',
    300: '#9BB5E0',
    400: '#7A9DCF',
    500: '#5A7FB5',
  },
  accent: {
    50: '#FDF6EE',
    100: '#F5E6D0',
    200: '#E8CFA8',
    300: '#D4A574',
    400: '#C28B55',
    500: '#A67340',
  },
  life: {
    50: '#FDF0F3',
    100: '#F8D8E0',
    200: '#F0B8C8',
    300: '#E8A0B4',
    400: '#D88498',
    500: '#C06880',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#FDFCF9',
    100: '#F5F0E8',
    200: '#E8E0D4',
    300: '#CFC4B4',
    400: '#A89888',
    500: '#7A6E60',
    600: '#5A5048',
    700: '#3A332C',
  },
  success: '#7EC8A0',
  warning: '#E8C170',
  error: '#D4847A',
  info: '#9BB5E0',
  stat: {
    endurance: '#7EC8A0',
    force: '#D4A574',
    magie: '#9BB5E0',
    vie: '#E8A0B4',
  },
  rarity: {
    common: '#CFC4B4',
    rare: '#9BB5E0',
    epic: '#B89FD6',
    legendary: '#E8C170',
  },
  timeOfDay: {
    morning: ['#FDF0E8', '#F8D8C8', '#F0E0D0'] as const,
    afternoon: ['#F0F5FA', '#D6E4F0', '#E8F0F8'] as const,
    evening: ['#E8E0F0', '#D4C8E8', '#C8B8D8'] as const,
    night: ['#2A2440', '#3A3060', '#4A4080'] as const,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    regular: 'Nunito_400Regular',
    medium: 'Nunito_600SemiBold',
    bold: 'Nunito_700Bold',
    extraBold: 'Nunito_800ExtraBold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    display: 40,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#3A332C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#3A332C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#3A332C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  }),
} as const;
