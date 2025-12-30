"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

type Option = { value: string; label: string; isDefault?: boolean };

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  onNewCategory?: () => void;
  onDeleteCategory?: (category: string) => Promise<void>;
  blogs?: Array<{ category?: string | null; id?: string }>;
  className?: string;
  placeholder?: string;
}

const DEFAULT_CATEGORIES = ["business", "design", "manufacturing"];

export default function CategorySelect({
  value,
  onChange,
  options,
  onNewCategory,
  onDeleteCategory,
  blogs = [],
  className = "",
  placeholder = "Select Category",
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || { value: "", label: placeholder };

  const isDefaultCategory = (cat: string) => {
    return DEFAULT_CATEGORIES.includes(cat.toLowerCase());
  };

  const isCategoryInUse = (category: string) => {
    return blogs.some(blog => blog.category?.toLowerCase() === category.toLowerCase());
  };

  const handleSelect = (optionValue: string) => {
    if (optionValue === "__new__" && onNewCategory) {
      onNewCategory();
    } else {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent, category: string) => {
    e.stopPropagation();
    
    if (isDefaultCategory(category)) {
      alert("Cannot delete default categories (Business, Design, Manufacturing)");
      return;
    }

    if (isCategoryInUse(category)) {
      alert("This category is linked with other blogs so we cannot delete it");
      return;
    }

    if (onDeleteCategory) {
      await onDeleteCategory(category);
      // If the deleted category was selected, clear the selection
      if (value === category) {
        onChange("");
      }
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black/5 outline-none transition-all bg-white text-left flex items-center justify-between hover:bg-[#F5EFE6] hover:border-[#CBB49A]"
      >
        <span className={value ? "text-[#2D2A2E]" : "text-gray-400"}>{selectedOption.label}</span>
        <ChevronDown className={`h-4 w-4 text-[#CBB49A] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-[#CBB49A] rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const canDelete = !isDefaultCategory(option.value) && option.value && onDeleteCategory;
              return (
                <div
                  key={option.value}
                  className={`group flex items-center justify-between ${
                    value === option.value
                      ? 'bg-[#F5EFE6] font-medium'
                      : 'hover:bg-[#F5EFE6]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="flex-1 text-left px-4 py-2 text-sm text-[#2D2A2E] transition-colors"
                  >
                    {option.label}
                  </button>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, option.value)}
                      className="px-2 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete category"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
            {onNewCategory && (
              <button
                type="button"
                onClick={() => handleSelect("__new__")}
                className="w-full text-left px-4 py-2 text-sm text-[#2D2A2E] hover:bg-[#F5EFE6] transition-colors border-t border-gray-200"
              >
                + Create new category
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

