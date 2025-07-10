'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  ChevronDown, 
  User,
  ThumbsUp,
  MessageCircle,
  Clock,
  Users,
  Pin,
  Award,
  Bookmark,
  Plus,
  Send
} from 'lucide-react';

// Mock data
const mockDiscussions = [
  {
    id: 1,
    title: 'Tips for Database Normalization?',
    content: 'I\'m struggling with understanding database normalization concepts. Could anyone share some tips or resources that helped them grasp these concepts better?',
    author: {
      id: 101,
      name: 'Jane Smith',
      avatar: null,
      role: 'Student'
    },
    course: 'Database Systems',
    createdAt: '2025-02-10T14:30:00Z',
    replies: 8,
    likes: 15,
    isPinned: true,
    tags: ['Database', 'Help', 'Normalization']
  },
  {
    id: 2,
    title: 'Group Project for Software Engineering',
    content: 'Anyone interested in forming a group for the upcoming software engineering project? I\'m thinking of building a food delivery app with React Native and Firebase.',
    author: {
      id: 102,
      name: 'Mike Johnson',
      avatar: null,
      role: 'Student'
    },
    course: 'Software Engineering',
    createdAt: '2025-02-12T09:15:00Z',
    replies: 12,
    likes: 7,
    isPinned: false,
    tags: ['Project', 'Group', 'React Native']
  },
  {
    id: 3,
    title: 'Resources for Algorithm Analysis',
    content: 'Can anyone recommend good resources or textbooks for algorithm analysis? I\'m finding the current material quite challenging.',
    author: {
      id: 103,
      name: 'Sarah Williams',
      avatar: null,
      role: 'Student'
    },
    course: 'Algorithms',
    createdAt: '2025-02-13T16:45:00Z',
    replies: 5,
    likes: 9,
    isPinned: false,
    tags: ['Algorithms', 'Resources', 'Study']
  }
];

const mockCourses = [
  'All Courses',
  'Database Systems',
  'Software Engineering',
  'Algorithms',
  'Statistics',
  'Discrete Mathematics'
];

// Mock comments for a discussion
const mockComments = [
  {
    id: 101,
    content: 'I found the textbook "Database Design for Mere Mortals" really helpful for understanding normalization. It explains the concepts in a straightforward way.',
    author: {
      id: 201,
      name: 'Alex Johnson',
      avatar: null,
      role: 'Student'
    },
    createdAt: '2025-02-10T15:10:00Z',
    likes: 7,
    isInstructor: false
  },
  {
    id: 102,
    content: 'Remember that normalization is about organizing your database to reduce redundancy and improve data integrity. Start by understanding the different normal forms (1NF, 2NF, 3NF) and their requirements.',
    author: {
      id: 202,
      name: 'Dr. Smith',
      avatar: null,
      role: 'Lecturer'
    },
    createdAt: '2025-02-10T16:30:00Z',
    likes: 12,
    isInstructor: true
  },
  {
    id: 103,
    content: 'I also struggled with this! What helped me was drawing out the tables and relationships. Visual representation made it much clearer.',
    author: {
      id: 203,
      name: 'Emma Wilson',
      avatar: null,
      role: 'Student'
    },
    createdAt: '2025-02-11T09:45:00Z',
    likes: 5,
    isInstructor: false
  }
];

