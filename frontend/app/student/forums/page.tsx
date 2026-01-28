'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useThemeColors } from '@/context/ThemeContext';
import { 
  MessageSquare, Search,
  User, ThumbsUp, MessageCircle,
  Users, Pin, Bookmark, Plus, Send, BookOpen,
  X,Award, CheckCircle, AlertCircle,
   Eye, Hash, Flame
} from 'lucide-react';
import FloatingThemeButton from '@/components/FloatingThemeButton';

const StudentForums = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedDiscussion, setSelectedDiscussion] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'unanswered'>('all');
  
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: 'How to approach dynamic programming problems effectively?',
      content: 'I\'m struggling with understanding the optimal substructure in DP problems. Can someone explain with examples? I\'ve watched several tutorials but still finding it hard to identify when to use DP.',
      author: { id: 101, name: 'Sarah Johnson', avatar: null, role: 'Student', reputation: 245 },
      course: 'Data Structures & Algorithms',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      replies: 12,
      likes: 28,
      views: 156,
      isPinned: false,
      isResolved: false,
      tags: ['Algorithms', 'Dynamic Programming', 'Help Needed']
    },
    {
      id: 2,
      title: 'Study Group for Web Development Final Project',
      content: 'Looking to form a study group for the upcoming web dev final project. We can meet twice a week to collaborate and review each other\'s code. Anyone interested?',
      author: { id: 102, name: 'Michael Chen', avatar: null, role: 'Student', reputation: 189 },
      course: 'Web Development',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      replies: 8,
      likes: 15,
      views: 94,
      isPinned: false,
      isResolved: false,
      tags: ['Study Group', 'Web Dev', 'Collaboration']
    },
    {
      id: 3,
      title: 'Important: Assignment 3 Deadline Extended',
      content: 'The deadline for Assignment 3 has been extended to next Friday. Make sure to review the updated rubric posted on the course portal.',
      author: { id: 103, name: 'Prof. Anderson', avatar: null, role: 'Instructor', reputation: 1250 },
      course: 'Computer Science 101',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      replies: 24,
      likes: 89,
      views: 342,
      isPinned: true,
      isResolved: false,
      tags: ['Announcement', 'Assignment', 'Deadline']
    },
    {
      id: 4,
      title: 'Best resources for learning React Hooks?',
      content: 'Can anyone recommend good tutorials or documentation for understanding React Hooks, especially useEffect and useContext? Looking for practical examples.',
      author: { id: 104, name: 'Emily Rodriguez', avatar: null, role: 'Student', reputation: 156 },
      course: 'Web Development',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      replies: 16,
      likes: 34,
      views: 203,
      isPinned: false,
      isResolved: true,
      tags: ['React', 'Resources', 'Web Dev']
    },
    {
      id: 5,
      title: 'Understanding Big O notation - Common pitfalls',
      content: 'What are some common mistakes students make when analyzing time complexity? I want to make sure I\'m not falling into the same traps.',
      author: { id: 105, name: 'David Kim', avatar: null, role: 'Student', reputation: 312 },
      course: 'Data Structures & Algorithms',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      replies: 21,
      likes: 56,
      views: 287,
      isPinned: false,
      isResolved: true,
      tags: ['Big O', 'Algorithms', 'Time Complexity']
    }
  ]);
  
  const isEmptyState = discussions.length === 0;
  
  const filteredDiscussions = discussions
    .filter(discussion => {
      const matchesSearch = 
        discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCourse = selectedCourse === 'All Courses' || discussion.course === selectedCourse;
      
      const matchesTab = 
        activeTab === 'all' ? true :
        activeTab === 'popular' ? discussion.likes > 20 :
        activeTab === 'unanswered' ? discussion.replies === 0 : true;
      
      return matchesSearch && matchesCourse && matchesTab;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'mostReplies':
          return b.replies - a.replies;
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handlePostComment = () => {
    if (newComment.trim() === '') return;
    
    setIsLoading(true);
    setTimeout(() => {
      setNewComment('');
      setIsLoading(false);
    }, 1000);
  };
  
  const learningResources = [
    { title: "Harvard CS50", url: "https://cs50.harvard.edu/x/2026/", icon: "🎓" },
    { title: "Programming with Mosh", url: "https://codewithmosh.com/", icon: "💻" },
    { title: "MIT OpenCourseWare", url: "https://ocw.mit.edu/", icon: "🏛️" },
    { title: "FreeCodeCamp", url: "https://www.freecodecamp.org/", icon: "🔥" },
    { title: "Khan Academy CS", url: "https://www.khanacademy.org/computing", icon: "📚" },
  ];

  const forumStats = [
    { label: 'Total Discussions', value: discussions.length, icon: MessageSquare, color: colors.info },
    { label: 'Active Today', value: discussions.filter(d => new Date(d.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000).length, icon: Flame, color: colors.warning },
    { label: 'Resolved', value: discussions.filter(d => d.isResolved).length, icon: CheckCircle, color: colors.success },
    { label: 'Total Views', value: discussions.reduce((acc, d) => acc + d.views, 0), icon: Eye, color: colors.primary },
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
        className="flex-1 overflow-auto"
      >
        <Header title="Student Forums" showWeekSelector={false} />
        
        <main className="p-4 md:p-6 lg:p-8" style={{ color: colors.textPrimary }}>
          {isEmptyState ? (
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-12 rounded-2xl text-center shadow-lg" 
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
                <h2 className="text-2xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                  Welcome to Student Forums
                </h2>
                <p className="text-lg mb-8 max-w-md" style={{ color: colors.textSecondary }}>
                  Connect with your peers, ask questions, share knowledge, and grow together.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-10">
                  <div className="p-6 rounded-xl" style={{ 
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.borderLight,
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: colors.primaryLight }}>
                        <BookOpen size={20} style={{ color: colors.primary }} />
                      </div>
                      <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                        Learning Resources
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {learningResources.map((resource, idx) => (
                        <li key={idx}>
                          <a href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center p-2 rounded-lg transition-colors hover:opacity-80"
                            style={{ 
                              backgroundColor: colors.backgroundTertiary,
                            }}
                          >
                            <span className="text-xl mr-3">{resource.icon}</span>
                            <span className="font-medium" style={{ color: colors.primary }}>
                              {resource.title}
                            </span>
                          </a>
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
                        <Users size={20} style={{ color: colors.primary }} />
                      </div>
                      <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                        Get Started
                      </h3>
                    </div>
                    <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                      Join the conversation and make the most of your learning experience:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                        <span style={{ color: colors.textSecondary }}>Ask questions about course materials</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                        <span style={{ color: colors.textSecondary }}>Form study groups with classmates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                        <span style={{ color: colors.textSecondary }}>Share resources and insights</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                        <span style={{ color: colors.textSecondary }}>Help peers and earn reputation</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <button 
                  className="px-6 py-3 rounded-xl flex items-center font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#ffffff',
                  }}
                  onClick={() => setDiscussions([
                    {
                      id: 1,
                      title: 'Welcome to the Forum!',
                      content: 'This is a space for discussing course topics, asking questions, and connecting with your peers.',
                      author: { id: 101, name: 'John Smith', avatar: null, role: 'Student', reputation: 150 },
                      course: 'Computer Science 101',
                      createdAt: new Date().toISOString(),
                      replies: 0,
                      likes: 0,
                      views: 1,
                      isPinned: true,
                      isResolved: false,
                      tags: ['Welcome', 'Introduction']
                    }
                  ])}
                >
                  <Plus size={20} className="mr-2" />
                  Start First Discussion
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {forumStats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl shadow-sm"
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

              {/* Search and Filters */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  {/* Search Bar */}
                  <div className="flex-1 relative">
                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                      style={{ color: colors.textTertiary }} />
                    <input
                      type="text"
                      placeholder="Search discussions, topics, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.inputBorder,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        color: colors.textPrimary
                      }}
                    />
                  </div>

                  <button 
                    className="px-6 py-3 rounded-xl flex items-center justify-center font-semibold shadow-sm hover:shadow-md transition-all whitespace-nowrap" 
                    style={{ backgroundColor: colors.primary, color: '#ffffff' }}
                  >
                    <Plus size={20} className="mr-2" />
                    New Discussion
                  </button>
                </div>

                {/* Tabs and Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Tabs */}
                  <div className="flex items-center gap-2">
                    {[
                      { key: 'all' as const, label: 'All Discussions' },
                      { key: 'popular' as const, label: 'Popular' },
                      { key: 'unanswered' as const, label: 'Unanswered' }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="px-4 py-2 rounded-lg font-medium text-sm transition-all"
                        style={{
                          backgroundColor: activeTab === tab.key ? colors.primary : colors.backgroundSecondary,
                          color: activeTab === tab.key ? '#ffffff' : colors.textSecondary,
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 rounded-lg focus:outline-none text-sm font-medium"
                      style={{ 
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.inputBorder,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        color: colors.textPrimary
                      }}
                    >
                      <option value="All Courses">All Courses</option>
                      <option value="Computer Science 101">Computer Science 101</option>
                      <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                      <option value="Web Development">Web Development</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 rounded-lg focus:outline-none text-sm font-medium"
                      style={{ 
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.inputBorder,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        color: colors.textPrimary
                      }}
                    >
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Popular</option>
                      <option value="mostReplies">Most Replies</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Forums Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Discussions List */}
                <div className="lg:col-span-2 space-y-4">
                  {filteredDiscussions.length > 0 ? (
                    filteredDiscussions.map((discussion, idx) => (
                      <motion.div
                        key={discussion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="rounded-xl cursor-pointer hover:shadow-lg transition-all"
                        style={{ 
                          backgroundColor: discussion.isPinned ? colors.primaryLight : colors.cardBackground,
                          borderColor: discussion.isPinned ? colors.primary : colors.border,
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        }}
                        onClick={() => setSelectedDiscussion(discussion.id)}
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
                                style={{ 
                                  backgroundColor: discussion.author.role === 'Instructor' 
                                    ? colors.primary + '20' 
                                    : colors.backgroundTertiary 
                                }}
                              >
                                <User size={20} style={{ 
                                  color: discussion.author.role === 'Instructor' 
                                    ? colors.primary 
                                    : colors.textTertiary 
                                }} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center flex-wrap gap-2">
                                  <span className="font-semibold truncate" style={{ color: colors.textPrimary }}>
                                    {discussion.author.name}
                                  </span>
                                  {discussion.author.role === 'Instructor' && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                      style={{ 
                                        backgroundColor: colors.primary,
                                        color: '#ffffff'
                                      }}
                                    >
                                      Instructor
                                    </span>
                                  )}
                                  <span className="text-xs" style={{ color: colors.textTertiary }}>
                                    • {formatDate(discussion.createdAt)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Award size={14} style={{ color: colors.warning }} />
                                  <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                    {discussion.author.reputation} reputation
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {discussion.isPinned && (
                              <div className="flex items-center text-xs font-semibold px-3 py-1.5 rounded-full ml-4"
                                style={{ backgroundColor: colors.primary, color: '#ffffff' }}>
                                <Pin size={14} className="mr-1" />
                                Pinned
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-bold mb-3 line-clamp-2" style={{ color: colors.textPrimary }}>
                            {discussion.title}
                          </h3>
                          <p className="mb-4 line-clamp-2 text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                            {discussion.content}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {discussion.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 text-xs font-medium rounded-full"
                                style={{ 
                                  backgroundColor: colors.backgroundTertiary, 
                                  color: colors.textSecondary 
                                }}
                              >
                                <Hash size={12} className="inline mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4"
                            style={{ borderTop: `1px solid ${colors.border}` }}>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center" style={{ color: colors.textTertiary }}>
                                <MessageCircle size={16} className="mr-1.5" />
                                <span className="font-medium">{discussion.replies}</span>
                              </div>
                              <div className="flex items-center" style={{ color: colors.textTertiary }}>
                                <ThumbsUp size={16} className="mr-1.5" />
                                <span className="font-medium">{discussion.likes}</span>
                              </div>
                              <div className="flex items-center" style={{ color: colors.textTertiary }}>
                                <Eye size={16} className="mr-1.5" />
                                <span className="font-medium">{discussion.views}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {discussion.isResolved && (
                                <span className="flex items-center text-xs font-semibold px-3 py-1.5 rounded-full"
                                  style={{ 
                                    backgroundColor: colors.success + '20',
                                    color: colors.success
                                  }}>
                                  <CheckCircle size={14} className="mr-1" />
                                  Resolved
                                </span>
                              )}
                              <span className="text-xs font-medium px-3 py-1.5 rounded-full"
                                style={{ 
                                  backgroundColor: colors.primaryLight,
                                  color: colors.primary
                                }}>
                                {discussion.course}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-16 rounded-xl"
                      style={{ 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}
                    >
                      <Search size={56} className="mx-auto mb-4" style={{ color: colors.textTertiary }} />
                      <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                        No discussions found
                      </h3>
                      <p className="mb-6 text-sm" style={{ color: colors.textSecondary }}>
                        Try adjusting your search terms or filters.
                      </p>
                      <button className="inline-flex items-center px-6 py-3 rounded-xl font-semibold"
                        style={{ backgroundColor: colors.primary, color: '#ffffff' }}>
                        <Plus size={18} className="mr-2" />
                        Start a New Discussion
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Learning Resources */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-xl p-6 shadow-sm"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                  >
                    <div className="flex items-center mb-5">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: colors.primaryLight }}>
                        <BookOpen size={20} style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                        Learning Resources
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {learningResources.map((resource, index) => (
                        <a 
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 rounded-lg transition-all hover:shadow-md"
                          style={{
                            backgroundColor: colors.backgroundSecondary,
                          }}
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{resource.icon}</span>
                            <span className="font-semibold text-sm" 
                              style={{ color: colors.primary }}>
                              {resource.title}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>

                  {/* Popular Tags */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl p-6 shadow-sm"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                  >
                    <div className="flex items-center mb-5">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: colors.primaryLight }}>
                        <Hash size={20} style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                        Popular Tags
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Programming', 'Algorithms', 'Web Dev', 'Assignments', 'Projects', 'Help', 'React', 'Python'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all hover:shadow-md"
                          style={{ 
                            backgroundColor: colors.backgroundTertiary, 
                            color: colors.textSecondary
                          }}
                        >
                          <Hash size={12} className="inline mr-1" />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Forum Guidelines */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl p-6 shadow-sm"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                  >
                    <div className="flex items-center mb-4">
                      <AlertCircle size={20} className="mr-2" style={{ color: colors.warning }} />
                      <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                        Forum Guidelines
                      </h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                        <span style={{ color: colors.textSecondary }}>Be respectful and constructive</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                        <span style={{ color: colors.textSecondary }}>Search before posting</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                        <span style={{ color: colors.textSecondary }}>Use relevant tags</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                        <span style={{ color: colors.textSecondary }}>Mark resolved discussions</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>

              {/* Discussion Detail Modal */}
              <AnimatePresence>
                {selectedDiscussion && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedDiscussion(null)}
                  >
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                      style={{ backgroundColor: colors.cardBackground }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {(() => {
                        const discussion = filteredDiscussions.find(d => d.id === selectedDiscussion);
                        if (!discussion) return null;

                        return (
                          <>
                            {/* Modal Header */}
                            <div className="p-6" style={{ borderBottom: `1px solid ${colors.border}` }}>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0 pr-4">
                                  <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                                    {discussion.title}
                                  </h2>
                                  <div className="flex flex-wrap gap-2">
                                    {discussion.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="px-3 py-1 text-xs font-medium rounded-full"
                                        style={{ 
                                          backgroundColor: colors.backgroundTertiary, 
                                          color: colors.textSecondary 
                                        }}
                                      >
                                        <Hash size={12} className="inline mr-1" />
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <button 
                                  onClick={() => setSelectedDiscussion(null)}
                                  className="p-2 rounded-lg hover:bg-opacity-80 transition-all"
                                  style={{ backgroundColor: colors.backgroundTertiary }}
                                >
                                  <X size={24} style={{ color: colors.textPrimary }} />
                                </button>
                              </div>
                              
                              <div className="flex items-center">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                                  style={{ 
                                    backgroundColor: discussion.author.role === 'Instructor' 
                                      ? colors.primary + '20' 
                                      : colors.backgroundTertiary 
                                  }}
                                >
                                  <User size={24} style={{ 
                                    color: discussion.author.role === 'Instructor' 
                                      ? colors.primary 
                                      : colors.textTertiary 
                                  }} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold" style={{ color: colors.textPrimary }}>
                                      {discussion.author.name}
                                    </span>
                                    {discussion.author.role === 'Instructor' && (
                                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                        style={{ 
                                          backgroundColor: colors.primary,
                                          color: '#ffffff'
                                        }}
                                      >
                                        Instructor
                                      </span>
                                    )}
                                    <span className="text-sm" style={{ color: colors.textTertiary }}>
                                      • {formatDate(discussion.createdAt)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 mt-1 text-sm">
                                    <div className="flex items-center">
                                      <Award size={14} className="mr-1" style={{ color: colors.warning }} />
                                      <span style={{ color: colors.textSecondary }}>
                                        {discussion.author.reputation} reputation
                                      </span>
                                    </div>
                                    <span style={{ color: colors.textTertiary }}>•</span>
                                    <span style={{ color: colors.primary }}>
                                      {discussion.course}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto flex-1">
                              <p className="text-base leading-relaxed mb-6" style={{ color: colors.textPrimary }}>
                                {discussion.content}
                              </p>
                              
                              <div className="flex items-center gap-4 mb-8 pb-6"
                                style={{ borderBottom: `1px solid ${colors.border}` }}>
                                <button className="flex items-center px-4 py-2 rounded-lg transition-all hover:shadow-md"
                                  style={{ backgroundColor: colors.backgroundSecondary, color: colors.textPrimary }}>
                                  <ThumbsUp size={18} className="mr-2" />
                                  <span className="font-medium">Like ({discussion.likes})</span>
                                </button>
                                <button className="flex items-center px-4 py-2 rounded-lg transition-all hover:shadow-md"
                                  style={{ backgroundColor: colors.backgroundSecondary, color: colors.textPrimary }}>
                                  <Bookmark size={18} className="mr-2" />
                                  <span className="font-medium">Save</span>
                                </button>
                                {discussion.isResolved && (
                                  <span className="flex items-center px-4 py-2 rounded-lg font-semibold ml-auto"
                                    style={{ 
                                      backgroundColor: colors.success + '20',
                                      color: colors.success
                                    }}>
                                    <CheckCircle size={18} className="mr-2" />
                                    Resolved
                                  </span>
                                )}
                              </div>
                              
                              <div>
                                <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: colors.textPrimary }}>
                                  <MessageCircle size={20} className="mr-2" />
                                  Replies ({discussion.replies})
                                </h3>
                                
                                {discussion.replies === 0 ? (
                                  <div className="text-center py-12 rounded-xl"
                                    style={{ backgroundColor: colors.backgroundSecondary }}>
                                    <MessageSquare size={48} className="mx-auto mb-3" style={{ color: colors.textTertiary }} />
                                    <p className="font-medium mb-1" style={{ color: colors.textPrimary }}>
                                      No replies yet
                                    </p>
                                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                                      Be the first to reply to this discussion!
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {/* Sample replies would go here */}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Comment Form */}
                            <div className="p-6" style={{ borderTop: `1px solid ${colors.border}` }}>
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: colors.backgroundTertiary }}>
                                  <User size={20} style={{ color: colors.textTertiary }} />
                                </div>
                                <div className="flex-1">
                                  <textarea
                                    ref={commentInputRef}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a thoughtful reply..."
                                    className="w-full p-4 rounded-xl resize-none focus:outline-none focus:ring-2"
                                    rows={4}
                                    style={{ 
                                      backgroundColor: colors.inputBackground,
                                      borderColor: colors.inputBorder,
                                      borderWidth: '1px',
                                      borderStyle: 'solid',
                                      color: colors.textPrimary
                                    }}
                                  />
                                  <div className="mt-3 flex justify-end">
                                    <button
                                      onClick={handlePostComment}
                                      disabled={newComment.trim() === '' || isLoading}
                                      className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                                        newComment.trim() === '' || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                                      }`}
                                      style={{ 
                                        backgroundColor: colors.primary,
                                        color: '#ffffff'
                                      }}
                                    >
                                      <Send size={18} className="mr-2" />
                                      {isLoading ? 'Posting...' : 'Post Reply'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </motion.div>
      <FloatingThemeButton/>
    </div>
  );
};

export default StudentForums;