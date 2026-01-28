/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useLayout } from "@/components/LayoutController";
import Sidebar from "@/components/lecturerSidebar";
import Header from "@/components/Header";
import {
  BookMarked,
  Plus,
  Settings,
  GraduationCap,
  BookOpen,
  Calendar,
  Filter,
  Users,
  Layers3
} from "lucide-react";

// Import modularized components
import { Assessment, Course, Message } from "@/types/assessment";
import { dummyCourses, dummyAssessments } from "@/data/assessmentData";
import Modal from "@/components/ui/Modal";
import Breadcrumb from "@/components/ui/Breadcrumb";
import MessageNotification from "@/components/ui/MessageNotification";
import StatsCards from "@/components/ui/StatsCards";
import AILoadingModal from "@/components/ui/AILoadingModal";
import AssessmentCard from "@/components/lecturer/assessment/AssessmentCard";
import AssessmentForm from "@/components/lecturer/assessment/AssessmentForm";
import SideAccessPanel from "@/components/lecturer/navigation/SideAccessPanel";
import MobileNav from "@/components/lecturer/navigation/MobileNav";
import ViewAssessmentModal from "@/components/lecturer/ViewAssessmentModal";
import EditAssessmentModal from "@/components/lecturer/EditAssessmentModal";
import DeleteAssessmentModal from "@/components/lecturer/DeleteAssessmentModal";
import LibraryWorkspace from "@/components/lecturer/courses/LibraryWorkspace";
import SubmissionsWorkspace from "@/components/lecturer/courses/SubmissionsWorkspace";
import StudentsWorkspace from "@/components/lecturer/courses/StudentsWorkspace";
import CoursesManagerInline from "@/components/lecturer/CoursesManagerInline";

// API imports
import { courseApi, unitApi, assessmentApi } from "@/services/api";
import { useApi } from "@/hooks/useApi";
import { 
  transformCourseToUI, 
  transformAssessmentToLegacy,
  transformLegacyToApiAssessment,
  groupUnitsByCourse 
} from "@/utils/dataTransformers";

// Theme imports
import { useThemeColors } from "@/context/ThemeContext";
import FloatingThemeButton from "@/components/FloatingThemeButton";

