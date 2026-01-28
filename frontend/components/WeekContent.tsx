'use client';

import { File, Video, Link as LinkIcon, Edit, Trash } from 'lucide-react';
import { useThemeColors } from '@/context/ThemeContext';

interface ContentItem {
  id: string;
  title: string;
  type: 'lecture' | 'assignment' | 'resource';
  description?: string;
  date?: string;
}

interface WeekContentProps {
  week: number;
  items: ContentItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const WeekContent = ({ week, items, onEdit, onDelete, onAdd }: WeekContentProps) => {
  const colors = useThemeColors();

  // Group items by type
  const lectures = items.filter(item => item.type === 'lecture');
  const assignments = items.filter(item => item.type === 'assignment');
  const resources = items.filter(item => item.type === 'resource');

  const getIcon = (type: string) => {
    switch (type) {
      case 'lecture': return <Video size={18} />;
      case 'assignment': return <File size={18} />;
      case 'resource': return <LinkIcon size={18} />;
      default: return <File size={18} />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'lecture':
        return {
          bg: colors.info + '10',
          color: colors.info,
          iconColor: colors.info
        };
      case 'assignment':
        return {
          bg: colors.warning + '10',
          color: colors.warning,
          iconColor: colors.warning
        };
      case 'resource':
        return {
          bg: colors.success + '10',
          color: colors.success,
          iconColor: colors.success
        };
      default:
        return {
          bg: colors.backgroundSecondary,
          color: colors.textSecondary,
          iconColor: colors.textSecondary
        };
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 
          className="text-xl font-semibold"
          style={{ color: colors.textPrimary }}
        >
          Week {week} Content
        </h2>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-700 transition-colors"
          style={{
            backgroundColor: colors.textPrimary,
            color: colors.background
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.textSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.textPrimary;
          }}
        >
          Add Content
        </button>
      </div>
      
      {/* Lectures */}
      {lectures.length > 0 && (
        <div>
          <h3 
            className="text-lg font-medium mb-3"
            style={{ color: colors.textPrimary }}
          >
            Lectures
          </h3>
          <div 
            className="rounded-xl border divide-y overflow-hidden"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {lectures.map(item => {
              const styles = getTypeStyles(item.type);
              return (
                <div 
                  key={item.id} 
                  className="p-4 flex justify-between items-center"
                  style={{ borderColor: colors.borderLight }}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                      style={{
                        backgroundColor: styles.bg,
                        color: styles.iconColor
                      }}
                    >
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h4 
                        className="font-medium"
                        style={{ color: colors.textPrimary }}
                      >
                        {item.title}
                      </h4>
                      {item.description && (
                        <p 
                          className="text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onEdit(item.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: colors.textTertiary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                        e.currentTarget.style.color = colors.textSecondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.textTertiary;
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: colors.textTertiary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.error + '10';
                        e.currentTarget.style.color = colors.error;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.textTertiary;
                      }}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Assignments */}
      {assignments.length > 0 && (
        <div>
          <h3 
            className="text-lg font-medium mb-3"
            style={{ color: colors.textPrimary }}
          >
            Assignments
          </h3>
          <div 
            className="rounded-xl border divide-y overflow-hidden"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {assignments.map(item => {
              const styles = getTypeStyles(item.type);
              return (
                <div 
                  key={item.id} 
                  className="p-4 flex justify-between items-center"
                  style={{ borderColor: colors.borderLight }}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                      style={{
                        backgroundColor: styles.bg,
                        color: styles.iconColor
                      }}
                    >
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h4 
                        className="font-medium"
                        style={{ color: colors.textPrimary }}
                      >
                        {item.title}
                      </h4>
                      {item.description && (
                        <p 
                          className="text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          {item.description}
                        </p>
                      )}
                      {item.date && (
                        <p 
                          className="text-xs"
                          style={{ color: colors.textTertiary }}
                        >
                          Due: {item.date}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onEdit(item.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: colors.textTertiary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                        e.currentTarget.style.color = colors.textSecondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.textTertiary;
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: colors.textTertiary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.error + '10';
                        e.currentTarget.style.color = colors.error;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.textTertiary;
                      }}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Resources */}
      {resources.length > 0 && (
        <div>
          <h3 
            className="text-lg font-medium mb-3"
            style={{ color: colors.textPrimary }}
          >
            Resources
          </h3>
          <div 
            className="rounded-xl border divide-y overflow-hidden"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            }}
          >
            {resources.map(item => {
              const styles = getTypeStyles(item.type);
              return (
                <div 
                  key={item.id} 
                  className="p-4 flex justify-between items-center"
                  style={{ borderColor: colors.borderLight }}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                      style={{
                        backgroundColor: styles.bg,
                        color: styles.iconColor
                      }}
                    >
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h4 
                        className="font-medium"
                        style={{ color: colors.textPrimary }}
                      >
                        {item.title}
                      </h4>
                      {item.description && (
                        <p 
                          className="text-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onEdit(item.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: colors.textTertiary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                        e.currentTarget.style.color = colors.textSecondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.textTertiary;
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: colors.textTertiary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.error + '10';
                        e.currentTarget.style.color = colors.error;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.textTertiary;
                      }}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* If no content at all, show mini empty state */}
      {items.length === 0 && (
        <div 
          className="rounded-xl border p-6 text-center"
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border
          }}
        >
          <p style={{ color: colors.textTertiary }}>
            No content has been added for Week {week} yet.
          </p>
          <button
            onClick={onAdd}
            className="mt-3 px-3 py-1.5 text-sm rounded-lg transition-colors"
            style={{
              backgroundColor: colors.textPrimary,
              color: colors.background
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.textSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.textPrimary;
            }}
          >
            Add First Content
          </button>
        </div>
      )}
    </div>
  );
};

export default WeekContent;