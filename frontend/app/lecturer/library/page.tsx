'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/lecturerSidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { 
  BookMarked, BarChart3, Clock, Monitor, Loader, Plus, Star, User, 
  Users, Bell, Menu, X, LetterText, ChevronDown, ChevronUp, GraduationCap,
  FileText, MessageSquare, Library, Settings, Upload, Image, Calendar,
  File, CheckCircle, AlertCircle, BookOpen, ChevronRight, Download,
  MessageCircle, Book, Search, Filter, Grid, List, Eye, Edit, Trash2,
  PlusCircle, FolderPlus, Share2, ExternalLink
} from 'lucide-react';

import {useLayout} from '@/components/LayoutController';

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

interface Resource {
  id: string;
  title: string;
  type: 'book' | 'paper' | 'video' | 'document' | 'link';
  category: string;
  author?: string;
  description: string;
  uploadDate: string;
  size?: string;
  downloads: number;
  rating: number;
  tags: string[];
  course?: string;
  fileUrl?: string;
  thumbnail?: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

// ===== CONSTANTS =====
const SAMPLE_CATEGORIES: Category[] = [
  { id: '1', name: 'Computer Science', count: 45, color: 'bg-blue-500' },
  { id: '2', name: 'Data Structures', count: 32, color: 'bg-purple-500' },
  { id: '3', name: 'Algorithms', count: 28, color: 'bg-green-500' },
  { id: '4', name: 'Database Systems', count: 24, color: 'bg-yellow-500' },
  { id: '5', name: 'Software Engineering', count: 19, color: 'bg-red-500' },
  { id: '6', name: 'Operating Systems', count: 15, color: 'bg-indigo-500' }
];

const SAMPLE_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Introduction to Algorithms (4th Edition)',
    type: 'book',
    category: 'Algorithms',
    author: 'Thomas H. Cormen',
    description: 'Comprehensive guide to algorithms and data structures with detailed explanations and examples.',
    uploadDate: '2024-12-15',
    size: '45.2 MB',
    downloads: 234,
    rating: 4.8,
    tags: ['algorithms', 'data-structures', 'computer-science'],
    course: 'CS301',
    fileUrl: '/resources/intro-algorithms.pdf'
  },
  {
    id: '2',
    title: 'Data Structures in Java Programming',
    type: 'document',
    category: 'Data Structures',
    author: 'Dr. Sarah Johnson',
    description: 'Practical guide to implementing data structures in Java with code examples.',
    uploadDate: '2024-12-10',
    size: '12.8 MB',
    downloads: 189,
    rating: 4.6,
    tags: ['java', 'data-structures', 'programming'],
    course: 'CS201',
    fileUrl: '/resources/java-data-structures.pdf'
  },
  {
    id: '3',
    title: 'Operating Systems Concepts (10th Edition)',
    type: 'book',
    category: 'Operating Systems',
    author: 'Abraham Silberschatz',
    description: 'Essential concepts in operating systems including process management, memory, and file systems.',
    uploadDate: '2024-12-08',
    size: '67.4 MB',
    downloads: 156,
    rating: 4.7,
    tags: ['operating-systems', 'processes', 'memory-management'],
    course: 'CS203',
    fileUrl: '/resources/os-concepts.pdf'
  },
  {
    id: '4',
    title: 'Database Design Tutorial Video Series',
    type: 'video',
    category: 'Database Systems',
    author: 'Prof. Michael Chen',
    description: 'Complete video series covering database design principles and normalization.',
    uploadDate: '2024-12-05',
    downloads: 98,
    rating: 4.9,
    tags: ['database', 'design', 'normalization', 'sql'],
    course: 'CS202',
    fileUrl: '/resources/db-design-videos'
  },
  {
    id: '5',
    title: 'Software Engineering Best Practices',
    type: 'paper',
    category: 'Software Engineering',
    author: 'IEEE Software',
    description: 'Research paper on modern software engineering practices and methodologies.',
    uploadDate: '2024-12-01',
    size: '2.1 MB',
    downloads: 145,
    rating: 4.5,
    tags: ['software-engineering', 'best-practices', 'methodology'],
    course: 'CS302',
    fileUrl: '/resources/se-best-practices.pdf'
  },
  {
    id: '6',
    title: 'MIT OpenCourseWare - Computer Science',
    type: 'link',
    category: 'Computer Science',
    description: 'Free online courses and materials from MIT covering various computer science topics.',
    uploadDate: '2024-11-28',
    downloads: 67,
    rating: 4.8,
    tags: ['online-course', 'mit', 'free', 'computer-science'],
    fileUrl: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/'
  }
];

// ===== UTILITY FUNCTIONS =====
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getResourceIcon = (type: string) => {
  const icons = {
    book: BookOpen,
    paper: FileText,
    video: Image,
    document: File,
    link: ExternalLink
  };
  return icons[type as keyof typeof icons] || File;
};

const getResourceTypeColor = (type: string) => {
  const colors = {
    book: 'bg-blue-100 text-blue-700',
    paper: 'bg-green-100 text-green-700',
    video: 'bg-purple-100 text-purple-700',
    document: 'bg-yellow-100 text-yellow-700',
    link: 'bg-red-100 text-red-700'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
};

// ===== COMPONENTS =====
const SidebarHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
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
);

const TopHeader: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => (
  <header className="flex items-center justify-between px-4 py-4 lg:py-6 bg-white border-b border-gray-200 shadow-sm lg:shadow-none">
    <div className="flex items-center space-x-3">
      <button
        className="lg:hidden text-rose-600 hover:text-rose-800 transition-colors"
        onClick={onSidebarToggle}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
      <span className="text-xl font-bold text-rose-600 hidden lg:inline">EduPortal</span>
    </div>
    <div className="flex items-center space-x-4">
      <button className="relative text-gray-500 hover:text-rose-600 transition-colors">
        <Bell className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full px-1.5 py-0.5">3</span>
      </button>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-rose-600" />
        </div>
        <span className="text-sm font-semibold text-gray-700 hidden md:inline">Dr. Alex Kimani</span>
      </div>
    </div>
  </header>
);

const UserProfile: React.FC = () => (
  <div className="flex p-6 items-center space-x-3 text-sm border-b border-rose-300 font-medium">
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
      <div className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center">
        <User className="w-4 h-4 text-rose-600" />
      </div>
    </div>
    <div className="text-white">
      <div className="font-semibold">Dr. Alex Kimani</div>
      <div className="text-xs opacity-80">Senior Lecturer</div>
    </div>
  </div>
);

const NavigationDropdown: React.FC<{
  items: DropdownItem[];
  isOpen: boolean;
  onItemClick: (path: string) => void;
}> = ({ items, isOpen, onItemClick }) => {
  if (!isOpen) return null;

  return (
    <div className="ml-8 mt-2 space-y-1">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.path}
          className="w-full text-left block p-2 text-sm font-medium rounded-lg hover:bg-rose-300 hover:bg-opacity-50 transition-all duration-200 text-white flex items-center"
        >
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          {item.label}
        </Link>
      ))}
    </div>
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
        
        <NavigationDropdown 
          items={item.dropdownItems || []} 
          isOpen={isDropdownOpen}
          onItemClick={onDropdownItemClick}
        />
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  isCreateDropdownOpen: boolean;
  onCreateDropdownToggle: () => void;
  onDropdownItemClick: (path: string) => void;
}



interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onCategoryChange }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
    <h3 className="font-bold text-lg mb-4 flex items-center">
      <Filter className="w-5 h-5 mr-2 text-rose-600" />
      Categories
    </h3>
    <div className="space-y-2">
      <button
        onClick={() => onCategoryChange('')}
        className={`w-full text-left p-2 rounded-lg transition-colors ${
          selectedCategory === '' ? 'bg-rose-100 text-rose-700' : 'hover:bg-gray-100'
        }`}
      >
        All Categories
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between ${
            selectedCategory === category.id ? 'bg-rose-100 text-rose-700' : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${category.color}`}></div>
            <span>{category.name}</span>
          </div>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{category.count}</span>
        </button>
      ))}
    </div>
  </div>
);

interface ResourceCardProps {
  resource: Resource;
  viewMode: 'grid' | 'list';
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, viewMode }) => {
  const Icon = getResourceIcon(resource.type);
  
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getResourceTypeColor(resource.type)}`}>
                  {resource.type}
                </span>
              </div>
            </div>
            {resource.author && (
              <p className="text-sm text-gray-600 mt-1">by {resource.author}</p>
            )}
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{resource.description}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{formatDate(resource.uploadDate)}</span>
                {resource.size && <span>{resource.size}</span>}
                <span>{resource.downloads} downloads</span>
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" />
                  <span>{resource.rating}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-rose-600 hover:text-rose-800 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-rose-600 hover:text-rose-800 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="text-rose-600 hover:text-rose-800 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getResourceTypeColor(resource.type)}`}>
          {resource.type}
        </span>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
      {resource.author && (
        <p className="text-sm text-gray-600 mb-2">by {resource.author}</p>
      )}
      <p className="text-sm text-gray-500 mb-3 line-clamp-3">{resource.description}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {resource.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>{formatDate(resource.uploadDate)}</span>
        <div className="flex items-center">
          <Star className="w-3 h-3 text-yellow-400 mr-1" />
          <span>{resource.rating}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{resource.downloads} downloads</span>
        <div className="flex items-center space-x-2">
          <button className="text-rose-600 hover:text-rose-800 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="text-rose-600 hover:text-rose-800 transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="text-rose-600 hover:text-rose-800 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const page: React.FC = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [resources, setResources] = useState<Resource[]>(SAMPLE_RESOURCES);


  const toggleCreateDropdown = () => setCreateDropdownOpen(!createDropdownOpen);

  const handleDropdownItemClick = (path: string) => {
    console.log('Navigating to:', path);
    setCreateDropdownOpen(false);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || resource.category === SAMPLE_CATEGORIES.find(c => c.id === selectedCategory)?.name;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 

      />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopHeader onSidebarToggle={toggleCreateDropdown} />
        
        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Library</h1>
            <p className="text-gray-600 mt-2">Manage and access educational resources for your courses.</p>
          </div>

          {/* Search and Actions Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' ? 'bg-rose-100 text-rose-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' ? 'bg-rose-100 text-rose-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Resource
                </button>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Add New Resource</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Resource Title"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <select className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                  <option value="">Select Type</option>
                  <option value="book">Book</option>
                  <option value="paper">Research Paper</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="link">External Link</option>
                </select>
                <input
                  type="text"
                  placeholder="Author"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <select className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                  <option value="">Select Category</option>
                  {SAMPLE_CATEGORIES.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Description"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  rows={3}
                ></textarea>
                <input
                  type="file"
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <button
                  className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors col-span-2"
                  onClick={() => {
                    // Handle upload logic here
                    setShowUploadForm(false);
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </button>
              </div>
            </div>
          )}
          {/* Category Filter */}
          <CategoryFilter
            categories={SAMPLE_CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={(categoryId) => setSelectedCategory(categoryId)}
          />
          {/* Resource Grid/List */}
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1'} mt-6`}>
            {filteredResources.length > 0 ? (
              filteredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} viewMode={viewMode} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No resources found matching your criteria.
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
export default page;

