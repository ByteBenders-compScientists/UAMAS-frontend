import React, { Fragment } from 'react';
import { ArrowRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  icon?: React.ElementType;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="hidden sm:flex items-center text-sm py-2 mb-4">
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <ArrowRight className="w-3 h-3 mx-2 text-gray-400" />
          )}
          <div className={`flex items-center ${
            index === items.length - 1 
              ? 'text-emerald-600 font-semibold' 
              : 'text-gray-600 hover:text-emerald-600'
          }`}>
            {item.icon && <item.icon className="w-4 h-4 mr-1.5" />}
            <span>{item.label}</span>
          </div>
        </Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;