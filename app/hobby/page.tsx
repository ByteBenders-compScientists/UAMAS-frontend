"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { studentApi } from "@/services/api"
import {
  ArrowRight,
  ArrowLeft,
  Book,
  Computer,
  CookingPot,
  Gamepad,
  Handshake,
  Lightbulb,
  Music,
  PaintbrushIcon as PaintBrush,
  Plane,
  Search,
  CheckCircle,
  Plus,
  X,
  Camera,
  Dumbbell,
  Guitar,
  Palette,
  Coffee,
  Mountain,
  Film,
  Headphones,
  Globe,
  Rocket,
  Star,
  Pen,
  Info,
} from "lucide-react"
import type { JSX } from "react/jsx-runtime"

// ── types ─────────────────────────────────────────────────────────────────────
interface Hobby {
  name: string
  type: "Hobby" | "Interest" | "Custom"
  isCustom?: boolean
}

interface Toast {
  id: number
  message: string
  type: "success" | "info" | "warning"
}

// ── icon map (shared) ─────────────────────────────────────────────────────────
const ICON_MAP: Record<string, (props: { className?: string }) => JSX.Element> = {
  Reading:            (p) => <Book {...p} />,
  "Music Production": (p) => <Music {...p} />,
  Technology:         (p) => <Computer {...p} />,
  Gaming:             (p) => <Gamepad {...p} />,
  Science:            (p) => <Lightbulb {...p} />,
  "Digital Art":      (p) => <PaintBrush {...p} />,
  Volunteering:       (p) => <Handshake {...p} />,
  Travel:             (p) => <Plane {...p} />,
  Cooking:            (p) => <CookingPot {...p} />,
  Photography:        (p) => <Camera {...p} />,
  Fitness:            (p) => <Dumbbell {...p} />,
  "Guitar Playing":   (p) => <Guitar {...p} />,
  Painting:           (p) => <Palette {...p} />,
  "Coffee Culture":   (p) => <Coffee {...p} />,
  Hiking:             (p) => <Mountain {...p} />,
  "Film Making":      (p) => <Film {...p} />,
  Podcasting:         (p) => <Headphones {...p} />,
  "Creative Writing": (p) => <Pen {...p} />,
  Languages:          (p) => <Globe {...p} />,
  Entrepreneurship:   (p) => <Rocket {...p} />,
}

const getIcon = (name: string, isCustom?: boolean, size = "w-5 h-5") => {
  if (isCustom) return <Star className={`${size} text-emerald-600`} />
  const Icon = ICON_MAP[name]
  return Icon ? <Icon className={`${size} text-emerald-600`} /> : <Star className={`${size} text-emerald-600`} />
}

// ── predefined data ───────────────────────────────────────────────────────────
const PREDEFINED: Hobby[] = [
  { name: "Reading",            type: "Hobby" },
  { name: "Music Production",   type: "Hobby" },
  { name: "Technology",         type: "Interest" },
  { name: "Gaming",             type: "Hobby" },
  { name: "Science",            type: "Interest" },
  { name: "Digital Art",        type: "Interest" },
  { name: "Volunteering",       type: "Interest" },
  { name: "Travel",             type: "Interest" },
  { name: "Cooking",            type: "Hobby" },
  { name: "Photography",        type: "Hobby" },
  { name: "Fitness",            type: "Hobby" },
  { name: "Guitar Playing",     type: "Hobby" },
  { name: "Painting",           type: "Hobby" },
  { name: "Coffee Culture",     type: "Interest" },
  { name: "Hiking",             type: "Hobby" },
  { name: "Film Making",        type: "Interest" },
  { name: "Podcasting",         type: "Interest" },
  { name: "Creative Writing",   type: "Hobby" },
  { name: "Languages",          type: "Interest" },
  { name: "Entrepreneurship",   type: "Interest" },
]

const FILTERS = ["All", "Hobbies", "Interests", "Custom"] as const

