"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, User, Mail } from "lucide-react";

type Lecturer = {
  id: string;
  firstname: string;
  surname: string;
  othernames: string;
  email: string;
};

type AddLecturerModalProps = {
  lecturer?: Lecturer | null;
  onClose: () => void;
  onSubmit: (data: Partial<Lecturer>) => void;
};

export default function AddLecturerModal({
  lecturer,
  onClose,
  onSubmit,
}: AddLecturerModalProps) {
  const [formData, setFormData] = useState({
    firstname: lecturer?.firstname || "",
    surname: lecturer?.surname || "",
    othernames: lecturer?.othernames || "",
    email: lecturer?.email || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lecturer) {
      setFormData({
        firstname: lecturer.firstname || "",
        surname: lecturer.surname || "",
        othernames: lecturer.othernames || "",
        email: lecturer.email || "",
      });
    } else {
      setFormData({
        firstname: "",
        surname: "",
        othernames: "",
        email: "",
      });
    }
  }, [lecturer]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstname?.trim()) {
      newErrors.firstname = "First name is required";
    }
    if (!formData.surname?.trim()) {
      newErrors.surname = "Surname is required";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors((prev) => ({
        ...prev,
        submit:
          error instanceof Error ? error.message : "Failed to save lecturer",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-xl shadow-xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {lecturer ? "Edit Lecturer" : "Add New Lecturer"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Enter first name"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.firstname ? "border-red-300" : "border-gray-200"
                }`}
              />
            </div>
            {errors.firstname && (
              <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Surname *
            </label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Enter surname"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.surname ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.surname && (
              <p className="mt-1 text-sm text-red-600">{errors.surname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Other Names
            </label>
            <input
              type="text"
              name="othernames"
              value={formData.othernames}
              onChange={handleChange}
              placeholder="Enter other names"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="lecturer@dekut.edu"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.email ? "border-red-300" : "border-gray-200"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Saving..."
                : lecturer
                ? "Update Lecturer"
                : "Add Lecturer"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
