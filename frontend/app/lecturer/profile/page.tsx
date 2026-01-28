/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/lecturerSidebar';
import { useLayout } from '@/components/LayoutController';
import { useTheme, useThemeColors } from '@/context/ThemeContext';
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
  Bell,
  Menu,
  X,
  Type,
  Clock,
  CheckCircle,
  GraduationCap,
  FileText,
  TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import FloatingThemeButton from '@/components/FloatingThemeButton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://68.221.169.119/api/v1";

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

// Top Header Component
const TopHeader: React.FC<{ onSidebarToggle: () => void }> = ({ onSidebarToggle }) => {
  const colors = useThemeColors();
  const { config } = useTheme();

  return (
    <header 
      className="flex items-center justify-between px-4 py-4 lg:py-6 border-b shadow-sm lg:shadow-none"
      style={{
        background: colors.cardBackground,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center space-x-3">
        <button
          className="lg:hidden transition-colors"
          onClick={onSidebarToggle}
          aria-label="Open sidebar"
          style={{ color: colors.primary }}
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold" style={{ color: colors.primary }}>
          EduPortal
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          className="relative transition-colors"
          style={{ color: colors.textSecondary }}
        >
          <Bell className="w-6 h-6" />
          <span 
            className="absolute -top-1 -right-1 text-xs rounded-full px-1.5 py-0.5"
            style={{
              background: colors.primary,
              color: colors.background
            }}
          >
            3
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: `${colors.primary}30` }}
          >
            <User className="w-4 h-4" style={{ color: colors.primary }} />
          </div>
          <span 
            className="text-sm font-semibold hidden md:inline"
            style={{ color: colors.textPrimary }}
          >
            Dr. Alex Kimani
          </span>
        </div>
      </div>
    </header>
  );
};

