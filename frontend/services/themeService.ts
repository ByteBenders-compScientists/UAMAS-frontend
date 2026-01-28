// Theme Service - Manages theme colors and preferences
export type ThemeMode = 'light' | 'dark';
export type ColorScheme = 'emerald' | 'blue' | 'purple' | 'orange' | 'rose';
export type FontSize = 'small' | 'medium' | 'large';

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryHover: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Accent colors
  accent: string;
  accentHover: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  
  // Border colors
  border: string;
  borderLight: string;
  borderDark: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Card and surface colors
  cardBackground: string;
  cardHover: string;
  
  // Sidebar colors
  sidebarBackground: string;
  sidebarHover: string;
  sidebarActive: string;
  
  // Input colors
  inputBackground: string;
  inputBorder: string;
  inputFocus: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  fontSize: FontSize;
}

// Color schemes for light mode
const lightColorSchemes: Record<ColorScheme, ThemeColors> = {
  emerald: {
    primary: '#10b981',
    primaryHover: '#059669',
    primaryLight: '#d1fae5',
    primaryDark: '#047857',
    
    secondary: '#10b981',
    secondaryHover: '#059669',
    secondaryLight: '#d1fae5',
    secondaryDark: '#047857',
    
    accent: '#10b981',
    accentHover: '#059669',
    
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    backgroundTertiary: '#f3f4f6',
    
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    borderDark: '#d1d5db',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    cardBackground: '#ffffff',
    cardHover: '#f9fafb',
    
    sidebarBackground: '#ffffff',
    sidebarHover: '#f3f4f6',
    sidebarActive: '#d1fae5',
    
    inputBackground: '#ffffff',
    inputBorder: '#d1d5db',
    inputFocus: '#10b981',
  },
  
  blue: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryLight: '#dbeafe',
    primaryDark: '#1d4ed8',
    
    secondary: '#3b82f6',
    secondaryHover: '#2563eb',
    secondaryLight: '#dbeafe',
    secondaryDark: '#1d4ed8',
    
    accent: '#3b82f6',
    accentHover: '#2563eb',
    
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    backgroundTertiary: '#f3f4f6',
    
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    borderDark: '#d1d5db',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    cardBackground: '#ffffff',
    cardHover: '#f9fafb',
    
    sidebarBackground: '#ffffff',
    sidebarHover: '#f3f4f6',
    sidebarActive: '#dbeafe',
    
    inputBackground: '#ffffff',
    inputBorder: '#d1d5db',
    inputFocus: '#3b82f6',
  },
  
  purple: {
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    primaryLight: '#ede9fe',
    primaryDark: '#6d28d9',
    
    secondary: '#8b5cf6',
    secondaryHover: '#7c3aed',
    secondaryLight: '#ede9fe',
    secondaryDark: '#6d28d9',
    
    accent: '#8b5cf6',
    accentHover: '#7c3aed',
    
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    backgroundTertiary: '#f3f4f6',
    
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    borderDark: '#d1d5db',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    cardBackground: '#ffffff',
    cardHover: '#f9fafb',
    
    sidebarBackground: '#ffffff',
    sidebarHover: '#f3f4f6',
    sidebarActive: '#ede9fe',
    
    inputBackground: '#ffffff',
    inputBorder: '#d1d5db',
    inputFocus: '#8b5cf6',
  },
  
  orange: {
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryLight: '#ffedd5',
    primaryDark: '#c2410c',
    
    secondary: '#f97316',
    secondaryHover: '#ea580c',
    secondaryLight: '#ffedd5',
    secondaryDark: '#c2410c',
    
    accent: '#f97316',
    accentHover: '#ea580c',
    
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    backgroundTertiary: '#f3f4f6',
    
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    borderDark: '#d1d5db',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    cardBackground: '#ffffff',
    cardHover: '#f9fafb',
    
    sidebarBackground: '#ffffff',
    sidebarHover: '#f3f4f6',
    sidebarActive: '#ffedd5',
    
    inputBackground: '#ffffff',
    inputBorder: '#d1d5db',
    inputFocus: '#f97316',
  },
  
  rose: {
    primary: '#f43f5e',
    primaryHover: '#e11d48',
    primaryLight: '#ffe4e6',
    primaryDark: '#be123c',
    
    secondary: '#f43f5e',
    secondaryHover: '#e11d48',
    secondaryLight: '#ffe4e6',
    secondaryDark: '#be123c',
    
    accent: '#f43f5e',
    accentHover: '#e11d48',
    
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    backgroundTertiary: '#f3f4f6',
    
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    borderDark: '#d1d5db',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    cardBackground: '#ffffff',
    cardHover: '#f9fafb',
    
    sidebarBackground: '#ffffff',
    sidebarHover: '#f3f4f6',
    sidebarActive: '#ffe4e6',
    
    inputBackground: '#ffffff',
    inputBorder: '#d1d5db',
    inputFocus: '#f43f5e',
  },
};

