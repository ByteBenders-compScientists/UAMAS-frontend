import React, { useState } from 'react'
import Link from 'next/link'
import { BrainCircuit, Menu, X, ChevronRight } from 'lucide-react'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* Navbar - SOLID BACKGROUND */}
      <nav className="bg-white shadow-lg sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <BrainCircuit className="text-emerald-600 h-8 w-8" />
              <span className="text-gray-900 text-xl font-bold ml-2">Intellimark</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-700 hover:text-emerald-600 font-medium">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-emerald-600 font-medium">
                How it Works
              </Link>
              <Link href="#for-lecturers" className="text-gray-700 hover:text-emerald-600 font-medium">
                For Lecturers
              </Link>
              <Link href="#for-students" className="text-gray-700 hover:text-emerald-600 font-medium">
                For Students
              </Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-emerald-600 font-medium">
                Testimonials
              </Link>
              <Link href="#faq" className="text-gray-700 hover:text-emerald-600 font-medium">
                FAQ
              </Link>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-emerald-600 font-medium px-4 py-2">
                Login
              </Link>
              <Link 
                href="/get-started" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - SOLID WHITE BACKGROUND */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-2">
                <Link 
                  href="#features" 
                  className="text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it Works
                </Link>
                <Link 
                  href="#for-lecturers" 
                  className="text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  For Lecturers
                </Link>
                <Link 
                  href="#for-students" 
                  className="text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  For Students
                </Link>
                <Link 
                  href="#testimonials" 
                  className="text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <Link 
                  href="#faq" 
                  className="text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
                
                <div className="pt-4 mt-2 border-t border-gray-200 space-y-3">
                  <Link 
                    href="/login" 
                    className="block text-center text-emerald-600 border border-emerald-200 py-3 px-4 rounded-lg font-medium hover:bg-emerald-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/get-started" 
                    className="block text-center bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium shadow-md hover:bg-emerald-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - SOLID BACKGROUNDS */}
      <section className="bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="text-center mb-8">
            <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Trusted by 50+ universities across Africa
            </span>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Empower Students through{' '}
              <span className="text-emerald-600">personalized learning</span>{' '}
              experiences
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              AI-powered platform for assessment and engagement. An intelligent solution for lecturers 
              and students in universities and colleges to enhance teaching and learning with automated 
              assessment and performance tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/get-started" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center gap-2"
              >
                Get Started
                <ChevronRight size={20} />
              </Link>
              <Link 
                href="#features" 
                className="bg-white hover:bg-gray-50 text-emerald-600 border-2 border-emerald-200 px-8 py-4 rounded-xl font-semibold text-lg"
              >
                See Features
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-2">For Lecturers</h3>
                <p className="text-gray-600">AI-powered assessment tools and analytics</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-2">For Students</h3>
                <p className="text-gray-600">Personalized learning paths and tracking</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-2">AI-Powered</h3>
                <p className="text-gray-600">Data-driven insights and analytics</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Navbar