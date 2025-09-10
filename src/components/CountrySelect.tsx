"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

type Country = { code: string; name: string };

interface CountrySelectProps {
  id: string;
  name?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// Minimal fallback list in case network fails
const fallbackCountries: Country[] = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
];

export default function CountrySelect({
  id,
  name,
  className,
  placeholder = "Select your country",
  value,
  onChange,
}: CountrySelectProps) {
  const [countries, setCountries] = useState<Country[]>(fallbackCountries);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2",
          { cache: "force-cache" }
        );
        if (!res.ok) throw new Error("Failed to load countries");
        const data: Array<{ name: { common: string }; cca2: string }> =
          await res.json();
        const parsed = data
          .map((c) => ({ 
            code: c.cca2 || "", 
            name: c.name?.common || ""
          }))
          .filter((c) => c.code && c.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (isMounted && parsed.length) setCountries(parsed);
      } catch (_e) {
        // keep fallback
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Set selected country when value changes
  useEffect(() => {
    if (value) {
      const country = countries.find(c => c.code === value);
      setSelectedCountry(country || null);
    } else {
      setSelectedCountry(null);
    }
  }, [value, countries]);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries;
    return countries.filter(country => 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm("");
    
    // Create a synthetic event for onChange
    if (onChange) {
      const syntheticEvent = {
        target: { value: country.code, name: name || "" }
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
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
        <div className="flex items-center">
          {selectedCountry && (
            <ReactCountryFlag 
              countryCode={selectedCountry.code} 
              svg 
              style={{
                width: '1.2em',
                height: '1.2em',
                marginRight: '0.5rem'
              }}
            />
          )}
          <span className="text-[#2D2A2E]">
            {selectedCountry ? selectedCountry.name : placeholder}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-[#CBB49A] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-[110] mt-1 bg-white border border-[#ECE9E2] rounded-xl shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-[#ECE9E2]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A9A29D]" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-[#ECE9E2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className="px-3 py-2 hover:bg-[#F8F7F4] cursor-pointer text-sm text-[#2D2A2E] flex items-center"
                  onClick={() => handleCountrySelect(country)}
                >
                  <ReactCountryFlag 
                    countryCode={country.code} 
                    svg 
                    style={{
                      width: '1.2em',
                      height: '1.2em',
                      marginRight: '0.5rem'
                    }}
                  />
                  {country.name}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-[#A9A29D]">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


