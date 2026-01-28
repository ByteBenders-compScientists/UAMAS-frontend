'use client';

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ColorScheme, FontSize } from '@/services/themeService';
import {
  Palette,
  Sun,
  Moon,
  Type,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';

const FloatingThemeButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { config, colors, toggleMode, updateColorScheme, updateFontSize, resetToDefault } = useTheme();

  const colorSchemes: { value: ColorScheme; label: string; color: string; darkColor: string }[] = [
    { value: 'emerald', label: 'Emerald', color: '#10b981', darkColor: '#10b981' },
    { value: 'blue', label: 'Blue', color: '#3b82f6', darkColor: '#3b82f6' },
    { value: 'purple', label: 'Purple', color: '#8b5cf6', darkColor: '#a78bfa' },
    { value: 'orange', label: 'Orange', color: '#f97316', darkColor: '#fb923c' },
    { value: 'rose', label: 'Rose', color: '#f43f5e', darkColor: '#fb7185' },
  ];

  const fontSizes: { value: FontSize; label: string; description: string }[] = [
    { value: 'small', label: 'Small', description: 'Compact' },
    { value: 'medium', label: 'Medium', description: 'Default' },
    { value: 'large', label: 'Large', description: 'Comfortable' },
  ];

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    updateColorScheme(scheme);
  };

  const handleFontSizeChange = (size: FontSize) => {
    updateFontSize(size);
  };

  const handleReset = () => {
    resetToDefault();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="floating-theme-button"
        style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: colors.primary,
          color: '#ffffff',
          border: 'none',
          boxShadow: `0 8px 24px ${colors.primary}40`,
          cursor: 'pointer',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
        title="Customize Theme"
      >
        <Settings size={28} className="rotating-cog" />
      </button>

      {/* Dialog Panel - Slides from Right */}
      {isOpen && (
        <div
          className="fixed right-0 top-0 h-full w-full sm:w-96 animate-slide-in shadow-2xl"
          style={{
            backgroundColor: colors.cardBackground,
            borderLeft: `1px solid ${colors.border}`,
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 sm:p-5"
            style={{
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: colors.backgroundSecondary,
            }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <Palette size={18} style={{ color: colors.primary }} />
              </div>
              <div>
                <h2
                  className="text-base sm:text-lg font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  Customize Theme
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: colors.textSecondary }}
                >
                  Personalize your experience
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: colors.textSecondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.sidebarHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 space-y-5 sm:space-y-6 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
            {/* Theme Mode Section */}
            <div>
              <label
                className="text-sm font-medium mb-3 block"
                style={{ color: colors.textPrimary }}
              >
                Appearance
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={config.mode === 'dark' ? toggleMode : undefined}
                  className="p-3 sm:p-4 rounded-xl transition-all duration-200 border-2"
                  style={{
                    backgroundColor: config.mode === 'light' ? colors.primaryLight : colors.backgroundSecondary,
                    borderColor: config.mode === 'light' ? colors.primary : colors.border,
                    color: colors.textPrimary,
                  }}
                >
                  <Sun
                    size={20}
                    className="mx-auto mb-2"
                    style={{ color: config.mode === 'light' ? colors.primary : colors.textSecondary }}
                  />
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs sm:text-sm font-medium">Light</span>
                    {config.mode === 'light' && (
                      <Check size={14} style={{ color: colors.primary }} />
                    )}
                  </div>
                </button>
                <button
                  onClick={config.mode === 'light' ? toggleMode : undefined}
                  className="p-3 sm:p-4 rounded-xl transition-all duration-200 border-2"
                  style={{
                    backgroundColor: config.mode === 'dark' ? colors.primaryLight : colors.backgroundSecondary,
                    borderColor: config.mode === 'dark' ? colors.primary : colors.border,
                    color: colors.textPrimary,
                  }}
                >
                  <Moon
                    size={20}
                    className="mx-auto mb-2"
                    style={{ color: config.mode === 'dark' ? colors.primary : colors.textSecondary }}
                  />
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs sm:text-sm font-medium">Dark</span>
                    {config.mode === 'dark' && (
                      <Check size={14} style={{ color: colors.primary }} />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Color Scheme Section */}
            <div>
              <label
                className="text-sm font-medium mb-3 block"
                style={{ color: colors.textPrimary }}
              >
                Color Scheme
              </label>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.value}
                    onClick={() => handleColorSchemeChange(scheme.value)}
                    className="relative group"
                    title={scheme.label}
                  >
                    <div
                      className="w-full aspect-square rounded-xl transition-all duration-200 border-2 flex items-center justify-center"
                      style={{
                        backgroundColor: config.mode === 'dark' ? scheme.darkColor : scheme.color,
                        borderColor: config.colorScheme === scheme.value ? colors.textPrimary : 'transparent',
                        opacity: config.colorScheme === scheme.value ? 1 : 0.6,
                      }}
                    >
                      {config.colorScheme === scheme.value && (
                        <Check 
                          size={16} 
                          className="text-white drop-shadow-lg" 
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                        />
                      )}
                    </div>
                    <p 
                      className="text-xs mt-1 text-center truncate"
                      style={{ color: colors.textSecondary }}
                    >
                      {scheme.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Section */}
            <div>
              <label
                className="text-sm font-medium mb-3 block"
                style={{ color: colors.textPrimary }}
              >
                <Type size={16} className="inline mr-2" />
                Font Size
              </label>
              <div className="space-y-2">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => handleFontSizeChange(size.value)}
                    className="w-full p-3 rounded-xl transition-all duration-200 border-2 flex items-center justify-between"
                    style={{
                      backgroundColor: config.fontSize === size.value ? colors.primaryLight : colors.backgroundSecondary,
                      borderColor: config.fontSize === size.value ? colors.primary : colors.border,
                      color: colors.textPrimary,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold"
                        style={{
                          backgroundColor: config.fontSize === size.value ? colors.primary : colors.border,
                          color: config.fontSize === size.value ? '#ffffff' : colors.textSecondary,
                          fontSize: size.value === 'small' ? '12px' : size.value === 'medium' ? '14px' : '16px',
                        }}
                      >
                        A
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{size.label}</p>
                        <p 
                          className="text-xs"
                          style={{ color: colors.textSecondary }}
                        >
                          {size.description}
                        </p>
                      </div>
                    </div>
                    {config.fontSize === size.value && (
                      <Check size={18} style={{ color: colors.primary }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="w-full p-3 rounded-xl transition-all duration-200 border flex items-center justify-center gap-2 font-medium"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.sidebarHover;
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.color = colors.textSecondary;
                }}
              >
                <RotateCcw size={16} />
                <span className="text-sm">Reset to Default</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse-scale {
          0%, 100% {
            transform: translateY(-50%) scale(1);
            box-shadow: 0 8px 24px ${colors.primary}40;
          }
          50% {
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 12px 32px ${colors.primary}60;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .floating-theme-button {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        .floating-theme-button:hover {
          animation: none;
          transform: translateY(-50%) scale(1.15) !important;
          box-shadow: 0 16px 40px ${colors.primary}70 !important;
        }

        .floating-theme-button:active {
          transform: translateY(-50%) scale(1.05) !important;
        }

        .rotating-cog {
          animation: rotate 8s linear infinite !important;
          display: inline-block;
        }

        .floating-theme-button:hover .rotating-cog {
          animation: rotate 1.5s linear infinite !important;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${colors.backgroundSecondary};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${colors.borderLight};
        }

        /* Mobile responsiveness */
        @media (max-width: 640px) {
          .floating-theme-button {
            width: 50px;
            height: 50px;
            right: 15px;
          }

          .rotating-cog {
            width: 24px;
            height: 24px;
          }
        }

        /* Tablet responsiveness */
        @media (min-width: 641px) and (max-width: 1024px) {
          .floating-theme-button {
            width: 55px;
            height: 55px;
            right: 18px;
          }

          .rotating-cog {
            width: 26px;
            height: 26px;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingThemeButton;