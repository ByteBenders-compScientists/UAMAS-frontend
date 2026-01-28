'use client';

import React, { useState } from 'react';
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

interface ThemeCustomizerProps {
  isCollapsed?: boolean;
  isMobileView?: boolean;
  isTabletView?: boolean;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ 
  isCollapsed = false,
  isMobileView = false,
  isTabletView = false
}) => {
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
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center px-3 py-2.5 my-1 rounded-xl text-sm transition-all duration-200
          ${isCollapsed && !isMobileView && !isTabletView ? 'justify-center' : ''}
        `}
        style={{
          backgroundColor: isOpen ? colors.sidebarActive : 'transparent',
          color: isOpen ? colors.primary : colors.textSecondary,
          border: `1px solid ${isOpen ? colors.primary : 'transparent'}`,
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = colors.sidebarHover;
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        title="Customize Theme"
      >
        <div style={{ color: isOpen ? colors.primary : colors.textTertiary }}>
          <Palette size={20} />
        </div>
        {(!isCollapsed || isMobileView || isTabletView) && (
          <span className="ml-3">Customize</span>
        )}
      </button>

      {/* Dialog Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Dialog Content */}
          <div
            className="rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden animate-scale-in"
            style={{
              backgroundColor: colors.cardBackground,
              border: `1px solid ${colors.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
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
            <div className="p-4 sm:p-5 space-y-5 sm:space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
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
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
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
      `}</style>
    </>
  );
};

export default ThemeCustomizer;