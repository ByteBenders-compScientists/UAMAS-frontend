"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLayout } from "@/components/LayoutController";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Library,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  // ExternalLink,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  // Info,
  BarChart3,
  TrendingUp,
  ListChecks,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Disclaimer from "@/components/Disclaimer";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

type ActiveAction = "cats" | "assignments" | "results" | "library";

type StudentUnit = {
  id: string;
  unit_code?: string;
  unit_name?: string;
  code?: string;
  name?: string;
  course_name?: string;
};

type StudentAssessment = Record<string, string | number | boolean | undefined> & {
  id: string;
  type?: string;
  title?: string;
  topic?: string;
  status?: string;
  number_of_questions?: number;
  total_marks?: number;
  duration?: number;
  deadline?: string;
  due_date?: string;
  closing_date?: string;
  close_at?: string;
  schedule_date?: string;
  unit_id?: string;
  unit_name?: string;
};

type StudentResource = Record<string, string | number | boolean | undefined> & {
  id: string;
  title?: string;
  unit_name?: string;
  course_name?: string;
  file_type?: string;
  file_size?: number;
  created_at: string;
};

type StudentSubmission = Record<string, string | number | boolean | undefined> & {
  submission_id: string;
  assessment_id: string;
  graded?: boolean;
  created_at: string;
  results?: { score?: number | string }[];
};

function getUnitLabel(unit: StudentUnit) {
  return unit.unit_name || unit.name || "Unit";
}

function getUnitCode(unit: StudentUnit) {
  return unit.unit_code || unit.code || "";
}

function isAssessmentLockedBySchedule(assessment: StudentAssessment) {
  if (!assessment.schedule_date) return false;
  
  const scheduleDate = new Date(assessment.schedule_date);
  const now = new Date();
  return scheduleDate > now;
}

type UnitItem = Record<string, string | number | boolean | undefined | { id?: string; unit_name?: string; name?: string; unit_code?: string; code?: string }> & {
  unit_id?: string;
  unitId?: string;
  unit_name?: string;
  unitName?: string;
  unit_code?: string;
  unitCode?: string;
  unit?: { id?: string; unit_name?: string; name?: string; unit_code?: string; code?: string };
};

function matchesSelectedUnit(item: UnitItem, selectedUnit: StudentUnit | null) {
  if (!selectedUnit) return true;

  const selectedId = selectedUnit.id;
  const selectedName = (selectedUnit.unit_name || selectedUnit.name || "").trim().toLowerCase();
  const selectedCode = (selectedUnit.unit_code || selectedUnit.code || "").trim().toLowerCase();

  const possibleUnitId = String(item.unit_id ?? item.unitId ?? item.unit?.id ?? "").trim();
  if (possibleUnitId && possibleUnitId === selectedId) return true;

  const possibleUnitName = String(item.unit_name ?? item.unitName ?? item.unit?.unit_name ?? item.unit?.name ?? "")
    .trim()
    .toLowerCase();
  if (possibleUnitName && selectedName && possibleUnitName === selectedName) return true;

  const possibleUnitCode = String(item.unit_code ?? item.unitCode ?? item.unit?.unit_code ?? item.unit?.code ?? "")
    .trim()
    .toLowerCase();
  if (possibleUnitCode && selectedCode && possibleUnitCode === selectedCode) return true;

  return false;
}

function hasUnitIdentifiers(item: UnitItem) {
  const possibleUnitId = String(item.unit_id ?? item.unitId ?? item.unit?.id ?? "").trim();
  if (possibleUnitId) return true;

  const possibleUnitName = String(item.unit_name ?? item.unitName ?? item.unit?.unit_name ?? item.unit?.name ?? "").trim();
  if (possibleUnitName) return true;

  const possibleUnitCode = String(item.unit_code ?? item.unitCode ?? item.unit?.unit_code ?? item.unit?.code ?? "").trim();
  if (possibleUnitCode) return true;

  return false;
}

