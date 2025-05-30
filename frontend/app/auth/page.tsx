'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookText, ChevronLeft, ChevronRight, School, User, Shield } from 'lucide-react'
import Image from 'next/image'

const carouselItems = [
  {
    id: 1,
    title: "AI-Powered Learning",
    description: "Smart assessment creation and grading for modern education",
    images: ["/assets/students1.jpg", "/assets/students2.jpg"]
  },
  {
    id: 2,
    title: "Personalized Learning", 
    description: "Adaptive content delivery based on student performance",
    images: ["/assets/students3.jpg", "/assets/students4.jpg"]
  },
  {
    id: 3,
    title: "Collaborative Education",
    description: "Connect students and educators in interactive environments",
    images: ["/assets/students5.jpg", "/assets/students6.jpg"]
  }
]

const lecturerContent = {
  title: "Teaching Excellence",
  description: "Empowering educators with advanced teaching tools and analytics",
  image: "/assets/lec.jpg",
  bgImage: "/assets/lec3.png"
}

const adminContent = {
  title: "System Management",
  description: "Complete control and oversight of your educational platform",
  image: "/assets/admin.jpg", 
  bgImage: "/assets/hobby.jpg"
}

const userTypes = {
  STUDENT: 'student',
  LECTURER: 'lecturer', 
  ADMIN: 'admin'
}

const userTypeColors = {
  [userTypes.STUDENT]: {
    primary: 'emerald',
    bg: 'emerald-50',
    highlight: 'emerald-500',
    hover: 'emerald-600',
    toggle: 'bg-emerald-500'
  },
  [userTypes.LECTURER]: {
    primary: 'amber',
    bg: 'amber-50', 
    highlight: 'amber-500',
    hover: 'amber-600',
    toggle: 'bg-amber-500'
  },
  [userTypes.ADMIN]: {
    primary: 'purple',
    bg: 'purple-50',
    highlight: 'purple-500', 
    hover: 'purple-600',
    toggle: 'bg-purple-500'
  }
}

