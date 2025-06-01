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

// Types
interface Hobby {
  name: string
  type: 'Hobby' | 'Interest'
}

interface LayoutState {
  selectedHobbies: string[]
  searchTerm: string
  activeFilter: string
}

// Layout Controller - Manages layout state and business logic
class LayoutController {
  private setState: React.Dispatch<React.SetStateAction<LayoutState>>
  
  constructor(setState: React.Dispatch<React.SetStateAction<LayoutState>>) {
    this.setState = setState
  }

  toggleHobby = (hobbyName: string) => {
    this.setState(prev => ({
      ...prev,
      selectedHobbies: prev.selectedHobbies.includes(hobbyName)
        ? prev.selectedHobbies.filter(h => h !== hobbyName)
        : [...prev.selectedHobbies, hobbyName]
    }))
  }

  setSearchTerm = (term: string) => {
    this.setState(prev => ({ ...prev, searchTerm: term }))
  }

  setActiveFilter = (filter: string) => {
    this.setState(prev => ({ ...prev, activeFilter: filter }))
  }

  filterHobbies = (hobbies: Hobby[], state: LayoutState): Hobby[] => {
    return hobbies.filter(hobby => {
      const matchesSearch = hobby.name.toLowerCase().includes(state.searchTerm.toLowerCase())
      const matchesFilter = state.activeFilter === 'All' || 
        (state.activeFilter === 'Hobbies' && hobby.type === 'Hobby') ||
        (state.activeFilter === 'Interests' && hobby.type === 'Interest')
      return matchesSearch && matchesFilter
    })
  }

  getIconForItem = (name: string, type: string) => {
    const iconClass = "w-8 h-8 text-green-600"
    
    if (type === 'Hobby') {
      switch (name) {
        case 'Reading': return <Book className={iconClass} />
        case 'Music': return <Music className={iconClass} />
        case 'Sports': return <Gamepad className={iconClass} />
        case 'Cooking': return <CookingPot className={iconClass} />
        case 'Science': return <Lightbulb className={iconClass} />
        default: return <Book className={iconClass} />
      }
    } else {
      switch (name) {
        case 'Technology': return <Computer className={iconClass} />
        case 'Art & Design': return <PaintBucket className={iconClass} />
        case 'Volunteering': return <Handshake className={iconClass} />
        case 'Travel': return <Plane className={iconClass} />
        default: return <Star className={iconClass} />
      }
    }
  }
}

// Hero Section Component
const HeroSection: React.FC = () => (
  <div className="relative w-full md:w-1/2 h-[40vh] md:h-auto text-white flex items-center justify-center">
    <Image
      src="/assets/students4.jpg"
      alt="Background"
      fill
      className="object-cover"
      priority
    />
    
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-300 opacity-30 z-10" />
    <div className="absolute inset-0 bg-black/30 z-20" />
    <div className="absolute inset-0 bg-black/40" />
    
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
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
    
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-3 opacity-60">
      <Gamepad className="w-6 h-6" />
      <PaintBucket className="w-6 h-6" />
      <Lightbulb className="w-6 h-6" />
      <Computer className="w-6 h-6" />
    </div>
  </div>
)

// Header Component
const Header: React.FC = () => (
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
)

// Search and Filter Component
interface SearchAndFilterProps {
  searchTerm: string
  activeFilter: string
  onSearchChange: (term: string) => void
  onFilterChange: (filter: string) => void
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  activeFilter,
  onSearchChange,
  onFilterChange
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div className="flex items-center border border-emerald-300 rounded-md px-3 py-2 bg-white shadow-sm w-full sm:max-w-md">
      <Search className="w-5 h-5 text-emerald-500 mr-2" />
      <input
        type="text"
        onChange={(e) => onSearchChange(e.target.value)}
        value={searchTerm}
        placeholder="Search hobbies or interests..."
        className="flex-1 outline-none text-sm bg-transparent"
      />
    </div>
    
