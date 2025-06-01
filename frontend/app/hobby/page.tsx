'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
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
  Star
} from 'lucide-react'

function Page() {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  
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
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-md"
        >
          <p className="text-sm opacity-80">Step 1 of 3</p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-2">
            Personalize your learning journey
          </h1>
          <p className="opacity-90 text-sm sm:text-base">
            Tell us what excites you! Select your hobbies and interests to get the most relevant content, communities, and events.
          </p>
        </motion.div>
  {/* Bottom icons */}
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-3 opacity-60">
    <Gamepad className="w-6 h-6" />
    <PaintBucket className="w-6 h-6" />
    <Lightbulb className="w-6 h-6" />
    <Computer className="w-6 h-6" />
  </div>
</div>


      {/* Right Section with Form */}
      <div className="w-full md:w-1/2 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredHobbies.map((item, index) => {
            const isSelected = selectedHobbies.includes(item.name)
            return (
              <div
                key={index}
                onClick={() => toggleHobby(item.name)}
                className={`bg-white rounded-xl shadow-md p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
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
                  <div className="mt-2">
                    <Star className="w-4 h-4 text-green-600 mx-auto fill-green-600" />
                  </div>
                )}
              </div>
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
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-md flex items-center justify-center transition-all duration-200"
            disabled={selectedHobbies.length === 0}
          >
            <span>Continue</span>
            <ArrowBigRight className="w-4 h-4 ml-2" />
          </button>
          {selectedHobbies.length > 0 && (
            <p className="text-sm text-green-600 mt-2">
              {selectedHobbies.length} interest{selectedHobbies.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page