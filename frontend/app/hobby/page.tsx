'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ArrowBigRight,
  Book,
  Computer,
  CookingPot,
  Gamepad,
  Handshake,
  Lightbulb,
  Music,
  PaintBucket,
  Plane,
  Search,
  Star,
  CheckCircle,
  Sparkles,
  Trophy,
  Heart,
  Target
} from 'lucide-react'

function Page() {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  
  const hobbies = [
    { name: 'Reading', type: 'Hobby' },
    { name: 'Music', type: 'Hobby' },
    { name: 'Technology', type: 'Interest' },
    { name: 'Sports', type: 'Hobby' },
    { name: 'Science', type: 'Hobby' },
    { name: 'Art & Design', type: 'Interest' },
    { name: 'Volunteering', type: 'Interest' },
    { name: 'Travel', type: 'Interest' },
    { name: 'Cooking', type: 'Hobby' },
  ]

  const getIconForItem = (name: string, type: string) => {
    const iconClass = "w-8 h-8 text-green-600"
    
    if (type === 'Hobby') {
      switch (name) {
        case 'Reading':
          return <Book className={iconClass} />
        case 'Music':
          return <Music className={iconClass} />
        case 'Sports':
          return <Gamepad className={iconClass} />
        case 'Cooking':
          return <CookingPot className={iconClass} />
        case 'Science':
          return <Lightbulb className={iconClass} />
        default:
          return <Book className={iconClass} />
      }
    } else {
      switch (name) {
        case 'Technology':
          return <Computer className={iconClass} />
        case 'Art & Design':
          return <PaintBucket className={iconClass} />
        case 'Volunteering':
          return <Handshake className={iconClass} />
        case 'Travel':
          return <Plane className={iconClass} />
        default:
          return <Star className={iconClass} />
      }
    }
  }

  const getSmallIconForItem = (name: string, type: string) => {
    const iconClass = "w-5 h-5 text-green-600"
    
    if (type === 'Hobby') {
      switch (name) {
        case 'Reading':
          return <Book className={iconClass} />
        case 'Music':
          return <Music className={iconClass} />
        case 'Sports':
          return <Gamepad className={iconClass} />
        case 'Cooking':
          return <CookingPot className={iconClass} />
        case 'Science':
          return <Lightbulb className={iconClass} />
        default:
          return <Book className={iconClass} />
      }
    } else {
      switch (name) {
        case 'Technology':
          return <Computer className={iconClass} />
        case 'Art & Design':
          return <PaintBucket className={iconClass} />
        case 'Volunteering':
          return <Handshake className={iconClass} />
        case 'Travel':
          return <Plane className={iconClass} />
        default:
          return <Star className={iconClass} />
      }
    }
  }

  const filteredHobbies = hobbies.filter(hobby => {
    const matchesSearch = hobby.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === 'All' || 
      (activeFilter === 'Hobbies' && hobby.type === 'Hobby') ||
      (activeFilter === 'Interests' && hobby.type === 'Interest')
    return matchesSearch && matchesFilter
  })

  const toggleHobby = (hobbyName: string) => {
    setSelectedHobbies(prev => 
      prev.includes(hobbyName)
        ? prev.filter(h => h !== hobbyName)
        : [...prev, hobbyName]
    )
  }

  const handleContinue = () => {
    if (selectedHobbies.length >= 2) {
      setShowSuccess(true)
    }
  }

  const navigateToDashboard = () => {
    router.push('/student/dashboard')
  }

  const selectedHobbiesWithType = selectedHobbies.map(hobbyName => {
    const hobby = hobbies.find(h => h.name === hobbyName)
    return hobby || { name: hobbyName, type: 'Hobby' }
  })

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Section with Background Image */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-auto text-white flex items-center justify-center">
        {/* Background image */}
        <Image
          src="/assets/students4.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />

        {/* Gradient overlay on top of image */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-300 opacity-30 z-10" />

        {/* Optional dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 z-20" />

        {/* Main content */}
        <div className="absolute inset-0 bg-black/40" />
        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="relative z-30 text-center max-w-md"
            >
              <p className="text-sm opacity-80">Step 1 of 3</p>
              <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-2">
                Personalize your learning journey
              </h1>
              <p className="opacity-90 text-sm sm:text-base">
                Tell us what excites you! Select your hobbies and interests to get the most relevant content, communities, and events.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-30 text-center max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
                className="mb-4"
              >
                <CheckCircle className="w-16 h-16 mx-auto text-green-400" />
              </motion.div>
              
              <p className="text-sm opacity-80">Step 2 of 3</p>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-3xl sm:text-4xl font-bold mt-4 mb-2"
              >
                Perfect Choice!
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="opacity-90 text-sm sm:text-base"
              >
                Your preferences have been saved successfully. We'll personalize your experience based on your interests.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom icons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-3 opacity-60">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0 }}
          >
            <Gamepad className="w-6 h-6" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          >
            <PaintBucket className="w-6 h-6" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          >
            <Lightbulb className="w-6 h-6" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 1.5 }}
          >
            <Computer className="w-6 h-6" />
          </motion.div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 p-6 sm:p-8 space-y-6">
        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key="selection"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <span className="font-semibold text-green-700">Welcome, Sara!</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <Star className="w-4 h-4" />
                  <span>Let's get started!</span>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                {/* Search Bar */}
                <div className="flex items-center border border-emerald-300 rounded-md px-3 py-2 bg-white shadow-sm w-full sm:max-w-md">
                  <Search className="w-5 h-5 text-emerald-500 mr-2" />
                  <input
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    placeholder="Search hobbies or interests..."
                    className="flex-1 outline-none text-sm bg-transparent"
                  />
                </div>
                
                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {['All', 'Hobbies', 'Interests'].map((filter) => (
                    <button
                      key={filter}
                      className={`px-4 py-1 text-sm rounded-full transition-all duration-200 ${
                        activeFilter === filter
                          ? 'bg-green-600 text-white'
                          : 'border border-green-500 text-green-700 hover:bg-green-50'
                      }`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hobby Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredHobbies.map((item, index) => {
                  const isSelected = selectedHobbies.includes(item.name)
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleHobby(item.name)}
                      className={`bg-white rounded-xl shadow-md p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        isSelected ? 'bg-green-50 border-2 border-green-500' : 'border border-gray-100 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        {getIconForItem(item.name, item.type)}
                      </div>
                      <h3 className={`font-medium mb-1 ${isSelected ? 'text-green-800' : 'text-green-700'}`}>
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.type}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-2"
                        >
                          <Star className="w-4 h-4 text-green-600 mx-auto fill-green-600" />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* No Results Message */}
              {filteredHobbies.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hobbies found. Try adjusting your search or filters.</p>
                </div>
              )}

              {/* Continue Button */}
              <div className="pt-4">
                <button 
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl shadow-md flex items-center justify-center transition-all duration-200 ${
                    selectedHobbies.length >= 2
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={selectedHobbies.length < 2}
                  onClick={handleContinue}
                >
                  <span>Continue</span>
                  <ArrowBigRight className="w-4 h-4 ml-2" />
                </button>
                {selectedHobbies.length > 0 && (
                  <p className={`text-sm mt-2 ${selectedHobbies.length >= 2 ? 'text-green-600' : 'text-orange-500'}`}>
                    {selectedHobbies.length} interest{selectedHobbies.length !== 1 ? 's' : ''} selected
                    {selectedHobbies.length < 2 && ' (Select at least 2 to continue)'}
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center h-full min-h-[500px] text-center"
            >
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
                className="mb-8"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4"
                  >
                    <div className="w-24 h-24 border-4 border-green-200 border-t-green-500 rounded-full"></div>
                  </motion.div>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold text-green-700 mb-4 flex items-center justify-center gap-2">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  Awesome Selection!
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  We've saved your preferences and will personalize your learning experience.
                </p>
              </motion.div>

              {/* Selected Interests Display */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mb-8 w-full max-w-md"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-700">Your Interests</h3>
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {selectedHobbiesWithType.map((hobby, index) => (
                    <motion.div
                      key={hobby.name}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2"
                    >
                      {getSmallIconForItem(hobby.name, hobby.type)}
                      <div className="text-left">
                        <p className="text-sm font-medium text-green-800">{hobby.name}</p>
                        <p className="text-xs text-green-600">{hobby.type}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Dashboard Button */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="w-full max-w-sm"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={navigateToDashboard}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 text-lg font-semibold transition-all duration-200"
                >
                  <Target className="w-6 h-6" />
                  Take me to my Dashboard
                  <ArrowBigRight className="w-6 h-6" />
                </motion.button>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="text-sm text-gray-500 mt-3"
                >
                  Ready to start your personalized learning journey!
                </motion.p>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4,
                  ease: "easeInOut"
                }}
                className="absolute top-10 left-10 opacity-20"
              >
                <Sparkles className="w-8 h-8 text-green-400" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [10, -10, 10],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute top-20 right-10 opacity-20"
              >
                <Star className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Page