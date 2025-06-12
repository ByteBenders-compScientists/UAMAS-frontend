// components/Sidebar.tsx
import React, { useState } from 'react';
import { 
  BookMarked, GraduationCap, Monitor, FileText, MessageCircle, BarChart3, 
  User, Settings, Plus, LetterText, ChevronDown, ChevronUp, X 
} from 'lucide-react';
import Link from 'next/link';

// ===== TYPES =====
interface NavigationItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  count?: number;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  path?: string;
}

interface DropdownItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

// ===== Sidebar Component =====
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  isCreateDropdownOpen: boolean;
  onCreateDropdownToggle: () => void;
  onDropdownItemClick: (path: string) => void;
}

const lecturerSidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  navigationItems,
  isCreateDropdownOpen,
  onCreateDropdownToggle,
  onDropdownItemClick
}) => {
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);

  const handleDropdownToggle = (index: number) => {
    setDropdownOpenIndex(dropdownOpenIndex === index ? null : index);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-rose-600 shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-auto lg:shadow-none`}
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between p-6 border-b border-rose-200">
        <div className="flex items-center space-x-2 text-xl font-bold">
          <LetterText className="w-6 h-6 text-rose-600" />
          <span className="text-white">EduPortal</span>
        </div>
        <button 
          className="lg:hidden text-white hover:text-rose-100 transition-colors"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigationItems.map((item, idx) => (
          <div key={item.label}>
            <NavigationItemComponent
              item={item}
              isDropdownOpen={dropdownOpenIndex === idx || (item.label === 'Create' && isCreateDropdownOpen)}
              onDropdownToggle={() => {
                if (item.label === 'Create') {
                  onCreateDropdownToggle();
                } else {
                  handleDropdownToggle(idx);
                }
              }}
              onDropdownItemClick={onDropdownItemClick}
            />
          </div>
        ))}
      </nav>
    </aside>
  );
};

const NavigationItemComponent: React.FC<{
  item: NavigationItem;
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
  onDropdownItemClick: (path: string) => void;
}> = ({ item, isDropdownOpen, onDropdownToggle, onDropdownItemClick }) => {
  if (item.hasDropdown) {
    return (
      <div>
        <button
          onClick={onDropdownToggle}
          className={`w-full flex items-center justify-between space-x-3 p-3 rounded-lg transition-all duration-200 ${
            item.active 
              ? 'bg-white text-rose-500 shadow-sm' 
              : 'hover:bg-rose-300 hover:bg-opacity-50 text-white'
          }`}
          aria-expanded={isDropdownOpen}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          {isDropdownOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {isDropdownOpen && (
          <div className="ml-8 mt-2 space-y-1">
            {item.dropdownItems && item.dropdownItems.map((dropdownItem, index) => (
              <Link
                key={index}
                href={dropdownItem.path}
                className="w-full text-left block p-2 text-sm font-medium rounded-lg hover:bg-rose-300 hover:bg-opacity-50 transition-all duration-200 text-white flex items-center"
                onClick={() => onDropdownItemClick(dropdownItem.path)}
              >
                {dropdownItem.icon && <dropdownItem.icon className="w-4 h-4 mr-2" />}
                {dropdownItem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link 
      href={item.path || "#"} 
      className={`flex items-center justify-between space-x-3 p-3 rounded-lg transition-all duration-200 ${
        item.active 
          ? 'bg-white text-rose-500 shadow-sm' 
          : 'hover:bg-rose-300 hover:bg-opacity-50 text-white'
      }`}
      onClick={() => onDropdownItemClick(item.path || '')}
    >
      <div className="flex items-center space-x-3">
        <item.icon className="w-5 h-5" />
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      {item.count && (
        <span className="bg-white text-rose-500 text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
          {item.count}
        </span>
      )}
    </Link>
  );
};

export default lecturerSidebar;