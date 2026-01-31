/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
import { useTheme, useThemeColors } from '@/context/ThemeContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
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
  X,
  CheckCircle
} from 'lucide-react';
import FloatingThemeButton from '@/components/FloatingThemeButton';

// Profile type
type Profile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  admissionDate: string;
  studentId: string;
  faculty: string;
  year: number;
  semester: number;
  bio: string;
  hobbies: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  avatar: string | null;
};

const mockProfile: Profile = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@university.edu',
  phone: '+254 712 345 678',
  address: 'University Residence, Block B',
  dateOfBirth: '2000-05-15',
  admissionDate: '2023-09-01',
  studentId: 'STU-2023-0042',
  faculty: 'Computer Science',
  year: 3,
  semester: 2,
  bio: "I'm a passionate student interested in AI and machine learning. Looking forward to connecting with others who share similar interests.",
  hobbies: ['Coding', 'Chess', 'Photography', 'Hiking'],
  socialLinks: {
    github: 'github.com/johndoe',
    linkedin: 'linkedin.com/in/johndoe',
    twitter: 'twitter.com/johndoe'
  },
  avatar: null
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function ProfilePage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const { config } = useTheme();
  const colors = useThemeColors();
  
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedProfile, setEditedProfile] = useState(mockProfile);
  const [newHobby, setNewHobby] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/auth/me`, {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.name && data.surname && data.reg_number) {
          setProfile(prev => ({
            ...prev,
            name: `${data.name} ${data.surname}`,
            studentId: data.reg_number,
            email: data.email || prev.email,
            year: data.year_of_study || prev.year,
            semester: data.semester || prev.semester,
            faculty: data.course_name || prev.faculty,
          }));
        }
      })
      .catch(() => {});
  }, []);

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
        setPreviewImage(reader.result as string);
        setEditedProfile({...editedProfile, avatar: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addHobby = () => {
    if (newHobby.trim() !== '' && !editedProfile.hobbies.includes(newHobby.trim())) {
      setEditedProfile({
        ...editedProfile,
        hobbies: [...editedProfile.hobbies, newHobby.trim()]
      });
      setNewHobby('');
    }
  };

  const removeHobby = (hobby: string) => {
    setEditedProfile({
      ...editedProfile,
      hobbies: editedProfile.hobbies.filter(h => h !== hobby)
    });
  };

  // Dynamic gradient based on theme
  const getGradient = () => {
    const isDark = config.mode === 'dark';
    const primary = colors.primary;
    const secondary = colors.secondary;
    
    if (isDark) {
      return `linear-gradient(135deg, ${primary}15 0%, ${secondary}25 50%, ${primary}15 100%)`;
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
        <Header title="My Profile" />
        
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

        <main className="p-4 md:p-6 pb-12">
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
              {/* Dynamic Gradient Header */}
              <div 
                className="relative h-48 overflow-hidden"
                style={{
                  background: getGradient(),
                  position: 'relative'
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
              
              <div className="relative px-8 pb-8">
                {/* Avatar Section */}
                <motion.div 
                  className="absolute -top-20 left-8"
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
                            <img 
                              src={previewImage} 
                              alt="Profile preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : profile.avatar ? (
                            <img 
                              src={profile.avatar} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
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
                          <img 
                            src={profile.avatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={64} style={{ color: colors.primary }} />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Profile Info */}
                <div className="pt-24 pl-0">
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
                    className="flex flex-wrap items-center gap-6 mb-6"
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
                      <Briefcase size={18} style={{ color: colors.primary }} />
                      <span style={{ color: colors.textPrimary, fontWeight: 600 }}>
                        {profile.faculty}
                      </span>
                    </div>
                    <div 
                      className="flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{
                        background: `${colors.secondary}15`,
                        border: `1px solid ${colors.secondary}30`,
                      }}
                    >
                      <BookOpen size={18} style={{ color: colors.secondary }} />
                      <span style={{ color: colors.textPrimary, fontWeight: 600 }}>
                        Year {profile.year}, Sem {profile.semester}
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
                        {profile.studentId}
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
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
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
                    <User size={20} style={{ color: colors.background }} />
                  </div>
                  Personal Information
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
                      Address
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
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedProfile.dateOfBirth}
                          onChange={(e) => setEditedProfile({...editedProfile, dateOfBirth: e.target.value})}
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
                          <Calendar size={20} style={{ color: colors.primary }} />
                          <span style={{ color: colors.textPrimary }}>
                            {new Date(profile.dateOfBirth).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </motion.div>
                    
                    <motion.div whileHover={{ x: 4 }}>
                      <label 
                        className="block text-sm font-semibold mb-2"
                        style={{ color: colors.textSecondary }}
                      >
                        Admission Date
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
                          {new Date(profile.admissionDate).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Hobbies & Interests */}
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
                    <Heart size={20} style={{ color: colors.background }} />
                  </div>
                  Interests
                </h2>
                
                <div className="space-y-4">
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newHobby}
                        onChange={(e) => setNewHobby(e.target.value)}
                        placeholder="Add new interest..."
                        className="flex-1 p-3 rounded-xl transition-all duration-300"
                        style={{
                          color: colors.textPrimary,
                          background: colors.backgroundSecondary,
                          border: `2px solid ${colors.border}`,
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && addHobby()}
                      />
                      <motion.button
                        onClick={addHobby}
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
                      {(isEditing ? editedProfile.hobbies : profile.hobbies).map((hobby, index) => (
                        <motion.div
                          key={hobby}
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
                            {hobby}
                          </span>
                          {isEditing && (
                            <button
                              onClick={() => removeHobby(hobby)}
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
          </div>
        </main>
      </motion.div>
      <FloatingThemeButton/>
    </div>
  );
}