"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Book,
  Computer,
  CookingPot,
  Gamepad,
  Handshake,
  Lightbulb,
  Music,
  PaintbrushIcon as PaintBrush,
  Plane,
  Search,
  Star,
  CheckCircle,
  Sparkles,
  Trophy,
  Heart,
  Target,
  Plus,
  X,
  Zap,
  Camera,
  Dumbbell,
  Guitar,
  Palette,
  Coffee,
  Mountain,
  Film,
  Headphones,
  Brush,
  Globe,
  Rocket,
} from "lucide-react"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

interface Hobby {
  name: string
  type: "Hobby" | "Interest" | "Custom"
  isCustom?: boolean
}

// Fixed particle positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { left: 10, top: 20 },
  { left: 80, top: 15 },
  { left: 25, top: 60 },
  { left: 70, top: 75 },
  { left: 45, top: 30 },
  { left: 90, top: 50 },
]

// Fixed floating element positions
const FLOATING_POSITIONS = [
  { left: 15, top: 25 },
  { left: 75, top: 35 },
  { left: 35, top: 70 },
  { left: 85, top: 80 },
  { left: 20, top: 85 },
  { left: 60, top: 20 },
  { left: 40, top: 45 },
  { left: 80, top: 65 },
]

function HobbySelectionPage() {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [showSuccess, setShowSuccess] = useState(false)
  const [user, setUser] = useState<{ name?: string }>({})
  const [customHobby, setCustomHobby] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customHobbies, setCustomHobbies] = useState<Hobby[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    const storedUser = localStorage.getItem("userData")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])
  useEffect(() => {
  return () => {
    setIsNavigating(false);
  };
}, []);

  const predefinedHobbies: Hobby[] = [
    { name: "Reading", type: "Hobby" },
    { name: "Music Production", type: "Hobby" },
    { name: "Technology", type: "Interest" },
    { name: "Gaming", type: "Hobby" },
    { name: "Science", type: "Interest" },
    { name: "Digital Art", type: "Interest" },
    { name: "Volunteering", type: "Interest" },
    { name: "Travel", type: "Interest" },
    { name: "Cooking", type: "Hobby" },
    { name: "Photography", type: "Hobby" },
    { name: "Fitness", type: "Hobby" },
    { name: "Guitar Playing", type: "Hobby" },
    { name: "Painting", type: "Hobby" },
    { name: "Coffee Culture", type: "Interest" },
    { name: "Hiking", type: "Hobby" },
    { name: "Film Making", type: "Interest" },
    { name: "Podcasting", type: "Interest" },
    { name: "Creative Writing", type: "Hobby" },
    { name: "Languages", type: "Interest" },
    { name: "Entrepreneurship", type: "Interest" },
  ]

  const allHobbies = [...predefinedHobbies, ...customHobbies]

  const getIconForItem = (name: string, type: string, isCustom = false) => {
    const iconClass = "w-8 h-8 text-emerald-600"

    if (isCustom) {
      return <Sparkles className={iconClass} />
    }

    const iconMap: { [key: string]: JSX.Element } = {
      Reading: <Book className={iconClass} />,
      "Music Production": <Music className={iconClass} />,
      Technology: <Computer className={iconClass} />,
      Gaming: <Gamepad className={iconClass} />,
      Science: <Lightbulb className={iconClass} />,
      "Digital Art": <PaintBrush className={iconClass} />,
      Volunteering: <Handshake className={iconClass} />,
      Travel: <Plane className={iconClass} />,
      Cooking: <CookingPot className={iconClass} />,
      Photography: <Camera className={iconClass} />,
      Fitness: <Dumbbell className={iconClass} />,
      "Guitar Playing": <Guitar className={iconClass} />,
      Painting: <Palette className={iconClass} />,
      "Coffee Culture": <Coffee className={iconClass} />,
      Hiking: <Mountain className={iconClass} />,
      "Film Making": <Film className={iconClass} />,
      Podcasting: <Headphones className={iconClass} />,
      "Creative Writing": <Brush className={iconClass} />,
      Languages: <Globe className={iconClass} />,
      Entrepreneurship: <Rocket className={iconClass} />,
    }

    return iconMap[name] || <Star className={iconClass} />
  }

  const getSmallIconForItem = (name: string, type: string, isCustom = false) => {
    const iconClass = "w-5 h-5 text-emerald-600"

    if (isCustom) {
      return <Sparkles className={iconClass} />
    }

    const iconMap: { [key: string]: JSX.Element } = {
      Reading: <Book className={iconClass} />,
      "Music Production": <Music className={iconClass} />,
      Technology: <Computer className={iconClass} />,
      Gaming: <Gamepad className={iconClass} />,
      Science: <Lightbulb className={iconClass} />,
      "Digital Art": <PaintBrush className={iconClass} />,
      Volunteering: <Handshake className={iconClass} />,
      Travel: <Plane className={iconClass} />,
      Cooking: <CookingPot className={iconClass} />,
      Photography: <Camera className={iconClass} />,
      Fitness: <Dumbbell className={iconClass} />,
      "Guitar Playing": <Guitar className={iconClass} />,
      Painting: <Palette className={iconClass} />,
      "Coffee Culture": <Coffee className={iconClass} />,
      Hiking: <Mountain className={iconClass} />,
      "Film Making": <Film className={iconClass} />,
      Podcasting: <Headphones className={iconClass} />,
      "Creative Writing": <Brush className={iconClass} />,
      Languages: <Globe className={iconClass} />,
      Entrepreneurship: <Rocket className={iconClass} />,
    }

    return iconMap[name] || <Star className={iconClass} />
  }

  const filteredHobbies = allHobbies.filter((hobby) => {
    const matchesSearch = hobby.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Hobbies" && hobby.type === "Hobby") ||
      (activeFilter === "Interests" && hobby.type === "Interest") ||
      (activeFilter === "Custom" && hobby.type === "Custom")
    return matchesSearch && matchesFilter
  })

  const toggleHobby = (hobbyName: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobbyName) ? prev.filter((h) => h !== hobbyName) : [...prev, hobbyName],
    )
  }

  const addCustomHobby = () => {
    if (customHobby.trim() && !allHobbies.some((h) => h.name.toLowerCase() === customHobby.toLowerCase())) {
      const newHobby: Hobby = {
        name: customHobby.trim(),
        type: "Custom",
        isCustom: true,
      }
      setCustomHobbies((prev) => [...prev, newHobby])
      setSelectedHobbies((prev) => [...prev, customHobby.trim()])
      setCustomHobby("")
      setShowCustomInput(false)
    }
  }

  const removeCustomHobby = (hobbyName: string) => {
    setCustomHobbies((prev) => prev.filter((h) => h.name !== hobbyName))
    setSelectedHobbies((prev) => prev.filter((h) => h !== hobbyName))
  }

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomHobby(e.target.value)
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1500)
  }

  const handleContinue = () => {
    if (selectedHobbies.length >= 2) {
      setShowSuccess(true)
    }
  }
