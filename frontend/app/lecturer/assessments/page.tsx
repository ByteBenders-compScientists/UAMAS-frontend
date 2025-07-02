"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Filter
} from "lucide-react";

// Import modularized components
import { Assessment, Course, Message } from "../../../types/assessment";
import { dummyCourses, dummyAssessments } from "../../../data/assessmentData";
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

const AssessmentsDashboard: React.FC = () => {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAccessMinimized, setIsAccessMinimized] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>(dummyAssessments);
  const [message, setMessage] = useState<Message | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Modal states
  const [viewingAssessment, setViewingAssessment] = useState<Assessment | null>(null);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [deletingAssessment, setDeletingAssessment] = useState<Assessment | null>(null);

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
    const items = [
      { label: "Assessments", icon: BookMarked, href: "#" }
    ];

    if (selectedCourse) {
      const course = dummyCourses.find(c => c.id === selectedCourse);
      if (course) {
        items.push({ label: course.name, icon: GraduationCap, href: "#" });
        
        if (selectedUnit) {
          const unit = course.units.find(u => u.id === selectedUnit);
          if (unit) {
            items.push({ label: unit.name, icon: BookOpen, href: "#" });
            
            if (selectedWeek > 0) {
              items.push({ label: `Week ${selectedWeek}`, icon: Calendar, href: "#" });
            }
          }
        }
      }
    }

    return items;
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateAssessment = async (data: any, isAI: boolean) => {
    setLoading(true);
    try {
      // Simulate API call with longer delay for AI generation
      await new Promise(resolve => setTimeout(resolve, isAI ? 4000 : 2000));
      
      const newAssessment: Assessment = {
        ...data,
        id: Date.now().toString(),
        verified: false,
        created_at: new Date().toISOString(),
        creator_id: "lecturer1",
        questions: isAI ? [] : [] // Add dummy questions for AI generation if needed
      };
      
      setAssessments(prev => [...prev, newAssessment]);
      setShowCreateForm(false);
      showMessage('success', `Assessment "${data.title}" ${isAI ? 'generated' : 'created'} successfully!`);
    } catch (error) {
      showMessage('error', 'Failed to create assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssessment = async (data: any) => {
    if (!editingAssessment) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      showMessage('error', 'Failed to update assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async () => {
    if (!deletingAssessment) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAssessments(prev => prev.filter(a => a.id !== deletingAssessment.id));
      showMessage('success', `Assessment "${deletingAssessment.title}" deleted successfully!`);
      setDeletingAssessment(null);
    } catch (error) {
      showMessage('error', 'Failed to delete assessment. Please try again.');
    }
  };

  const handleVerifyAssessment = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAssessments(prev => 
        prev.map(a => a.id === id ? { ...a, verified: true } : a)
      );
      
      showMessage('success', 'Assessment verified successfully!');
    } catch (error) {
      showMessage('error', 'Failed to verify assessment. Please try again.');
    }
  };

  const canCreateAssessment = selectedCourse && selectedUnit && selectedWeek > 0;

  // Calculate sidebar width for proper positioning
  const getSidebarWidth = () => {
    if (isMobileView || isTabletView) return 0;
    return sidebarCollapsed ? 80 : 240;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
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
          courses={dummyCourses}
        />
        
        {/* Desktop Side Panel */}
        <SideAccessPanel
          selectedCourse={selectedCourse}
          selectedUnit={selectedUnit}
          selectedWeek={selectedWeek}
          onCourseSelect={setSelectedCourse}
          onUnitSelect={setSelectedUnit}
          onWeekSelect={setSelectedWeek}
          courses={dummyCourses}
          isMinimized={isAccessMinimized}
          onToggleMinimize={() => setIsAccessMinimized(!isAccessMinimized)}
        />

        <div className="flex-1 overflow-auto">
          <Header title="Assessments" showWeekSelector={false} />

          <main className="p-4 lg:p-6">
            {/* Mobile Filter Button */}
            <div className="flex justify-between items-center mb-4 md:hidden">
              <h1 className="text-xl font-bold text-gray-900">Assessments</h1>
              <button
                onClick={() => setMobileNavOpen(true)}
                className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm text-emerald-600"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
            
            {/* Breadcrumb */}
            <Breadcrumb items={getBreadcrumbItems()} />

            {/* Message */}
            <AnimatePresence>
              <MessageNotification message={message} />
            </AnimatePresence>

            <div className="max-w-7xl mx-auto">
              <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Assessment Management</h1>
                <p className="text-base lg:text-lg text-gray-600">Create, manage, and organize your assessments with AI assistance</p>
              </div>

              {!canCreateAssessment ? (
                <div className="text-center py-12 lg:py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Settings className="w-10 h-10 lg:w-12 lg:h-12 text-emerald-600" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Get Started</h3>
                    <p className="text-base lg:text-lg text-gray-600 mb-6">
                      Select a course, unit, and week to view and create assessments
                    </p>
                    <div className="space-y-3 text-sm text-gray-500">
                      <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                        <span className="mr-3 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">1</span>
                        <GraduationCap className="w-4 h-4 mr-2 text-emerald-600" />
                        <span className="font-semibold">Choose a course</span>
                      </div>
                      <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                        <span className="mr-3 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">2</span>
                        <BookOpen className="w-4 h-4 mr-2 text-emerald-600" />
                        <span className="font-semibold">Select a unit</span>
                      </div>
                      <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                        <span className="mr-3 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">3</span>
                        <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                        <span className="font-semibold">Pick a week</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Creation Form State - Hide everything else when creating */}
                  {showCreateForm ? (
                    <div className="mb-6">
                      <AssessmentForm
                        selectedCourse={selectedCourse}
                        selectedUnit={selectedUnit}
                        selectedWeek={selectedWeek}
                        courses={dummyCourses}
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
                          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                            Assessments for Week {selectedWeek}
                          </h2>
                          <p className="text-base text-gray-600 mt-1">
                            {filteredAssessments.length} assessment{filteredAssessments.length !== 1 ? 's' : ''} found
                          </p>
                        </div>
                        <button
                          onClick={() => setShowCreateForm(true)}
                          className="flex items-center px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-bold shadow-lg"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Create Assessment
                        </button>
                      </div>

                      {filteredAssessments.length === 0 ? (
                        <div className="text-center py-12 lg:py-16 bg-white rounded-xl border border-gray-200 shadow">
                          <BookMarked className="w-16 h-16 lg:w-20 lg:h-20 text-gray-300 mx-auto mb-5" />
                          <h3 className="text-xl font-bold text-gray-600 mb-3">No assessments yet</h3>
                          <p className="text-base text-gray-500 mb-6">
                            Create your first assessment for this week to get started
                          </p>
                          <button
                            onClick={() => setShowCreateForm(true)}
                            className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-bold mx-auto shadow"
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
                              courses={dummyCourses}
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
            courses={dummyCourses}
            onVerify={handleVerifyAssessment}
          />
        )}
      </Modal>
      
      {/* Edit Assessment Modal */}
      <Modal
        isOpen={editingAssessment !== null}
        onClose={() => setEditingAssessment(null)}
        title="Edit Assessment"
        maxWidth="max-w-6xl"
      >
        {editingAssessment && (
          <EditAssessmentModal
            assessment={editingAssessment}
            courses={dummyCourses}
            onUpdate={handleUpdateAssessment}
            onCancel={() => setEditingAssessment(null)}
            loading={loading}
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
    </div>
  );
};

export default AssessmentsDashboard;