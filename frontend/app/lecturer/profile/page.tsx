/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useRef } from 'react';
import Sidebar from '@/components/lecturerSidebar';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { useLayout } from '@/components/LayoutController';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Camera,
  Save,
  Briefcase,
  BookOpen,
  Award,
  Heart,
  Bell,
  Menu,
  X,
  Type,
  ChevronDown,
  ChevronUp,
  Monitor,
  GraduationCap,
  Plus,
  FileText,
  BookMarked,
  MessageCircle,
  BarChart3,
  Book,
  Settings,
  Clock
} from 'lucide-react';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

// Mock lecturer profile data
const mockProfile = {
  id: 1,
  name: 'Dr. Alex Kimani',
  email: 'alex.kimani@university.edu',
  phone: '+254 712 345 678',
  address: 'University Faculty Block C, Room 205',
  dateOfBirth: '1980-03-20',
  joinDate: '2015-08-01',
  employeeId: 'LEC-2015-006',
  department: 'Computer Science',
  position: 'Senior Lecturer',
  qualification: 'PhD in Computer Science',
  specialization: 'Artificial Intelligence & Machine Learning',
  bio: "I'm a passionate educator and researcher specializing in AI and machine learning. I enjoy mentoring students and contributing to cutting-edge research in computer science.",
  researchInterests: ['Machine Learning', 'Data Science', 'Computer Vision', 'Natural Language Processing', 'Deep Learning'],
  courses: ['CS201 - Data Structures', 'CS301 - Machine Learning', 'CS401 - Advanced AI'],
  socialLinks: {
    linkedin: 'linkedin.com/in/alexkimani',
    researchgate: 'researchgate.net/profile/Alex-Kimani',
    orcid: 'orcid.org/0000-0002-1234-5678'
  },
  avatar: null as string | null,
  officeHours: 'Monday & Wednesday 2:00 PM - 4:00 PM',
  yearsOfExperience: 10
};

// Navigation items for the sidebar
const navigationItems = [
  { icon: Monitor, label: 'Dashboard', path: '/lecturer/dashboard' },
  { icon: GraduationCap, label: 'Courses', path: '/lecturer/courses' },
  { 
    icon: Plus, 
    label: 'Create', 
    hasDropdown: true,
    dropdownItems: [
      { label: 'New Assignment', path: '/lecturer/assignment/create', icon: FileText },
      { label: 'New Task', path: '/lecturer/task/create', icon: BookOpen },
      { label: 'New CAT', path: '/lecturer/cat/create', icon: BookMarked }
    ] 
  },
  { icon: FileText, label: 'Assignment', count: 8, path: '/lecturer/assignment' },
  { icon: BookMarked, label: 'CATs', path: '/lecturer/cats' },
  { icon: MessageCircle, label: 'Forums', path: '/lecturer/forums' },
  { icon: BarChart3, label: 'Submission', path: '/lecturer/submission' },
  { icon: Book, label: 'Library', path: '/lecturer/library' },
  { icon: User, label: 'Profile', active: true, path: '/lecturer/profile' },
  { icon: Settings, label: 'Settings', path: '/lecturer/settings' }
];

// Sidebar Header Component
const SidebarHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="flex items-center justify-between p-6 border-b border-rose-200">
    <div className="flex items-center space-x-2 text-xl font-bold">
      <Type className="w-6 h-6 text-rose-600" />
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

// Top Header Component
const TopHeader: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => (
  <header className="flex items-center justify-between px-4 py-4 lg:py-6 bg-white border-b border-gray-200 shadow-sm lg:shadow-none">
    <div className="flex items-center space-x-3">
      <button
        className="lg:hidden text-rose-600 hover:text-emerald-800 transition-colors"
        onClick={onSidebarToggle}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
      <span className="text-xl font-bold text-emerald-600">EduPortal</span>
    </div>
    <div className="flex items-center space-x-4">
      <button className="relative text-gray-500 hover:text-emerald-600 transition-colors">
        <Bell className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full px-1.5 py-0.5">3</span>
      </button>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-emerald-600" />
        </div>
        <span className="text-sm font-semibold text-gray-700 hidden md:inline">Dr. Alex Kimani</span>
      </div>
    </div>
  </header>
);

// User Profile Component for Sidebar
const UserProfile = () => (
  <div className="flex p-6 items-center space-x-3 text-sm border-b border-rose-300 font-medium">
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
      <div className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center">
        <User className="w-4 h-4 text-rose-600" />
      </div>
    </div>
    <div className="text-white">
      <div className="font-semibold"> Alex Kimani</div>
      <div className="text-xs opacity-80">Senior Lecturer</div>
    </div>
  </div>
);

// Navigation Dropdown Component
type DropdownItem = {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const NavigationDropdown = ({
  items,
  isOpen
}: {
  items: DropdownItem[];
  isOpen: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="ml-8 mt-2 space-y-1">
      {items.map((item: DropdownItem, index: number) => (
        <button
          key={index}
          className="w-full text-left p-2 text-sm font-medium rounded-lg hover:bg-rose-300 hover:bg-opacity-50 transition-all duration-200 text-white flex items-center"
          onClick={() => console.log(`Navigate to ${item.path}`)}
        >
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          {item.label}
        </button>
      ))}
    </div>
  );
};

// Navigation Item Component
type NavigationItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path?: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  count?: number;
  active?: boolean;
};

