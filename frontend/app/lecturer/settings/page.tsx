'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/lecturerSidebar';
import Header from '@/components/Header';
import { useTheme, useThemeColors } from '@/context/ThemeContext';
import { ColorScheme, FontSize } from '@/services/themeService';
import { Sun, Moon, Check, RotateCcw, PaletteIcon } from 'lucide-react';

interface ColorSchemeOption {
  value: ColorScheme;
  label: string;
  description: string;
  gradient: string;
}

const colorSchemeOptions: ColorSchemeOption[] = [
  {
    value: 'emerald',
    label: 'Emerald',
    description: 'Fresh and educational',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    value: 'blue',
    label: 'Ocean Blue',
    description: 'Professional and calming',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    value: 'purple',
    label: 'Royal Purple',
    description: 'Creative and inspiring',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    value: 'orange',
    label: 'Warm Orange',
    description: 'Energetic and motivating',
    gradient: 'from-orange-400 to-amber-500',
  },
  {
    value: 'rose',
    label: 'Rose Pink',
    description: 'Modern and friendly',
    gradient: 'from-rose-400 to-pink-500',
  },
];

const fontSizeOptions = [
  { value: 'small' as FontSize, label: 'Small', description: 'Compact' },
  { value: 'medium' as FontSize, label: 'Medium', description: 'Default' },
  { value: 'large' as FontSize, label: 'Large', description: 'Comfortable' },
];