const navigateToDashboard = async () => {
  if (isNavigating) return;
  
  try {
    setIsNavigating(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    await router.push("/student/dashboard");
    
  } catch (error) {
    console.error("Navigation error:", error);
  
  }
};


  const selectedHobbiesWithType = selectedHobbies.map((hobbyName) => {
    const hobby = allHobbies.find((h) => h.name === hobbyName)
    return hobby || { name: hobbyName, type: "Hobby" as const }
  })

  // Show navigation loading state
  if (isNavigating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 border-4 border-emerald-500 border-t-transparent rounded-full"
          />
          <h2 className="text-2xl font-bold text-emerald-700 mb-2">Launching Your Dashboard!</h2>
          <p className="text-emerald-600">Preparing your personalized experience...</p>
        </motion.div>
      </div>
    )
  }

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-emerald-600 font-medium">Loading your personalization page...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Left Section with Educational Background Image */}
      <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-auto text-white flex items-center justify-center overflow-hidden">
        {/* Educational background image from Unsplash */}
        <Image
          src="/assets/authbg.jpg"
          alt="Students studying together in modern classroom"
          fill
          className="object-cover"
          priority
        />

        {/* Animated gradient overlay */}
        <motion.div
          animate={{
            background: [
              "linear-gradient(45deg, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.6))",
              "linear-gradient(45deg, rgba(5, 150, 105, 0.8), rgba(16, 185, 129, 0.6))",
              "linear-gradient(45deg, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.6))",
            ],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute inset-0 z-10"
        />

        {/* Fixed positioned floating particles */}
        <div className="absolute inset-0 z-20">
          {PARTICLE_POSITIONS.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-30 text-center max-w-lg px-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm opacity-90 mb-2 font-medium"
              >
                Step 1 of 3 • Personalization
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
              >
                What makes you{" "}
                <motion.span
                  animate={{ color: ["#ffffff", "#fbbf24", "#ffffff"] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="inline-block"
                >
                  unique?
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-lg opacity-95 leading-relaxed"
              >
                Share your passions and interests to unlock a personalized learning experience tailored just for you!
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-30 text-center max-w-lg px-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm opacity-90 mb-2 font-medium"
              >
                Step 2 of 3 • Success!
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl lg:text-5xl font-bold mb-4"
              >
                Perfect Choice!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-lg opacity-95"
              >
                Your unique profile is ready! We&apos;ll create amazing learning experiences based on your interests.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom floating icons */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-4 opacity-70">
          {[Gamepad, PaintBrush, Lightbulb, Computer, Music, Camera].map((Icon, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2 + index * 0.3,
                delay: index * 0.2,
              }}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30"
            >
              <Icon className="w-5 h-5" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 p-6 lg:p-8 space-y-6 bg-white/50 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key="selection"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </motion.div>
                  <div>
                    <h2 className="font-bold text-gray-800 text-lg">Welcome, {user.name || "Student"}!</h2>
                    <p className="text-emerald-600 text-sm font-medium">Let&apos;s discover your passions</p>
                  </div>
                </div>

                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full border border-emerald-200"
                >
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 text-sm font-semibold">{selectedHobbies.length} selected</span>
                </motion.div>
              </motion.div>

              {/* Search & Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                {/* Search Bar */}
                <div className="relative">
                  <div className="flex items-center bg-white border-2 border-emerald-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-emerald-400 focus-within:shadow-md transition-all">
                    <Search className="w-5 h-5 text-emerald-500 mr-3" />
                    <input
                      type="text"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                      placeholder="Search your interests..."
                      className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                    />
                    {searchTerm && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSearchTerm("")}
                        className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {["All", "Hobbies", "Interests", "Custom"].map((filter) => (
                    <motion.button
                      key={filter}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 ${
                        activeFilter === filter
                          ? "bg-emerald-500 text-white shadow-lg"
                          : "bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                      {filter === "Custom" && customHobbies.length > 0 && (
                        <span className="ml-1 bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {customHobbies.length}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Add Custom Hobby Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-800">Add Your Own Interest</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showCustomInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={customHobby}
                            onChange={handleCustomInputChange}
                            placeholder="Type your unique interest..."
                            className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none"
                            onKeyPress={(e) => e.key === "Enter" && addCustomHobby()}
                          />
                          {isTyping && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <Sparkles className="w-4 h-4 text-purple-500" />
                            </motion.div>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addCustomHobby}
                          disabled={!customHobby.trim()}
                          className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          Add
                        </motion.button>
                      </div>
                      <p className="text-sm text-purple-600">
                        💡 Add anything that excites you - from niche hobbies to unique interests!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Hobby Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                <AnimatePresence>
                  {filteredHobbies.map((item, index) => {
                    const isSelected = selectedHobbies.includes(item.name)
                    return (
                      <motion.div
                        key={item.name}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleHobby(item.name)}
                        className={`relative bg-white rounded-2xl shadow-md p-4 cursor-pointer transition-all duration-300 border-2 ${
                          isSelected
                            ? "border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg"
                            : "border-gray-100 hover:border-emerald-200 hover:shadow-lg"
                        }`}
                      >
                        {/* Custom hobby remove button */}
                        {item.isCustom && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              removeCustomHobby(item.name)
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 z-10"
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        )}

                        <div className="text-center">
                          <motion.div
                            animate={isSelected ? { rotate: [0, 10, -10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                            className="flex items-center justify-center mb-3"
                          >
                            {getIconForItem(item.name, item.type, item.isCustom)}
                          </motion.div>

                          <h3 className={`font-semibold mb-1 ${isSelected ? "text-emerald-800" : "text-gray-800"}`}>
                            {item.name}
                          </h3>

                          <div className="flex items-center justify-center gap-1 mb-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                item.type === "Custom"
                                  ? "bg-purple-100 text-purple-700"
                                  : item.type === "Hobby"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {item.type}
                            </span>
                            {item.isCustom && <Sparkles className="w-3 h-3 text-purple-500" />}
                          </div>

                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="flex items-center justify-center"
                              >
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Selection glow effect */}
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl pointer-events-none"
                          />
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>

              {/* No Results Message */}
              {filteredHobbies.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">No interests found matching your search</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters or add a custom interest!</p>
                </motion.div>
              )}

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-6 border-t border-gray-200"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full px-8 py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg font-semibold transition-all duration-300 ${
                    selectedHobbies.length >= 2
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={selectedHobbies.length < 2}
                  onClick={handleContinue}
                >
                  <span>Continue to Next Step</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="text-center mt-3"
                >
                  <p className={`text-sm ${selectedHobbies.length >= 2 ? "text-emerald-600" : "text-orange-500"}`}>
                    {selectedHobbies.length === 0
                      ? "Select at least 2 interests to continue"
                      : selectedHobbies.length === 1
                        ? "Select 1 more interest to continue"
                        : `${selectedHobbies.length} interests selected - Ready to go! 🚀`}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
           <motion.div
  key="success"
  initial={{ opacity: 0, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="flex flex-col items-center justify-center h-full min-h-[600px] text-center relative"
>
  {/* Fixed positioned floating background elements - with pointer-events-none and proper z-index */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {FLOATING_POSITIONS.map((pos, i) => (
      <motion.div
        key={i}
        className="absolute w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20"
        style={{
          left: `${pos.left}%`,
          top: `${pos.top}%`,
        }}
        animate={{
          y: [-20, -60, -20],
          x: [-10, 10, -10],
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 4 + (i % 3),
          repeat: Number.POSITIVE_INFINITY,
          delay: i * 0.3,
        }}
      />
    ))}
  </div>

  {/* All content with proper z-index to ensure it's above floating elements */}
  <div className="relative z-10 w-full max-w-2xl px-4">
    {/* Success Animation */}
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 1, type: "spring", stiffness: 150 }}
      className="mb-8 relative"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute -inset-6"
      >
        <div className="w-32 h-32 border-4 border-emerald-200 border-t-emerald-500 rounded-full"></div>
      </motion.div>

      <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute -top-3 -right-3"
      >
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </motion.div>
    </motion.div>

    {/* Success Message */}
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="mb-8 max-w-md mx-auto"
    >
      <motion.h2
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3"
      >
        <Trophy className="w-10 h-10 text-yellow-500" />
        Fantastic!
      </motion.h2>
      <p className="text-gray-600 text-lg leading-relaxed">
        Your personalized learning profile is ready! We&apos;ll use your interests to create amazing educational
        experiences just for you.
      </p>
    </motion.div>

    {/* Selected Interests Display */}
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="mb-8 w-full max-w-lg mx-auto"
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <Heart className="w-6 h-6 text-red-500" />
        <h3 className="text-xl font-bold text-gray-800">Your Unique Interests</h3>
        <Heart className="w-6 h-6 text-red-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {selectedHobbiesWithType.map((hobby, index) => (
          <motion.div
            key={hobby.name}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 flex items-center gap-3 shadow-sm"
          >
            {getSmallIconForItem(hobby.name, hobby.type, hobby.isCustom)}
            <div className="text-left flex-1">
              <p className="font-semibold text-emerald-800">{hobby.name}</p>
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    hobby.type === "Custom"
                      ? "bg-purple-100 text-purple-700"
                      : hobby.type === "Hobby"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {hobby.type}
                </span>
                {hobby.isCustom && <Sparkles className="w-3 h-3 text-purple-500" />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Dashboard Button - FIXED with proper z-index and positioning */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="pt-6 border-t border-gray-200 w-full"
    >
      <motion.button                   
        disabled={isNavigating}                   
        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}                   
        whileTap={{ scale: 0.95 }}                   
        onClick={navigateToDashboard}
        className={`w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-lg font-bold transition-all duration-300 relative z-20
          ${isNavigating ? 'opacity-50 cursor-not-allowed' : 'hover:from-emerald-600 hover:to-teal-700'}`}
      >
        <Target className="w-6 h-6" />
        Launch My Dashboard
        <ArrowRight className="w-6 h-6" />
      </motion.button>
    
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-1"
      >
        <Rocket className="w-4 h-4" />
        Ready to start your personalized learning journey!
      </motion.p>
    </motion.div>
  </div>

              </motion.div>
        
          )}
          </AnimatePresence>
      
      </div>
    </div>
  )
}

export default HobbySelectionPage
