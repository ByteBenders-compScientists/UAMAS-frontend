'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLayout } from '@/components/LayoutController';
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
  Heart
} from 'lucide-react';

// Mock data
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
  avatar: string | null; // Allow both string and null
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
  avatar: null // Will be replaced with an actual image URL when uploaded
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function ProfilePage() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedProfile, setEditedProfile] = useState(mockProfile);
  const [newHobby, setNewHobby] = useState('');
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
        <Header title="My Profile" />
        
        <main className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6"
            >
              <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
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
                          <img 
                            src={previewImage} 
                            alt="Profile preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          profile.avatar ? (
                            <img 
                              src={profile.avatar} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
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
                        <img 
                          src={profile.avatar} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
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
                      className="text-2xl font-bold text-gray-900 mb-1 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-1"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h1>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-2" />
                      <span>{profile.faculty}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen size={16} className="mr-2" />
                      <span>Year {profile.year}, Semester {profile.semester}</span>
                    </div>
                    <div className="flex items-center">
                      <Award size={16} className="mr-2" />
                      <span>Student ID: {profile.studentId}</span>
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-700 mb-4">{profile.bio}</p>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.address}
                        onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedProfile.dateOfBirth}
                          onChange={(e) => setEditedProfile({...editedProfile, dateOfBirth: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <span className="text-gray-800">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-800">{new Date(profile.admissionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Hobbies & Interests */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hobbies & Interests</h2>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newHobby}
                          onChange={(e) => setNewHobby(e.target.value)}
                          placeholder="Add a new hobby"
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => e.key === 'Enter' && addHobby()}
                        />
                        <button
                          onClick={addHobby}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {editedProfile.hobbies.map((hobby) => (
                          <div
                            key={hobby}
                            className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1"
                          >
                            <Heart size={14} className="mr-1" />
                            <span className="text-sm">{hobby}</span>
                            <button
                              onClick={() => removeHobby(hobby)}
                              className="ml-2 text-blue-400 hover:text-blue-700"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.hobbies.map((hobby) => (
                        <div
                          key={hobby}
                          className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1"
                        >
                          <Heart size={14} className="mr-1" />
                          <span className="text-sm">{hobby}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}