// Color schemes for dark mode - PURE BLACK (AMOLED)
const darkColorSchemes: Record<ColorScheme, ThemeColors> = {
  emerald: {
    primary: '#10b981',
    primaryHover: '#34d399',
    primaryLight: '#10b981',
    primaryDark: '#059669',
    
    secondary: '#10b981',
    secondaryHover: '#34d399',
    secondaryLight: '#10b981',
    secondaryDark: '#059669',
    
    accent: '#10b981',
    accentHover: '#34d399',
    
    background: '#000000',
    backgroundSecondary: '#0f0f0f',
    backgroundTertiary: '#1a1a1a',
    
    textPrimary: '#ffffff',
    textSecondary: '#a3a3a3',
    textTertiary: '#737373',
    
    border: '#262626',
    borderLight: '#333333',
    borderDark: '#171717',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#10b981',
    
    cardBackground: '#0f0f0f',
    cardHover: '#1a1a1a',
    
    sidebarBackground: '#000000',
    sidebarHover: '#1a1a1a',
    sidebarActive: '#064e3b',
    
    inputBackground: '#0f0f0f',
    inputBorder: '#262626',
    inputFocus: '#10b981',
  },
  
  blue: {
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    primaryLight: '#3b82f6',
    primaryDark: '#2563eb',
    
    secondary: '#3b82f6',
    secondaryHover: '#60a5fa',
    secondaryLight: '#3b82f6',
    secondaryDark: '#2563eb',
    
    accent: '#3b82f6',
    accentHover: '#60a5fa',
    
    background: '#000000',
    backgroundSecondary: '#0f0f0f',
    backgroundTertiary: '#1a1a1a',
    
    textPrimary: '#ffffff',
    textSecondary: '#a3a3a3',
    textTertiary: '#737373',
    
    border: '#262626',
    borderLight: '#333333',
    borderDark: '#171717',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    cardBackground: '#0f0f0f',
    cardHover: '#1a1a1a',
    
    sidebarBackground: '#000000',
    sidebarHover: '#1a1a1a',
    sidebarActive: '#1e3a8a',
    
    inputBackground: '#0f0f0f',
    inputBorder: '#262626',
    inputFocus: '#3b82f6',
  },
  
  purple: {
    primary: '#a78bfa',
    primaryHover: '#c4b5fd',
    primaryLight: '#a78bfa',
    primaryDark: '#8b5cf6',
    
    secondary: '#a78bfa',
    secondaryHover: '#c4b5fd',
    secondaryLight: '#a78bfa',
    secondaryDark: '#8b5cf6',
    
    accent: '#a78bfa',
    accentHover: '#c4b5fd',
    
    background: '#000000',
    backgroundSecondary: '#0f0f0f',
    backgroundTertiary: '#1a1a1a',
    
    textPrimary: '#ffffff',
    textSecondary: '#a3a3a3',
    textTertiary: '#737373',
    
    border: '#262626',
    borderLight: '#333333',
    borderDark: '#171717',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    cardBackground: '#0f0f0f',
    cardHover: '#1a1a1a',
    
    sidebarBackground: '#000000',
    sidebarHover: '#1a1a1a',
    sidebarActive: '#2e1065',
    
    inputBackground: '#0f0f0f',
    inputBorder: '#262626',
    inputFocus: '#a78bfa',
  },
  
  orange: {
    primary: '#fb923c',
    primaryHover: '#fdba74',
    primaryLight: '#fb923c',
    primaryDark: '#f97316',
    
    secondary: '#fb923c',
    secondaryHover: '#fdba74',
    secondaryLight: '#fb923c',
    secondaryDark: '#f97316',
    
    accent: '#fb923c',
    accentHover: '#fdba74',
    
    background: '#000000',
    backgroundSecondary: '#0f0f0f',
    backgroundTertiary: '#1a1a1a',
    
    textPrimary: '#ffffff',
    textSecondary: '#a3a3a3',
    textTertiary: '#737373',
    
    border: '#262626',
    borderLight: '#333333',
    borderDark: '#171717',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    cardBackground: '#0f0f0f',
    cardHover: '#1a1a1a',
    
    sidebarBackground: '#000000',
    sidebarHover: '#1a1a1a',
    sidebarActive: '#431407',
    
    inputBackground: '#0f0f0f',
    inputBorder: '#262626',
    inputFocus: '#fb923c',
  },
  
  rose: {
    primary: '#fb7185',
    primaryHover: '#fda4af',
    primaryLight: '#fb7185',
    primaryDark: '#f43f5e',
    
    secondary: '#fb7185',
    secondaryHover: '#fda4af',
    secondaryLight: '#fb7185',
    secondaryDark: '#f43f5e',
    
    accent: '#fb7185',
    accentHover: '#fda4af',
    
    background: '#000000',
    backgroundSecondary: '#0f0f0f',
    backgroundTertiary: '#1a1a1a',
    
    textPrimary: '#ffffff',
    textSecondary: '#a3a3a3',
    textTertiary: '#737373',
    
    border: '#262626',
    borderLight: '#333333',
    borderDark: '#171717',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    cardBackground: '#0f0f0f',
    cardHover: '#1a1a1a',
    
    sidebarBackground: '#000000',
    sidebarHover: '#1a1a1a',
    sidebarActive: '#4c0519',
    
    inputBackground: '#0f0f0f',
    inputBorder: '#262626',
    inputFocus: '#fb7185',
  },
};

