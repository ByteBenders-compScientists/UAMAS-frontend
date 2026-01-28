/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
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

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://68.221.169.119/api/v1"

export default function LibraryPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resources, setResources] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const resourcesGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    router.replace('/student/unitworkspace?action=library');
  }, [router, searchParams]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/bd/student/notes`, {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) setResources(data);
      })
      .catch(() => {});
  }, []);

  const resourceTypes = ['All', ...Array.from(new Set(resources.map(r => r.file_type?.toUpperCase()))).filter(Boolean)];

  const filteredResources = resources
    .filter(resource => {
      const matchesSearch = resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.unit_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.course_name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || resource.file_type?.toUpperCase() === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'title': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  const getTypeIcon = (type: string) => {
    if (!type) return <FileText size={20} className="text-gray-500" />;
    const t = type.toLowerCase();
    if (t === 'pdf') return <FileText size={20} className="text-red-500" />;
    if (t === 'video' || t === 'mp4') return <Video size={20} className="text-blue-500" />;
    if (t === 'audio' || t === 'mp3') return <Headphones size={20} className="text-green-500" />;
    if (t === 'image' || t === 'jpg' || t === 'jpeg' || t === 'png') return <Image size={20} className="text-purple-500" />;
    return <FileText size={20} className="text-gray-500" />;
  };

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
        <Header title="Library" showWeekSelector={resources.length > 0} />
        
        <main className="p-4 md:p-6">
          {resources.length === 0 ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="Library is Empty"
                description="Course materials, lecture notes, and resources will be available here once your lecturers upload them. Check back regularly for new content."
                icon={<Library size={48} />}
              />
            </div>
          ) : (
            <div className="max-w-8xl mx-auto">
              {/* Search and Filters */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources, units, or courses..."
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
                      <option value="title">Alphabetical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Stats */}
              {(() => {
                const fileTypes = [
                  { type: 'PDF', color: 'text-red-600', bg: 'bg-red-50', Icon: FileText },
                  { type: 'DOCX', color: 'text-indigo-600', bg: 'bg-indigo-50', Icon: FileText },
                  { type: 'PPT', color: 'text-orange-600', bg: 'bg-orange-50', Icon: FileText },
                  { type: 'VIDEO', color: 'text-blue-600', bg: 'bg-blue-50', Icon: Video },
                  { type: 'AUDIO', color: 'text-green-600', bg: 'bg-green-50', Icon: Headphones },
                  { type: 'IMAGE', color: 'text-purple-600', bg: 'bg-purple-50', Icon: Image },
                ];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                      onClick={() => {
                        setSelectedType('All');
                        resourcesGridRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Resources</p>
                          <p className="text-2xl font-bold text-blue-600">{resources.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Library size={24} className="text-blue-600" />
                        </div>
                      </div>
                    </motion.div>
                    {fileTypes.map(({ type, color, bg, Icon }, idx) => (
                      <motion.div
                        key={type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200`}
                        onClick={() => {
                          setSelectedType(type);
                          resourcesGridRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{type}</p>
                            <p className={`text-2xl font-bold ${color}`}>{resources.filter(r => {
                              const t = r.file_type?.toUpperCase();
                              if (type === 'IMAGE') {
                                return t === 'JPG' || t === 'JPEG' || t === 'PNG' || t === 'IMAGE';
                              }
                              if (type === 'VIDEO') {
                                return t === 'VIDEO' || t === 'MP4' || t === 'AVI' || t === 'MOV' || t === 'WMV' || t === 'FLV' || t === 'WEBM' || t === 'MPEG';
                              }
                              if (type === 'AUDIO') {
                                return t === 'AUDIO' || t === 'MP3' || t === 'WAV' || t === 'AAC' || t === 'OGG' || t === 'FLAC';
                              }
                              if (type === 'PPT') {
                                return t === 'PPT' || t === 'PPTX';
                              }
                              return t === type;
                            }).length}</p>
                          </div>
                          <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
                            <Icon size={24} className={color} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })()}

              {/* Resources Grid */}
              <div ref={resourcesGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          {getTypeIcon(resource.file_type)}
                          <span className="ml-2 text-sm font-medium text-gray-600">{resource.file_type?.toUpperCase()}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{resource.unit_name}</p>
                      <p className="text-xs text-gray-500 mb-2">{resource.course_name}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                        </div>
                        <span>{(resource.file_size / 1024).toFixed(1)} KB</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">ID: {resource.id}</span>
                        <a
                          href={`${apiBaseUrl}/bd/notes/${resource.id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </a>
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