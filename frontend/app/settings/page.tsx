'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useTheme } from '@/context/ThemeContext';
import { ColorScheme, FontSize } from '@/services/themeService';
import { Sun, Moon, Check, RotateCcw, Sparkles } from 'lucide-react';

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
    <div className={`flex h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <Sidebar />
      
      <motion.div 
        initial={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        animate={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto"
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
                <Sparkles className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Appearance
                </h1>
              </div>
              <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                    isDark 
                      ? 'bg-emerald-500/10 border border-emerald-500/20' 
                      : 'bg-emerald-50 border border-emerald-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                  }`}>
                    <Check className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <span className={`font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
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
              className={`rounded-2xl p-6 mb-6 border ${
                isDark 
                  ? 'bg-slate-900 border-slate-800' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Theme Mode
              </h2>
              
              <button
                onClick={handleModeToggle}
                className={`group relative w-full sm:w-auto px-8 py-4 rounded-xl font-medium transition-all duration-300 overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white'
                    : 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 group-hover:via-emerald-500/20 transition-all duration-300" />
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
              className={`rounded-2xl p-6 mb-6 border ${
                isDark 
                  ? 'bg-slate-900 border-slate-800' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
                    className={`relative p-5 rounded-xl transition-all duration-300 text-left group ${
                      config.colorScheme === option.value
                        ? isDark
                          ? 'bg-slate-800 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                          : 'bg-gray-50 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : isDark
                          ? 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Gradient Preview */}
                    <div className={`h-20 rounded-lg bg-gradient-to-br ${option.gradient} mb-4 shadow-md transform group-hover:scale-105 transition-transform duration-300`} />
                    
                    {/* Content */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {option.label}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {option.description}
                        </p>
                      </div>
                      {config.colorScheme === option.value && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
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
              className={`rounded-2xl p-6 mb-6 border ${
                isDark 
                  ? 'bg-slate-900 border-slate-800' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
                    className={`relative p-5 rounded-xl transition-all duration-300 group ${
                      config.fontSize === option.value
                        ? isDark
                          ? 'bg-slate-800 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                          : 'bg-gray-50 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : isDark
                          ? 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className={`font-semibold ${
                        option.value === 'small' ? 'text-sm' : 
                        option.value === 'medium' ? 'text-base' : 
                        'text-lg'
                      } ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Aa
                      </span>
                      <div className="text-center">
                        <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {option.label}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {option.description}
                        </div>
                      </div>
                      {config.fontSize === option.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
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
              className={`rounded-2xl p-6 mb-6 border ${
                isDark 
                  ? 'bg-slate-900 border-slate-800' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Preview
              </h2>
              
              <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${
                  colorSchemeOptions.find(c => c.value === config.colorScheme)?.gradient
                } bg-clip-text text-transparent`}>
                  Sample Heading
                </h3>
                <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  This is how your text will appear with the current settings. The quick brown fox jumps over the lazy dog.
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Secondary text for additional information and context.
                </p>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-emerald-500/25">
                    Primary
                  </button>
                  <button className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}>
                    Secondary
                  </button>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium transition-all duration-300">
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
              className={`rounded-2xl p-6 border ${
                isDark 
                  ? 'bg-slate-900 border-slate-800' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Reset Settings
              </h2>
              <p className={`mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Reset to default: Light mode, Emerald theme, Medium font size
              </p>
              
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Default
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-red-500/25"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                    }`}
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
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Your preferences are saved automatically and persist across sessions
              </p>
            </motion.div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}