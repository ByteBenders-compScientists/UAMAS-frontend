'use client';

import { File, Video, Link as LinkIcon, Edit, Trash } from 'lucide-react';

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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Week {week} Content</h2>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
        >
          Add Content
        </button>
      </div>
      
      {/* Lectures */}
      {lectures.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Lectures</h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {lectures.map(item => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mr-3">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onEdit(item.id)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Assignments */}
      {assignments.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Assignments</h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {assignments.map(item => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center mr-3">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                    {item.date && <p className="text-xs text-gray-400">Due: {item.date}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onEdit(item.id)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Resources */}
      {resources.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Resources</h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {resources.map(item => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mr-3">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onEdit(item.id)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* If no content at all, show mini empty state */}
      {items.length === 0 && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-gray-500">No content has been added for Week {week} yet.</p>
          <button
            onClick={onAdd}
            className="mt-3 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            Add First Content
          </button>
        </div>
      )}
    </div>
  );
};

export default WeekContent;