function ActionTabs({
  activeAction,
  onChange,
}: {
  activeAction: ActiveAction;
  onChange: (action: ActiveAction) => void;
}) {
  const tabs: { key: ActiveAction; label: string; icon: ReactNode }[] = [
    { key: "cats", label: "CATs", icon: <BookOpen className="h-4 w-4" /> },
    { key: "assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
    { key: "results", label: "Results", icon: <FileText className="h-4 w-4" /> },
    { key: "library", label: "Library", icon: <Library className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((t) => {
        const isActive = activeAction === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-colors ${
              isActive
                ? "bg-emerald-600 text-white ring-emerald-600"
                : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function UnitSidePanel({
  units,
  selectedUnitId,
  onSelectUnit,
  isMinimized,
  onToggleMinimize,
}: {
  units: StudentUnit[];
  selectedUnitId: string;
  onSelectUnit: (unitId: string) => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setExpanded(!isMinimized);
  }, [isMinimized]);

  const selectedUnit = units.find((u) => String(u.id) === String(selectedUnitId));

  return (
    <motion.div
      initial={{ width: 320 }}
      animate={{ width: isMinimized ? 60 : 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-r border-gray-100 shadow-lg flex flex-col relative z-20 h-full hidden md:flex"
    >
      <div className="p-4 lg:p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
        <div className="flex items-center justify-between">
          {!isMinimized && (
            <div>
              <h3 className="font-bold text-gray-900 flex items-center text-base">
                <Filter className="w-5 h-5 mr-3 text-emerald-600" />
                Unit Selection
              </h3>
              <p className="text-sm text-gray-500 mt-1">Choose your unit context</p>
            </div>
          )}
          <button
            onClick={onToggleMinimize}
            className="p-2 hover:bg-emerald-100 rounded-xl transition-colors group"
          >
            {isMinimized ? (
              <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto p-4 lg:p-6"
          >
            <label className="block text-xs font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-emerald-600" />
              My Units
            </label>

            <div className="space-y-3">
              {units.map((unit) => {
                const isSelected = String(selectedUnitId) === String(unit.id);
                const label = getUnitLabel(unit);
                const code = getUnitCode(unit);

                return (
                  <button
                    key={unit.id}
                    onClick={() => onSelectUnit(unit.id)}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between group hover:shadow-md ${
                      isSelected
                        ? "border-emerald-300 bg-emerald-50 shadow-md"
                        : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50"
                    }`}
                  >
                    <div className="text-left min-w-0">
                      <div className="font-semibold text-sm text-gray-900 truncate">{label}</div>
                      <div className="text-xs text-gray-500 font-medium truncate">{code}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-300" />
                  </button>
                );
              })}
            </div>

            {selectedUnit && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 relative p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 shadow-sm overflow-hidden"
              >
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <h4 className="font-bold text-emerald-900 mb-3 flex items-center text-sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Current Unit
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-emerald-900 font-semibold">{getUnitLabel(selectedUnit)}</div>
                    {!!getUnitCode(selectedUnit) && (
                      <div className="text-emerald-800">{getUnitCode(selectedUnit)}</div>
                    )}
                    {!!selectedUnit.course_name && (
                      <div className="text-emerald-800">{selectedUnit.course_name}</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isMinimized && (
        <div className="p-4 space-y-4">
          <button
            onClick={onToggleMinimize}
            className="w-full p-4 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm"
          >
            <Filter className="w-5 h-5 mx-auto" />
          </button>

          {selectedUnit && (
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shadow-sm mx-auto">
              <BookOpen className="w-5 h-5 text-emerald-700" />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function StudentUnitWorkspace() {
  const { sidebarCollapsed, isMobileView, isTabletView } = useLayout();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeAction, setActiveAction] = useState<ActiveAction>("cats");
  const [isAccessMinimized, setIsAccessMinimized] = useState(false);

  const [units, setUnits] = useState<StudentUnit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");

  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [assessmentsLoading, setAssessmentsLoading] = useState(true);

  const [pendingAssessment, setPendingAssessment] = useState<StudentAssessment | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const [resources, setResources] = useState<StudentResource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);

  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);

  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    const action = (searchParams.get("action") || "").toLowerCase();
    if (action === "cats" || action === "assignments" || action === "results" || action === "library") {
      setActiveAction(action);
    }
  }, [searchParams]);

  useEffect(() => {
    const assessmentId = searchParams.get("assessmentId");
    if (!assessmentId) return;
    const action = (searchParams.get("action") || "").toLowerCase();
    if (action === "results" || action === "library") return;
    const found = assessments.find((a) => String(a.id) === String(assessmentId)) || null;
    if (found) {
      setPendingAssessment(found);
      setShowDisclaimer(true);
    }
  }, [searchParams, assessments]);

  useEffect(() => {
    const action = (searchParams.get("action") || "").toLowerCase();
    if (action !== "results") return;

    const assessmentId = searchParams.get("assessmentId");
    if (!assessmentId) return;

    const selectedUnitLocal =
      units.find((u) => String(u.id) === String(selectedUnitId)) || null;
    const submissionsHaveUnitIdentifiersLocal = submissions.some((s) => hasUnitIdentifiers(s));
    const visibleSubmissionsLocal = submissionsHaveUnitIdentifiersLocal
      ? submissions.filter((s) => matchesSelectedUnit(s, selectedUnitLocal))
      : submissions;

    const match = visibleSubmissionsLocal
      .slice()
      .sort((a, b) => {
        const at = Date.parse(a.created_at || "") || 0;
        const bt = Date.parse(b.created_at || "") || 0;
        return bt - at;
      })
      .find((s) => String(s.assessment_id) === String(assessmentId));

    if (match) {
      setExpandedSubmissionId(String(match.submission_id || match.id || ""));
    }
  }, [searchParams, submissions, units, selectedUnitId]);

  useEffect(() => {
    if (isMobileView) setIsAccessMinimized(true);
  }, [isMobileView]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/auth/me`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const nextUnits = Array.isArray(data?.units) ? data.units : [];
        setUnits(nextUnits);
        if (!selectedUnitId && nextUnits.length > 0) {
          setSelectedUnitId(String(nextUnits[0].id));
        }
      })
      .catch(() => {
        setUnits([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAssessmentsLoading(true);
    fetch(`${apiBaseUrl}/bd/student/assessments`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setAssessments(Array.isArray(data) ? data : []);
      })
      .catch(() => setAssessments([]))
      .finally(() => setAssessmentsLoading(false));
  }, []);

  useEffect(() => {
    setResourcesLoading(true);
    fetch(`${apiBaseUrl}/bd/student/notes`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setResources(Array.isArray(data) ? data : []))
      .catch(() => setResources([]))
      .finally(() => setResourcesLoading(false));
  }, []);

  useEffect(() => {
    setSubmissionsLoading(true);
    fetch(`${apiBaseUrl}/bd/student/submissions`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSubmissions(Array.isArray(data) ? data : []))
      .catch(() => setSubmissions([]))
      .finally(() => setSubmissionsLoading(false));
  }, []);

  const selectedUnit = useMemo(
    () => units.find((u) => String(u.id) === String(selectedUnitId)) || null,
    [units, selectedUnitId]
  );

  const cats = useMemo(
    () => assessments.filter((a) => (a.type || "").toLowerCase() === "cat"),
    [assessments]
  );

  const assignments = useMemo(
    () => assessments.filter((a) => (a.type || "").toLowerCase() === "assignment"),
    [assessments]
  );

  const catsHaveUnitIdentifiers = useMemo(() => cats.some((c) => hasUnitIdentifiers(c)), [cats]);
  const assignmentsHaveUnitIdentifiers = useMemo(
    () => assignments.some((a) => hasUnitIdentifiers(a)),
    [assignments]
  );

  const filteredCats = useMemo(
    () => cats.filter((a) => matchesSelectedUnit(a, selectedUnit)),
    [cats, selectedUnit]
  );

  const filteredAssignments = useMemo(
    () => assignments.filter((a) => matchesSelectedUnit(a, selectedUnit)),
    [assignments, selectedUnit]
  );

  const filteredResources = useMemo(
    () => resources.filter((r) => matchesSelectedUnit(r, selectedUnit)),
    [resources, selectedUnit]
  );

  const submissionsHaveUnitIdentifiers = useMemo(
    () => submissions.some((s) => hasUnitIdentifiers(s)),
    [submissions]
  );

  const filteredSubmissions = useMemo(
    () => submissions.filter((s) => matchesSelectedUnit(s, selectedUnit)),
    [submissions, selectedUnit]
  );

  const resourcesHaveUnitIdentifiers = useMemo(
    () => resources.some((r) => hasUnitIdentifiers(r)),
    [resources]
  );

  const onChangeAction = (action: ActiveAction) => {
    setActiveAction(action);
    router.replace(`/student/unitworkspace?action=${action}`);
  };

  const startAssessment = (assessment: StudentAssessment) => {
    const status = String(assessment.status || "").toLowerCase();
    if (status === "completed") {
      router.push(`/student/unitworkspace?action=results&assessmentId=${encodeURIComponent(assessment.id)}`);
      return;
    }
    
    if (isAssessmentLockedBySchedule(assessment)) {
      return;
    }
    
    setPendingAssessment(assessment);
    setShowDisclaimer(true);
  };

  const visibleSubmissions = submissionsHaveUnitIdentifiers ? filteredSubmissions : submissions;

  const totalSubmissions = visibleSubmissions.length;
  const gradedSubmissions = visibleSubmissions.filter((s) => s.graded).length;
  const pendingSubmissions = visibleSubmissions.filter((s) => !s.graded).length;
  const totalQuestions = visibleSubmissions.reduce(
    (acc, s) => acc + (Array.isArray(s.results) ? s.results.length : 0),
    0
  );
  const allScores = visibleSubmissions.flatMap((s) =>
    Array.isArray(s.results) ? s.results.map((r: { score?: number | string | undefined }) => Number(r?.score ?? 0)) : []
  );
  const averageScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
  const highestScore = allScores.length > 0 ? Math.max(...allScores) : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <motion.div
        initial={{ marginLeft: !isMobileView && !isTabletView ? (sidebarCollapsed ? 80 : 240) : 0 }}
        animate={{ marginLeft: !isMobileView && !isTabletView ? (sidebarCollapsed ? 80 : 240) : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-hidden"
      >
        <Header title="My Units Workspace" showWeekSelector={false} />

        <main className="h-[calc(100vh-64px)] flex">
          {showDisclaimer && pendingAssessment && (
            <Disclaimer
              title={pendingAssessment.title || pendingAssessment.topic || "Assessment"}
              numberOfQuestions={pendingAssessment.number_of_questions || 0}
              duration={pendingAssessment.duration}
              onAgree={() => {
                const id = pendingAssessment.id;
                setShowDisclaimer(false);
                router.push(`/student/attempt?assessmentId=${encodeURIComponent(id)}`);
              }}
              onCancel={() => {
                setShowDisclaimer(false);
                setPendingAssessment(null);
                router.push("/student/dashboard");
              }}
            />
          )}
          <UnitSidePanel
            units={units}
            selectedUnitId={selectedUnitId}
            onSelectUnit={(unitId) => setSelectedUnitId(unitId)}
            isMinimized={isAccessMinimized}
            onToggleMinimize={() => setIsAccessMinimized((v) => !v)}
          />

          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-6 lg:p-8">
              {isMobileView || isTabletView ? (
                <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Selected unit</div>
                      <div className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedUnit ? getUnitLabel(selectedUnit) : "Select a unit"}
                      </div>
                    </div>
                    <select
                      value={selectedUnitId}
                      onChange={(e) => setSelectedUnitId(e.target.value)}
                      className="w-full sm:w-80 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {getUnitLabel(u)}{getUnitCode(u) ? ` (${getUnitCode(u)})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900">Workspace</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedUnit ? (
                      <span>
                        Showing content for <span className="font-semibold">{getUnitLabel(selectedUnit)}</span>
                      </span>
                    ) : (
                      "Select a unit to continue"
                    )}
                  </p>
                </div>
                <ActionTabs activeAction={activeAction} onChange={onChangeAction} />
              </div>

              {!selectedUnit ? (
                <div className="mt-8 max-w-4xl">
                  <EmptyState
                    title="Select a Unit"
                    description="Choose a unit from the panel to view your CATs, assignments, results, and library resources."
                    icon={<BookOpen size={48} />}
                  />
                </div>
              ) : (
                <div className="mt-6">
                  {activeAction === "cats" && (
                    <div className="space-y-4">
                      {assessmentsLoading ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
                          Loading CATs...
                        </div>
                      ) : filteredCats.length === 0 ? (
                        <EmptyState
                          title="No CATs for this unit"
                          description="When your lecturer publishes CATs for this unit, they will appear here."
                          icon={<BookOpen size={48} />}
                        />
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {filteredCats.map((cat) => {
                            const deadlineValue = cat?.deadline ?? cat?.due_date ?? cat?.closing_date ?? cat?.close_at ?? null;
                            const parsedDeadline = deadlineValue ? Date.parse(deadlineValue) : NaN;
                            const isPastDeadline = !!deadlineValue && !Number.isNaN(parsedDeadline) && Date.now() > parsedDeadline;
                            const isLockedBySchedule = isAssessmentLockedBySchedule(cat);
                            const status = cat.status || "";

                            return (
                              <div
                                key={cat.id}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                  <div className="min-w-0">
                                    <h3 className="text-base font-semibold text-gray-900 truncate">{cat.title || cat.topic || "CAT"}</h3>
                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                      <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 font-semibold ring-1 ring-inset ring-gray-200">
                                        Questions: {cat.number_of_questions ?? "-"}
                                      </span>
                                      <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 font-semibold ring-1 ring-inset ring-gray-200">
                                        Total Marks: {cat.total_marks ?? "-"}
                                      </span>
                                      {!!cat.duration && (
                                        <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 font-semibold ring-1 ring-inset ring-gray-200">
                                          <Clock className="mr-1 h-3.5 w-3.5" />
                                          {cat.duration} min
                                        </span>
                                      )}
                                      {!!cat.schedule_date && (
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                                          <Clock className="mr-1 h-3.5 w-3.5" />
                                          Opens: {new Date(cat.schedule_date).toLocaleString()}
                                        </span>
                                      )}
                                      {!!deadlineValue && !Number.isNaN(parsedDeadline) && (
                                        <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 font-semibold ring-1 ring-inset ring-gray-200">
                                          Deadline: {new Date(parsedDeadline).toLocaleString()}
                                        </span>
                                      )}
                                      {isLockedBySchedule && (
                                        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                                          <Clock className="mr-1 h-3.5 w-3.5" />
                                          Scheduled
                                        </span>
                                      )}
                                      {isPastDeadline && (
                                        <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                                          <AlertCircle className="mr-1 h-3.5 w-3.5" />
                                          Closed
                                        </span>
                                      )}
                                      {!!status && (
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                          {status}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => startAssessment(cat)}
                                      disabled={isLockedBySchedule}
                                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${
                                        isLockedBySchedule
                                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                                      }`}
                                    >
                                      <Play className="h-4 w-4" />
                                      {isLockedBySchedule ? "Locked" : "Open"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {cats.length > 0 && filteredCats.length === 0 && !catsHaveUnitIdentifiers && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                          Your CATs data did not include unit identifiers, so unit filtering may be limited.
                        </div>
                      )}
                    </div>
                  )}

                  {activeAction === "assignments" && (
                    <div className="space-y-4">
                      {assessmentsLoading ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
                          Loading assignments...
                        </div>
                      ) : filteredAssignments.length === 0 ? (
                        <EmptyState
                          title="No assignments for this unit"
                          description="When your lecturer publishes assignments for this unit, they will appear here."
                          icon={<ClipboardList size={48} />}
                        />
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {filteredAssignments.map((a) => {
                            const deadlineValue = a?.deadline ?? a?.due_date ?? a?.closing_date ?? a?.close_at ?? null;
                            const parsedDeadline = deadlineValue ? Date.parse(deadlineValue) : NaN;
                            const isPastDeadline = !!deadlineValue && !Number.isNaN(parsedDeadline) && Date.now() > parsedDeadline;
                            const isLockedBySchedule = isAssessmentLockedBySchedule(a);
                            const status = a.status || "";

                            return (
                              <div
                                key={a.id}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                  <div className="min-w-0">
                                    <h3 className="text-base font-semibold text-gray-900 truncate">{a.title || a.topic || "Assignment"}</h3>
                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                      <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 font-semibold ring-1 ring-inset ring-gray-200">
                                        Questions: {a.number_of_questions ?? "-"}
                                      </span>
                                      <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 font-semibold ring-1 ring-inset ring-gray-200">
                                        Total Marks: {a.total_marks ?? "-"}
                                      </span>
                                      {!!a.duration && (
                                        <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 font-semibold ring-1 ring-inset ring-gray-200">
                                          <Clock className="mr-1 h-3.5 w-3.5" />
                                          {a.duration} min
                                        </span>
                                      )}
                                      {!!a.schedule_date && (
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                                          <Clock className="mr-1 h-3.5 w-3.5" />
                                          Opens: {new Date(a.schedule_date).toLocaleString()}
                                        </span>
                                      )}
                                      {!!deadlineValue && !Number.isNaN(parsedDeadline) && (
                                        <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 font-semibold ring-1 ring-inset ring-gray-200">
                                          Deadline: {new Date(parsedDeadline).toLocaleString()}
                                        </span>
                                      )}
                                      {isLockedBySchedule && (
                                        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                                          <Clock className="mr-1 h-3.5 w-3.5" />
                                          Scheduled
                                        </span>
                                      )}
                                      {isPastDeadline && (
                                        <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                                          <AlertCircle className="mr-1 h-3.5 w-3.5" />
                                          Closed
                                        </span>
                                      )}
                                      {!!status && (
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                          {status}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => startAssessment(a)}
                                      disabled={isLockedBySchedule}
                                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${
                                        isLockedBySchedule
                                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                                      }`}
                                    >
                                      <Play className="h-4 w-4" />
                                      {isLockedBySchedule ? "Locked" : "Open"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {assignments.length > 0 && filteredAssignments.length === 0 && !assignmentsHaveUnitIdentifiers && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                          Your assignments data did not include unit identifiers, so unit filtering may be limited.
                        </div>
                      )}
                    </div>
                  )}

                  {activeAction === "results" && (
                    <div className="space-y-4">
                      {submissionsLoading ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
                          Loading results...
                        </div>
                      ) : visibleSubmissions.length === 0 ? (
                        <EmptyState
                          title="No results yet"
                          description="Your submitted assessments will appear here once available."
                          icon={<FileText size={48} />}
                        />
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center space-x-4">
                              <div className="p-2 rounded-full bg-blue-100 text-blue-600"><FileText className="w-6 h-6" /></div>
                              <div>
                                <div className="text-lg font-bold">{totalSubmissions}</div>
                                <div className="text-sm text-gray-500">Submissions</div>
                              </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center space-x-4">
                              <div className="p-2 rounded-full bg-green-100 text-green-600"><CheckCircle className="w-6 h-6" /></div>
                              <div>
                                <div className="text-lg font-bold">{gradedSubmissions}</div>
                                <div className="text-sm text-gray-500">Graded</div>
                              </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center space-x-4">
                              <div className="p-2 rounded-full bg-amber-100 text-amber-600"><Clock className="w-6 h-6" /></div>
                              <div>
                                <div className="text-lg font-bold">{pendingSubmissions}</div>
                                <div className="text-sm text-gray-500">Pending</div>
                              </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center space-x-4">
                              <div className="p-2 rounded-full bg-purple-100 text-purple-600"><ListChecks className="w-6 h-6" /></div>
                              <div>
                                <div className="text-lg font-bold">{totalQuestions}</div>
                                <div className="text-sm text-gray-500">Questions</div>
                              </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center space-x-4">
                              <div className="p-2 rounded-full bg-blue-100 text-blue-600"><BarChart3 className="w-6 h-6" /></div>
                              <div>
                                <div className="text-lg font-bold">{averageScore.toFixed(2)}</div>
                                <div className="text-sm text-gray-500">Avg score</div>
                              </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center space-x-4">
                              <div className="p-2 rounded-full bg-emerald-100 text-emerald-600"><TrendingUp className="w-6 h-6" /></div>
                              <div>
                                <div className="text-lg font-bold">{highestScore}</div>
                                <div className="text-sm text-gray-500">Highest</div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="text-sm font-semibold text-gray-900">
                              {submissionsHaveUnitIdentifiers
                                ? "Results are filtered by the selected unit."
                                : "Results are currently shown across all units."}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              {submissionsHaveUnitIdentifiers
                                ? "Select a different unit to view its submissions and feedback."
                                : "If your submissions API includes unit identifiers, we can filter these by the selected unit."}
                            </div>
                          </div>

                          <div className="mt-6 space-y-4">
                            {visibleSubmissions
                              .slice()
                              .sort((a, b) => {
                                const at = Date.parse(a.created_at || "") || 0;
                                const bt = Date.parse(b.created_at || "") || 0;
                                return bt - at;
                              })
                              .map((s) => {
                                const submissionId = String(s.submission_id || s.id || "");
                                const results = Array.isArray(s.results) ? s.results : [];
                                const totalMarks = results.reduce((acc: number, r: { score?: number | string | undefined; marks?: number | string | undefined }) => acc + (Number(r?.marks ?? 0) || 0), 0);
                                const totalScore = results.reduce((acc: number, r: { score?: number | string | undefined }) => acc + (Number(r?.score ?? 0) || 0), 0);
                                const expanded = expandedSubmissionId === submissionId;
                                const title =
                                  String(s.topic || "").trim() ||
                                  String(s.title || "").trim() ||
                                  "Submission";

                                const questionsCount = Number(s.number_of_questions ?? results.length ?? 0);
                                const deadlineValue = s.deadline ?? s.due_date ?? s.closing_date ?? s.close_at ?? null;
                                const parsedDeadline = deadlineValue ? Date.parse(String(deadlineValue)) : NaN;
                                const hasDeadline = !!deadlineValue && !Number.isNaN(parsedDeadline);
                                const isLocked = hasDeadline && Date.now() < parsedDeadline;

                                const formatValue = (value: string | number | boolean | undefined) => {
                                  if (value === null || value === undefined) return "";
                                  if (Array.isArray(value)) return value.map((v) => String(v)).join(", ");
                                  if (typeof value === "object") return JSON.stringify(value);
                                  return String(value);
                                };

                                return (
                                  <div
                                    key={submissionId}
                                    className="rounded-2xl border border-gray-200 bg-white shadow-sm"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => setExpandedSubmissionId(expanded ? null : submissionId)}
                                      className="w-full px-6 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                                    >
                                      <div className="min-w-0 text-left">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <div className="text-base font-semibold text-gray-900 truncate">{title}</div>
                                          <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                                              s.graded
                                                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                                : "bg-amber-50 text-amber-800 ring-amber-200"
                                            }`}
                                          >
                                            {s.graded ? (isLocked ? "Graded (Locked)" : "Graded") : "Pending"}
                                          </span>
                                          {hasDeadline && (
                                            <span
                                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                                                isLocked
                                                  ? "bg-red-50 text-red-700 ring-red-200"
                                                  : "bg-gray-50 text-gray-700 ring-gray-200"
                                              }`}
                                            >
                                              Deadline: {new Date(parsedDeadline).toLocaleString()}
                                            </span>
                                          )}
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                          <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 font-semibold ring-1 ring-inset ring-gray-200">
                                            Questions: {questionsCount}
                                          </span>
                                          <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 font-semibold ring-1 ring-inset ring-gray-200">
                                            Score: {totalScore} / {totalMarks}
                                          </span>
                                          {!!s.created_at && (
                                            <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 font-semibold ring-1 ring-inset ring-gray-200">
                                              {new Date(s.created_at).toLocaleString()}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-end gap-2">
                                        <ChevronDown
                                          className={`h-5 w-5 text-gray-400 transition-transform ${
                                            expanded ? "rotate-180" : "rotate-0"
                                          }`}
                                        />
                                      </div>
                                    </button>

                                    {expanded && (
                                      <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                                        {isLocked ? (
                                          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                            <div className="flex items-start gap-3">
                                              <AlertCircle className="h-5 w-5 text-amber-700 mt-0.5" />
                                              <div>
                                                <div className="text-sm font-semibold text-amber-900">
                                                  Detailed feedback will be available after the deadline.
                                                </div>
                                                <div className="mt-1 text-sm text-amber-900">
                                                  This submission has a deadline. Question-level details (correct answers, rubric, and feedback) will become visible on:
                                                  <span className="font-semibold"> {new Date(parsedDeadline).toLocaleString()}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ) : results.length === 0 ? (
                                          <div className="text-sm text-gray-600">No question results provided.</div>
                                        ) : (
                                          <div className="space-y-4">
                                            {results.map((r: any, idx: number) => {
                                              const questionText = String(r.question_text || "Question");
                                              const score = Number(r.score) || 0;
                                              const marks = Number(r.marks) || 0;
                                              const feedback = String(r.feedback || "");
                                              const correct = r.correct_answer;
                                              const rubric = String(r.rubric || "");

                                              return (
                                                <div
                                                  key={String(r.id || r.question_id || idx)}
                                                  className="rounded-2xl border border-gray-200 bg-white p-5"
                                                >
                                                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                    <div className="min-w-0">
                                                      <div className="text-sm font-semibold text-gray-900">
                                                        Q{idx + 1}. {questionText}
                                                      </div>
                                                      {!!r.blooms_level && (
                                                        <div className="mt-1 text-xs text-gray-500">
                                                          Bloom&apos;s: {String(r.blooms_level)}
                                                        </div>
                                                      )}
                                                    </div>
                                                    <div className="shrink-0">
                                                      <span
                                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                                                          score >= marks
                                                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                                            : score > 0
                                                              ? "bg-amber-50 text-amber-800 ring-amber-200"
                                                              : "bg-red-50 text-red-700 ring-red-200"
                                                        }`}
                                                      >
                                                        {score} / {marks}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  {!!correct && (
                                                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                                        Correct answer
                                                      </div>
                                                      <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
                                                        {formatValue(correct)}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {!!feedback && (
                                                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                                                        Feedback
                                                      </div>
                                                      <div className="mt-2 text-sm text-emerald-900 whitespace-pre-wrap">
                                                        {feedback}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {!!rubric && (
                                                    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                                                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                                        Rubric
                                                      </div>
                                                      <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
                                                        {rubric}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {!!r.image_url && (
                                                    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                                                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
                                                        Submitted Image
                                                      </div>
                                                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                                                        <img 
                                                          src={r.image_url} 
                                                          alt="Submitted work" 
                                                          className="w-full h-auto max-h-64 object-contain bg-gray-50"
                                                          onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                          }}
                                                        />
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {activeAction === "library" && (
                    <div className="space-y-4">
                      {resourcesLoading ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
                          Loading library resources...
                        </div>
                      ) : filteredResources.length === 0 ? (
                        <EmptyState
                          title="No resources for this unit"
                          description="Lecture notes and materials uploaded for this unit will appear here."
                          icon={<Library size={48} />}
                        />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredResources.map((r) => (
                            <div
                              key={r.id}
                              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3 className="text-base font-semibold text-gray-900 truncate">{r.title || "Resource"}</h3>
                                  <div className="mt-2 text-xs text-gray-500">
                                    {r.unit_name || ""}
                                  </div>
                                  <div className="mt-1 text-xs text-gray-400">
                                    {r.course_name || ""}
                                  </div>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200">
                                  {(r.file_type || "FILE").toUpperCase()}
                                </span>
                              </div>

                              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                <div className="inline-flex items-center">
                                  <Clock className="mr-1 h-3.5 w-3.5" />
                                  {r.created_at ? new Date(r.created_at).toLocaleDateString() : ""}
                                </div>
                                {!!r.file_size && <div>{(r.file_size / 1024).toFixed(1)} KB</div>}
                              </div>

                              <div className="mt-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <a
                                    href={`${apiBaseUrl}/bd/notes/${r.id}/download`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
                                  >
                                    <Download className="h-4 w-4" />
                                    Download
                                  </a>
                                  <a
                                    href={`${apiBaseUrl}/bd/notes/${r.id}/download`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                                  >
                                    <Eye className="h-4 w-4" />
                                    View
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {resources.length > 0 && filteredResources.length === 0 && !resourcesHaveUnitIdentifiers && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                          Your resources data did not include unit identifiers, so unit filtering may be limited.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}