// ── Toast Component ───────────────────────────────────────────────────────────
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm
              ${toast.type === "success" ? "bg-emerald-50/95 border-emerald-200" : ""}
              ${toast.type === "info" ? "bg-blue-50/95 border-blue-200" : ""}
              ${toast.type === "warning" ? "bg-amber-50/95 border-amber-200" : ""}
            `}
          >
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
              ${toast.type === "success" ? "bg-emerald-100" : ""}
              ${toast.type === "info" ? "bg-blue-100" : ""}
              ${toast.type === "warning" ? "bg-amber-100" : ""}
            `}>
              {toast.type === "success" && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              {toast.type === "info" && <Info className="w-3.5 h-3.5 text-blue-600" />}
              {toast.type === "warning" && <Info className="w-3.5 h-3.5 text-amber-600" />}
            </div>
            <p className={`flex-1 text-sm font-medium
              ${toast.type === "success" ? "text-emerald-800" : ""}
              ${toast.type === "info" ? "text-blue-800" : ""}
              ${toast.type === "warning" ? "text-amber-800" : ""}
            `}>
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ── Tooltip Component ─────────────────────────────────────────────────────────
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false)

  return (
    <div 
      className="relative inline-block" 
      onMouseEnter={() => setShow(true)} 
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap shadow-lg pointer-events-none z-50"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── component ─────────────────────────────────────────────────────────────────
export default function HobbySelectionPage() {
  const router = useRouter()

  // ── auth / gate state ───────────────────────────────────────────────────────
  const [isChecking,    setIsChecking]    = useState(true)
  const [isAuthorized,  setIsAuthorized]  = useState(false)
  const [user,          setUser]          = useState<{ name?: string }>({})

  // ── UI state ────────────────────────────────────────────────────────────────
  const [isMounted,      setIsMounted]      = useState(false)
  const [selected,       setSelected]       = useState<string[]>([])
  const [search,         setSearch]         = useState("")
  const [filter,         setFilter]         = useState<typeof FILTERS[number]>("All")
  const [customHobbies,  setCustomHobbies]  = useState<Hobby[]>([])
  const [customInput,    setCustomInput]    = useState("")
  const [addingCustom,   setAddingCustom]   = useState(false)
  const [showSuccess,    setShowSuccess]    = useState(false)
  const [isNavigating,   setIsNavigating]   = useState(false)
  const [toasts,         setToasts]         = useState<Toast[]>([])
  const [toastId,        setToastId]        = useState(0)

  // ── mount + auth check ──────────────────────────────────────────────────────
  useEffect(() => {
    setIsMounted(true)

    try {
      const raw = localStorage.getItem("userData")
      if (!raw) { router.push("/auth"); return }

      const userData = JSON.parse(raw)
      const role = userData.role?.toLowerCase()
      if (role !== "student") { router.push(`/${role}/dashboard`); return }
      if (localStorage.getItem("hobbyCompleted") === "true") { router.push("/student/dashboard"); return }

      setUser(userData)
      setIsAuthorized(true)
    } catch {
      router.push("/auth")
    } finally {
      setIsChecking(false)
    }
  }, [router])

  // ── derived ─────────────────────────────────────────────────────────────────
  const allHobbies = [...PREDEFINED, ...customHobbies]

  const filtered = allHobbies.filter((h) => {
    if (!h.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === "All")       return true
    if (filter === "Hobbies")   return h.type === "Hobby"
    if (filter === "Interests") return h.type === "Interest"
    if (filter === "Custom")    return h.type === "Custom"
    return true
  })

  // ── toast helpers ───────────────────────────────────────────────────────────
  const showToast = (message: string, type: Toast["type"] = "info") => {
    const id = toastId
    setToastId((prev) => prev + 1)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 4000)
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // ── handlers ────────────────────────────────────────────────────────────────
  const toggle = (name: string) => {
    const wasSelected = selected.includes(name)
    setSelected((prev) => (wasSelected ? prev.filter((n) => n !== name) : [...prev, name]))
    
    if (!wasSelected) {
      const newCount = selected.length + 1
      if (newCount === 1) {
        showToast("Great! Pick one more to continue", "info")
      } else if (newCount === 2) {
        showToast("Perfect! You can continue now", "success")
      } else {
        showToast(`${name} added`, "success")
      }
    }
  }

  const addCustom = () => {
    const trimmed = customInput.trim()
    if (!trimmed) return
    
    if (allHobbies.some((h) => h.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast("This interest already exists", "warning")
      return
    }
    
    setCustomHobbies((prev) => [...prev, { name: trimmed, type: "Custom", isCustom: true }])
    setSelected((prev) => [...prev, trimmed])
    setCustomInput("")
    setAddingCustom(false)
    showToast(`${trimmed} added as custom interest`, "success")
  }

  const removeCustom = (name: string) => {
    setCustomHobbies((prev) => prev.filter((h) => h.name !== name))
    setSelected((prev) => prev.filter((n) => n !== name))
    showToast(`${name} removed`, "info")
  }

  const navigateToDashboard = async () => {
    if (isNavigating) return
    setIsNavigating(true)
    try {
      await studentApi.updateStudentHobbies(selected)
    } catch (e) {
      console.error("Hobbies save error:", e)
    }
    localStorage.setItem("hobbyCompleted", "true")
    router.push("/student/dashboard")
  }

  // ── loading / gate screens ──────────────────────────────────────────────────
  if (!isMounted || isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // ── success screen ──────────────────────────────────────────────────────────
  if (showSuccess) {
    const selectedWithType = selected.map(
      (name) => allHobbies.find((h) => h.name === name) ?? { name, type: "Hobby" as const }
    )

    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <div className="min-h-screen flex flex-col lg:flex-row">
          {/* left – hero (shrunk on success, same image) */}
          <div className="relative w-full lg:w-5/12 h-[35vh] lg:h-auto">
            <Image src="/assets/authbg.jpg" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-emerald-900/50 to-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-white text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-3xl lg:text-4xl font-bold"
              >
                All set
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-white/70 mt-2 text-base lg:text-lg max-w-sm"
              >
                Your profile is personalised and ready to go.
              </motion.p>
            </div>
          </div>

          {/* right – selected interests + CTA */}
          <div className="w-full lg:w-7/12 flex flex-col items-center justify-center px-6 py-16 lg:py-0 bg-slate-50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Your interests</h2>
              <p className="text-slate-500 mb-6">These will shape your learning experience.</p>

              {/* tag cloud */}
              <div className="flex flex-wrap gap-2 mb-10">
                {selectedWithType.map((h, i) => (
                  <motion.div
                    key={h.name}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="inline-flex items-center gap-2 bg-white border border-emerald-200 rounded-full px-4 py-2 shadow-sm"
                  >
                    {getIcon(h.name, h.isCustom, "w-4 h-4")}
                    <span className="text-sm font-medium text-slate-700">{h.name}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <motion.button
                  disabled={isNavigating}
                  onClick={navigateToDashboard}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-base px-6 py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  {isNavigating ? "Opening…" : "Go to Dashboard"}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  onClick={() => setShowSuccess(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm px-6 py-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go back and edit
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    )
  }

  // ── main selection screen ───────────────────────────────────────────────────
  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* ── left panel – hero ─────────────────────────────────────────────── */}
        <div className="relative w-full lg:w-5/12 h-[40vh] lg:h-auto lg:sticky lg:top-0 lg:self-start lg:h-screen">
          <Image src="/assets/authbg.jpg" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-emerald-900/45 to-black/35" />

          {/* centred copy */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-white text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl lg:text-5xl font-bold leading-tight"
            >
              What makes you<br />
              <span className="text-emerald-300">unique?</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-white/75 text-base lg:text-lg max-w-md leading-relaxed"
            >
              Pick the things you enjoy. We&apos;ll use them to personalise your learning experience.
            </motion.p>
          </div>
        </div>

        {/* ── right panel – selection ───────────────────────────────────────── */}
        <div className="w-full lg:w-7/12 min-h-screen lg:overflow-y-auto bg-slate-50">
          <div className="max-w-2xl mx-auto px-5 py-8 lg:py-12">

            {/* welcome */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <p className="text-slate-500 text-sm">Welcome back,</p>
              <h2 className="text-xl font-bold text-slate-800 mt-0.5">{user.name || "Student"}</h2>
            </motion.div>

            {/* search */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-6"
            >
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search interests…"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* filter pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="flex gap-2 mt-4 flex-wrap"
            >
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition
                    ${filter === f
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                    }`}
                >
                  {f}
                </button>
              ))}
            </motion.div>

            {/* hobby list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-5 flex flex-col gap-2"
            >
              <AnimatePresence>
                {filtered.map((hobby) => {
                  const isSelected = selected.includes(hobby.name)
                  return (
                    <motion.button
                      key={hobby.name}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => toggle(hobby.name)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left
                        ${isSelected
                          ? "bg-emerald-50 border-emerald-400"
                          : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                    >
                      {/* icon */}
                      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                          ${isSelected ? "bg-emerald-100" : "bg-slate-100"}`}
                      >
                        {getIcon(hobby.name, hobby.isCustom)}
                      </div>

                      {/* text */}
                      <div className="flex-1 min-w-0">
                        <span className={`block text-sm font-semibold truncate ${isSelected ? "text-emerald-800" : "text-slate-700"}`}>
                          {hobby.name}
                        </span>
                        <span className={`text-xs ${isSelected ? "text-emerald-500" : "text-slate-400"}`}>
                          {hobby.type}
                        </span>
                      </div>

                      {/* check or remove (custom) */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {hobby.isCustom && (
                          <Tooltip content="Remove custom interest">
                            <button
                              onClick={(e) => { e.stopPropagation(); removeCustom(hobby.name) }}
                              className="text-slate-300 hover:text-red-500 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        )}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                            ${isSelected ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}
                        >
                          {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </AnimatePresence>

              {/* empty state */}
              {filtered.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm">No results for &quot;{search}&quot;</p>
                </div>
              )}
            </motion.div>

            {/* add custom ──────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-4"
            >
              {!addingCustom ? (
                <Tooltip content="Add something unique to you">
                  <button
                    onClick={() => setAddingCustom(true)}
                    className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add your own interest
                  </button>
                </Tooltip>
              ) : (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addCustom(); if (e.key === "Escape") setAddingCustom(false) }}
                    placeholder="e.g. Skateboarding"
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition"
                  />
                  <button
                    onClick={addCustom}
                    disabled={!customInput.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setAddingCustom(false); setCustomInput("") }}
                    className="text-slate-400 hover:text-slate-600 transition px-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>

            {/* continue ─────────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-8 pt-6 border-t border-slate-200"
            >
              <Tooltip content={selected.length < 2 ? "Select at least 2 interests" : "Review your selection"}>
                <button
                  disabled={selected.length < 2}
                  onClick={() => setShowSuccess(true)}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base shadow-sm transition-all
                    ${selected.length >= 2
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Tooltip>

              <p className="text-center text-xs text-slate-400 mt-3">
                {selected.length === 0
                  ? "Select at least 2 interests to continue"
                  : selected.length === 1
                    ? "Pick one more interest"
                    : `${selected.length} selected — you're good to go`}
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  )
}