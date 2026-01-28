/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useLayout } from '@/components/LayoutController';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '@/context/ThemeContext';
import Sidebar from '@/components/lecturerSidebar';
import { 
  BookMarked, User, Users, Bell, Menu, MessageSquare, FileText, Search, 
   Pin, Clock3, Plus,  Settings, TrendingUp, Eye,
  CheckCircle, X
} from 'lucide-react';
import FloatingThemeButton from '@/components/FloatingThemeButton';

const LecturerForums = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const colors = useThemeColors();
  const [selectedWeek, setSelectedWeek] = useState(2);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [forums, setForums] = useState<Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    week: number;
    course: string;
    courseCode: string;
    posts: number;
    participants: number;
    lastActivity: string;
    isPinned: boolean;
    isActive: boolean;
    moderator: string;
  }>>([]);
  
  // Determine empty state
  const isEmptyState = forums.length === 0;

  // Sample courses for dropdown
  const courses = [
    { id: '1', name: 'Computer Science 201', code: 'CS201', color: colors.primary },
    { id: '2', name: 'Computer Science 301', code: 'CS301', color: colors.info },
    { id: '3', name: 'Database Management', code: 'CS202', color: colors.accent },
    { id: '4', name: 'Operating Systems', code: 'CS203', color: colors.success },
    { id: '5', name: 'Software Engineering', code: 'CS302', color: colors.warning }
  ];

  // Week options for dropdown
  const weekOptions = Array.from({ length: 15 }, (_, i) => ({
    value: i + 1,
    label: `Week ${i + 1}`,
    dateRange: `Jan ${15 + i * 7} - Jan ${21 + i * 7}`
  }));
  
  // Form data for creating new forums
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general'
  });

  // Handler for creating new forum
  const handleCreateForum = () => {
    if (!formData.title || !formData.description) return;
    
    const course = courses.find(c => c.id === selectedCourse);
    
    const newForum = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      week: selectedWeek,
      course: course?.name || 'General',
      courseCode: course?.code || 'GEN',
      posts: 0,
      participants: 0,
      lastActivity: new Date().toISOString(),
      isPinned: false,
      isActive: true,
      moderator: 'Dr. Alex Kimani'
    };
    
    setForums(prev => [newForum, ...prev]);
    setFormData({ title: '', description: '', category: 'general' });
    setShowCreateModal(false);
  };

  // Get relative time from date
  const getTimeAgo = (dateString: string | number | Date) => {
    if (!dateString) return '';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const options = { 
      year: 'numeric' as const, 
      month: 'short' as const, 
      day: 'numeric' as const,
      hour: '2-digit' as const,
      minute: '2-digit' as const
    };
    return date.toLocaleDateString(undefined, options);
  };

  const getCategoryColors = (category: string) => {
    const categoryColors: Record<string, { bg: string; text: string }> = {
      'general': { bg: colors.backgroundTertiary, text: colors.textPrimary },
      'assignment': { bg: colors.success + '20', text: colors.success },
      'exam': { bg: colors.warning + '20', text: colors.warning },
      'project': { bg: colors.accent + '20', text: colors.accent },
      'discussion': { bg: colors.info + '20', text: colors.info }
    };
    
    return categoryColors[category] || { bg: colors.backgroundTertiary, text: colors.textPrimary };
  };

  // Get category icon
  const getCategoryIcon = (category: 'general' | 'assignment' | 'exam' | 'project' | 'discussion') => {
      const categoryIcons = {
        'general': MessageSquare,
        'assignment': FileText,
        'exam': BookMarked,
        'project': Settings,
        'discussion': Users
      };
      
      return categoryIcons[category] || MessageSquare;
  };

  // Helper for top header
  const TopHeader: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => (
    <header 
      className="flex items-center justify-between px-4 md:px-6 py-4 lg:py-6 border-b shadow-sm"
      style={{ 
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center space-x-3">
        <button
          className="lg:hidden hover:opacity-80 transition-colors p-2 rounded-lg"
          onClick={onSidebarToggle}
          aria-label="Open sidebar"
          style={{ color: colors.textPrimary }}
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold" style={{ color: colors.primary }}>Forums</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative hover:opacity-80 transition-colors p-2 rounded-lg"
          style={{ color: colors.textSecondary }}>
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-semibold rounded-full shadow-sm"
            style={{ backgroundColor: colors.primary, color: '#ffffff' }}>
            3
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primaryLight }}>
            <User className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
          <span className="text-sm font-semibold hidden md:inline" style={{ color: colors.textPrimary }}>
            Dr. Alex Kimani
          </span>
        </div>
      </div>
    </header> 
  );

  // Week and course selector component
  const WeekAndCourseSelector = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
          Select Course
        </label>
        <select
          className="p-3 w-full rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm"
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
          style={{ 
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            borderWidth: '1px',
            borderStyle: 'solid',
            color: colors.textPrimary,
            // Removed invalid property
          }}
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
          Select Week
        </label>
        <select
          className="p-3 w-full rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm"
          value={selectedWeek}
          onChange={e => setSelectedWeek(Number(e.target.value))}
          style={{ 
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            borderWidth: '1px',
            borderStyle: 'solid',
            color: colors.textPrimary
          }}
        >
          {weekOptions.map(week => (
            <option key={week.value} value={week.value}>
              {week.label} ({week.dateRange})
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  // Forum card component
  const ForumCard: React.FC<{ forum: { id: string; title: string; description: string; category: string; week: number; course: string; courseCode: string; posts: number; participants: number; lastActivity: string; isPinned: boolean; isActive: boolean; moderator: string; }; onForumClick: (id: string) => void; index: number; }> = ({ forum, onForumClick, index }) => {
    const CategoryIcon = getCategoryIcon(forum.category as 'general' | 'assignment' | 'exam' | 'project' | 'discussion');
    const categoryColors = getCategoryColors(forum.category);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer"
        style={{ 
          backgroundColor: forum.isPinned ? colors.primaryLight : colors.cardBackground,
          borderColor: forum.isPinned ? colors.primary : colors.border,
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
        onClick={() => onForumClick(forum.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {forum.isPinned && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: colors.primary, color: '#ffffff' }}>
                <Pin className="w-3 h-3" />
                Pinned
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: categoryColors.bg, color: categoryColors.text }}
            >
              <CategoryIcon className="w-3.5 h-3.5" />
              {forum.category}
            </div>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-lg" 
            style={{ backgroundColor: colors.backgroundTertiary, color: colors.textSecondary }}>
            {forum.courseCode}
          </span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ color: colors.textPrimary }}>
          {forum.title}
        </h3>
        <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: colors.textSecondary }}>
          {forum.description}
        </p>
        
        <div className="flex items-center justify-between text-sm mb-4" style={{ color: colors.textTertiary }}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">{forum.posts}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="font-medium">{forum.participants}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{forum.posts * 15}</span>
            </span>
          </div>
        </div>
        
        <div className="pt-3 flex items-center justify-between text-xs"
          style={{ borderTop: `1px solid ${colors.borderLight}` }}>
          <span style={{ color: colors.textTertiary }}>
            Moderator: <span className="font-medium" style={{ color: colors.textSecondary }}>{forum.moderator}</span>
          </span>
          <div className="flex items-center gap-2">
            {forum.isActive && (
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: colors.success }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.success }}></span>
                Active
              </span>
            )}
            <span className="flex items-center gap-1" style={{ color: colors.textTertiary }}>
              <Clock3 className="w-3.5 h-3.5" />
              {getTimeAgo(forum.lastActivity)}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Stats component
  const ForumStats: React.FC<{ forums: Array<{ posts: number; participants: number; isActive: boolean; }>; }> = ({ forums }) => {
    const totalPosts = forums.reduce((sum: any, forum: { posts: any; }) => sum + forum.posts, 0);
    const totalParticipants = forums.reduce((sum: any, forum: { participants: any; }) => sum + forum.participants, 0);
    const activeForums = forums.filter((forum: { isActive: any; }) => forum.isActive).length;
    const totalViews = forums.reduce((sum: number, forum: { posts: number; }) => sum + (forum.posts * 15), 0);
    
    const stats = [
      { label: 'Active Forums', value: activeForums, icon: MessageSquare, color: colors.primary },
      { label: 'Total Posts', value: totalPosts, icon: MessageSquare, color: colors.info },
      { label: 'Participants', value: totalParticipants, icon: Users, color: colors.success },
      { label: 'Total Views', value: totalViews, icon: Eye, color: colors.warning }
    ];
    
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-xl p-4 shadow-sm"
            style={{ 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>
                  {stat.label}
                </p>
                <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  {stat.value}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.color + '20' }}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Create forum modal
  const CreateForumModal = () => {
    if (!showCreateModal) return null;

    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="rounded-2xl max-w-lg w-full p-6 shadow-2xl"
            style={{ backgroundColor: colors.cardBackground }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                Create New Forum
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-opacity-80 transition-all"
                style={{ backgroundColor: colors.backgroundTertiary }}
              >
                <X size={20} style={{ color: colors.textPrimary }} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Forum Title
                </label>
                <input
                  type="text"
                  className="p-3 w-full rounded-xl focus:outline-none focus:ring-2 transition-all"
                  placeholder="Enter forum title..."
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  style={{ 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: colors.textPrimary
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Description
                </label>
                <textarea
                  className="p-3 w-full rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
                  placeholder="Describe the purpose of this forum..."
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  style={{ 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: colors.textPrimary
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  Category
                </label>
                <select
                  className="p-3 w-full rounded-xl focus:outline-none focus:ring-2 transition-all"
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  style={{ 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: colors.textPrimary
                  }}
                >
                  <option value="general">General Discussion</option>
                  <option value="assignment">Assignment Help</option>
                  <option value="exam">Exam Preparation</option>
                  <option value="project">Project Discussion</option>
                  <option value="discussion">Course Discussion</option>
                </select>
              </div>
              
              <div className="p-4 rounded-xl" style={{ backgroundColor: colors.backgroundSecondary }}>
                <p className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Forum Details
                </p>
                <div className="space-y-1 text-sm" style={{ color: colors.textSecondary }}>
                  <p>Week: <span className="font-semibold" style={{ color: colors.textPrimary }}>{selectedWeek}</span></p>
                  <p>Course: <span className="font-semibold" style={{ color: colors.textPrimary }}>
                    {courses.find(c => c.id === selectedCourse)?.name || 'All Courses'}
                  </span></p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateForum}
                disabled={!formData.title || !formData.description}
                className={`px-6 py-3 rounded-xl flex-1 font-semibold transition-all ${
                  !formData.title || !formData.description ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
                style={{ backgroundColor: colors.primary, color: '#ffffff' }}
              >
                Create Forum
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-80"
                style={{ 
                  backgroundColor: colors.backgroundTertiary,
                  color: colors.textPrimary
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Forum tips for empty state
  const forumTips = [
    "Create separate forums for different topics to keep discussions organized",
    "Pin important forums to make them more visible to students",
    "Consider creating forums for each assignment to centralize questions",
    "Use clear titles and descriptions to help students understand the purpose",
    "Create exam review forums before important tests"
  ];

  return (
    <div className="flex h-screen" style={{ backgroundColor: colors.background }}>
      <Sidebar />
      
      <motion.div
        initial={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        animate={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TopHeader onSidebarToggle={() => console.log('toggle sidebar')} />
        
        <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-auto" style={{ color: colors.textPrimary }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6" style={{ color: colors.textPrimary }}>
              Discussion Forums
            </h1>
            
            {isEmptyState ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-8 md:p-12 rounded-2xl shadow-lg"
                style={{ 
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: colors.primaryLight }}>
                  <MessageSquare size={40} style={{ color: colors.primary }} />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-center" style={{ color: colors.textPrimary }}>
                  No Forums Created Yet
                </h2>
                <p className="mb-8 text-center max-w-md text-lg" style={{ color: colors.textSecondary }}>
                  Create your first discussion forum to engage students and facilitate course discussions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-8">
                  <div className="p-6 rounded-xl" style={{ 
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.borderLight,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: colors.primaryLight }}>
                        <TrendingUp size={20} style={{ color: colors.primary }} />
                      </div>
                      <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>Forum Tips</h3>
                    </div>
                    <ul className="space-y-3">
                      {forumTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                          <span style={{ color: colors.textSecondary }} className="text-sm leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-6 rounded-xl" style={{ 
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.borderLight,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: colors.primaryLight }}>
                        <BookMarked size={20} style={{ color: colors.primary }} />
                      </div>
                      <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>Get Started</h3>
                    </div>
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.textSecondary }}>
                      Creating a forum is easy. Here&apos;s what you need to do:
                    </p>
                    <ol className="space-y-3 text-sm">
                      {[
                        'Select a week and course for your forum',
                        'Choose a topic and create a clear description',
                        'Select the category that best fits your forum'
                      ].map((step, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="inline-flex items-center justify-center rounded-full h-6 w-6 flex-shrink-0 mr-3 text-xs font-bold"
                            style={{ backgroundColor: colors.primaryLight, color: colors.primary }}>
                            {idx + 1}
                          </span>
                          <span style={{ color: colors.textSecondary }} className="leading-relaxed pt-0.5">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                
                <WeekAndCourseSelector />
                
                <button 
                  className="px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg hover:shadow-xl transition-all"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#ffffff'
                  }}
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={20} className="mr-2" />
                  Create Your First Forum
                </button>
              </motion.div>
            ) : (
              <>
                <WeekAndCourseSelector />
                
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                      style={{ color: colors.textTertiary }} />
                    <input
                      type="text"
                      placeholder="Search forums by title, description, or category..."
                      className="pl-12 pr-4 py-3 w-full rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      style={{ 
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.inputBorder,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        color: colors.textPrimary
                      }}
                    />
                  </div>
                  <select
                    className="px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm"
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    style={{ 
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.inputBorder,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: colors.textPrimary
                    }}
                  >
                    <option value="all">All Categories</option>
                    <option value="general">General Discussion</option>
                    <option value="assignment">Assignment Help</option>
                    <option value="exam">Exam Preparation</option>
                    <option value="project">Project Discussion</option>
                    <option value="discussion">Course Discussion</option>
                  </select>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 rounded-xl whitespace-nowrap font-semibold shadow-sm hover:shadow-lg transition-all flex items-center"
                    style={{ backgroundColor: colors.primary, color: '#ffffff' }}
                  >
                    <Plus size={20} className="mr-2" />
                    Create Forum
                  </button>
                </div>

                <ForumStats forums={forums} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {forums.length > 0 ? (
                    forums.map((forum, idx) => (
                      <ForumCard 
                        key={forum.id} 
                        forum={forum}
                        index={idx}
                        onForumClick={() => console.log('Forum clicked:', forum.id)} 
                      />
                    ))
                  ) : (
                    <div className="col-span-3 text-center p-12 rounded-xl shadow-sm"
                      style={{ 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}>
                      <Search size={56} className="mx-auto mb-4" style={{ color: colors.textTertiary }} />
                      <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                        No forums match your filters
                      </h3>
                      <p className="mb-6 text-lg" style={{ color: colors.textSecondary }}>
                        Try adjusting your search terms, week, course, or category.
                      </p>
                      <button 
                        className="inline-flex items-center px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-lg transition-all"
                        style={{ backgroundColor: colors.primary, color: '#ffffff' }}
                        onClick={() => setShowCreateModal(true)}
                      >
                        <Plus size={18} className="mr-2" />
                        Create New Forum
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </motion.div>
      
      <CreateForumModal />
      <FloatingThemeButton/>
    </div>
  );
};

export default LecturerForums;