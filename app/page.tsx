/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import {
  Users,
  BookOpen,
  BarChart3,
  Award,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  GraduationCap,
  TrendingUp,
  Shield,
  Clock,
  Star,
  MessageSquare,
  FileText,
  Globe,
  Server,
  Zap,
  Monitor,
  Video,
  Slack,
  Cloud,
  HardDrive,
  FolderOpen,
  Github,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function IntelliMark() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("Features");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const integrationsRef = useRef<HTMLDivElement | null>(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const heroVariants = {
    enter: {
      opacity: 0,
      scale: 1.1,
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: easeInOut, // Use the imported function
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 1.5,
        ease: easeInOut,
      },
    },
  };

  const paintVariants = {
    initial: { 
      clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
      opacity: 0.2
    },
    hover: { 
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      opacity: 1,
      transition: { duration: 0.4 } 
    },
    exit: { 
      clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
      opacity: 0.2,
      transition: { duration: 0.3 } 
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleNavClick = (item: string) => {
      setActiveNavItem(item);
      const element = document.getElementById(item.toLowerCase().replace(" ", "-"));
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  const getIcon = (tool: string) => {
    const icons: { [key: string]: any } = {
      Canvas: BookOpen,
      Moodle: GraduationCap,
      Blackboard: Monitor,
      "Google Classroom": Users,
      "Microsoft Teams": MessageSquare,
      Zoom: Video,
      Slack: Slack,
      Notion: FileText,
      Dropbox: Cloud,
      OneDrive: HardDrive,
      "Google Drive": FolderOpen,
      GitHub: Github,
    };
    return icons[tool] || Globe;
  };

  const heroSlides = [
    {
      image: "/assets/ana2.jpg",
      title: "Empower Students",
      subtitle: "through personalized learning experiences"
    },
    {
      image: "/assets/educators.jpg",
      title: "Support Educators",
      subtitle: "by automating administrative tasks"
    },
    {
      image: "/assets/hero.jpg",
      title: "Transform Education",
      subtitle: "with AI-powered assessment and engagement"
    },
    {
      image: "https://images.unsplash.com/photo-1645263012668-a6617115f9b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Drive Academic Success",
      subtitle: "with data-driven insights and analytics"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Benson Mwangi",
      role: "Computer Science Professor",
      image: "/assets/ben.jpg",
      quote:
        "IntelliMark has completely transformed how I manage assessments. The AI-powered grading has saved me countless hours, and the analytics provide incredible insights into student learning patterns.",
    },
    {
      name: "Joseph Kiprotich",
      role: "Engineering Student",
      image: "/assets/lec2.jpg",
      quote:
        "As a student with a busy schedule, the personalized learning paths and instant feedback have helped me stay on track. I've seen my grades improve significantly since using this platform.",
    },
    {
      name: "Lecturer David Maina",
      role: "Department Head, Mathematics",
      image: "/assets/stud.jpg",
      quote:
        "The implementation across our department has been seamless. We've seen increased student engagement and improved performance metrics. The customizable assessments are particularly valuable.",
    },
  ];

  const trustedInstitutions = [
    "University of Nairobi",
    "JKUAT University",
    "KCA University",
    "Dedan Kimathi University",
    "Kenyatta University",
    "Kabarak University",
    "Strathmore University",
    "Technical University of Kenya",
    "Mount Kenya University",
    "USIU Africa"
  ];

  const integrationTools = [
    "Canvas",
    "Moodle",
    "Blackboard",
    "Google Classroom",
    "Microsoft Teams",
    "Zoom",
    "Slack",
    "Notion",
    "Dropbox",
    "OneDrive",
    "Google Drive",
    "GitHub",
  ];

  const faqItems = [
    {
      question: "Is the platform suitable for any institution?",
      answer:
        "Yes, IntelliMark is designed for universities, colleges, and schools of all sizes. Our flexible architecture allows the platform to scale with institutions of any size, from small departments to large multi-campus universities.",
    },
    {
      question: "Are the AI-generated questions reliable?",
      answer:
        "Absolutely. Our AI creates questions aligned with learning objectives and vetted by educational standards. Each question undergoes quality checks to ensure relevance, accuracy, and appropriate difficulty levels. Lecturers also have full editorial control before publishing.",
    },
    {
      question: "Can students see detailed performance analytics?",
      answer:
        "Yes! Students receive comprehensive insights on their performance with progress tracking, personalized feedback, and motivational tools. They can view their strengths, areas for improvement, and track progress over time with intuitive visualizations.",
    },
    {
      question: "Is my data safe and secure?",
      answer:
        "Security is our top priority. All data is encrypted both in transit and at rest using industry-standard protocols. We employ enterprise-grade security measures, regular security audits, and comply with major educational data protection regulations including FERPA and GDPR.",
    },
    {
      question: "How long does implementation take?",
      answer:
        "Implementation typically takes 2-4 weeks, depending on your institution's size and specific requirements. Our dedicated onboarding team will guide you through every step of the process, including data migration, integration with existing systems, and staff training.",
    },
    {
      question: "Do you offer training and support?",
      answer:
        "Yes, we provide comprehensive training sessions for all users, detailed documentation, video tutorials, and a knowledge base. Our support team is available via email, chat, and phone. Enterprise plans include dedicated account managers and 24/7 priority support.",
    },
  ];

  // Auto slide for hero section
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Auto slide for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Auto scroll for institutions carousel
  useEffect(() => {
    const scrollCarousel = () => {
      if (carouselRef.current) {
        if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth - carouselRef.current.clientWidth) {
          carouselRef.current.scrollLeft = 0;
        } else {
          carouselRef.current.scrollLeft += 1;
        }
      }
    };

    const interval = setInterval(scrollCarousel, 20);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll for integrations carousel
  useEffect(() => {
    const scrollIntegrations = () => {
      if (integrationsRef.current) {
        if (integrationsRef.current.scrollLeft >= integrationsRef.current.scrollWidth - integrationsRef.current.clientWidth) {
          integrationsRef.current.scrollLeft = 0;
        } else {
          integrationsRef.current.scrollLeft += 1;
        }
      }
    };

    const interval = setInterval(scrollIntegrations, 20);
    return () => clearInterval(interval);
  }, []);

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

 const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Clean background - no mesh patterns */}
      <div className="fixed inset-0 w-full h-full z-0 bg-gradient-to-b from-gray-50 to-white" />

      <div className="relative z-10">
        {/* Navbar - Fixed position, not extending behind hero */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed w-full top-0 z-50 bg-white/70 shadow-lg border-b border-gray-100"
        >
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center h-20">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <Image
                  src="/assets/logo3.png"
                  alt="logo"
                  width={230}
                  height={160}
                  quality={100}
                />
              </motion.div>

              {/* Desktop Navigation - Enhanced with active state */}
              <div className="hidden md:flex items-center space-x-8">
                {[
                  "Features",
                  "How it Works",
                  "For Lecturers",
                  "For Students",
                  "Testimonials",
                  "FAQ",
                ].map((item) => (
                  <motion.a
                    key={item}
                    onClick={() => handleNavClick(item)}
                    whileHover={{ y: -2 }}
                    className={`cursor-pointer font-medium transition-colors duration-200 relative py-2 ${
                      activeNavItem === item 
                        ? "text-emerald-600" 
                        : "text-gray-700 hover:text-emerald-600"
                    }`}
                  >
                    {item}
                    {activeNavItem === item && (
                      <motion.div 
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"
                      />
                    )}
                  </motion.a>
                ))}

                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-colors"
                    onClick={() => handleNavigation("/auth")}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium shadow-md"
                    onClick={() => handleNavigation("/auth")}
                  >
                    Get Started
                  </motion.button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden py-4 space-y-4 overflow-hidden"
                >
                  {[
                    "Features",
                    "How it Works",
                    "For Lecturers",
                    "For Students",
                    "Testimonials",
                    "FAQ",
                  ].map((item) => (
                    <a
                      key={item}
                      onClick={() => {
                        handleNavClick(item);
                        setIsMenuOpen(false);
                      }}
                      className={`block py-2 font-medium cursor-pointer ${
                        activeNavItem === item 
                          ? "text-emerald-600" 
                          : "text-gray-700 hover:text-emerald-600"
                      }`}
                    >
                      {item}
                    </a>
                  ))}
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      className="block w-full text-left py-2 text-emerald-600 font-medium"
                      onClick={() => handleNavigation("/auth")}
                    >
                      Login
                    </button>
                    <button
                      className="block w-full text-left py-2 mt-2 bg-emerald-600 text-white rounded-lg px-4"
                      onClick={() => handleNavigation("/auth")}
                    >
                      Get Started
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>

        {/* Hero Section with smooth zoom animation */}
        <section className="pt-20 relative h-screen overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHeroSlide}
                variants={heroVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                <div className="absolute inset-0 bg-black/50 z-10" />
                <Image
                  src={heroSlides[currentHeroSlide].image}
                  alt={`Hero slide ${currentHeroSlide + 1}`}
                  fill
                  className="object-cover"
                  priority
                  quality={100}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-center">
            <div className="max-w-3xl text-white">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-8"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentHeroSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-3xl lg:text-5xl font-bold leading-tight mt-2">
                      {heroSlides[currentHeroSlide].title}
                    </h1>
                    <p className="text-2xl text-emerald-300 font-light">
                      {heroSlides[currentHeroSlide].subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <motion.h2
                  variants={fadeInUp}
                  className="text-3xl lg:text-4xl font-medium leading-tight"
                >
                  The AI-powered platform for{" "}
                  <span className="text-emerald-300">
                    assessment and engagement
                  </span>
                </motion.h2>

                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-200 leading-relaxed"
                >
                  An intelligent solution for lecturers and students in
                  universities and colleges to enhance teaching and learning with automated 
                  assessment and performance tracking.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center space-x-2"
                    onClick={() => handleNavigation("/auth")}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
                  >
                    See Features
                  </motion.button>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex items-center space-x-6 text-sm text-gray-300"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Trusted by 50+ universities across Africa</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Hero navigation buttons */}
          <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroSlide(index)}
                className={`w-8 h-1 ${
                  currentHeroSlide === index ? "bg-emerald-500" : "bg-white/50"
                } transition-all duration-300 hover:bg-emerald-400`}
              />
            ))}
          </div>

          {/* Hero prev/next buttons */}
          <button
            onClick={prevHeroSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextHeroSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </section>

        {/* Trusted By Section - Infinite Carousel */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="text-gray-500 font-medium">
                TRUSTED BY LEADING INSTITUTIONS
              </h3>
            </div>
            <div className="relative overflow-hidden">
              <div 
                ref={carouselRef} 
                className="flex items-center space-x-16 whitespace-nowrap overflow-x-auto scrollbar-hide py-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Double the items for continuous scrolling */}
                {[...trustedInstitutions, ...trustedInstitutions].map((uni, index) => (
                  <div
                    key={index}
                    className="text-gray-600 font-semibold text-lg inline-block"
                  >
                    {uni}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why IntelliMark - Features Section - Updated with numbered cards */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 relative"
            >
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-9xl font-black opacity-5 text-emerald-900 whitespace-nowrap">
                FEATURES
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4 relative z-10">
                Why IntelliMark?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive tools designed specifically for modern education,
                empowering both educators and students
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Automated Assessment Creation",
                  description:
                    "Generate comprehensive quizzes and assignments with AI-powered content creation tailored to your curriculum.",
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Smart Analytics & Insights",
                  description:
                    "Track student progress with detailed analytics, identify learning gaps, and optimize teaching strategies.",
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Performance Management",
                  description:
                    "Monitor individual and class performance with intelligent reporting and progress tracking systems.",
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Student Performance Analytics",
                  description:
                    "Comprehensive dashboards showing learning patterns, strengths, and areas for improvement.",
                },
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Engaging Student Tools",
                  description:
                    "Interactive learning modules, gamified assessments, and personalized study recommendations.",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Personalized Motivation",
                  description:
                    "AI-driven motivation systems that adapt to individual learning styles and preferences.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white p-8 rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:bg-emerald-200 hover:opacity-20 transition-all duration-300"
                >
                  {/* Feature number */}
                  <span className="absolute top-4 right-4 text-4xl font-black text-gray-100 group-hover:text-emerald-600 group-hover:opacity-20 transition-all duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  {/* Paint animation overlay */}
                  <motion.div 
                    variants={paintVariants}
                    initial="initial"
                    whileHover="hover"
                    exit="exit"
                    className="absolute inset-0 bg-emerald-600 z-0"
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-14 h-14 flex items-center justify-center rounded-lg mb-4 bg-emerald-100 text-emerald-600">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Features Section - Enhanced design */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 relative"
            >
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-9xl font-black opacity-5 text-emerald-900 whitespace-nowrap">
                AI FEATURES
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4 relative z-10">
                Advanced AI Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Cutting-edge artificial intelligence designed specifically for
                educational environments
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/assets/ai.png"
                  alt="Advanced AI features in action"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  quality={100}
                />
              </motion.div>

              <div className="space-y-8">
                {[
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: "AI-Powered Grading",
                    description:
                      "Intelligent assessment of student submissions with detailed feedback, consistent grading, and time-saving automation.",
                  },
                  {
                    icon: <FileText className="w-6 h-6" />,
                    title: "Question Generation Engine",
                    description:
                      "Create unique, curriculum-aligned questions and assessments with our advanced NLP system.",
                  },
                  {
                    icon: <Server className="w-6 h-6" />,
                    title: "Predictive Learning Paths",
                    description:
                      "Machine learning algorithms that adapt to student progress and create personalized learning journeys.",
                  },
                  {
                    icon: <MessageSquare className="w-6 h-6" />,
                    title: "Intelligent Tutoring Assistant",
                    description:
                      "24/7 AI tutor that provides contextual help, answers questions, and guides students through difficult concepts.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                    className="flex items-start space-x-4 p-4 rounded-lg bg-white shadow-md border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-emerald-600 text-white flex items-center justify-center rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Numbered steps layout */}
        <section
          id="how-it-works"
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 relative"
            >
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-9xl font-black opacity-5 text-emerald-900 whitespace-nowrap">
                PROCESS
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4 relative z-10">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple steps to transform your teaching and learning experience
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto space-y-12">
              {[
                {
                  number: "01",
                  icon: <Users className="w-8 h-8" />,
                  title: "Upload & Align",
                  subtitle: "Assignment with AI",
                  description:
                    "Upload your curriculum and let AI align assignments with learning objectives. Create, customize, and publish assessments in minutes.",
                },
                {
                  number: "02",
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Student Completes",
                  subtitle: "Assignment",
                  description:
                    "Students engage with interactive, personalized assignments tailored to their learning pace. Our system adapts to provide an optimal challenge level.",
                },
                {
                  number: "03",
                  icon: <Clock className="w-8 h-8" />,
                  title: "Instant Feedback",
                  subtitle: "& Assessment",
                  description:
                    "AI provides immediate, detailed feedback and generates comprehensive assessment reports, highlighting strengths and areas for improvement.",
                },
                {
                  number: "04",
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Lecturer Receives",
                  subtitle: "Detailed Analytics",
                  description:
                    "Access comprehensive analytics, progress tracking, and actionable insights for each student. Identify patterns and optimize teaching strategies.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start gap-8 relative"
                >
                  {/* Step number */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="text-5xl font-black text-emerald-600">
                      {step.number}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-emerald-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {step.title}
                        </h3>
                        <p className="text-emerald-600 font-medium">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Ecosystem - Horizontal scrolling */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 relative"
            >
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-9xl font-black opacity-5 text-emerald-900 whitespace-nowrap">
                INTEGRATIONS
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4 relative z-10">
                Integration Ecosystem
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Seamlessly connects with your existing tools and platforms
              </p>
            </motion.div>

            <div className="relative overflow-hidden">
              <div 
                ref={integrationsRef}
                className="flex items-center space-x-8 py-8 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Double the items for continuous scrolling */}
                {[...integrationTools, ...integrationTools].map((tool, index) => {
                  const IconComponent = getIcon(tool);
                  return (
                    <motion.div
                      key={index}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      }}
                      className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center justify-center min-w-[180px] h-[150px] border border-gray-100"
                    >
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                        <IconComponent className="w-6 h-6 text-emerald-600" />
                      </div>
                      <p className="font-medium text-gray-700">{tool}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* For Lecturers */}
        <section
          id="for-lecturers"
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="relative">
                  <div className="absolute -top-12 left-0 text-9xl font-black opacity-5 text-emerald-900">
                    LECTURERS
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800 relative z-10">
                    For Lecturers
                  </h2>
                </div>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Streamline your teaching workflow, reduce administrative
                  burden, and gain valuable insights into student performance
                  with our comprehensive educator tools.
                </p>
                <div className="space-y-4 mt-8">
                  {[
                    "AI-powered content creation: Approve, edit, and publish in a single workflow",
                    "AI marking with detailed recommendations, reducing grading workload by up to 70%",
                    "Manage groups and students, tracking individual and collective progress",
                    "View personalized analytics and identify areas requiring additional attention",
                    "Automatic plagiarism detection and academic integrity verification",
                    "Customizable assessment templates aligned with learning objectives",
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{feature}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold shadow-lg mt-4"
                  onClick={() => handleNavigation("/auth")}
                >
                  Get Lecturer Demo
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  <Image
                    src="/assets/lec2.jpeg"
                    alt="Lecturer using IntelliMark dashboard"
                    className="w-full rounded-xl shadow-lg"
                    width={500}
                    height={400}
                    quality={100}
                  />

                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-10 -right-10 bg-white p-4 rounded-lg shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      <p className="font-medium">Time Saved</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-emerald-600">
                          68%
                        </p>
                        <p className="text-xs text-gray-500">Grading Time</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-emerald-600">
                          52%
                        </p>
                        <p className="text-xs text-gray-500">Prep Time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* For Students */}
        <section id="for-students" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative order-2 lg:order-1"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  <Image
                    src="/assets/students4.jpg"
                    alt="Student using IntelliMark on tablet"
                    className="w-full rounded-xl shadow-lg"
                    width={500}
                    height={400}
                    quality={100}
                  />

                  {/* Floating Badge */}
                  <div className="absolute -top-10 -left-10 bg-white p-3 rounded-full shadow-lg flex items-center justify-center w-24 h-24 border border-gray-100">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-emerald-600">93%</p>
                      <p className="text-xs text-gray-500">
                        Student Satisfaction
                      </p>
                    </div>
                  </div>

                  {/* Floating Card */}
                  <div className="absolute -bottom-8 -right-8 bg-white p-4 rounded-lg shadow-lg max-w-[200px] border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <p className="font-medium text-sm">Achievement</p>
                    </div>
                    <p className="text-xs text-gray-600">
                      &ldquo;Completed 5 consecutive assignments with above 90%
                      scores!&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6 order-1 lg:order-2"
              >
                <div className="relative">
                  <div className="absolute -top-12 left-0 text-9xl font-black opacity-5 text-emerald-900">
                    STUDENTS
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800 relative z-10">
                    For Students
                  </h2>
                </div>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Enhance your learning journey with personalized feedback,
                  engaging assignments, and motivational tools designed to help
                  you excel in your studies.
                </p>
                <div className="space-y-4 mt-8">
                  {[
                    "See all your CATs & assignments in a beautiful dashboard with upcoming deadlines",
                    "Get instant, actionable feedback on submissions--no more waiting for grades",
                    "Receive motivational encouragement when you need it most",
                    "Track your progress with interactive visual analytics and performance insights",
                    "Access personalized study recommendations based on your learning patterns",
                    "Earn badges, certificates, and recognition for your academic achievements",
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{feature}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold shadow-lg mt-4"
                  onClick={() => handleNavigation("/auth")}
                >
                  Get Student Demo
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 relative"
            >
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-9xl font-black opacity-5 text-emerald-900 whitespace-nowrap">
                TESTIMONIALS
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4 relative z-10">
                What People Are Saying
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from educators and students who have transformed their
                teaching and learning experience
              </p>
            </motion.div>

            <div className="relative">
              <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl p-8 shadow-xl border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                        <Image
                          src={testimonials[currentTestimonial].image}
                          alt={testimonials[currentTestimonial].name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          quality={100}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-5xl text-emerald-600 opacity-20 mb-2">
                          &quot;
                        </div>
                        <p className="text-gray-700 italic text-lg leading-relaxed mb-6">
                          {testimonials[currentTestimonial].quote}
                        </p>
                        <div>
                          <h4 className="font-semibold text-xl">
                            {testimonials[currentTestimonial].name}
                          </h4>
                          <p className="text-emerald-600">
                            {testimonials[currentTestimonial].role}
                          </p>
                          <div className="flex items-center mt-2">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 text-yellow-400"
                                fill="#facc15"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Testimonial navigation */}
                <div className="flex justify-center mt-6 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-8 h-1 ${
                        currentTestimonial === index ? "bg-emerald-600" : "bg-gray-300"
                      } transition-all duration-300 hover:bg-emerald-400`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Tracking */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8 relative"
            >
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-9xl font-black opacity-5 text-emerald-900 whitespace-nowrap">
                ANALYTICS
              </div>
              <h2 className="text-4xl font-bold text-gray-800 relative z-10">
                Track Performance. See Growth.
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive analytics that provide actionable insights for
                both educators and students
              </p>

              <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8 border border-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                  alt="Performance dashboard showing student analytics"
                  className="w-full rounded-lg shadow-lg mb-6"
                  width={1000}
                  height={600}
                  quality={100}
                />

                <div className="grid md:grid-cols-3 gap-6 text-left">
                  {[
                    {
                      icon: <TrendingUp className="w-6 h-6 text-white" />,
                      title:
                        "Visualize learning progress with interactive charts and detailed metrics",
                    },
                    {
                      icon: <Award className="w-6 h-6 text-white" />,
                      title:
                        "Identify topics you excel at based on comprehensive test analysis",
                    },
                    {
                      icon: <BarChart3 className="w-6 h-6 text-white" />,
                      title:
                        "Stay motivated with personalized badges and targeted reinforcement",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <p className="text-gray-700 mt-2">{item.title}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-emerald-600 rounded-3xl p-12 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-5xl font-bold mb-6">
                  Ready to Revolutionize Your Learning Experience?
                </h2>
                <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto">
                  Join thousands of educators and students already transforming
                  their educational journey with IntelliMark.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <motion.button
                    whileHover={{
                      scale: 1.05
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-5 bg-white text-emerald-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() => handleNavigation("/auth")}
                  >
                    Get Started Free
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-5 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg"
                  >
                    Schedule Demo
                  </motion.button>
                </div>

                <p className="text-sm mt-8 opacity-80">
                  No credit card required. Free 30-day trial.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section - With Accordion */}
        <section id="faq" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 relative"
            >
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-9xl font-black opacity-5 text-emerald-900 whitespace-nowrap">
                QUESTIONS
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4 relative z-10">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to know about IntelliMark
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0 ml-4">
                      {expandedFaq === index ? (
                        <Minus className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-gray-600 border-t border-gray-100">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer - Enhanced */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-6">
            {/* Top section with logo and newsletter */}
            <div className="flex flex-col lg:flex-row justify-between items-center mb-12 pb-12 border-b border-gray-800">
              <div className="mb-8 lg:mb-0">
                <Image
                  src="/assets/logo3.png"
                  alt="IntelliMark logo"
                  width={230}
                  height={160}
                  quality={100}
                />
              </div>
              
              <div className="w-full max-w-md">
                <h4 className="text-xl font-bold mb-4">Stay Updated</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-3 rounded-l-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-r-lg transition-colors duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main footer content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
              <div className="lg:col-span-2">
                <h4 className="text-lg font-bold mb-6 text-emerald-400">About IntelliMark</h4>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Transforming education through intelligent automation and
                  personalized learning experiences. Making education more
                  accessible, engaging, and effective for all.
                </p>
                <div className="space-y-2">
                  <p className="text-gray-400 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-emerald-400" />
                    <span className="text-emerald-400">info@intellimark.com</span>
                  </p>
                  <p className="text-gray-400 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-emerald-400" />
                    <span className="text-emerald-400">+254 712 345 678</span>
                  </p>
                  <p className="text-gray-400 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                    <span>Nairobi, Kenya</span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6 text-emerald-400">Features</h4>
                <ul className="space-y-3 text-gray-400">
                  {[
                    "Automated Assessment",
                    "Performance Analytics",
                    "Student Engagement",
                    "AI-Powered Insights",
                    "Curriculum Alignment",
                    "Personalized Learning",
                  ].map((item, i) => (
                    <li key={i} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center">
                      <ChevronRight className="w-4 h-4 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6 text-emerald-400">For Educators</h4>
                <ul className="space-y-3 text-gray-400">
                  {[
                    "Lecturer Dashboard",
                    "Content Creation",
                    "Progress Tracking",
                    "Grade Management",
                    "Department Analytics",
                    "Academic Planning",
                  ].map((item, i) => (
                    <li key={i} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center">
                      <ChevronRight className="w-4 h-4 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6 text-emerald-400">Company</h4>
                <ul className="space-y-3 text-gray-400">
                  {[
                    "About Us",
                    "Careers",
                    "Blog",
                    "Help Center",
                    "Contact Us",
                    "Privacy Policy",
                    "Terms of Service",
                  ].map((item, i) => (
                    <li key={i} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center">
                      <ChevronRight className="w-4 h-4 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Social media */}
            <div className="flex justify-center space-x-6 mb-8">
              {[Twitter, Facebook, Instagram, Linkedin, Youtube, Github].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-500 text-sm">
              <p className="mb-4">
                &copy; 2025 IntelliMark. All rights reserved. Empowering
                education through innovation.
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}