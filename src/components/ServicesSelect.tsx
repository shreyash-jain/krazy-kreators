"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Service = { value: string; label: string };

interface ServicesSelectProps {
  id: string;
  name?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const services: Service[] = [
  { value: "Design Services", label: "Design Services" },
  { value: "Tech Pack Development", label: "Tech Pack Development" },
  { value: "Sample Development", label: "Sample Development" },
  { value: "Production", label: "Production" },
  { value: "Full Package Service", label: "Full Package Service" },
  { value: "Consulting", label: "Consulting" },
];

export default function ServicesSelect({
  id,
  name,
  className,
  placeholder = "Select services you need",
  value,
  onChange,
}: ServicesSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set selected service when value changes
  useEffect(() => {
    if (value) {
      const service = services.find(s => s.value === value);
      setSelectedService(service || null);
    } else {
      setSelectedService(null);
    }
  }, [value]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsOpen(false);
    
    // Create a synthetic event for onChange
    if (onChange) {
      const syntheticEvent = {
        target: { value: service.value, name: name || "" }
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
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
    <div ref={dropdownRef} className="relative">
      <div
        className={`${className} cursor-pointer flex items-center justify-between`}
        onClick={handleToggle}
      >
        <span className="text-[#2D2A2E]">
          {selectedService ? selectedService.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-[#CBB49A] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-[110] mt-1 bg-white border border-[#ECE9E2] rounded-xl shadow-lg max-h-60 overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {services.map((service) => (
              <div
                key={service.value}
                className="px-3 py-2 hover:bg-[#F8F7F4] cursor-pointer text-sm text-[#2D2A2E]"
                onClick={() => handleServiceSelect(service)}
              >
                {service.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
