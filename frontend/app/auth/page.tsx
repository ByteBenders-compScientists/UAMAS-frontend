'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Sparkles, LucideIcon, Brain, Lightbulb, Users, Award } from 'lucide-react'
import Image from 'next/image'

// Educational roles that will animate through the tagline
const educationRoles = [
  { text: "Lecturers", icon: BookOpen, color: "text-amber-500" },
  { text: "Students", icon: Lightbulb, color: "text-emerald-500" },
  { text: "Admins", icon: Users, color: "text-purple-500" }
]

// Features to highlight in background cards
const features = [
  { 
    title: "AI-Powered Learning",
    description: "Smart assessment tools for modern education",
    icon: Brain,
    color: "bg-gradient-to-br from-emerald-500/90 to-teal-600/90"
  },
  { 
    title: "Personalized Education",
    description: "Adaptive content based on performance",
    icon: Sparkles,
    color: "bg-gradient-to-br from-amber-500/90 to-orange-600/90"
  },
  { 
    title: "Academic Excellence",
    description: "Tools designed for educational success",
    icon: Award, 
    color: "bg-gradient-to-br from-purple-500/90 to-indigo-600/90"
  }
]

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)

  // Animate through different user roles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % educationRoles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Call fetchUserInfo to get the name and role
        await fetchUserInfo(); 

        // Then redirect based on role
        const user = JSON.parse(localStorage.getItem('userData') || '{}');

        switch ((user.role || '').toLowerCase()) {
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
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userData', JSON.stringify(data));
      } else {
        console.error('Failed to get user data', data);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-gray-50">
      {/* Left side: Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 order-2 md:order-1 z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome to EduAI</h1>
            <div className="h-8 mt-2 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoleIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center"
                >
                  {React.createElement(educationRoles[currentRoleIndex].icon, { 
                    size: 18, 
                    className: educationRoles[currentRoleIndex].color
                  })}
                  <span className={`ml-2 text-lg ${educationRoles[currentRoleIndex].color}`}>
                    Empowering {educationRoles[currentRoleIndex].text}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.form 
            variants={itemVariants} 
            onSubmit={handleLogin} 
            className="space-y-5 bg-white p-8 rounded-xl shadow-md"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 text-red-600 text-sm rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Sign in
            </button>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src="/assets/google.svg"
                  alt="Google Logo"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src="/assets/apple.svg"
                  alt="Apple Logo"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src="/assets/facebook.svg"
                  alt="Facebook Logo"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </button>
            </div>
          </motion.form>

          <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-gray-600">
            Need an account?{' '}
            <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
              Contact your administrator
            </a>
          </motion.p>
        </motion.div>
      </div>

      {/* Right side: Visual elements */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-full order-1 md:order-2 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-800"></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <Image 
            src="/assets/new.png" 
            alt="Background Pattern"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* Content */}
        <div className="relative h-full w-full p-6 md:p-10 flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Logo/Brand */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
              <Brain size={50} className="text-emerald-500" />
            </div>
            
            <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-4">
              EduAI Portal
            </h2>
            
            <p className="text-emerald-50 text-xl text-center max-w-md mb-10">
              The next generation of AI-powered educational tools for modern learning
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className={`${feature.color} p-5 rounded-xl shadow-lg backdrop-blur-sm`}
              >
                <feature.icon size={24} className="text-white mb-3" />
                <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                <p className="text-white/80 text-sm mt-1">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Floating decorative elements */}
          <div className="absolute top-10 right-10 opacity-20">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
            >
              <BookOpen size={80} className="text-white" />
            </motion.div>
          </div>
          
          <div className="absolute bottom-20 left-10 opacity-20">
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0] 
              }}
              transition={{ 
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <Lightbulb size={60} className="text-white" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}