// Font size configurations
const fontSizeConfig = {
  small: {
    base: '14px',
    sm: '12px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '30px',
  },
  medium: {
    base: '16px',
    sm: '14px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '36px',
  },
  large: {
    base: '18px',
    sm: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '28px',
    '3xl': '32px',
    '4xl': '40px',
  },
};

class ThemeService {
  private static instance: ThemeService;
  private readonly STORAGE_KEY = 'uamas_theme_config';

  private constructor() {}

  static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  /**
   * Get the current theme configuration from localStorage
   */
  getThemeConfig(): ThemeConfig {
    if (typeof window === 'undefined') {
      return this.getDefaultConfig();
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading theme config:', error);
    }

    return this.getDefaultConfig();
  }

  /**
   * Save theme configuration to localStorage
   */
  saveThemeConfig(config: ThemeConfig): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      this.applyTheme(config);
    } catch (error) {
      console.error('Error saving theme config:', error);
    }
  }

  /**
   * Get default theme configuration
   */
  private getDefaultConfig(): ThemeConfig {
    return {
      mode: 'light',
      colorScheme: 'emerald',
      fontSize: 'medium',
    };
  }

  /**
   * Get colors for current theme configuration
   */
  getThemeColors(mode: ThemeMode, colorScheme: ColorScheme): ThemeColors {
    const schemes = mode === 'light' ? lightColorSchemes : darkColorSchemes;
    return schemes[colorScheme];
  }

  /**
   * Get font sizes for current configuration
   */
  getFontSizes(fontSize: FontSize) {
    return fontSizeConfig[fontSize];
  }

  /**
   * Apply theme to document
   */
  applyTheme(config: ThemeConfig): void {
    if (typeof window === 'undefined') return;

    const colors = this.getThemeColors(config.mode, config.colorScheme);
    const fontSizes = this.getFontSizes(config.fontSize);

    // Apply CSS variables to root
    const root = document.documentElement;

    // Apply color variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${this.camelToKebab(key)}`, value);
    });

    // Apply font size variables
    Object.entries(fontSizes).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });

    // Apply dark mode class
    if (config.mode === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }

    // Set base font size
    root.style.fontSize = fontSizes.base;
  }

  /**
   * Convert camelCase to kebab-case
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Toggle between light and dark mode
   */
  toggleMode(): ThemeConfig {
    const config = this.getThemeConfig();
    const newConfig = {
      ...config,
      mode: config.mode === 'light' ? 'dark' as ThemeMode : 'light' as ThemeMode,
    };
    this.saveThemeConfig(newConfig);
    return newConfig;
  }

  /**
   * Update color scheme
   */
  updateColorScheme(colorScheme: ColorScheme): ThemeConfig {
    const config = this.getThemeConfig();
    const newConfig = { ...config, colorScheme };
    this.saveThemeConfig(newConfig);
    return newConfig;
  }

  /**
   * Update font size
   */
  updateFontSize(fontSize: FontSize): ThemeConfig {
    const config = this.getThemeConfig();
    const newConfig = { ...config, fontSize };
    this.saveThemeConfig(newConfig);
    return newConfig;
  }

  /**
   * Reset to default theme
   */
  resetToDefault(): ThemeConfig {
    const defaultConfig = this.getDefaultConfig();
    this.saveThemeConfig(defaultConfig);
    return defaultConfig;
  }
}

export const themeService = ThemeService.getInstance();