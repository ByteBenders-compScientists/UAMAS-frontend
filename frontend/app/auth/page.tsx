'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookText, ChevronLeft, ChevronRight } from 'lucide-react'
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

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [error, setError] = useState('')

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Login logic would go here
    console.log('Login with:', { email, password, rememberMe })
  }

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    // Signup logic would go here
    console.log('Sign up with:', { email, password })
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {/* Left panel with carousel */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-full bg-emerald-50 overflow-hidden rounded-b-[2rem] md:rounded-none">
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
              className="absolute bottom-3 left-0 right-0 mx-auto w-[90%] max-w-xs bg-white bg-opacity-90 p-4 rounded-lg shadow-md items-center "
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold text-gray-900 text-center">{carouselItems[currentSlide].title}</h3>
              <p className="text-sm text-gray-700 mt-1 text-center">{carouselItems[currentSlide].description}</p>
              <div className="flex justify-center items-center text-center gap-1.5 mt-2 text-sm text-emerald-700">
                <BookText size={16} />
                <span className='text-center'>Smart Learning</span>
              </div>
              
              <div className="flex items-center justify-center mt-4 gap-2">
                <button 
                  onClick={prevSlide}
                  className="p-1 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-colors"
                >
                  <ChevronLeft size={16} className="text-emerald-700" />
                </button>
                
                <div className="flex gap-1">
                  {carouselItems.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === currentSlide ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={nextSlide}
                  className="p-1 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-colors"
                >
                  <ChevronRight size={16} className="text-emerald-700" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right panel with authentication form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Welcome back!</h2>
            <p className="text-gray-600 mb-6">Please enter your details to sign in</p>

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
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
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
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                  required
                />
              </div>

              {!isLogin && (
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
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                    required
                  />
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="text-emerald-600 hover:text-emerald-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
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

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                  }}
                  className="ml-1 text-emerald-600 hover:text-emerald-500 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}