"use client";

import React, { useEffect, useState } from "react";
import AddCourseModal from "@/components/lecturer/AddCourseModal";
import type {
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateUnitRequest,
  UpdateUnitRequest,
  Unit,
} from "@/services/api";
import { Plus, Edit, Trash2, Save, X, ChevronDown, ChevronUp, BookOpen, GraduationCap, Bookmark, Calendar, Layers, Copy } from 'lucide-react';
import { courseApi, unitApi } from "@/services/api";
import { useThemeColors } from '@/context/ThemeContext';

type Course = {
  id: string;
  code: string;
  name: string;
  department: string;
  school: string;
  units: LocalUnit[];
};

type LocalUnit = Unit & {
  unique_join_code?: string;
};

export default function CoursesManagerInline() {
  const colors = useThemeColors();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // UI state for accordion + inline unit forms
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [addingUnitForCourse, setAddingUnitForCourse] = useState<string | null>(null);
  const [editingUnit, setEditingUnit] = useState<{ courseId: string; unit: LocalUnit } | null>(null);
  const [unitForm, setUnitForm] = useState<Partial<CreateUnitRequest & { id?: string }>>({});
  const [unitSubmitting, setUnitSubmitting] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseApi.getCourses();
      setCourses(data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAdd = () => {
    setSelectedCourse(null);
    setShowAddModal(true);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course? This will also remove its units.")) return;
    try {
      await courseApi.deleteCourse(id);
      // refresh list
      await fetchCourses();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete course");
    }
  };

  const handleSubmit = async (data: { code: string; name: string; department: string; school: string }) => {
    try {
      setSubmitting(true);
      if (selectedCourse) {
        // update
        await courseApi.updateCourse(selectedCourse.id, data as UpdateCourseRequest);
      } else {
        // create
        await courseApi.createCourse(data as CreateCourseRequest);
      }
      setShowAddModal(false);
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  // Unit management
  const startAddUnit = (courseId: string) => {
    setAddingUnitForCourse(courseId);
    setUnitForm({ course_id: courseId, unit_code: "", unit_name: "", level: 100, semester: 1 });
  };

  const startEditUnit = (courseId: string, unit: LocalUnit) => {
    setEditingUnit({ courseId, unit });
    setUnitForm({ id: unit.id, course_id: courseId, unit_code: unit.unit_code, unit_name: unit.unit_name, level: unit.level, semester: unit.semester });
  };

  const cancelUnitForm = () => {
    setAddingUnitForCourse(null);
    setEditingUnit(null);
    setUnitForm({});
  };

  const submitUnitForm = async () => {
    if (!unitForm || !unitForm.course_id) return;
    // basic validation
    if (!unitForm.unit_code || !unitForm.unit_name) {
      alert('Please provide unit code and name');
      return;
    }

    try {
      setUnitSubmitting(true);
      if (editingUnit && unitForm.id) {
        await unitApi.updateUnit(unitForm.id, unitForm as UpdateUnitRequest);
      } else {
        await unitApi.createUnit(unitForm as CreateUnitRequest);
      }
      await fetchCourses();
      cancelUnitForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save unit');
    } finally {
      setUnitSubmitting(false);
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm('Delete this unit? This action cannot be undone.')) return;
    try {
      await unitApi.deleteUnit(unitId);
      await fetchCourses();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete unit');
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Manage Courses</h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>Create, edit and delete courses and their units right here.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm" style={{ color: colors.textTertiary }}>Tip: expand a course to manage its units</div>
          <button 
            onClick={handleAdd} 
            className="inline-flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Course
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center" style={{ color: colors.textSecondary }}>Loading courses...</div>
      ) : error ? (
        <div 
          className="p-4 rounded"
          style={{
            backgroundColor: `${colors.error}15`,
            color: colors.error,
          }}
        >
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div 
          className="p-6 rounded border text-center"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            color: colors.textSecondary,
          }}
        >
          No courses yet
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md"
              style={{
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              }}
            >
              <div 
                className="flex items-center justify-between p-5 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${colors.background}, ${colors.backgroundSecondary})`,
                }}
                onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)}
              >
                <div className="flex-1">
                  <div className="flex items-start sm:items-center">
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-inner"
                      style={{
                        background: `linear-gradient(to bottom right, ${colors.primaryLight}, ${colors.info}20)`,
                      }}
                    >
                      <GraduationCap className="w-6 h-6" style={{ color: colors.primary }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                        <h3 className="text-lg font-bold truncate" style={{ color: colors.textPrimary }}>{course.name}</h3>
                        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                          <span 
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: `${colors.primary}20`,
                              color: colors.primary,
                            }}
                          >
                            {course.units.length} {course.units.length === 1 ? 'Unit' : 'Units'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(course);
                            }}
                            className="p-1.5 hover:opacity-90 rounded-full transition-colors"
                            style={{ color: colors.textSecondary }}
                            title="Edit course"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(course.id);
                            }}
                            className="p-1.5 hover:opacity-90 rounded-full transition-colors"
                            style={{ color: colors.error }}
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:items-center text-sm space-y-1 sm:space-y-0 sm:space-x-4" style={{ color: colors.textSecondary }}>
                        <span className="flex items-center">
                          <svg className="flex-shrink-0 mr-1.5 h-4 w-4" style={{ color: colors.textTertiary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {course.department}
                        </span>
                        <span className="hidden sm:block" style={{ color: colors.border }}>•</span>
                        <span className="flex items-center">
                          <svg className="flex-shrink-0 mr-1.5 h-4 w-4" style={{ color: colors.textTertiary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          {course.school}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button 
                    className="p-2 hover:opacity-90 rounded-full transition-colors duration-200"
                    style={{ color: colors.textSecondary }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCourseId(expandedCourseId === course.id ? null : course.id);
                    }}
                  >
                    {expandedCourseId === course.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {expandedCourseId === course.id && (
                <div 
                  className="p-6 border-t"
                  style={{
                    background: `linear-gradient(to bottom, ${colors.backgroundSecondary}, ${colors.background})`,
                    borderColor: colors.border,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="text-lg font-semibold flex items-center" style={{ color: colors.textPrimary }}>
                        <Layers className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
                        Course Units
                      </h3>
                      <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>Manage units for {course.name}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startAddUnit(course.id);
                      }}
                      className="group inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5"
                      style={{ 
                        backgroundColor: colors.primary,
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryDark})`,
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                      Add New Unit
                    </button>
                  </div>

                  {course.units.length === 0 ? (
                    <div 
                      className="relative block w-full p-8 text-center rounded-xl border-2 border-dashed hover:border-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                      style={{
                        borderColor: colors.border,
                        backgroundColor: colors.cardBackground,
                      }}
                    >
                      <BookOpen className="w-12 h-12 mx-auto" style={{ color: colors.textTertiary }} />
                      <h4 className="mt-2 text-base font-medium" style={{ color: colors.textPrimary }}>No units added yet</h4>
                      <p className="mt-1 text-sm max-w-xs mx-auto" style={{ color: colors.textSecondary }}>
                        Organize your course by adding units. Each unit can contain lectures, materials, and assessments.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                      {course.units.map((u) => (
                        <div 
                          key={u.id} 
                          className="relative group p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                          style={{
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.border,
                          }}
                        >
                          <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditUnit(course.id, u);
                              }}
                              className="p-1.5 hover:opacity-90 rounded-full transition-colors"
                              style={{ color: colors.textSecondary }}
                              title="Edit unit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUnit(u.id);
                              }}
                              className="p-1.5 hover:opacity-90 rounded-full transition-colors"
                              style={{ color: colors.error }}
                              title="Delete unit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-start">
                            <div 
                              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                              style={{ backgroundColor: `${colors.primary}20` }}
                            >
                              <Bookmark className="w-5 h-5" style={{ color: colors.primary }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-semibold truncate" style={{ color: colors.textPrimary }}>{u.unit_name}</h4>
                              <div className="flex flex-wrap items-center mt-1 text-sm space-x-2" style={{ color: colors.textSecondary }}>
                                <span 
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: `${colors.info}20`,
                                    color: colors.info,
                                  }}
                                >
                                  {u.unit_code}
                                </span>
                                <span className="inline-flex items-center">
                                  <Calendar className="w-3.5 h-3.5 mr-1" style={{ color: colors.textTertiary }} />
                                  <span>Y{u.level}</span>
                                  <span className="mx-1" style={{ color: colors.border }}> • </span>
                                  <span>Sem {u.semester}</span>
                                </span>
                                {u.unique_join_code && (
                                  <span 
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                    style={{
                                      backgroundColor: `${colors.primary}20`,
                                      color: colors.primary,
                                    }}
                                  >
                                    <span className="font-mono tracking-wide">
                                      Join: {u.unique_join_code}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard
                                          .writeText(u.unique_join_code || "")
                                          .catch(() => {
                                            // Silently ignore clipboard errors
                                          });
                                      }}
                                      className="ml-1 inline-flex items-center px-1 py-0.5 rounded hover:opacity-90"
                                      style={{ color: colors.primary }}
                                      title="Copy join code"
                                    >
                                      <Copy size={10} />
                                    </button>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline unit form for add/edit */}
                  {(addingUnitForCourse === course.id || (editingUnit && editingUnit.courseId === course.id)) && (
                    <div 
                      className="mt-6 p-6 rounded-xl border shadow-sm"
                      style={{
                        background: `linear-gradient(to bottom right, ${colors.cardBackground}, ${colors.backgroundSecondary})`,
                        borderColor: colors.border,
                      }}
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h4 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                            {editingUnit ? 'Edit Unit' : 'Create New Unit'}
                          </h4>
                          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                            {editingUnit 
                              ? 'Update the unit details below' 
                              : 'Fill in the details to create a new unit for this course'}
                          </p>
                        </div>
                        <button
                          onClick={cancelUnitForm}
                          className="p-1.5 -mr-1.5 hover:opacity-90 rounded-full transition-colors"
                          style={{ color: colors.textSecondary }}
                          aria-label="Close form"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                            Unit Code
                            <span style={{ color: colors.error }} className="ml-0.5">*</span>
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Bookmark className="h-5 w-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                            </div>
                            <input
                              type="text"
                              className="block w-full pl-10 sm:text-sm rounded-lg border py-2.5 px-4"
                              placeholder="e.g. CS101"
                              value={unitForm.unit_code || ''}
                              onChange={(e) => setUnitForm((p) => ({ ...p, unit_code: e.target.value }))}
                              style={{
                                backgroundColor: colors.inputBackground,
                                borderColor: colors.inputBorder,
                                color: colors.textPrimary,
                              }}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                            Academic Year
                            <span style={{ color: colors.error }} className="ml-0.5">*</span>
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                            </div>
                            <select
                              className="appearance-none block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg border"
                              value={unitForm.level ?? 1}
                              onChange={(e) => setUnitForm((p) => ({ ...p, level: Number(e.target.value) }))}
                              style={{
                                backgroundColor: colors.inputBackground,
                                borderColor: colors.inputBorder,
                                color: colors.textPrimary,
                              }}
                              required
                            >
                              <option value={1}>Year 1</option>
                              <option value={2}>Year 2</option>
                              <option value={3}>Year 3</option>
                              <option value={4}>Year 4</option>
                              <option value={5}>Year 5</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <ChevronDown className="h-4 w-4" style={{ color: colors.textTertiary }} />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                            Unit Name
                            <span style={{ color: colors.error }} className="ml-0.5">*</span>
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <BookOpen className="h-5 w-5" style={{ color: colors.textTertiary }} aria-hidden="true" />
                            </div>
                            <input
                              type="text"
                              className="block w-full pl-10 sm:text-sm rounded-lg border py-2.5 px-4"
                              placeholder="e.g. Introduction to Computer Science"
                              value={unitForm.unit_name || ''}
                              onChange={(e) => setUnitForm((p) => ({ ...p, unit_name: e.target.value }))}
                              style={{
                                backgroundColor: colors.inputBackground,
                                borderColor: colors.inputBorder,
                                color: colors.textPrimary,
                              }}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                            Semester
                            <span style={{ color: colors.error }} className="ml-0.5">*</span>
                          </span>
                          <div className="grid grid-cols-2 gap-3">
                            <label 
                              className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${unitForm.semester === 1 ? '' : ''}`}
                              style={{
                                borderColor: unitForm.semester === 1 ? colors.primary : colors.border,
                                backgroundColor: unitForm.semester === 1 ? `${colors.primary}10` : colors.cardBackground,
                              }}
                            >
                              <input
                                type="radio"
                                name="semester"
                                className="sr-only"
                                checked={unitForm.semester === 1}
                                onChange={() => setUnitForm(p => ({ ...p, semester: 1 }))}
                              />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div 
                                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 ${unitForm.semester === 1 ? '' : ''}`}
                                    style={{
                                      borderColor: unitForm.semester === 1 ? colors.primary : colors.border,
                                    }}
                                  >
                                    {unitForm.semester === 1 && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>}
                                  </div>
                                  <div>
                                    <h4 className="font-medium" style={{ color: colors.textPrimary }}>1st Semester</h4>
                                    <p className="text-sm" style={{ color: colors.textSecondary }}>September - December</p>
                                  </div>
                                </div>
                                <div className="text-2xl font-bold" style={{ color: colors.textTertiary }}>1</div>
                              </div>
                            </label>
                            <label 
                              className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${unitForm.semester === 2 ? '' : ''}`}
                              style={{
                                borderColor: unitForm.semester === 2 ? colors.primary : colors.border,
                                backgroundColor: unitForm.semester === 2 ? `${colors.primary}10` : colors.cardBackground,
                              }}
                            >
                              <input
                                type="radio"
                                name="semester"
                                className="sr-only"
                                checked={unitForm.semester === 2}
                                onChange={() => setUnitForm(p => ({ ...p, semester: 2 }))}
                              />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div 
                                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 ${unitForm.semester === 2 ? '' : ''}`}
                                    style={{
                                      borderColor: unitForm.semester === 2 ? colors.primary : colors.border,
                                    }}
                                  >
                                    {unitForm.semester === 2 && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>}
                                  </div>
                                  <div>
                                    <h4 className="font-medium" style={{ color: colors.textPrimary }}>2nd Semester</h4>
                                    <p className="text-sm" style={{ color: colors.textSecondary }}>January - April</p>
                                  </div>
                                </div>
                                <div className="text-2xl font-bold" style={{ color: colors.textTertiary }}>2</div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="mt-8 pt-5 border-t flex items-center justify-end space-x-3"
                        style={{ borderColor: colors.border }}
                      >
                        <button
                          type="button"
                          onClick={cancelUnitForm}
                          className="inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md hover:opacity-90 transition-colors"
                          style={{
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.border,
                            color: colors.textPrimary,
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={submitUnitForm}
                          disabled={unitSubmitting}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                          style={{ 
                            backgroundColor: colors.primary,
                          }}
                        >
                          {unitSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {editingUnit ? 'Updating...' : 'Creating...'}
                            </>
                          ) : (
                            <>
                              <Save className="-ml-1 mr-2 h-4 w-4" />
                              {editingUnit ? 'Update Unit' : 'Create Unit'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddCourseModal
          course={selectedCourse}
          onClose={() => setShowAddModal(false)}
          onSubmit={(d) => handleSubmit(d)}
          isLoading={submitting}
          error={error}
        />
      )}
    </div>
  );
}