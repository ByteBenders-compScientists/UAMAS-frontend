/* eslint-disable @typescript-eslint/no-explicit-any */
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
  HiTrendingUp,
  HiCheckCircle,
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

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://68.221.169.119/api/v1"

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

  // Auth mode + signup state
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [signupStep, setSignupStep] = useState<1 | 2>(1)
  const [signupRole, setSignupRole] = useState<"student" | "lecturer">("student")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupCode, setSignupCode] = useState("")
  const [signupFirstname, setSignupFirstname] = useState("")
  const [signupSurname, setSignupSurname] = useState("")
  const [signupOthernames, setSignupOthernames] = useState("")
  const [signupRegNumber, setSignupRegNumber] = useState("")
  const [signupUnitJoinCode, setSignupUnitJoinCode] = useState("")
  const [signupError, setSignupError] = useState("")
  const [isSignupLoading, setIsSignupLoading] = useState(false)
  const [signupSuccessMessage, setSignupSuccessMessage] = useState("")

  // Reduced skeleton loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSkeletonLoading(false)
    }, 800)
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

  const resetSignupState = () => {
    setSignupStep(1)
    setSignupEmail("")
    setSignupPassword("")
    setSignupCode("")
    setSignupFirstname("")
    setSignupSurname("")
    setSignupOthernames("")
    setSignupRegNumber("")
    setSignupUnitJoinCode("")
    setSignupError("")
    setSignupSuccessMessage("")
    setEmailError("")
    setPasswordError("")
  }

  const handleRequestVerificationCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isEmailValid = validateEmail(signupEmail)
    if (!isEmailValid) {
      return
    }

    setIsSignupLoading(true)
    setSignupError("")
    setSignupSuccessMessage("")

    try {
      const response = await fetch(`${apiBaseUrl}/auth/register/request-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: signupEmail,
          role: signupRole,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSignupStep(2)
        setSignupSuccessMessage("Verification code sent to your institutional email.")
      } else {
        setSignupError(data.error || data.message || "Failed to send verification code. Please try again.")
      }
    } catch (err) {
      console.error("Request verification code error:", err)
      setSignupError("Network error. Please check your connection and try again.")
    } finally {
      setIsSignupLoading(false)
    }
  }

  const handleCompleteSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isEmailValid = validateEmail(signupEmail)
    const isPasswordValid = validatePassword(signupPassword)

    if (!isEmailValid || !isPasswordValid || !signupCode) {
      if (!signupCode) {
        setSignupError("Verification code is required")
      }
      return
    }

    setIsSignupLoading(true)
    setSignupError("")
    setSignupSuccessMessage("")

    const payload: any = {
      email: signupEmail,
      password: signupPassword,
      role: signupRole,
      verification_code: signupCode,
      firstname: signupFirstname,
      surname: signupSurname,
      othernames: signupOthernames || undefined,
    }

    if (signupRole === "student") {
      payload.reg_number = signupRegNumber
      if (signupUnitJoinCode.trim()) {
        payload.unit_join_code = signupUnitJoinCode.trim()
      }
    }

    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setSignupSuccessMessage("Account created successfully. You can now log in.")
        setEmail(signupEmail)
        setAuthMode("login")
        setSignupStep(1)
      } else {
        setSignupError(data.error || data.message || "Registration failed. Please check your details and try again.")
      }
    } catch (err) {
      console.error("Complete signup error:", err)
      setSignupError("Network error. Please check your connection and try again.")
    } finally {
      setIsSignupLoading(false)
    }
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

        setTimeout(() => {
          const role = (data.role || "").toLowerCase()
          switch (role) {
            case "student":
              window.location.href = "/student/dashboard"
              break
            case "lecturer":
            case "teacher":
              window.location.href = "/lecturer/dashboard"
              break
            default:
              window.location.href = "/student/dashboard"
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
          {/* Background Image with zoom transition */}
          <div className="absolute inset-0">
            <AnimatePresence>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
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

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <Image src="/assets/logo3.png" alt="logo" width={200} height={180} quality={100} />
            </motion.div>

            {/* Main Content */}
            <div className="space-y-8 max-w-2xl">
              <AnimatePresence>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white backdrop-blur-md rounded-full flex items-center justify-center border border-white/25 shadow-lg">
                      <currentContent.icon className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-emerald-400 text-sm font-semibold mb-1">{currentContent.tagline}</div>
                      <h2 className="text-4xl font-bold leading-tight">{currentContent.title}</h2>
                      <p className="text-emerald-400 text-lg font-medium">{currentContent.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xl text-white/90 leading-relaxed ml-20">{currentContent.description}</p>
                </motion.div>
              </AnimatePresence>
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
                {authMode === "login" ? "Welcome back" : "Create your account"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600"
              >
                {authMode === "login"
                  ? "Continue your AI-powered learning journey"
                  : "Sign up with your institutional email to get started"}
              </motion.p>
            </div>
            {/* Auth mode toggle */}
            <div className="flex items-center justify-center lg:justify-start">
              <div className="inline-flex rounded-full bg-gray-100 p-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login")
                    setSignupError("")
                    setSignupSuccessMessage("")
                  }}
                  className={`px-4 py-2 rounded-full transition-all ${
                    authMode === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup")
                    resetSignupState()
                  }}
                  className={`px-4 py-2 rounded-full transition-all ${
                    authMode === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Sign up
                </button>
              </div>
            </div>

            {authMode === "login" ? (
              <>
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all font-semibold text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Login
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
                      {
                        name: "Google",
                        icon: SiGoogle,
                        color: "hover:text-red-500 hover:border-red-200 hover:bg-red-50",
                      },
                      {
                        name: "Facebook",
                        icon: SiFacebook,
                        color: "hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50",
                      },
                      {
                        name: "Apple",
                        icon: SiApple,
                        color: "hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50",
                      },
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
              </>
            ) : (
              <>
                {signupStep === 1 ? (
                  <form onSubmit={handleRequestVerificationCode} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sign up as</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSignupRole("student")}
                          className={`flex items-center justify-center rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                            signupRole === "student"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
                          }`}
                        >
                          Student
                        </button>
                        <button
                          type="button"
                          onClick={() => setSignupRole("lecturer")}
                          className={`flex items-center justify-center rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                            signupRole === "lecturer"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300"
                          }`}
                        >
                          Lecturer
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Institutional Email
                      </label>
                      <div className="relative group">
                        <HiMail
                          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                            emailError ? "text-red-400" : "text-gray-400 group-focus-within:text-emerald-500"
                          }`}
                        />
                        <input
                          id="signup-email"
                          type="email"
                          value={signupEmail}
                          onChange={(e) => {
                            setSignupEmail(e.target.value)
                            if (e.target.value) validateEmail(e.target.value)
                          }}
                          placeholder="you@institution.ac.ke"
                          className={`w-full outline-0 pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:ring-2 focus:bg-white transition-all duration-200 hover:border-gray-300 ${
                            emailError
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                          }`}
                          required
                          disabled={isSignupLoading}
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

                    {signupError && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200 flex items-center"
                      >
                        <HiExclamationCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        {signupError}
                      </motion.div>
                    )}

                    {signupSuccessMessage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-200"
                      >
                        {signupSuccessMessage}
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isSignupLoading || !!emailError}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all font-semibold text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSignupLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                          />
                          Sending code...
                        </>
                      ) : (
                        <>
                          Send verification code
                          <HiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </form>
                ) : (
                  <form onSubmit={handleCompleteSignup} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <label htmlFor="signup-code" className="block text-sm font-semibold text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <input
                        id="signup-code"
                        type="text"
                        value={signupCode}
                        onChange={(e) => setSignupCode(e.target.value)}
                        placeholder="Enter the 6-digit code sent to your email"
                        className="w-full  outline-0 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                        required
                        disabled={isSignupLoading}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative group">
                        <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={signupPassword}
                          onChange={(e) => {
                            setSignupPassword(e.target.value)
                            if (e.target.value) validatePassword(e.target.value)
                          }}
                          placeholder="Create a strong password"
                          className={`w-full outline-0 pl-12 pr-12 py-4 bg-gray-50 border rounded-xl focus:ring-2 focus:bg-white transition-all duration-200 hover:border-gray-300 ${
                            passwordError
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                          }`}
                          required
                          disabled={isSignupLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={signupFirstname}
                          onChange={(e) => setSignupFirstname(e.target.value)}
                          className="w-full outline-0 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          required
                          disabled={isSignupLoading}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Surname</label>
                        <input
                          type="text"
                          value={signupSurname}
                          onChange={(e) => setSignupSurname(e.target.value)}
                          className="w-full outline-0 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          required
                          disabled={isSignupLoading}
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Other Names (optional)</label>
                      <input
                        type="text"
                        value={signupOthernames}
                        onChange={(e) => setSignupOthernames(e.target.value)}
                        className="w-full outline-0 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                        disabled={isSignupLoading}
                      />
                    </motion.div>

                    {signupRole === "student" && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Number</label>
                          <input
                            type="text"
                            value={signupRegNumber}
                            onChange={(e) => setSignupRegNumber(e.target.value)}
                            className="w-full outline-0 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                            required
                            disabled={isSignupLoading}
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9, duration: 0.5 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Unit Join Code (optional)
                          </label>
                          <input
                            type="text"
                            value={signupUnitJoinCode}
                            onChange={(e) => setSignupUnitJoinCode(e.target.value)}
                            placeholder="Enter unit join code if you have one"
                            className="w-full outline-0 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                            disabled={isSignupLoading}
                          />
                        </motion.div>
                      </>
                    )}

                    {signupError && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200 flex items-center"
                      >
                        <HiExclamationCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        {signupError}
                      </motion.div>
                    )}

                    {signupSuccessMessage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-200"
                      >
                        {signupSuccessMessage}
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isSignupLoading || !!emailError || !!passwordError}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all font-semibold text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSignupLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                          />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Complete registration
                          <HiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}