export default function ForumsPage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [hasContent] = useState(mockDiscussions.length > 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedDiscussion, setSelectedDiscussion] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort discussions
  const filteredDiscussions = mockDiscussions
    .filter(discussion => {
      const matchesSearch = 
        discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCourse = selectedCourse === 'All Courses' || discussion.course === selectedCourse;
      
      return matchesSearch && matchesCourse;
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
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      if (hours < 1) {
        const minutes = Math.floor(diffTime / (1000 * 60));
        return `${minutes} minutes ago`;
      }
      return `${hours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handlePostComment = () => {
    if (newComment.trim() === '') return;
    
    setIsLoading(true);
    // Simulate posting a comment
    setTimeout(() => {
      setNewComment('');
      setIsLoading(false);
      // In a real app, you would add the new comment to the comments list
    }, 1000);
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
        <Header title="Forums" showWeekSelector={hasContent} />
        
        <main className="p-4 md:p-6">
          {!hasContent ? (
            <div className="max-w-4xl mx-auto">
              <EmptyState
                title="No Discussions Yet"
                description="Be the first to start a discussion. Ask questions, share ideas, or connect with other students."
                icon={<MessageSquare size={48} />}
                onAction={() => console.log('Start discussion clicked')}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Search and Filters */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search discussions, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {/* Course Filter */}
                    <div className="relative">
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      >
                        {mockCourses.map((course) => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  {/* New Discussion Button */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Discussions</h2>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Plus size={16} className="mr-2" />
                      New Discussion
                    </button>
                  </div>

                  {/* Discussions */}
                  {filteredDiscussions.length > 0 ? (
                    filteredDiscussions.map((discussion) => (
                      <motion.div
                        key={discussion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-xl shadow-sm border ${discussion.isPinned ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}
                        onClick={() => setSelectedDiscussion(discussion.id)}
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                {discussion.author.avatar ? (
                                  <img 
                                    src={discussion.author.avatar} 
                                    alt={discussion.author.name} 
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <User size={20} className="text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium text-gray-900">{discussion.author.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">• {discussion.author.role}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(discussion.createdAt)}
                                </div>
                              </div>
                            </div>
                            
                            {discussion.isPinned && (
                              <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium">
                                <Pin size={12} className="mr-1" />
                                Pinned
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{discussion.title}</h3>
                          <p className="text-gray-700 mb-4 line-clamp-2">{discussion.content}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {discussion.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="flex items-center mr-4">
                              <MessageCircle size={16} className="mr-1" />
                              <span>{discussion.replies} replies</span>
                            </div>
                            <div className="flex items-center mr-4">
                              <ThumbsUp size={16} className="mr-1" />
                              <span>{discussion.likes} likes</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-blue-600">{discussion.course}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                      <Search size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your search terms or filters.</p>
                      <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus size={16} className="mr-2" />
                        Start a New Discussion
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Popular Discussions */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Discussions</h3>
                    <div className="space-y-4">
                      {mockDiscussions
                        .sort((a, b) => b.likes - a.likes)
                        .slice(0, 3)
                        .map((discussion) => (
                          <div 
                            key={discussion.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedDiscussion(discussion.id)}
                          >
                            <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                              {discussion.title}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <ThumbsUp size={12} className="mr-1" />
                              <span>{discussion.likes} likes</span>
                              <span className="mx-2">•</span>
                              <MessageCircle size={12} className="mr-1" />
                              <span>{discussion.replies} replies</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </motion.div>

                  {/* Active Users */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users</h3>
                    <div className="space-y-4">
                      {[...new Set(mockDiscussions.map(d => d.author))].slice(0, 3).map((author) => (
                        <div key={author.id} className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            {author.avatar ? (
                              <img 
                                src={author.avatar} 
                                alt={author.name} 
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <User size={16} className="text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{author.name}</div>
                            <div className="text-xs text-gray-500">{author.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Popular Tags */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(mockDiscussions.flatMap(d => d.tags))].map((tag) => (
                        <div
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Discussion Detail Modal */}
              {selectedDiscussion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                  >
                    {/* Modal Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {mockDiscussions.find(d => d.id === selectedDiscussion)?.title}
                        </h2>
                        <button 
                          onClick={() => setSelectedDiscussion(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          &times;
                        </button>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User size={20} className="text-gray-500" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">
                              {mockDiscussions.find(d => d.id === selectedDiscussion)?.author.name}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              • {mockDiscussions.find(d => d.id === selectedDiscussion)?.author.role}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(mockDiscussions.find(d => d.id === selectedDiscussion)?.createdAt || '')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto flex-1">
                      <p className="text-gray-700 mb-6">
                        {mockDiscussions.find(d => d.id === selectedDiscussion)?.content}
                      </p>
                      
                      <div className="flex items-center space-x-4 mb-8">
                        <button className="flex items-center text-gray-600 hover:text-blue-600">
                          <ThumbsUp size={18} className="mr-1" />
                          <span>Like</span>
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-blue-600">
                          <Bookmark size={18} className="mr-1" />
                          <span>Bookmark</span>
                        </button>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Replies</h3>
                        
                        <div className="space-y-6">
                          {mockComments.map((comment) => (
                            <div key={comment.id} className={`p-4 rounded-lg ${comment.isInstructor ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                                  <User size={16} className="text-gray-500" />
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-gray-900">{comment.author.name}</span>
                                    {comment.isInstructor && (
                                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                                        Instructor
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">{formatDate(comment.createdAt)}</div>
                                </div>
                              </div>
                              <p className="text-gray-700 mb-2">{comment.content}</p>
                              <div className="flex items-center text-sm">
                                <button className="flex items-center text-gray-500 hover:text-blue-600">
                                  <ThumbsUp size={14} className="mr-1" />
                                  <span>{comment.likes}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Comment Form */}
                    <div className="p-6 border-t border-gray-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={20} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <textarea
                            ref={commentInputRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                          />
                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={handlePostComment}
                              disabled={newComment.trim() === '' || isLoading}
                              className={`flex items-center px-4 py-2 rounded-lg ${
                                newComment.trim() === '' || isLoading
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              } transition-colors`}
                            >
                              <Send size={16} className="mr-2" />
                              {isLoading ? 'Posting...' : 'Post Reply'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}