const AssessmentsDashboard: React.FC = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const pathname = usePathname();
  const colors = useThemeColors(); // Get theme colors from context

  // Shared course / unit / week context for all course tools
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(0);

  // Which tool the lecturer is currently using under Courses
  type ActiveAction = "assessments" | "library" | "submissions" | "students" | "manage";
  const [activeAction, setActiveAction] = useState<ActiveAction>("assessments");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAccessMinimized, setIsAccessMinimized] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Modal states
  const [viewingAssessment, setViewingAssessment] = useState<Assessment | null>(null);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [deletingAssessment, setDeletingAssessment] = useState<Assessment | null>(null);

  // API hooks
  const { 
    data: apiCourses, 
    loading: coursesLoading, 
    error: coursesError  } = useApi(() => courseApi.getCourses(), []);

  const { 
    data: apiUnits, 
    loading: unitsLoading, 
    error: unitsError  } = useApi(() => unitApi.getUnits(), []);

  const { 
    data: apiAssessments, 
    loading: assessmentsLoading, 
    error: assessmentsError,
    refetch: refetchAssessments 
  } = useApi(() => assessmentApi.getAssessments(), []);

  // Transform API data to UI format
  useEffect(() => {
    if (apiCourses && apiUnits) {
      try {
        const coursesWithColors = apiCourses.map((course, index) => 
          transformCourseToUI(course, index)
        );
        const groupedCourses = groupUnitsByCourse(coursesWithColors, apiUnits);
        setCourses(groupedCourses);
      } catch (error) {
        console.error('Error transforming courses:', error);
        showMessage('error', 'Failed to load courses. Using offline data.');
        setCourses(dummyCourses);
      }
    } else if (coursesError || unitsError) {
      console.error('API Error:', coursesError || unitsError);
      showMessage('info', 'Using offline data. Please check your connection.');
      setCourses(dummyCourses);
    }
  }, [apiCourses, apiUnits, coursesError, unitsError]);

  // Transform assessments
  useEffect(() => {
    if (apiAssessments) {
      try {
        const legacyAssessments = apiAssessments.map(transformAssessmentToLegacy);
        setAssessments(legacyAssessments);
      } catch (error) {
        console.error('Error transforming assessments:', error);
        showMessage('error', 'Failed to load assessments. Using offline data.');
        setAssessments(dummyAssessments);
      }
    } else if (assessmentsError) {
      console.error('Assessments API Error:', assessmentsError);
      showMessage('info', 'Using offline assessment data. Please check your connection.');
      setAssessments(dummyAssessments);
    }
  }, [apiAssessments, assessmentsError]);

  // Auto-minimize side panel on mobile
  useEffect(() => {
    if (isMobileView) {
      setIsAccessMinimized(true);
    }
  }, [isMobileView]);

  // Get filtered assessments based on selections
  const filteredAssessments = assessments.filter(assessment => {
    if (!selectedCourse || !selectedUnit || selectedWeek === 0) return false;
    return assessment.course_id === selectedCourse && 
           assessment.unit_id === selectedUnit && 
           assessment.week === selectedWeek;
  });

  // Get breadcrumb items
  const getBreadcrumbItems = () => {
    const rootLabel = pathname?.startsWith("/lecturer/courses") ? "Courses" : "Assessments";
    const rootHref = pathname?.startsWith("/lecturer/courses") ? "/lecturer/courses" : "/lecturer/assessments";
    const items = [
      { label: rootLabel, icon: BookMarked, href: rootHref }
    ];

    if (selectedCourse) {
      const course = courses.find(c => c.id === selectedCourse);
      if (course) {
        items.push({ label: course.name, icon: GraduationCap, href: "#" });
        
        if (selectedUnit) {
          const unit = course.units.find(u => u.id === selectedUnit);
          if (unit) {
            items.push({ label: unit.unit_name, icon: BookOpen, href: "#" });
            
            if (selectedWeek > 0) {
              items.push({ label: `Week ${selectedWeek}`, icon: Calendar, href: "#" });
            }
          }
        }
      }
    }

    return items;
  };

  const handleQuestionCountUpdate = (assessmentId: string, nextCount: number) => {
    setAssessments((prev) =>
      prev.map((a) => (a.id === assessmentId ? { ...a, number_of_questions: nextCount } : a))
    );
    setEditingAssessment((prev) =>
      prev && prev.id === assessmentId ? { ...prev, number_of_questions: nextCount } : prev
    );
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

   
  const handleCreateAssessment = async (data: any, isAI: boolean, docFile?: File) => {
    setLoading(true);
    try {
      const apiData = transformLegacyToApiAssessment(data);
      
      let response;
      if (isAI) {
        response = await assessmentApi.generateAssessmentWithAI(apiData as any, docFile);
      } else {
        response = await assessmentApi.createAssessment(apiData as any);
      }
      
      // Refresh assessments from API
      await refetchAssessments();
      
      setShowCreateForm(false);
      showMessage('success', `Assessment "${response.title}" ${isAI ? 'generated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Create assessment error:', error);
      showMessage('error', 'Failed to create assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssessment = async (data: any) => {
    if (!editingAssessment) return;
    
    setLoading(true);
    try {
      // For now, we'll update locally since the API doesn't have an update endpoint
      // In a real implementation, you'd call an update API endpoint here
      
      const updatedAssessment = {
        ...editingAssessment,
        ...data,
        course_id: selectedCourse,
        unit_id: selectedUnit,
        week: selectedWeek
      };
      
      setAssessments(prev => 
        prev.map(a => a.id === editingAssessment.id ? updatedAssessment : a)
      );
      
      setEditingAssessment(null);
      showMessage('success', `Assessment "${data.title}" updated successfully!`);
    } catch (error) {
      console.error('Update assessment error:', error);
      showMessage('error', 'Failed to update assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async () => {
    if (!deletingAssessment) return;
    
    try {
      await assessmentApi.deleteAssessment(deletingAssessment.id);
      
      // Refresh assessments from API
      await refetchAssessments();
      
      showMessage('success', `Assessment "${deletingAssessment.title}" deleted successfully!`);
      setDeletingAssessment(null);
    } catch (error) {
      console.error('Delete assessment error:', error);
      showMessage('error', 'Failed to delete assessment. Please try again.');
    }
  };

  const handleVerifyAssessment = async (id: string) => {
    try {
      const response = await assessmentApi.verifyAssessment(id);
      
      // Update local state
      setAssessments(prev => 
        prev.map(a => a.id === id ? { ...a, verified: true } : a)
      );
      
      // Update viewingAssessment if it's currently open
      if (viewingAssessment && viewingAssessment.id === id) {
        setViewingAssessment({ ...viewingAssessment, verified: true });
      }
      
      // Update editingAssessment if it's currently open
      if (editingAssessment && editingAssessment.id === id) {
        setEditingAssessment({ ...editingAssessment, verified: true });
      }
      
      showMessage('success', `Assessment "${response.title}" verified successfully!`);
    } catch (error) {
      console.error('Verify assessment error:', error);
      showMessage('error', 'Failed to verify assessment. Please try again.');
    }
  };

  const canCreateAssessment = selectedCourse && selectedUnit && selectedWeek > 0;

  // Switch between tools within the Courses workspace
  const handleGoToLibrary = () => {
    if (!canCreateAssessment) return;
    setActiveAction("library");
  };

  const handleGoToSubmissions = () => {
    if (!selectedCourse || !selectedUnit) return;
    setActiveAction("submissions");
  };

  const handleGoToStudents = () => {
    if (!selectedCourse) return;
    setActiveAction("students");
  };

  const handleGoToCourseManagement = () => {
    // Open inline manager within the Courses workspace instead of navigating away
    setActiveAction("manage");
  };

  // Determine whether the currently selected action has the required selection
  const hasRequiredSelection = (() => {
    switch (activeAction) {
      case "assessments":
      case "library":
        return selectedCourse && selectedUnit && selectedWeek > 0;
      case "submissions":
        return selectedCourse && selectedUnit;
      case "students":
        return selectedCourse;
      case "manage":
        return true; // manage doesn't require any selection
      default:
        return false;
    }
  })();

  const getInstructions = () => {
    switch (activeAction) {
      case "assessments":
      case "library":
        return {
          title: "Get Started in Courses workspace",
          desc: "Select a course, unit, and week, then choose Assessments or Library above.",
          steps: [
            { icon: GraduationCap, label: "Choose a course" },
            { icon: BookOpen, label: "Select a unit" },
            { icon: Calendar, label: "Pick a week" },
          ],
        };
      case "submissions":
        return {
          title: "Open Submissions",
          desc: "Select a course and a unit to view submissions for that unit.",
          steps: [
            { icon: GraduationCap, label: "Choose a course" },
            { icon: BookOpen, label: "Select a unit" },
          ],
        };
      case "students":
        return {
          title: "View Students",
          desc: "Select a course to view enrolled students.",
          steps: [{ icon: GraduationCap, label: "Choose a course" }],
        };
      default:
        return {
          title: "Get Started in Courses workspace",
          desc: "Select the required context above.",
          steps: [],
        };
    }
  };

  // Calculate sidebar width for proper positioning
  const getSidebarWidth = () => {
    if (isMobileView || isTabletView) return 0;
    return sidebarCollapsed ? 80 : 240;
  };

  // Show loading state while fetching initial data
  if (coursesLoading || unitsLoading || assessmentsLoading) {
    return (
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: colors.background }}>
        <Sidebar />
        <div 
          className="flex flex-1 transition-all duration-300 items-center justify-center"
          style={{ marginLeft: getSidebarWidth() }}
        >
          <AILoadingModal 
            isOpen={true} 
            title="Loading Dashboard" 
            message="Fetching your courses and assessments..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: colors.background }}>
      <Sidebar />
      
      {/* AI Loading Modal */}
      <AILoadingModal isOpen={loading} />
      
      <div 
        className="flex flex-1 transition-all duration-300"
        style={{
          marginLeft: getSidebarWidth()
        }}
      >
        {/* Mobile Nav */}
        <MobileNav
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          selectedCourse={selectedCourse}
          selectedUnit={selectedUnit}
          selectedWeek={selectedWeek}
          onCourseSelect={setSelectedCourse}
          onUnitSelect={setSelectedUnit}
          onWeekSelect={setSelectedWeek}
          courses={courses}
        />
        
        {/* Desktop Side Panel */}
        <SideAccessPanel
          selectedCourse={selectedCourse}
          selectedUnit={selectedUnit}
          selectedWeek={selectedWeek}
          onCourseSelect={setSelectedCourse}
          onUnitSelect={setSelectedUnit}
          onWeekSelect={setSelectedWeek}
          courses={courses}
          isMinimized={isAccessMinimized}
          onToggleMinimize={() => setIsAccessMinimized(!isAccessMinimized)}
        />

        <div className="flex-1 overflow-auto">
          {/* This is the central Courses workspace; actions are chosen inside */}
          <Header title="Courses" showWeekSelector={false} />

          <main className="p-4 lg:p-6">
            {/* Mobile: course filters + action chips */}
            <div className="flex flex-col gap-3 mb-4 md:hidden">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Courses</h1>
                <button
                  onClick={() => setMobileNavOpen(true)}
                  className="p-2 rounded-lg shadow-sm"
                  style={{ 
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.primary 
                  }}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleGoToLibrary}
                  disabled={!canCreateAssessment}
                  className="px-3 py-2 text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.primaryLight,
                    color: colors.primaryDark 
                  }}
                >
                  Open Library for this week
                </button>
                <button
                  onClick={handleGoToSubmissions}
                  disabled={!selectedCourse || !selectedUnit}
                  className="px-3 py-2 text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.textPrimary 
                  }}
                >
                  View Submissions for this unit
                </button>
                <button
                  onClick={handleGoToStudents}
                  disabled={!selectedCourse}
                  className="px-3 py-2 text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.textPrimary 
                  }}
                >
                  Students in this course
                </button>
                <button
                  onClick={handleGoToCourseManagement}
                  className="px-3 py-2 text-xs font-semibold rounded-lg"
                  style={{ 
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.textPrimary 
                  }}
                >
                  Manage Courses & Units
                </button>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <Breadcrumb items={getBreadcrumbItems()} />

            {/* Message */}
            <AnimatePresence>
              <MessageNotification message={message} />
            </AnimatePresence>

            <div className="max-w-8xl mx-auto">
              {/* Desktop: page heading + primary actions selector */}
              <div className="mb-4 lg:mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                    Courses workspace
                  </h1>
                  <p className="text-base lg:text-lg" style={{ color: colors.textSecondary }}>
                    Select a course, unit, and week, then choose what you want to work on.
                  </p>
                </div>
                <div className="hidden md:flex flex-wrap gap-3">
                  <button
                    onClick={handleGoToLibrary}
                    disabled={!canCreateAssessment}
                    className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: colors.primaryLight,
                      borderColor: colors.primaryLight,
                      color: colors.primaryDark 
                    }}
                  >
                    Open Library for this course / unit / week
                  </button>
                  <button
                    onClick={handleGoToSubmissions}
                    disabled={!selectedCourse || !selectedUnit}
                    className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      color: colors.textPrimary 
                    }}
                  >
                    View Submissions for this unit
                  </button>
                  <button
                    onClick={handleGoToStudents}
                    disabled={!selectedCourse}
                    className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      color: colors.textPrimary 
                    }}
                  >
                    <Users className="w-4 h-4" />
                    Students in this course
                  </button>
                  <button
                    onClick={handleGoToCourseManagement}
                    className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                    style={{ 
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      color: colors.textPrimary 
                    }}
                  >
                    <Layers3 className="w-4 h-4" />
                    Manage Courses & Units
                  </button>
                </div>
              </div>

              {/* Action switcher for what should be loaded under this course context */}
              <div className="mb-6" style={{ borderBottom: `1px solid ${colors.border}` }}>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveAction("assessments")}
                    className="px-4 py-2 text-sm rounded-t-lg border-b-2 transition-colors"
                    style={{ 
                      borderBottomColor: activeAction === "assessments" ? colors.primary : 'transparent',
                      color: activeAction === "assessments" ? colors.primary : colors.textSecondary,
                      fontWeight: activeAction === "assessments" ? 600 : 400
                    }}
                  >
                    Assessments
                  </button>
                  <button
                    onClick={handleGoToLibrary}
                    disabled={!canCreateAssessment}
                    className={`px-4 py-2 text-sm rounded-t-lg border-b-2 transition-colors ${
                      !canCreateAssessment ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                    style={{ 
                      borderBottomColor: activeAction === "library" ? colors.primary : 'transparent',
                      color: activeAction === "library" ? colors.primary : colors.textSecondary,
                      fontWeight: activeAction === "library" ? 600 : 400
                    }}
                  >
                    Library
                  </button>
                  <button
                    onClick={handleGoToSubmissions}
                    disabled={!selectedCourse || !selectedUnit}
                    className={`px-4 py-2 text-sm rounded-t-lg border-b-2 transition-colors ${
                      !selectedCourse || !selectedUnit ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                    style={{ 
                      borderBottomColor: activeAction === "submissions" ? colors.primary : 'transparent',
                      color: activeAction === "submissions" ? colors.primary : colors.textSecondary,
                      fontWeight: activeAction === "submissions" ? 600 : 400
                    }}
                  >
                    Submissions
                  </button>
                  <button
                    onClick={handleGoToStudents}
                    disabled={!selectedCourse}
                    className={`px-4 py-2 text-sm rounded-t-lg border-b-2 transition-colors ${
                      !selectedCourse ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                    style={{ 
                      borderBottomColor: activeAction === "students" ? colors.primary : 'transparent',
                      color: activeAction === "students" ? colors.primary : colors.textSecondary,
                      fontWeight: activeAction === "students" ? 600 : 400
                    }}
                  >
                    Students
                  </button>
                </div>
              </div>

              {/* MAIN BODY - depends on selected action */}
              {!hasRequiredSelection ? (
                (() => {
                  const info = getInstructions();
                  return (
                    <div className="text-center py-12 lg:py-16">
                      <div className="max-w-md mx-auto">
                        <div 
                          className="w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${colors.primaryLight}, ${colors.backgroundSecondary})` 
                          }}
                        >
                          <Settings 
                            className="w-10 h-10 lg:w-12 lg:h-12" 
                            style={{ color: colors.primary }}
                          />
                        </div>
                        <h3 
                          className="text-xl lg:text-2xl font-bold mb-3"
                          style={{ color: colors.textPrimary }}
                        >{info.title}</h3>
                        <p 
                          className="text-base lg:text-lg mb-6"
                          style={{ color: colors.textSecondary }}
                        >{info.desc}</p>
                        <div className="space-y-3 text-sm" style={{ color: colors.textTertiary }}>
                          {info.steps.map((s, i) => (
                            <div 
                              key={i} 
                              className="flex items-center justify-center p-3 rounded-xl shadow-sm"
                              style={{ 
                                backgroundColor: colors.cardBackground, 
                                borderColor: colors.border,
                                border: `1px solid ${colors.border}` 
                              }}
                            >
                              <span 
                                className="mr-3 w-6 h-6 rounded-full flex items-center justify-center font-bold"
                                style={{ 
                                  backgroundColor: colors.primaryLight, 
                                  color: colors.primary 
                                }}
                              >{i + 1}</span>
                              <s.icon 
                                className="w-4 h-4 mr-2" 
                                style={{ color: colors.primary }}
                              />
                              <span className="font-semibold">{s.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <>
                  {activeAction === "assessments" && (
                    <>
                      {/* Creation Form State - Hide everything else when creating */}
                      {showCreateForm ? (
                        <div className="mb-6">
                          <AssessmentForm
                            selectedCourse={selectedCourse}
                            selectedUnit={selectedUnit}
                            selectedWeek={selectedWeek}
                            courses={courses}
                            onSubmit={handleCreateAssessment}
                            onCancel={() => setShowCreateForm(false)}
                            loading={loading}
                          />
                        </div>
                      ) : (
                        <>
                          <StatsCards assessments={filteredAssessments} />

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                            <div>
                              <h2 
                                className="text-xl lg:text-2xl font-bold"
                                style={{ color: colors.textPrimary }}
                              >
                                Assessments for Week {selectedWeek}
                              </h2>
                              <p 
                                className="text-base mt-1"
                                style={{ color: colors.textSecondary }}
                              >
                                {filteredAssessments.length} assessment{filteredAssessments.length !== 1 ? 's' : ''} found
                              </p>
                            </div>
                            <button
                              onClick={() => setShowCreateForm(true)}
                              className="flex items-center px-5 py-3 rounded-xl font-bold shadow-lg transition-colors"
                              style={{ 
                                backgroundColor: colors.primary,
                                color: '#ffffff'
                              }}
                            >
                              <Plus className="w-5 h-5 mr-2" />
                              Create Assessment
                            </button>
                          </div>

                          {filteredAssessments.length === 0 ? (
                            <div 
                              className="text-center py-12 lg:py-16 rounded-xl shadow"
                              style={{ 
                                backgroundColor: colors.cardBackground,
                                borderColor: colors.border,
                                border: `1px solid ${colors.border}` 
                              }}
                            >
                              <BookMarked 
                                className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-5" 
                                style={{ color: colors.borderLight }}
                              />
                              <h3 
                                className="text-xl font-bold mb-3"
                                style={{ color: colors.textSecondary }}
                              >No assessments yet</h3>
                              <p 
                                className="text-base mb-6"
                                style={{ color: colors.textTertiary }}
                              >
                                Create your first assessment for this week to get started
                              </p>
                              <button
                                onClick={() => setShowCreateForm(true)}
                                className="flex items-center px-6 py-3 rounded-xl font-bold mx-auto shadow transition-colors"
                                style={{ 
                                  backgroundColor: colors.primary,
                                  color: '#ffffff'
                                }}
                              >
                                <Plus className="w-5 h-5 mr-2" />
                                Create First Assessment
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                              {filteredAssessments.map((assessment, index) => (
                                <AssessmentCard
                                  key={assessment.id}
                                  assessment={assessment}
                                  courses={courses}
                                  onEdit={setEditingAssessment}
                                  onDelete={setDeletingAssessment}
                                  onView={setViewingAssessment}
                                  onVerify={handleVerifyAssessment}
                                  index={index}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {activeAction === "library" && (
                    <LibraryWorkspace
                      selectedCourseId={selectedCourse}
                      selectedUnitId={selectedUnit}
                      selectedWeek={selectedWeek}
                    />
                  )}

                  {activeAction === "submissions" && (
                    <SubmissionsWorkspace
                      selectedCourseId={selectedCourse}
                      selectedUnitId={selectedUnit}
                    />
                  )}

                  {activeAction === "students" && (
                    <StudentsWorkspace selectedCourseId={selectedCourse} />
                  )}
                  {activeAction === "manage" && (
                    <CoursesManagerInline />
                  )}
                </>
              )}
            </div>
          </main>
          
          {/* Decorative Footer */}
          <div className="h-24 relative overflow-hidden">
          </div>
        </div>
      </div>
      
      {/* View Assessment Modal */}
      <Modal
        isOpen={viewingAssessment !== null}
        onClose={() => setViewingAssessment(null)}
        title="Assessment Details"
        maxWidth="max-w-5xl"
      >
        {viewingAssessment && (
          <ViewAssessmentModal 
            assessment={viewingAssessment} 
            courses={courses}
            onVerify={handleVerifyAssessment}
          />
        )}
      </Modal>
      
      {/* Edit Assessment Modal */}
      <Modal
        isOpen={editingAssessment !== null}
        onClose={() => setEditingAssessment(null)}
        title="Edit Assessment"
        maxWidth="max-w-8xl"
      >
        {editingAssessment && (
          <EditAssessmentModal
            assessment={editingAssessment}
            courses={courses}
            onUpdate={handleUpdateAssessment}
            onCancel={() => setEditingAssessment(null)}
            loading={loading}
            onQuestionCountUpdate={handleQuestionCountUpdate}
          />
        )}
      </Modal>
      
      {/* Delete Assessment Modal */}
      <Modal
        isOpen={deletingAssessment !== null}
        onClose={() => setDeletingAssessment(null)}
        title="Delete Assessment"
        maxWidth="max-w-md"
      >
        {deletingAssessment && (
          <DeleteAssessmentModal
            assessment={deletingAssessment}
            onConfirm={handleDeleteAssessment}
            onCancel={() => setDeletingAssessment(null)}
          />
        )}
      </Modal>
      <FloatingThemeButton/>
    </div>
  );
};

export default AssessmentsDashboard;