export default function AuthPage() {
  const [userType, setUserType] = useState(userTypes.STUDENT)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [error, setError] = useState('')

  const colors = userTypeColors[userType]

  // Reset form when changing user type
  useEffect(() => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setRememberMe(false)
    setError('')
    setIsLogin(true)
  }, [userType])

  // Auto-advance carousel only for students
  useEffect(() => {
    if (userType === userTypes.STUDENT) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [userType])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (email === 'test@gmail.com' && password === 'test1234') {
      if (userType === userTypes.STUDENT) {
        console.log('Redirecting to /hobbies')
        window.location.href = '/hobbies'
      } else if (userType === userTypes.LECTURER) {
        console.log('Redirecting to /lecturer/dashboard')
        window.location.href = '/lecturer/dashboard'
      } else if (userType === userTypes.ADMIN) {
        console.log('Redirecting to /admin/dashboard')
        window.location.href = '/admin/dashboard'
      }
    } else {
      setError('Invalid credentials. Try test@gmail.com / test1234')
    }
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    console.log('Sign up with:', { email, password, userType })
  }

  const getPageTitle = () => {
    if (userType === userTypes.STUDENT) {
      return isLogin ? 'Welcome back!' : 'Create an account'
    } else if (userType === userTypes.LECTURER) {
      return 'Welcome back, Educator!'
    } else {
      return 'Admin Portal Access'
    }
  }

  const getPageSubtitle = () => {
    if (userType === userTypes.STUDENT) {
      return isLogin 
        ? 'Please enter your details to sign in' 
        : 'Sign up to get started with learning'
    } else if (userType === userTypes.LECTURER) {
      return 'Please enter your details to sign in'
    } else {
      return 'Enter your credentials to access admin controls'
    }
  }

  const renderStudentCarousel = () => (
    <div className={`relative w-full md:w-1/2 h-[40vh] md:h-full bg-${colors.bg} overflow-hidden rounded-b-[2rem] md:rounded-none order-1 md:order-1`}>
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src="/assets/new.png" 
          alt="Background Pattern"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full p-6 flex flex-col justify-center"
        >
          <div className="relative h-[70%] md:h-[60%] w-full">
            <div className="border-4 border-white absolute left-28 -top-[20%] md:left-28 md:-top-[20%] w-[50%] h-[100%] rounded-lg overflow-hidden shadow-lg">
              <Image 
                src={carouselItems[currentSlide].images[0]} 
                alt="Students learning"
                fill
                style={{ objectFit: 'cover' }}
                quality={100}
              />
            </div>
            <div className="border-4 border-white absolute right-4 bottom-[10%] w-[45%] h-[80%] rounded-lg overflow-hidden shadow-lg">
              <Image 
                src={carouselItems[currentSlide].images[1]} 
                alt="Students learning" 
                fill
                style={{ objectFit: 'cover' }}
                quality={100}
              />
            </div>
          </div>

          <motion.div 
            className="absolute bottom-3 left-0 right-0 mx-auto w-[90%] max-w-xs bg-white bg-opacity-90 p-4 rounded-lg shadow-md items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold text-gray-900 text-center">{carouselItems[currentSlide].title}</h3>
            <p className="text-sm text-gray-700 mt-1 text-center">{carouselItems[currentSlide].description}</p>
            <div className={`flex justify-center items-center text-center gap-1.5 mt-2 text-sm text-${colors.highlight}`}>
              <BookText size={16} />
              <span className='text-center'>Smart Learning</span>
            </div>
            
            <div className="flex items-center justify-center mt-4 gap-2">
              <button 
                onClick={prevSlide}
                className={`p-1 rounded-full bg-${colors.primary}-100 hover:bg-${colors.primary}-200 transition-colors`}
              >
                <ChevronLeft size={16} className={`text-${colors.highlight}`} />
              </button>
              
              <div className="flex gap-1">
                {carouselItems.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentSlide ? `bg-${colors.highlight}` : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextSlide}
                className={`p-1 rounded-full bg-${colors.primary}-100 hover:bg-${colors.primary}-200 transition-colors`}
              >
                <ChevronRight size={16} className={`text-${colors.highlight}`} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )

  const renderLecturerAdminImage = () => {
    const content = userType === userTypes.LECTURER ? lecturerContent : adminContent
    
    return (
      <div className={`relative w-full md:w-1/2 h-[40vh] md:h-full bg-${colors.bg} overflow-hidden rounded-b-[2rem] md:rounded-none order-1 md:order-2`}>
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src={content.bgImage} 
            alt="Background Pattern"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full p-6 flex flex-col justify-center items-center"
        >
          <div className="relative w-[80%] h-[60%] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
            <Image 
              src={content.image} 
              alt={`${userType} interface`}
              fill
              style={{ objectFit: 'cover' }}
              quality={100}
            />
          </div>

          <motion.div 
            className="absolute bottom-3 left-0 right-0 mx-auto w-[90%] max-w-xs bg-white bg-opacity-95 p-4 rounded-lg shadow-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold text-gray-900 text-center">{content.title}</h3>
            <p className="text-sm text-gray-700 mt-1 text-center">{content.description}</p>
            <div className={`flex justify-center items-center text-center gap-1.5 mt-2 text-sm text-${colors.highlight}`}>
              {userType === userTypes.LECTURER ? <School size={16} /> : <Shield size={16} />}
              <span className='text-center'>
                {userType === userTypes.LECTURER ? 'Academic Excellence' : 'System Management'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const renderForm = () => (
    <div className={`w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 ${
      userType === userTypes.STUDENT ? 'order-2 md:order-2' : 'order-2 md:order-1'
    }`}>
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* User Type Toggle */}
          <div className="mb-8 flex justify-center">
            <div className={`flex p-1 rounded-xl bg-gray-100 shadow-inner text-sm mb-2`}>
              {Object.values(userTypes).map((type) => (
                <button
                  key={type}
                  onClick={() => setUserType(type)}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 
                    ${userType === type 
                      ? `text-white shadow-sm` 
                      : 'text-gray-600 hover:text-gray-800'}`}
                >
                  {userType === type && (
                    <motion.div
                      layoutId="activeUserType"
                      className={`absolute inset-0 rounded-lg ${userTypeColors[type].toggle}`}
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative flex items-center justify-center gap-1.5">
                    {type === userTypes.STUDENT && <User size={14} />}
                    {type === userTypes.LECTURER && <School size={14} />}
                    {type === userTypes.ADMIN && <Shield size={14} />}
                    <span className="capitalize">{type}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-1">{getPageTitle()}</h2>
          <p className="text-gray-600 mb-6">{getPageSubtitle()}</p>

          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-${colors.highlight} focus:border-${colors.highlight} transition`}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-${colors.highlight} focus:border-${colors.highlight} transition`}
                required
              />
            </div>

            {!isLogin && userType === userTypes.STUDENT && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-${colors.highlight} focus:border-${colors.highlight} transition`}
                  required
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={`h-4 w-4 text-${colors.highlight} border-gray-300 rounded focus:ring-${colors.primary}-400`}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className={`text-${colors.highlight} hover:text-${colors.hover}`}>
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${colors.highlight} hover:bg-${colors.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${colors.highlight} transition-colors`}
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
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
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
          </div>

          {/* Only show sign up option for students */}
          {userType === userTypes.STUDENT && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                  }}
                  className={`ml-1 text-${colors.highlight} hover:text-${colors.hover} font-medium`}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {userType === userTypes.STUDENT ? (
        <>
          {renderStudentCarousel()}
          {renderForm()}
        </>
      ) : (
        <>
          {renderForm()}
          {renderLecturerAdminImage()}
        </>
      )}
    </div>
  )
}