'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface LayoutContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  isMobileView: boolean;
  isTabletView: boolean;
}

const LayoutContext = createContext<LayoutContextType>({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  isMobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  isMobileView: false,
  isTabletView: false,
});

export const useLayout = () => useContext(LayoutContext);

interface LayoutControllerProps {
  children: ReactNode;
}

export const LayoutController = ({ children }: LayoutControllerProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTabletView, setIsTabletView] = useState(false);
  const pathname = usePathname();

  // Handle responsive views
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobileView(width < 640);
      setIsTabletView(width >= 640 && width < 1024);
      
      // Auto-collapse sidebar on tablet
      if (width >= 640 && width < 1024) {
        setSidebarCollapsed(true);
      }
    };

    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <LayoutContext.Provider 
      value={{ 
        sidebarCollapsed, 
        setSidebarCollapsed, 
        isMobileMenuOpen, 
        setMobileMenuOpen,
        isMobileView,
        isTabletView,
      }}
    >
      {children}
      
      {/* Global styles for z-index hierarchy */}
      <style jsx global>{`
        /* Ensure proper z-index stacking for layout elements */
        
        /* Sidebar and its tooltips should be above main content */
        .sidebar-container {
          z-index: 50 !important;
        }
        
        /* Tooltips should be at the very top */
        .sidebar-tooltip {
          z-index: 9999 !important;
        }
        
        /* Main content should be below sidebar */
        .main-content {
          z-index: 10 !important;
        }
        
        /* Modals and overlays */
        .modal-overlay {
          z-index: 100 !important;
        }
        
        .modal-content {
          z-index: 101 !important;
        }
      `}</style>
    </LayoutContext.Provider>
  );
};

export default LayoutController;