// Main Profile Page Component
export default function LecturerProfilePage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const { config } = useTheme();
  const colors = useThemeColors();
  
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedProfile, setEditedProfile] = useState(mockProfile);
  const [newResearchInterest, setNewResearchInterest] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleProfileUpdate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setProfile(editedProfile);
      setIsEditing(false);
      setIsLoading(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
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

  // Dynamic gradient based on theme
  const getGradient = () => {
    const isDark = config.mode === 'dark';
    const primary = colors.primary;
    const secondary = colors.secondary;
    
    if (isDark) {
      return `linear-gradient(135deg, ${primary}20 0%, ${secondary}30 50%, ${primary}20 100%)`;
    }
    return `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
  };

  const getCardGradient = () => {
    const isDark = config.mode === 'dark';
    return isDark 
      ? `linear-gradient(135deg, ${colors.cardBackground} 0%, ${colors.backgroundTertiary} 100%)`
      : colors.cardBackground;
  };

  return (
    <div className="min-h-screen flex" style={{ background: colors.background }}>
      <Sidebar />
      
      <motion.div
        initial={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        animate={{ 
          marginLeft: (!isMobileView && !isTabletView) ? (sidebarCollapsed ? 80 : 240) : 0 
        }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col"
      >
        <TopHeader onSidebarToggle={() => {}} />
        
        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.success}15, ${colors.success}25)`,
                border: `2px solid ${colors.success}`,
                backdropFilter: 'blur(12px)'
              }}
            >
              <CheckCircle size={24} style={{ color: colors.success }} />
              <span style={{ color: colors.textPrimary, fontWeight: 600 }}>
                Profile updated successfully!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <main className="flex-1 p-4 lg:p-6 max-w-8xl mx-auto w-full">
          <div className="max-w-5xl mx-auto">
            {/* Profile Header Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl shadow-lg overflow-hidden mb-8 relative"
              style={{
                background: getCardGradient(),
                border: `1px solid ${colors.border}`
              }}
            >
              {/* Header with Diagonal Design */}
              <div 
                className="relative h-56 overflow-hidden"
                style={{
                  background: getGradient(),
                  clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)'
                }}
              >
                {/* Background Pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'url(/assets/pattern1.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {/* Action Button */}
                <motion.button 
                  onClick={() => isEditing ? handleProfileUpdate() : setIsEditing(true)}
                  disabled={isLoading}
                  className="absolute top-6 right-6 px-6 py-3 rounded-full shadow-md backdrop-blur-md transition-all duration-300 font-semibold"
                  style={{
                    background: config.mode === 'dark' 
                      ? `${colors.cardBackground}cc` 
                      : `${colors.background}f5`,
                    border: `2px solid ${colors.border}`,
                    color: colors.primary,
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEditing ? (
                    <span className="flex items-center gap-2">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Profile
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Edit2 size={18} />
                      Edit Profile
                    </span>
                  )}
                </motion.button>
              </div>
              
              <div className="relative px-8 pb-8 -mt-16">
                {/* Avatar Section */}
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={isEditing ? { scale: 1.05 } : {}}
                  >
                    <div 
                      className="relative rounded-full overflow-hidden shadow-lg"
                      style={{
                        border: `5px solid ${colors.cardBackground}`,
                      }}
                    >
                      {isEditing ? (
                        <div className="relative group">
                          <div 
                            className="w-40 h-40 flex items-center justify-center cursor-pointer transition-all duration-300"
                            onClick={triggerFileInput}
                            style={{
                              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                            }}
                          >
                            {previewImage ? (
                              <Image 
                                src={previewImage} 
                                alt="Profile preview" 
                                className="w-full h-full object-cover"
                                width={160} 
                                height={160} 
                                priority
                              />
                            ) : profile.avatar ? (
                              <Image 
                                src={profile.avatar} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                width={160} 
                                height={160} 
                                priority
                              />
                            ) : (
                              <User size={64} style={{ color: colors.primary }} />
                            )}
                          </div>
                          <div 
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                            style={{
                              background: `${colors.primary}cc`,
                            }}
                            onClick={triggerFileInput}
                          >
                            <Camera size={40} style={{ color: colors.background }} />
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
                        <div 
                          className="w-40 h-40 flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                          }}
                        >
                          {profile.avatar ? (
                            <Image 
                              src={profile.avatar} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                              width={160} 
                              height={160} 
                              priority
                            />
                          ) : (
                            <User size={64} style={{ color: colors.primary }} />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Profile Info */}
                  <div className="flex-1 mt-4 md:mt-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                        className="text-3xl font-bold mb-2 w-full px-4 py-2 rounded-xl transition-all duration-300"
                        style={{
                          color: colors.textPrimary,
                          background: colors.backgroundSecondary,
                          border: `2px solid ${colors.border}`,
                        }}
                      />
                    ) : (
                      <motion.h1 
                        className="text-4xl font-bold mb-2"
                        style={{ color: colors.textPrimary }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {profile.name}
                      </motion.h1>
                    )}
                    
                    <motion.div 
                      className="flex flex-wrap items-center gap-4 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div 
                        className="flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{
                          background: `${colors.primary}15`,
                          border: `1px solid ${colors.primary}30`,
                        }}
                      >
                        <GraduationCap size={18} style={{ color: colors.primary }} />
                        <span style={{ color: colors.textPrimary, fontWeight: 600 }}>
                          {profile.position}
                        </span>
                      </div>
                      <div 
                        className="flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{
                          background: `${colors.secondary}15`,
                          border: `1px solid ${colors.secondary}30`,
                        }}
                      >
                        <Briefcase size={18} style={{ color: colors.secondary }} />
                        <span style={{ color: colors.textPrimary, fontWeight: 600 }}>
                          {profile.department}
                        </span>
                      </div>
                      <div 
                        className="flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{
                          background: `${colors.accent}15`,
                          border: `1px solid ${colors.accent}30`,
                        }}
                      >
                        <Award size={18} style={{ color: colors.accent }} />
                        <span style={{ color: colors.textPrimary, fontWeight: 600 }}>
                          {profile.employeeId}
                        </span>
                      </div>
                    </motion.div>

                    {isEditing ? (
                      <textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                        className="w-full p-4 rounded-xl resize-none transition-all duration-300"
                        style={{
                          color: colors.textPrimary,
                          background: colors.backgroundSecondary,
                          border: `2px solid ${colors.border}`,
                        }}
                        rows={3}
                      />
                    ) : (
                      <motion.p 
                        className="text-lg leading-relaxed"
                        style={{ color: colors.textSecondary }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {profile.bio}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Professional Information */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 rounded-3xl shadow-lg p-8"
                style={{
                  background: getCardGradient(),
                  border: `1px solid ${colors.border}`,
                }}
              >
                <h2 
                  className="text-2xl font-bold mb-6 flex items-center gap-3"
                  style={{ color: colors.textPrimary }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    <Briefcase size={20} style={{ color: colors.background }} />
                  </div>
                  Professional Information
                </h2>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div whileHover={{ x: 4 }}>
                      <label 
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textSecondary }}
                      >
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                          className="w-full p-4 rounded-xl transition-all duration-300"
                          style={{
                            color: colors.textPrimary,
                            background: colors.backgroundSecondary,
                            border: `2px solid ${colors.border}`,
                          }}
                        />
                      ) : (
                        <div 
                          className="flex items-center gap-3 p-4 rounded-xl"
                          style={{
                            background: colors.backgroundSecondary,
                            border: `1px solid ${colors.borderLight}`,
                          }}
                        >
                          <Mail size={20} style={{ color: colors.primary }} />
                          <span style={{ color: colors.textPrimary }}>{profile.email}</span>
                        </div>
                      )}
                    </motion.div>
                    
                    <motion.div whileHover={{ x: 4 }}>
                      <label 
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textSecondary }}
                      >
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                          className="w-full p-4 rounded-xl transition-all duration-300"
                          style={{
                            color: colors.textPrimary,
                            background: colors.backgroundSecondary,
                            border: `2px solid ${colors.border}`,
                          }}
                        />
                      ) : (
                        <div 
                          className="flex items-center gap-3 p-4 rounded-xl"
                          style={{
                            background: colors.backgroundSecondary,
                            border: `1px solid ${colors.borderLight}`,
                          }}
                        >
                          <Phone size={20} style={{ color: colors.primary }} />
                          <span style={{ color: colors.textPrimary }}>{profile.phone}</span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  <motion.div whileHover={{ x: 4 }}>
                    <label 
                      className="block text-sm font-semibold mb-2"
                      style={{ color: colors.textSecondary }}
                    >
                      Office Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.address}
                        onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                        className="w-full p-4 rounded-xl transition-all duration-300"
                        style={{
                          color: colors.textPrimary,
                          background: colors.backgroundSecondary,
                          border: `2px solid ${colors.border}`,
                        }}
                      />
                    ) : (
                      <div 
                        className="flex items-center gap-3 p-4 rounded-xl"
                        style={{
                          background: colors.backgroundSecondary,
                          border: `1px solid ${colors.borderLight}`,
                        }}
                      >
                        <MapPin size={20} style={{ color: colors.primary }} />
                        <span style={{ color: colors.textPrimary }}>{profile.address}</span>
                      </div>
                    )}
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div whileHover={{ x: 4 }}>
                      <label 
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textSecondary }}
                      >
                        Qualification
                      </label>
                      <div 
                        className="flex items-center gap-3 p-4 rounded-xl"
                        style={{
                          background: colors.backgroundSecondary,
                          border: `1px solid ${colors.borderLight}`,
                        }}
                      >
                        <Award size={20} style={{ color: colors.primary }} />
                        <span style={{ color: colors.textPrimary }}>{profile.qualification}</span>
                      </div>
                    </motion.div>
                    
                    <motion.div whileHover={{ x: 4 }}>
                      <label 
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textSecondary }}
                      >
                        Specialization
                      </label>
                      <div 
                        className="flex items-center gap-3 p-4 rounded-xl"
                        style={{
                          background: colors.backgroundSecondary,
                          border: `1px solid ${colors.borderLight}`,
                        }}
                      >
                        <TrendingUp size={20} style={{ color: colors.primary }} />
                        <span style={{ color: colors.textPrimary }}>{profile.specialization}</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div whileHover={{ x: 4 }}>
                      <label 
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textSecondary }}
                      >
                        Join Date
                      </label>
                      <div 
                        className="flex items-center gap-3 p-4 rounded-xl"
                        style={{
                          background: colors.backgroundSecondary,
                          border: `1px solid ${colors.borderLight}`,
                        }}
                      >
                        <Calendar size={20} style={{ color: colors.primary }} />
                        <span style={{ color: colors.textPrimary }}>
                          {new Date(profile.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                    
                    <motion.div whileHover={{ x: 4 }}>
                      <label 
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textSecondary }}
                      >
                        Office Hours
                      </label>
                      <div 
                        className="flex items-center gap-3 p-4 rounded-xl"
                        style={{
                          background: colors.backgroundSecondary,
                          border: `1px solid ${colors.borderLight}`,
                        }}
                      >
                        <Clock size={20} style={{ color: colors.primary }} />
                        <span style={{ color: colors.textPrimary }}>{profile.officeHours}</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Research Interests */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-3xl shadow-lg p-8"
                style={{
                  background: getCardGradient(),
                  border: `1px solid ${colors.border}`,
                }}
              >
                <h2 
                  className="text-2xl font-bold mb-6 flex items-center gap-3"
                  style={{ color: colors.textPrimary }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    <BookOpen size={20} style={{ color: colors.background }} />
                  </div>
                  Research
                </h2>
                
                <div className="space-y-4">
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newResearchInterest}
                        onChange={(e) => setNewResearchInterest(e.target.value)}
                        placeholder="Add research interest..."
                        className="flex-1 p-3 rounded-xl transition-all duration-300"
                        style={{
                          color: colors.textPrimary,
                          background: colors.backgroundSecondary,
                          border: `2px solid ${colors.border}`,
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && addResearchInterest()}
                      />
                      <motion.button
                        onClick={addResearchInterest}
                        className="px-5 py-3 rounded-xl font-semibold shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                          color: colors.background,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add
                      </motion.button>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-3">
                    <AnimatePresence>
                      {(isEditing ? editedProfile.researchInterests : profile.researchInterests).map((interest, index) => (
                        <motion.div
                          key={interest}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                            border: `2px solid ${colors.primary}30`,
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          <span 
                            className="font-medium"
                            style={{ color: colors.textPrimary }}
                          >
                            {interest}
                          </span>
                          {isEditing && (
                            <button
                              onClick={() => removeResearchInterest(interest)}
                              className="ml-1 transition-colors"
                              style={{ color: colors.error }}
                            >
                              <X size={16} />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Current Courses */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 rounded-3xl shadow-lg p-8"
              style={{
                background: getCardGradient(),
                border: `1px solid ${colors.border}`,
              }}
            >
              <h2 
                className="text-2xl font-bold mb-6 flex items-center gap-3"
                style={{ color: colors.textPrimary }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  }}
                >
                  <FileText size={20} style={{ color: colors.background }} />
                </div>
                Current Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.courses.map((course, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-5 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
                      border: `1px solid ${colors.borderLight}`,
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}30)`,
                        }}
                      >
                        <BookOpen size={20} style={{ color: colors.primary }} />
                      </div>
                      <span 
                        className="font-semibold"
                        style={{ color: colors.textPrimary }}
                      >
                        {course}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </motion.div>
      <FloatingThemeButton/>
    </div>
  );
}