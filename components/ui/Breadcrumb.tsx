import React, { Fragment } from 'react';
import { ArrowRight } from 'lucide-react';
import { useThemeColors } from '@/context/ThemeContext';

interface BreadcrumbItem {
  label: string;
  icon?: React.ElementType;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const colors = useThemeColors();

  return (
    <nav className="hidden sm:flex items-center text-sm py-2 mb-4">
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <ArrowRight 
              className="w-3 h-3 mx-2" 
              style={{ color: colors.textTertiary }}
            />
          )}
          <div 
            className={`flex items-center ${index === items.length - 1 ? 'font-semibold' : 'hover:text-primary'}`}
            style={{
              color: index === items.length - 1 ? colors.primary : colors.textSecondary
            }}
          >
            {item.icon && (
              <item.icon 
                className="w-4 h-4 mr-1.5" 
                style={{ color: index === items.length - 1 ? colors.primary : colors.textSecondary }}
              />
            )}
            <span>{item.label}</span>
          </div>
        </Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;