const NavigationItemComponent = ({
  item,
  isDropdownOpen,
  onDropdownToggle
}: {
  item: NavigationItem;
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
}) => {
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
        />
      </div>
    );
  }

  return (
    <button 
      onClick={() => console.log(`Navigate to ${item.path}`)}
      className={`w-full flex items-center justify-between space-x-3 p-3 rounded-lg transition-all duration-200 ${
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
    </button>
  );
};



 
// Main Profile Page Component
export default function page() {
  const { sidebarCollapsed, isMobileView, isTabletView }  = useLayout();
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedProfile, setEditedProfile] = useState(mockProfile);
  const [newResearchInterest, setNewResearchInterest] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);



  const handleProfileUpdate = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProfile(editedProfile);
      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreviewImage(reader.result);
          setEditedProfile({...editedProfile, avatar: reader.result});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addResearchInterest = () => {
    if (newResearchInterest.trim() !== '' && !editedProfile.researchInterests.includes(newResearchInterest.trim())) {
      setEditedProfile({
        ...editedProfile,
        researchInterests: [...editedProfile.researchInterests, newResearchInterest.trim()]
      });
      setNewResearchInterest('');
    }
  };

  const removeResearchInterest = (interest: string) => {
    setEditedProfile({
      ...editedProfile,
      researchInterests: editedProfile.researchInterests.filter(i => i !== interest)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
     
      />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopHeader onSidebarToggle={() => {}} />
        
        <main className="flex-1 p-4 lg:p-6 max-w-8xl mx-auto w-full">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="relative h-40 bg-gradient-to-r from-rose-500 to-purple-600">
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Edit2 size={16} className="text-gray-700" />
                  </button>
                ) : (
                  <button 
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Save size={16} className={`${isLoading ? 'text-gray-400' : 'text-gray-700'}`} />
                  </button>
                )}
              </div>
              
              <div className="relative px-6 pb-6">
                <div className="absolute -top-16 left-6 rounded-full border-4 border-white overflow-hidden">
                  {isEditing ? (
                    <div className="relative">
                      <div 
                        className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={triggerFileInput}
                      >
                        {previewImage ? (
                          
                          <Image 
                            src={previewImage} 
                            alt="Profile preview" 
                            className="w-full h-full object-cover"
                            width={128} 
                            height={128} 
                            priority
                          />
                        ) : (
                          profile.avatar ? (
                            <Image 
                              src={profile.avatar} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                              width={128} 
                              height={128} 
                              priority
                            />
                          ) : (
                            <User size={48} className="text-gray-400" />
                          )
                        )}
                        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Camera size={32} className="text-white" />
                        </div>
                      </div>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      {profile.avatar ? (
                        <Image 
                          src={profile.avatar} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          width={128} 
                          height={128} 
                          priority
                        />
                      ) : (
                        <User size={48} className="text-gray-400" />
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-20">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      className="text-2xl font-bold text-gray-900 mb-1 w-full border-b border-gray-300 focus:outline-none focus:border-rose-500 pb-1"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h1>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-2" />
                      <span>{profile.position}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen size={16} className="mr-2" />
                      <span>{profile.department}</span>
                    </div>
                    <div className="flex items-center">
                      <Award size={16} className="mr-2" />
                      <span>Employee ID: {profile.employeeId}</span>
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-700 mb-4">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Mail size={16} className="text-gray-400 mr-2" />
                          <span className="text-gray-800">{profile.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Phone size={16} className="text-gray-400 mr-2" />
                          <span className="text-gray-800">{profile.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.address}
                        onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-800">{profile.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                      <div className="flex items-center">
                        <Award size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-800">{profile.qualification}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                      <div className="flex items-center">
                        <BookOpen size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-800">{profile.specialization}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-800">{new Date(profile.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
                      <div className="flex items-center">
                        <Clock size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-800">{profile.officeHours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Interests */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Research Interests</h2>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newResearchInterest}
                          onChange={(e) => setNewResearchInterest(e.target.value)}
                          placeholder="Add research interest"
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                          onKeyDown={(e) => e.key === 'Enter' && addResearchInterest()}
                        />
                        <button
                          onClick={addResearchInterest}
                          className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {editedProfile.researchInterests.map((interest) => (
                          <div
                            key={interest}
                            className="flex items-center bg-rose-50 text-rose-700 rounded-full px-3 py-1"
                          >
                            <Heart size={14} className="mr-1" />
                            <span className="text-sm">{interest}</span>
                            <button
                              onClick={() => removeResearchInterest(interest)}
                              className="ml-2 text-rose-400 hover:text-rose-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.researchInterests.map((interest) => (
                        <div
                          key={interest}
                          className="flex items-center bg-rose-50 text-rose-700 rounded-full px-3 py-1"
                        >
                          <Heart size={14} className="mr-1" />
                          <span className="text-sm">{interest}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Current Courses */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.courses.map((course, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <BookOpen size={16} className="text-rose-600 mr-2" />
                      <span className="font-medium text-gray-800">{course}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}