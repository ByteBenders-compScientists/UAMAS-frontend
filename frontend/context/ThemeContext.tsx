'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  themeService,
  ThemeConfig,
  ThemeColors,
  ColorScheme,
  FontSize,
} from '@/services/themeService';

interface ThemeContextType {
  config: ThemeConfig;
  colors: ThemeColors;
  toggleMode: () => void;
  updateColorScheme: (scheme: ColorScheme) => void;
  updateFontSize: (size: FontSize) => void;
  resetToDefault: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>(() => themeService.getThemeConfig());
  const [colors, setColors] = useState<ThemeColors>(() =>
    themeService.getThemeColors(config.mode, config.colorScheme)
  );
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      const savedConfig = themeService.getThemeConfig();
      setConfig(savedConfig);
      setColors(themeService.getThemeColors(savedConfig.mode, savedConfig.colorScheme));
      themeService.applyTheme(savedConfig);
      setIsLoading(false);
    };

    initializeTheme();
  }, []);

  // Update colors when config changes
  useEffect(() => {
    if (!isLoading) {
      const newColors = themeService.getThemeColors(config.mode, config.colorScheme);
      setColors(newColors);
      themeService.applyTheme(config);
    }
  }, [config, isLoading]);

  const toggleMode = () => {
    const newConfig = themeService.toggleMode();
    setConfig(newConfig);
  };

  const updateColorScheme = (scheme: ColorScheme) => {
    const newConfig = themeService.updateColorScheme(scheme);
    setConfig(newConfig);
  };

  const updateFontSize = (size: FontSize) => {
    const newConfig = themeService.updateFontSize(size);
    setConfig(newConfig);
  };

  const resetToDefault = () => {
    const defaultConfig = themeService.resetToDefault();
    setConfig(defaultConfig);
  };

  const value: ThemeContextType = {
    config,
    colors,
    toggleMode,
    updateColorScheme,
    updateFontSize,
    resetToDefault,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to get current theme colors
 */
export function useThemeColors() {
  const { colors } = useTheme();
  return colors;
}

/**
 * Hook to get current theme config
 */
export function useThemeConfig() {
  const { config } = useTheme();
  return config;
}

/**
 * Hook to get theme mode
 */
export function useThemeMode() {
  const { config, toggleMode } = useTheme();
  return {
    mode: config.mode,
    isDark: config.mode === 'dark',
    toggleMode,
  };
}

/**
 * Hook to get and update color scheme
 */
export function useColorScheme() {
  const { config, updateColorScheme } = useTheme();
  return {
    colorScheme: config.colorScheme,
    updateColorScheme,
  };
}

/**
 * Hook to get and update font size
 */
export function useFontSize() {
  const { config, updateFontSize } = useTheme();
  return {
    fontSize: config.fontSize,
    updateFontSize,
  };
}