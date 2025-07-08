"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HiEye,
  HiEyeOff,
  HiMail,
  HiLockClosed,
  HiArrowRight,
  HiExclamationCircle,
  HiSparkles,
  HiAcademicCap,
  HiLightBulb,
  HiUsers,
  HiClock,
  HiTrendingUp,
  HiStar,
  HiCheckCircle,
  HiHeart,
} from "react-icons/hi"
import { SiGoogle, SiApple, SiFacebook } from "react-icons/si"
import { RiRobot2Fill } from "react-icons/ri"
import Image from "next/image"

// Educational content with more sophisticated transitions
const educationContent = [
  {
    title: "Smart Assessment Creation",
    subtitle: "Generate quizzes instantly with AI",
    description: "Transform your teaching with intelligent assessment tools that adapt to your curriculum",
    icon: HiAcademicCap,
    image: "/assets/ana2.jpg",
    accent: "emerald",
    tagline: "For Lecturers",
  },
  {
    title: "Personalized Learning Paths",
    subtitle: "AI-driven student insights",
    description: "Help every student succeed with personalized feedback and adaptive learning experiences",
    icon: HiLightBulb,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=800&fit=crop",
    accent: "blue",
    tagline: "For Students",
  },
  {
    title: "Intelligent Analytics",
    subtitle: "Data-powered education decisions",
    description: "Gain deep insights into learning patterns and optimize your teaching strategies",
    icon: HiTrendingUp,
    image: "/assets/ana.jpg",
    accent: "purple",
    tagline: "For Everyone",
  },
]

// Smaller floating elements with just words - reduced and repositioned
const floatingElements = [
  {
    icon: HiStar,
    text: "Excellence",
    position: "top-20 right-16",
    delay: 0,
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
    size: "small",
  },
  {
    icon: HiCheckCircle,
    text: "Trusted",
    position: "bottom-40 left-12",
    delay: 2,
    color: "bg-gradient-to-r from-green-400 to-emerald-500",
    size: "small",
  },
]

