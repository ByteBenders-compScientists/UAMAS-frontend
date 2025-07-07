"use client";
import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  BrainCircuit,
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
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EduAISuite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 300]);

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

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const getIcon = (tool: string) => {
    const icons = {
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
    } as const;
    return (icons as Record<string, typeof Globe>)[tool] || Globe;
  };

  const testimonials = [
    {
      name: "Dr Benson Mwangi",
      role: "Computer Science Professor",
      image: "/assets/ben.jpg",
      quote:
        "EduAI Suite has completely transformed how I manage assessments. The AI-powered grading has saved me countless hours, and the analytics provide incredible insights into student learning patterns.",
    },
    {
      name: "Joseph Kiprotich",
      role: "Engineering Student",
      image: "/assets/stud.jpg",
      quote:
        "As a student with a busy schedule, the personalized learning paths and instant feedback have helped me stay on track. I've seen my grades improve significantly since using this platform.",
    },
    {
      name: "Lecturer David Maina",
      role: "Department Head, Mathematics",
      image: "/assets/lec2.jpg",
      quote:
        "The implementation across our department has been seamless. We've seen increased student engagement and improved performance metrics. The customizable assessments are particularly valuable.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 w-full h-full z-0">
        <motion.div
          style={{ y: parallaxY }}
          className="absolute inset-0 w-full h-[120%] bg-gradient-to-b from-emerald-50 via-white to-teal-50"
        >
          <div className="absolute inset-0 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10">
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100/20 shadow-lg"
        >
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                 <Image
                src="/assets/logo3.png"
                alt="logo"
                width={190}
                height={160}
                quality={100}
                />
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {[
                  "Features",
                  "How it Works",
                  "For Lecturers",
                  "For Students",
                  "Testimonials",
                  "FAQ",
                ].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    whileHover={{ y: -2 }}
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
                  >
                    {item}
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
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(16, 185, 129, 0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium shadow-md"
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
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 space-y-4"
              >
                {[
                  "Features",
                  "How it Works",
                  "For Lecturers",
                  "For Students",
                  "Testimonials",
                  "Pricing",
                  "FAQ",
                ].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="block text-gray-700 hover:text-emerald-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
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
                    className="block w-full text-left py-2 text-emerald-600 font-medium"
                    onClick={() => handleNavigation("/auth")}
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 z-0"></div>
          <div className="container mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-8"
              >
                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl lg:text-6xl font-bold leading-tight"
                >
                  Transform How You{" "}
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    Teach, Learn,
                  </span>{" "}
                  and Motivate
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-600 leading-relaxed"
                >
                  An AI-powered platform for lecturers and students in
                  universities and colleges to enhance CTL and student
                  engagement with automated assessment and performance tracking.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center space-x-2"
                    onClick={() => handleNavigation("/auth")}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-colors"
                  >
                    See Features
                  </motion.button>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex items-center space-x-6 text-sm text-gray-500"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Trusted by 50+ universities worldwide</span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-2xl"></div>
                  <Image
                    src="/assets/backgroundimage.jpeg"
                    alt="Students and lecturer using EduAI Suite"
                    className="w-full h-64 object-cover rounded-lg relative z-10"
                    width={400}
                    height={400}
                    quality={100}
                  />
                  <div className="mt-4 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Active Learning Session
                        </p>
                        <p className="text-sm text-gray-600">
                          Real-time engagement tracking
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">+28% Engagement</p>
                    <p className="text-xs text-gray-500">Last 30 days</p>
                  </div>
                </div>

                <div className="absolute -top-10 -right-5 bg-white p-3 rounded-lg shadow-lg transform rotate-6">
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="#facc15"
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium mt-1">
                    Rated 4.9/5 by educators
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="text-gray-500 font-medium">
                TRUSTED BY LEADING INSTITUTIONS
              </h3>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {[
                "University of Nairobi",
                "JKUAT University",
                "KCA",
                "Dedan Kimathi University",
                "Kenyatta University",
                "Kabarak",
              ].map((uni, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-gray-400 font-semibold text-lg"
                >
                  {uni}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why EduAI Suite - Transparent Section */}
        <section id="features" className="py-20 bg-white/30 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Why EduAI Suite?
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
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                  className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20"
                >
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3 rounded-lg w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
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
              >
                <Image
                  src="/assets/ai.png"
                  alt="Advanced AI features in action"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-2xl"
                  quality={100}
                />
              </motion.div>

              <div className="space-y-8">
                {[
                  {
                    icon: <Zap className="w-6 h-6 text-emerald-500" />,
                    title: "AI-Powered Grading",
                    description:
                      "Intelligent assessment of student submissions with detailed feedback, consistent grading, and time-saving automation.",
                  },
                  {
                    icon: <FileText className="w-6 h-6 text-emerald-500" />,
                    title: "Question Generation Engine",
                    description:
                      "Create unique, curriculum-aligned questions and assessments with our advanced NLP system.",
                  },
                  {
                    icon: <Server className="w-6 h-6 text-emerald-500" />,
                    title: "Predictive Learning Paths",
                    description:
                      "Machine learning algorithms that adapt to student progress and create personalized learning journeys.",
                  },
                  {
                    icon: (
                      <MessageSquare className="w-6 h-6 text-emerald-500" />
                    ),
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
                    className="flex items-start space-x-4"
                  >
                    <div className="bg-emerald-100 p-3 rounded-lg">
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

        {/* How It Works */}
        <section
          id="how-it-works"
          className="py-20 bg-white/30 backdrop-blur-sm"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple steps to transform your teaching and learning experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Upload & Align",
                  subtitle: "Assignment with AI",
                  description:
                    "Upload your curriculum and let AI align assignments with learning objectives.",
                },
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Student Completes",
                  subtitle: "Assignment",
                  description:
                    "Students engage with interactive, personalized assignments tailored to their learning pace.",
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "Instant Feedback",
                  subtitle: "& Assessment",
                  description:
                    "AI provides immediate, detailed feedback and generates comprehensive assessment reports.",
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Lecturer Receives",
                  subtitle: "Detailed Analytics",
                  description:
                    "Access comprehensive analytics, progress tracking, and actionable insights for each student.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center relative"
                >
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>

                  {/* Connector Line */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                  )}

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-emerald-600 font-medium mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Ecosystem */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Integration Ecosystem
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Seamlessly connects with your existing tools and platforms
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {[
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
              ].map((tool, index) => {
                const IconComponent = getIcon(tool);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                    className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="font-medium text-gray-700">{tool}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* For Lecturers - Transparent Section */}
        <section
          id="for-lecturers"
          className="py-20 bg-white/30 backdrop-blur-sm"
        >
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-4xl font-bold text-gray-800">
                  For Lecturers
                </h2>
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
                      <CheckCircle className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{feature}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold shadow-lg mt-4"
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
                <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/assets/lec.jpg"
                    alt="Lecturer using EduAI Suite dashboard"
                    className="w-full rounded-xl shadow-lg"
                    width={500}
                    height={400}
                    quality={100}
                  />

                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-10 -right-10 bg-white p-4 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="w-5 h-5 text-emerald-500" />
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
        <section id="for-students" className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative order-2 lg:order-1"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-6 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/assets/student.png"
                    alt="Student using EduAI Suite on tablet"
                    className="w-full rounded-xl shadow-lg"
                    width={500}
                    height={400}
                    quality={100}
                  />

                  {/* Floating Badge */}
                  <div className="absolute -top-10 -left-10 bg-white p-3 rounded-full shadow-lg flex items-center justify-center w-24 h-24">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-emerald-600">93%</p>
                      <p className="text-xs text-gray-500">
                        Student Satisfaction
                      </p>
                    </div>
                  </div>

                  {/* Floating Card */}
                  <div className="absolute -bottom-8 -right-8 bg-white p-4 rounded-lg shadow-lg max-w-[200px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5 text-emerald-500" />
                      <p className="font-medium text-sm">Achievement</p>
                    </div>
                    <p className="text-xs text-gray-600">
                      "Completed 5 consecutive assignments with above 90%
                      scores!"
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
                <h2 className="text-4xl font-bold text-gray-800">
                  For Students
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Enhance your learning journey with personalized feedback,
                  engaging assignments, and motivational tools designed to help
                  you excel in your studies.
                </p>
                <div className="space-y-4 mt-8">
                  {[
                    "See all your CATs & assignments in a beautiful dashboard with upcoming deadlines",
                    "Get instant, actionable feedback on submissions—no more waiting for grades",
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
                      <CheckCircle className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{feature}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold shadow-lg mt-4"
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
          className="py-20 bg-white/30 backdrop-blur-sm"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                What People Are Saying
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from educators and students who have transformed their
                teaching and learning experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                  className="bg-white rounded-xl p-8 shadow-xl relative"
                >
                  <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 text-emerald-500 text-8xl opacity-10">
                    &quot;
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16  rounded-full flex items-center justify-center">
                      {/* <Users className="w-8 h-8 text-emerald-600" /> */}
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full absolute inset-0 ml-[8%] mt-[9%] sm:ml-[7%] sm:mt-[7%]"
                        width={64}
                        height={64}
                        quality={100}
                      />
                    </div>
                    <div className="mt-1 sm:mt-4 md:mt-1">
                      <h4 className="font-semibold text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-emerald-600">{testimonial.role}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 italic leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="#facc15"
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Tracking */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-gray-800">
                Track Performance. See Growth.
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive analytics that provide actionable insights for
                both educators and students
              </p>

              <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-8">
                <Image
                  src="/assets/dash.png"
                  alt="Performance dashboard showing student analytics"
                  className="w-full rounded-lg shadow-lg mb-6"
                  width={1000}
                  height={600}
                  quality={100}
                />

                <div className="grid md:grid-cols-3 gap-6 text-left">
                  {[
                    {
                      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
                      title:
                        "Visualize learning progress with interactive charts and detailed metrics",
                    },
                    {
                      icon: <Award className="w-6 h-6 text-emerald-500" />,
                      title:
                        "Identify topics you excel at based on comprehensive test analysis",
                    },
                    {
                      icon: <BarChart3 className="w-6 h-6 text-emerald-500" />,
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
                      {item.icon}
                      <p className="text-gray-700">{item.title}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-12 text-white relative overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                >
                  <defs>
                    <pattern
                      id="dots"
                      width="30"
                      height="30"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="10" cy="10" r="2" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
              </div>

              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">
                  Ready to Revolutionize Your Learning Experience?
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                  Join thousands of educators and students already transforming
                  their educational journey with EduAI Suite.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(255,255,255,0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() => handleNavigation("/auth")}
                  >
                    Get Started Free
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg"
                  >
                    Schedule Demo
                  </motion.button>
                </div>

                <p className="text-sm mt-6 opacity-80">
                  No credit card required. Free 30-day trial.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section - Transparent */}
        <section id="faq" className="py-20 bg-white/30 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to know about EduAI Suite
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Is the platform suitable for any institution?",
                  answer:
                    "Yes, EduAI Suite is designed for universities, colleges, and schools of all sizes. Our flexible architecture allows the platform to scale with institutions of any size, from small departments to large multi-campus universities.",
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
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-5 gap-8">
              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl">
                    <BrainCircuit className="text-white h-6 w-6" />
                  </div>
                  <span className="text-xl font-bold">EduAI Suite</span>
                </div>
                <p className="text-gray-400">
                  Transforming education through intelligent automation and
                  personalized learning experiences. Making education more
                  accessible, engaging, and effective for all.
                </p>
                <div className="pt-4">
                  <p className="text-gray-400">
                    Contact us:{" "}
                    <span className="text-emerald-400">
                      info@eduaisuite.com
                    </span>
                  </p>
                  <p className="text-gray-400">
                    Support:{" "}
                    <span className="text-emerald-400">
                      support@eduaisuite.com
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-emerald-400">
                  Features
                </h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="hover:text-white transition-colors">
                    Automated Assessment
                  </li>
                  <li className="hover:text-white transition-colors">
                    Performance Analytics
                  </li>
                  <li className="hover:text-white transition-colors">
                    Student Engagement
                  </li>
                  <li className="hover:text-white transition-colors">
                    AI-Powered Insights
                  </li>
                  <li className="hover:text-white transition-colors">
                    Curriculum Alignment
                  </li>
                  <li className="hover:text-white transition-colors">
                    Personalized Learning
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-emerald-400">
                  For Educators
                </h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="hover:text-white transition-colors">
                    Lecturer Dashboard
                  </li>
                  <li className="hover:text-white transition-colors">
                    Content Creation
                  </li>
                  <li className="hover:text-white transition-colors">
                    Progress Tracking
                  </li>
                  <li className="hover:text-white transition-colors">
                    Grade Management
                  </li>
                  <li className="hover:text-white transition-colors">
                    Department Analytics
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-emerald-400">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="hover:text-white transition-colors">
                    About Us
                  </li>
                  <li className="hover:text-white transition-colors">
                    Careers
                  </li>
                  <li className="hover:text-white transition-colors">Blog</li>
                  <li className="hover:text-white transition-colors">
                    Help Center
                  </li>
                  <li className="hover:text-white transition-colors">
                    Contact Us
                  </li>
                  <li className="hover:text-white transition-colors">
                    Privacy Policy
                  </li>
                  <li className="hover:text-white transition-colors">
                    Terms of Service
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>
                &copy; 2025 EduAI Suite. All rights reserved. Empowering
                education through innovation.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
