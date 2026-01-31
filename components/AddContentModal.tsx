'use client';

import { useState } from 'react';
import { X, Video, File, Link as LinkIcon } from 'lucide-react';

interface EditItem {
  id?: string;
  title?: string;
  type?: 'lecture' | 'assignment' | 'resource';
  description?: string;
  date?: string;
}

interface AddContentModalProps {
  week: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: unknown) => void;
  editItem?: EditItem;
}

const AddContentModal = ({ week, isOpen, onClose, onSave, editItem }: AddContentModalProps) => {
  const [formData, setFormData] = useState({
    title: editItem?.title || '',
    type: editItem?.type || 'lecture',
    description: editItem?.description || '',
    date: editItem?.date || '',
  });
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: editItem?.id || Date.now().toString(),
      week
    });
    onClose();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <X size={18} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">
          {editItem ? 'Edit Content' : `Add Content for Week ${week}`}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter title"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <button
                type="button"
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  formData.type === 'lecture' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'lecture' }))}
              >
                <Video size={20} className={formData.type === 'lecture' ? 'text-blue-500' : 'text-gray-500'} />
                <span className="text-xs mt-1">Lecture</span>
              </button>
              <button
                type="button"
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  formData.type === 'assignment' 
                    ? 'border-amber-500 bg-amber-50 text-amber-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'assignment' }))}
              >
                <File size={20} className={formData.type === 'assignment' ? 'text-amber-500' : 'text-gray-500'} />
                <span className="text-xs mt-1">Assignment</span>
              </button>
              <button
                type="button"
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  formData.type === 'resource' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'resource' }))}
              >
                <LinkIcon size={20} className={formData.type === 'resource' ? 'text-emerald-500' : 'text-gray-500'} />
                <span className="text-xs mt-1">Resource</span>
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              placeholder="Enter description"
            />
          </div>
          
          {formData.type === 'assignment' && (
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              {editItem ? 'Update' : 'Add Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContentModal;