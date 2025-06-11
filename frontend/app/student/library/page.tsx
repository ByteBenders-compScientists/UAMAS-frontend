'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { 
  Library, 
  Search, 
  BookOpen,
  Download,
  Eye,
  Filter,
  FileText,
  Video,
  Headphones,
  Image,
  Star,
  Clock
} from 'lucide-react';

// Mock data
const mockResources = [
  {
    id: 1,
    title: 'Database Design Fundamentals',
    type: 'PDF',
    course: 'Database Systems',
    author: 'Dr. Smith',
    uploadDate: '2025-01-15',
    size: '2.4 MB',
    downloads: 156,
    rating: 4.8,
    description: 'Comprehensive guide to database design principles and normalization.',
    tags: ['Database', 'Design', 'SQL']
  },
  {
    id: 2,
    title: 'Algorithm Complexity Analysis',
    type: 'Video',
    course: 'Algorithms',
    author: 'Prof. Wilson',
    uploadDate: '2025-01-20',
    size: '45 min',
    downloads: 89,
    rating: 4.6,
    description: 'Video lecture on Big O notation and algorithm analysis.',
    tags: ['Algorithms', 'Complexity', 'Analysis']
  },
  {
    id: 3,
    title: 'Statistics Formula Sheet',
    type: 'PDF',
    course: 'Statistics',
    author: 'Prof. Johnson',
    uploadDate: '2025-01-18',
    size: '1.2 MB',
    downloads: 203,
    rating: 4.9,
    description: 'Quick reference for statistical formulas and distributions.',
    tags: ['Statistics', 'Formulas', 'Reference']
  },
  {
    id: 4,
    title: 'Programming Best Practices',
    type: 'Audio',
    course: 'Software Engineering',
    author: 'Dr. Brown',
    uploadDate: '2025-01-22',
    size: '30 min',
    downloads: 67,
    rating: 4.5,
    description: 'Audio discussion on coding standards and best practices.',
    tags: ['Programming', 'Best Practices', 'Software']
  }
];

const resourceTypes = ['All', 'PDF', 'Video', 'Audio', 'Image'];

export default function LibraryPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [hasContent] = useState(mockResources.length > 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText size={20} className="text-red-500" />;
      case 'Video': return <Video size={20} className="text-blue-500" />;
      case 'Audio': return <Headphones size={20} className="text-green-500" />;
      case 'Image': return <Image size={20} className="text-purple-500" />;
      default: return <FileText size={20} className="text-gray-500" />;
    }
  };

  const filteredResources = mockResources
    .filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedType === 'All' || resource.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent': return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'popular': return b.downloads - a.downloads;
        case 'rating': return b.rating - a.rating;
        case 'title': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <motion.div 
        initial={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        animate={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto"
      >
        <Header title="Library" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="Library is Empty"
                description="Course materials, lecture notes, and resources will be available here once your lecturers upload them. Check back regularly for new content."
                icon={<Library size={48} />}
              />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Search and Filters */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources, courses, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {/* Type Filter */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                      {resourceTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            selectedType === type
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center space-x-2">
                    <Filter size={16} className="text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Downloaded</option>
                      <option value="rating">Highest Rated</option>
                      <option value="title">Alphabetical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Resources</p>
                      <p className="text-2xl font-bold text-blue-600">{mockResources.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Library size={24} className="text-blue-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">PDFs</p>
                      <p className="text-2xl font-bold text-red-600">
                        {mockResources.filter(r => r.type === 'PDF').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                      <FileText size={24} className="text-red-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Videos</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {mockResources.filter(r => r.type === 'Video').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Video size={24} className="text-blue-600" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Audio</p>
                      <p className="text-2xl font-bold text-green-600">
                        {mockResources.filter(r => r.type === 'Audio').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <Headphones size={24} className="text-green-600" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          {getTypeIcon(resource.type)}
                          <span className="ml-2 text-sm font-medium text-gray-600">{resource.type}</span>
                        </div>
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">{resource.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{resource.course}</p>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{resource.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{new Date(resource.uploadDate).toLocaleDateString()}</span>
                        </div>
                        <span>{resource.size}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{resource.downloads} downloads</span>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <Search size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or filters.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}