// Stats with enhanced styling
const stats = [
  { icon: HiClock, value: "75%", label: "Time Saved", delay: 0 },
  { icon: HiUsers, value: "15K+", label: "Educators", delay: 0.2 },
  { icon: HiTrendingUp, value: "98%", label: "Satisfaction", delay: 0.4 },
]

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true)

  // Skeleton loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSkeletonLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Gentle content rotation with smooth fade
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % educationContent.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("Email is required")
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required")
      return false
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value) validateEmail(value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (value) validatePassword(value)
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setIsLoading(true)
    setError("")

    try {

      const response = await fetch(`${apiBaseUrl}/auth/login`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowSuccess(true)
        await fetchUserInfo()

        // Delay redirect to show success animation
        setTimeout(() => {
          const user = data
          switch ((user.role || "").toLowerCase()) {
          case 'student':
            window.location.href = '/hobby';
            break;
          case 'lecturer':
          case 'teacher':
            window.location.href = '/lecturer/dashboard';
            break;
          case 'admin':
            window.location.href = '/admin/dashboard';
            break;
          default:
            window.location.href = '/hobby';
          }
        }, 2000)
      } else {
        setError(data.message || "Invalid credentials. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserInfo = async () => {
    try {

      const response = await fetch(`${apiBaseUrl}/auth/me`, {

        method: "GET",
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("userData", JSON.stringify(data))
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
    }
  }

  const currentContent = educationContent[currentIndex]

  if (isSkeletonLoading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        {/* Left Side Skeleton */}
        <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
          <div className="absolute inset-4 rounded-3xl overflow-hidden bg-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"></div>
            <div className="relative z-10 flex flex-col justify-between p-12 h-full">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-2xl animate-pulse"></div>
                <div>
                  <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 w-1/2 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Right Side Skeleton */}
        <div className="w-full lg:w-2/5 bg-white flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-2">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-emerald-500/90 backdrop-blur-sm z-[100] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="bg-white rounded-3xl p-8 shadow-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <HiCheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Welcome to IntelliLearn!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600"
              >
                Redirecting to your dashboard...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Side - Hero Section with Rounded Design */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        {/* Rounded container */}
        <div className="absolute inset-4 rounded-3xl overflow-hidden shadow-2xl">
          {/* Background Image with smooth crossfade */}
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={currentContent.image || "/placeholder.svg"}
                  alt="Educational background"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/60" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Smaller floating text elements */}
          {floatingElements.map((element) => (
            <motion.div
              key={element.text}
              className={`absolute ${element.position} z-30`}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [0.9, 1, 0.9],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 6,
                delay: element.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div
                className={`${element.color} text-white ${
                  element.size === "tiny" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
                } rounded-full shadow-lg backdrop-blur-sm flex items-center space-x-2 border border-white/20`}
              >
                <element.icon className={element.size === "tiny" ? "w-3 h-3" : "w-4 h-4"} />
                <span className="font-medium whitespace-nowrap">{element.text}</span>
              </div>
            </motion.div>
          ))}

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <Image
                src="/assets/logo3.png"
                alt="logo"
                width={200}
                height={180}
                quality={100}
                />
            </motion.div>

            {/* Main Content */}
            <div className="space-y-8 max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/25 shadow-lg">
                      <currentContent.icon className="w-8 h-8 text-emerald-300" />
                    </div>
                    <div>
                      <div className="text-emerald-300 text-sm font-semibold mb-1">{currentContent.tagline}</div>
                      <h2 className="text-4xl font-bold leading-tight">{currentContent.title}</h2>
                      <p className="text-emerald-200 text-lg font-medium">{currentContent.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xl text-white/90 leading-relaxed ml-20">{currentContent.description}</p>
                </motion.div>
              </AnimatePresence>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 ml-20">
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stat.delay, duration: 0.6 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/25 text-center cursor-default shadow-lg"
                  >
                    <stat.icon className="w-6 h-6 text-emerald-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex items-center space-x-2 text-white/70"
            >
              <HiSparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-sm">Transforming education with artificial intelligence</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Smaller floating cards that extend into form area */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="hidden lg:block absolute left-1/2 top-1/3 transform -translate-y-1/2 -translate-x-8 z-50"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50 min-w-[200px]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <HiSparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">AI Powered</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="hidden lg:block absolute left-1/2 bottom-1/3 transform translate-y-1/2 -translate-x-4 z-50"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-xl p-3 shadow-xl border border-white/50 min-w-[160px]">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
              <HiHeart className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium text-gray-900 text-sm">Easy to use </span>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Full Height Login Form */}
      <div className="w-full lg:w-2/5 bg-white flex flex-col relative">
        {/* Background gradient that extends from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-white"></div>

        {/* Mobile Header */}
        <div className="lg:hidden p-6 bg-gradient-to-r from-slate-800 to-slate-900 relative z-10">
          <div className="flex items-center space-x-3 text-white">
            <RiRobot2Fill className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">IntelliLearn</h1>
              <p className="text-white/70 text-sm">AI-Powered Education</p>
            </div>
          </div>
        </div>

        {/* Form Container - Full Height */}
        <div className="flex-1 flex items-center justify-center p-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md space-y-8"
          >
            {/* Header */}
            <div className="text-center lg:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                Welcome back
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600"
              >
                Continue your AI-powered learning journey
              </motion.p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <HiMail
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                      emailError ? "text-red-400" : "text-gray-400 group-focus-within:text-emerald-500"
                    }`}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="your@email.com"
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:ring-2 focus:bg-white transition-all duration-200 hover:border-gray-300 ${
                      emailError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    }`}
                    required
                    disabled={isLoading}
                  />
                </div>
                <AnimatePresence>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-1 flex items-center"
                    >
                      <HiExclamationCircle className="w-4 h-4 mr-1" />
                      {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <HiLockClosed
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                      passwordError ? "text-red-400" : "text-gray-400 group-focus-within:text-emerald-500"
                    }`}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-xl focus:ring-2 focus:bg-white transition-all duration-200 hover:border-gray-300 ${
                      passwordError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    }`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
                <AnimatePresence>
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm mt-1 flex items-center"
                    >
                      <HiExclamationCircle className="w-4 h-4 mr-1" />
                      {passwordError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200 flex items-center"
                >
                  <HiExclamationCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center"
              >
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700">
                  Keep me signed in
                </label>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading || !!emailError || !!passwordError}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all font-semibold text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Access IntelliLearn
                    <HiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { name: "Google", icon: SiGoogle, color: "hover:text-red-500 hover:border-red-200 hover:bg-red-50" },
                  {
                    name: "Facebook",
                    icon: SiFacebook,
                    color: "hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50",
                  },
                  { name: "Apple", icon: SiApple, color: "hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50" },
                ].map((provider) => (
                  <motion.button
                    key={provider.name}
                    type="button"
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-600 transition-all ${provider.color}`}
                  >
                    <provider.icon className="w-5 h-5" />
                  </motion.button>
                ))}
              </motion.div>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-center text-sm text-gray-600"
            >
              Need access?{" "}
              <button className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                Contact your institution
              </button>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