export default function SettingsPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const { config, toggleMode, updateColorScheme, updateFontSize, resetToDefault } = useTheme();
  const colors = useThemeColors();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const isDark = config.mode === 'dark';

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    updateColorScheme(scheme);
    showSaveMessage('Color scheme updated');
  };

  const handleFontSizeChange = (size: FontSize) => {
    updateFontSize(size);
    showSaveMessage('Font size updated');
  };

  const handleModeToggle = () => {
    toggleMode();
    showSaveMessage(`Switched to ${isDark ? 'light' : 'dark'} mode`);
  };

  const handleReset = () => {
    resetToDefault();
    setShowResetConfirm(false);
    showSaveMessage('Settings reset to default');
  };

  const showSaveMessage = (message: string) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(''), 2500);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      backgroundColor: colors.background 
    }}>
      <Sidebar />
      
      <motion.div 
        initial={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        animate={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        transition={{ duration: 0.3 }}
        style={{ flex: 1, overflow: 'auto' }}
      >
        <Header title="Settings" showWeekSelector={false} />
        
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <PaletteIcon style={{ color: colors.primary }} className="w-6 h-6" />
                <h1 style={{ color: colors.textPrimary }} className="text-3xl font-bold">
                  Appearance
                </h1>
              </div>
              <p style={{ color: colors.textSecondary }} className="text-base">
                Customize your experience with themes and preferences
              </p>
            </motion.div>

            {/* Save Message */}
            <AnimatePresence>
              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    backgroundColor: isDark ? `${colors.primary}20` : `${colors.primaryLight}`,
                    borderColor: isDark ? `${colors.primary}40` : colors.primary,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                  className="mb-6 p-4 rounded-xl flex items-center gap-3"
                >
                  <div 
                    style={{
                      backgroundColor: isDark ? `${colors.primary}30` : colors.primaryLight,
                    }}
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    <Check style={{ color: colors.primary }} className="w-3 h-3" />
                  </div>
                  <span style={{ color: colors.primary }} className="font-medium">
                    {saveMessage}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Theme Mode Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
              className="rounded-2xl p-6 mb-6"
            >
              <h2 style={{ color: colors.textPrimary }} className="text-lg font-semibold mb-4">
                Theme Mode
              </h2>
              
              <button
                onClick={handleModeToggle}
                style={{
                  backgroundColor: colors.cardHover,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                className="group relative w-full sm:w-auto px-8 py-4 rounded-xl font-medium transition-all duration-300 overflow-hidden hover:scale-105"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
                  e.currentTarget.style.borderColor = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.cardHover;
                  e.currentTarget.style.borderColor = colors.border;
                }}
              >
                <div className="relative flex items-center justify-center gap-3">
                  {isDark ? (
                    <>
                      <Sun className="w-5 h-5" />
                      <span>Switch to Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5" />
                      <span>Switch to Dark Mode</span>
                    </>
                  )}
                </div>
              </button>
            </motion.div>

            {/* Color Scheme Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
              className="rounded-2xl p-6 mb-6"
            >
              <h2 style={{ color: colors.textPrimary }} className="text-lg font-semibold mb-4">
                Color Scheme
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {colorSchemeOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    onClick={() => handleColorSchemeChange(option.value)}
                    style={{
                      backgroundColor: config.colorScheme === option.value 
                        ? colors.cardHover 
                        : colors.cardBackground,
                      borderColor: config.colorScheme === option.value 
                        ? colors.primary 
                        : colors.border,
                      borderWidth: '2px',
                      borderStyle: 'solid'
                    }}
                    className="relative p-5 rounded-xl transition-all duration-300 text-left group"
                    onMouseEnter={(e) => {
                      if (config.colorScheme !== option.value) {
                        e.currentTarget.style.borderColor = colors.borderLight;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (config.colorScheme !== option.value) {
                        e.currentTarget.style.borderColor = colors.border;
                      }
                    }}
                  >
                    {/* Gradient Preview */}
                    <div className={`h-20 rounded-lg bg-gradient-to-br ${option.gradient} mb-4 shadow-md transform group-hover:scale-105 transition-transform duration-300`} />
                    
                    {/* Content */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 style={{ color: colors.textPrimary }} className="font-semibold">
                          {option.label}
                        </h3>
                        <p style={{ color: colors.textSecondary }} className="text-sm">
                          {option.description}
                        </p>
                      </div>
                      {config.colorScheme === option.value && (
                        <div 
                          style={{ backgroundColor: colors.primary }}
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Font Size Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
              className="rounded-2xl p-6 mb-6"
            >
              <h2 style={{ color: colors.textPrimary }} className="text-lg font-semibold mb-4">
                Font Size
              </h2>
              
              <div className="grid grid-cols-3 gap-4">
                {fontSizeOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    onClick={() => handleFontSizeChange(option.value)}
                    style={{
                      backgroundColor: config.fontSize === option.value 
                        ? colors.cardHover 
                        : colors.cardBackground,
                      borderColor: config.fontSize === option.value 
                        ? colors.primary 
                        : colors.border,
                      borderWidth: '2px',
                      borderStyle: 'solid'
                    }}
                    className="relative p-5 rounded-xl transition-all duration-300 group"
                    onMouseEnter={(e) => {
                      if (config.fontSize !== option.value) {
                        e.currentTarget.style.borderColor = colors.borderLight;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (config.fontSize !== option.value) {
                        e.currentTarget.style.borderColor = colors.border;
                      }
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span 
                        style={{ color: colors.textPrimary }}
                        className={`font-semibold ${
                          option.value === 'small' ? 'text-sm' : 
                          option.value === 'medium' ? 'text-base' : 
                          'text-lg'
                        }`}
                      >
                        Aa
                      </span>
                      <div className="text-center">
                        <div style={{ color: colors.textPrimary }} className="font-medium text-sm">
                          {option.label}
                        </div>
                        <div style={{ color: colors.textSecondary }} className="text-xs">
                          {option.description}
                        </div>
                      </div>
                      {config.fontSize === option.value && (
                        <div 
                          style={{ backgroundColor: colors.primary }}
                          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
              className="rounded-2xl p-6 mb-6"
            >
              <h2 style={{ color: colors.textPrimary }} className="text-lg font-semibold mb-4">
                Preview
              </h2>
              
              <div 
                style={{ backgroundColor: colors.backgroundSecondary }}
                className="p-6 rounded-xl"
              >
                <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${
                  colorSchemeOptions.find(c => c.value === config.colorScheme)?.gradient
                } bg-clip-text text-transparent`}>
                  Sample Heading
                </h3>
                <p style={{ color: colors.textPrimary }} className="mb-3">
                  This is how your text will appear with the current settings. The quick brown fox jumps over the lazy dog.
                </p>
                <p style={{ color: colors.textSecondary }} className="text-sm">
                  Secondary text for additional information and context.
                </p>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <button 
                    style={{
                      backgroundColor: colors.primary,
                      color: '#ffffff'
                    }}
                    className="px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primaryHover;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Primary
                  </button>
                  <button 
                    style={{
                      backgroundColor: colors.cardHover,
                      color: colors.textPrimary,
                      borderColor: colors.border,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                    className="px-6 py-2.5 rounded-lg font-medium transition-all duration-300"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.cardHover;
                    }}
                  >
                    Secondary
                  </button>
                  <button 
                    style={{
                      backgroundColor: colors.info,
                      color: '#ffffff'
                    }}
                    className="px-6 py-2.5 rounded-lg font-medium transition-all duration-300"
                  >
                    Info
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Reset Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
              className="rounded-2xl p-6"
            >
              <h2 style={{ color: colors.textPrimary }} className="text-lg font-semibold mb-2">
                Reset Settings
              </h2>
              <p style={{ color: colors.textSecondary }} className="mb-4 text-sm">
                Reset to default: Light mode, Emerald theme, Medium font size
              </p>
              
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  style={{
                    backgroundColor: colors.cardHover,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.cardHover;
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Default
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    style={{
                      backgroundColor: colors.error,
                      color: '#ffffff'
                    }}
                    className="px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    style={{
                      backgroundColor: colors.cardHover,
                      color: colors.textPrimary,
                      borderColor: colors.border,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                    className="px-6 py-2.5 rounded-lg font-medium transition-all duration-300"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.backgroundTertiary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.cardHover;
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <p style={{ color: colors.textTertiary }} className="text-sm">
                Your preferences are saved automatically and persist across sessions
              </p>
            </motion.div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}