    <div className="flex gap-2 flex-wrap">
      {['All', 'Hobbies', 'Interests'].map((filter) => (
        <button
          key={filter}
          className={`px-4 py-1 text-sm rounded-full transition-all duration-200 ${
            activeFilter === filter
              ? 'bg-green-600 text-white'
              : 'border border-green-500 text-green-700 hover:bg-green-50'
          }`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  </div>
)

// Hobby Card Component
interface HobbyCardProps {
  hobby: Hobby
  isSelected: boolean
  icon: React.ReactNode
  onToggle: () => void
}

const HobbyCard: React.FC<HobbyCardProps> = ({ hobby, isSelected, icon, onToggle }) => (
  <div
    onClick={onToggle}
    className={`bg-white rounded-xl shadow-md p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
      isSelected ? 'bg-green-50 border-2 border-green-500' : 'border border-gray-100 hover:bg-green-50'
    }`}
  >
    <div className="flex items-center justify-center mb-2">
      {icon}
    </div>
    <h3 className={`font-medium mb-1 ${isSelected ? 'text-green-800' : 'text-green-700'}`}>
      {hobby.name}
    </h3>
    <p className="text-sm text-gray-500">{hobby.type}</p>
    {isSelected && (
      <div className="mt-2">
        <Star className="w-4 h-4 text-green-600 mx-auto fill-green-600" />
      </div>
    )}
  </div>
)

// Hobby Grid Component
interface HobbyGridProps {
  hobbies: Hobby[]
  selectedHobbies: string[]
  getIcon: (name: string, type: string) => React.ReactNode
  onToggleHobby: (name: string) => void
}

const HobbyGrid: React.FC<HobbyGridProps> = ({ hobbies, selectedHobbies, getIcon, onToggleHobby }) => {
  if (hobbies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hobbies found. Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {hobbies.map((hobby, index) => (
        <HobbyCard
          key={index}
          hobby={hobby}
          isSelected={selectedHobbies.includes(hobby.name)}
          icon={getIcon(hobby.name, hobby.type)}
          onToggle={() => onToggleHobby(hobby.name)}
        />
      ))}
    </div>
  )
}

// Continue Button Component
interface ContinueButtonProps {
  selectedCount: number
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ selectedCount }) => (
  <div className="pt-4">
    <button 
      className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-md flex items-center justify-center transition-all duration-200"
      disabled={selectedCount === 0}
    >
      <span>Continue</span>
      <ArrowBigRight className="w-4 h-4 ml-2" />
    </button>
    {selectedCount > 0 && (
      <p className="text-sm text-green-600 mt-2">
        {selectedCount} interest{selectedCount !== 1 ? 's' : ''} selected
      </p>
    )}
  </div>
)

// Main Form Section Component
interface FormSectionProps {
  state: LayoutState
  controller: LayoutController
  hobbies: Hobby[]
}

const FormSection: React.FC<FormSectionProps> = ({ state, controller, hobbies }) => {
  const filteredHobbies = controller.filterHobbies(hobbies, state)

  return (
    <div className="w-full md:w-1/2 p-6 sm:p-8 space-y-6">
      <Header />
      
      <SearchAndFilter
        searchTerm={state.searchTerm}
        activeFilter={state.activeFilter}
        onSearchChange={controller.setSearchTerm}
        onFilterChange={controller.setActiveFilter}
      />
      
      <HobbyGrid
        hobbies={filteredHobbies}
        selectedHobbies={state.selectedHobbies}
        getIcon={controller.getIconForItem}
        onToggleHobby={controller.toggleHobby}
      />
      
      <ContinueButton selectedCount={state.selectedHobbies.length} />
    </div>
  )
}

// Main Page Component
function Page() {
  const [state, setState] = useState<LayoutState>({
    selectedHobbies: [],
    searchTerm: '',
    activeFilter: 'All'
  })

  const controller = new LayoutController(setState)
  
  const hobbies: Hobby[] = [
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <HeroSection />
      <FormSection 
        state={state} 
        controller={controller} 
        hobbies={hobbies} 
      />
    </div>
  )
}

export default Page