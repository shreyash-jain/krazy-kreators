"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

type CountryCode = { code: string; name: string; dialCode: string; flag: string };

interface PhoneNumberInputProps {
  id: string;
  name?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}


// Common country codes with dial codes
const countryCodes: CountryCode[] = [
  { code: "US", name: "United States", dialCode: "+1", flag: "US" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "GB" },
  { code: "IN", name: "India", dialCode: "+91", flag: "IN" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "CA" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "AU" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "DE" },
  { code: "FR", name: "France", dialCode: "+33", flag: "FR" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "IT" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "ES" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "NL" },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "BE" },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "CH" },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "AT" },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "SE" },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "NO" },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "DK" },
  { code: "FI", name: "Finland", dialCode: "+358", flag: "FI" },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "PL" },
  { code: "CZ", name: "Czech Republic", dialCode: "+420", flag: "CZ" },
  { code: "HU", name: "Hungary", dialCode: "+36", flag: "HU" },
  { code: "RO", name: "Romania", dialCode: "+40", flag: "RO" },
  { code: "BG", name: "Bulgaria", dialCode: "+359", flag: "BG" },
  { code: "HR", name: "Croatia", dialCode: "+385", flag: "HR" },
  { code: "SI", name: "Slovenia", dialCode: "+386", flag: "SI" },
  { code: "SK", name: "Slovakia", dialCode: "+421", flag: "SK" },
  { code: "LT", name: "Lithuania", dialCode: "+370", flag: "LT" },
  { code: "LV", name: "Latvia", dialCode: "+371", flag: "LV" },
  { code: "EE", name: "Estonia", dialCode: "+372", flag: "EE" },
  { code: "IE", name: "Ireland", dialCode: "+353", flag: "IE" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "PT" },
  { code: "GR", name: "Greece", dialCode: "+30", flag: "GR" },
  { code: "CY", name: "Cyprus", dialCode: "+357", flag: "CY" },
  { code: "MT", name: "Malta", dialCode: "+356", flag: "MT" },
  { code: "LU", name: "Luxembourg", dialCode: "+352", flag: "LU" },
  { code: "IS", name: "Iceland", dialCode: "+354", flag: "IS" },
  { code: "LI", name: "Liechtenstein", dialCode: "+423", flag: "LI" },
  { code: "MC", name: "Monaco", dialCode: "+377", flag: "MC" },
  { code: "SM", name: "San Marino", dialCode: "+378", flag: "SM" },
  { code: "VA", name: "Vatican City", dialCode: "+379", flag: "VA" },
  { code: "AD", name: "Andorra", dialCode: "+376", flag: "AD" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "JP" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "KR" },
  { code: "CN", name: "China", dialCode: "+86", flag: "CN" },
  { code: "HK", name: "Hong Kong", dialCode: "+852", flag: "HK" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "SG" },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "MY" },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "TH" },
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: "ID" },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "PH" },
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: "VN" },
  { code: "TW", name: "Taiwan", dialCode: "+886", flag: "TW" },
  { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "NZ" },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "ZA" },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "EG" },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "NG" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "KE" },
  { code: "GH", name: "Ghana", dialCode: "+233", flag: "GH" },
  { code: "MA", name: "Morocco", dialCode: "+212", flag: "MA" },
  { code: "TN", name: "Tunisia", dialCode: "+216", flag: "TN" },
  { code: "DZ", name: "Algeria", dialCode: "+213", flag: "DZ" },
  { code: "LY", name: "Libya", dialCode: "+218", flag: "LY" },
  { code: "SD", name: "Sudan", dialCode: "+249", flag: "SD" },
  { code: "ET", name: "Ethiopia", dialCode: "+251", flag: "ET" },
  { code: "UG", name: "Uganda", dialCode: "+256", flag: "UG" },
  { code: "TZ", name: "Tanzania", dialCode: "+255", flag: "TZ" },
  { code: "RW", name: "Rwanda", dialCode: "+250", flag: "RW" },
  { code: "BI", name: "Burundi", dialCode: "+257", flag: "BI" },
  { code: "MW", name: "Malawi", dialCode: "+265", flag: "MW" },
  { code: "ZM", name: "Zambia", dialCode: "+260", flag: "ZM" },
  { code: "ZW", name: "Zimbabwe", dialCode: "+263", flag: "ZW" },
  { code: "BW", name: "Botswana", dialCode: "+267", flag: "BW" },
  { code: "NA", name: "Namibia", dialCode: "+264", flag: "NA" },
  { code: "SZ", name: "Eswatini", dialCode: "+268", flag: "SZ" },
  { code: "LS", name: "Lesotho", dialCode: "+266", flag: "LS" },
  { code: "MG", name: "Madagascar", dialCode: "+261", flag: "MG" },
  { code: "MU", name: "Mauritius", dialCode: "+230", flag: "MU" },
  { code: "SC", name: "Seychelles", dialCode: "+248", flag: "SC" },
  { code: "KM", name: "Comoros", dialCode: "+269", flag: "KM" },
  { code: "DJ", name: "Djibouti", dialCode: "+253", flag: "DJ" },
  { code: "SO", name: "Somalia", dialCode: "+252", flag: "SO" },
  { code: "ER", name: "Eritrea", dialCode: "+291", flag: "ER" },
  { code: "SS", name: "South Sudan", dialCode: "+211", flag: "SS" },
  { code: "CF", name: "Central African Republic", dialCode: "+236", flag: "CF" },
  { code: "TD", name: "Chad", dialCode: "+235", flag: "TD" },
  { code: "NE", name: "Niger", dialCode: "+227", flag: "NE" },
  { code: "ML", name: "Mali", dialCode: "+223", flag: "ML" },
  { code: "BF", name: "Burkina Faso", dialCode: "+226", flag: "BF" },
  { code: "CI", name: "Côte d'Ivoire", dialCode: "+225", flag: "CI" },
  { code: "LR", name: "Liberia", dialCode: "+231", flag: "LR" },
  { code: "SL", name: "Sierra Leone", dialCode: "+232", flag: "SL" },
  { code: "GN", name: "Guinea", dialCode: "+224", flag: "GN" },
  { code: "GW", name: "Guinea-Bissau", dialCode: "+245", flag: "GW" },
  { code: "GM", name: "Gambia", dialCode: "+220", flag: "GM" },
  { code: "SN", name: "Senegal", dialCode: "+221", flag: "SN" },
  { code: "MR", name: "Mauritania", dialCode: "+222", flag: "MR" },
  { code: "CV", name: "Cape Verde", dialCode: "+238", flag: "CV" },
  { code: "ST", name: "São Tomé and Príncipe", dialCode: "+239", flag: "ST" },
  { code: "GQ", name: "Equatorial Guinea", dialCode: "+240", flag: "GQ" },
  { code: "GA", name: "Gabon", dialCode: "+241", flag: "GA" },
  { code: "CG", name: "Republic of the Congo", dialCode: "+242", flag: "CG" },
  { code: "CD", name: "Democratic Republic of the Congo", dialCode: "+243", flag: "CD" },
  { code: "AO", name: "Angola", dialCode: "+244", flag: "AO" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "BR" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "AR" },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "CL" },
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "CO" },
  { code: "PE", name: "Peru", dialCode: "+51", flag: "PE" },
  { code: "VE", name: "Venezuela", dialCode: "+58", flag: "VE" },
  { code: "EC", name: "Ecuador", dialCode: "+593", flag: "EC" },
  { code: "BO", name: "Bolivia", dialCode: "+591", flag: "BO" },
  { code: "PY", name: "Paraguay", dialCode: "+595", flag: "PY" },
  { code: "UY", name: "Uruguay", dialCode: "+598", flag: "UY" },
  { code: "GY", name: "Guyana", dialCode: "+592", flag: "GY" },
  { code: "SR", name: "Suriname", dialCode: "+597", flag: "SR" },
  { code: "GF", name: "French Guiana", dialCode: "+594", flag: "GF" },
  { code: "FK", name: "Falkland Islands", dialCode: "+500", flag: "FK" },
  { code: "GS", name: "South Georgia and the South Sandwich Islands", dialCode: "+500", flag: "GS" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "MX" },
  { code: "GT", name: "Guatemala", dialCode: "+502", flag: "GT" },
  { code: "BZ", name: "Belize", dialCode: "+501", flag: "BZ" },
  { code: "SV", name: "El Salvador", dialCode: "+503", flag: "SV" },
  { code: "HN", name: "Honduras", dialCode: "+504", flag: "HN" },
  { code: "NI", name: "Nicaragua", dialCode: "+505", flag: "NI" },
  { code: "CR", name: "Costa Rica", dialCode: "+506", flag: "CR" },
  { code: "PA", name: "Panama", dialCode: "+507", flag: "PA" },
  { code: "CU", name: "Cuba", dialCode: "+53", flag: "CU" },
  { code: "JM", name: "Jamaica", dialCode: "+1", flag: "JM" },
  { code: "HT", name: "Haiti", dialCode: "+509", flag: "HT" },
  { code: "DO", name: "Dominican Republic", dialCode: "+1", flag: "DO" },
  { code: "PR", name: "Puerto Rico", dialCode: "+1", flag: "PR" },
  { code: "TT", name: "Trinidad and Tobago", dialCode: "+1", flag: "TT" },
  { code: "BB", name: "Barbados", dialCode: "+1", flag: "BB" },
  { code: "AG", name: "Antigua and Barbuda", dialCode: "+1", flag: "AG" },
  { code: "DM", name: "Dominica", dialCode: "+1", flag: "DM" },
  { code: "GD", name: "Grenada", dialCode: "+1", flag: "GD" },
  { code: "KN", name: "Saint Kitts and Nevis", dialCode: "+1", flag: "KN" },
  { code: "LC", name: "Saint Lucia", dialCode: "+1", flag: "LC" },
  { code: "VC", name: "Saint Vincent and the Grenadines", dialCode: "+1", flag: "VC" },
  { code: "BS", name: "Bahamas", dialCode: "+1", flag: "BS" },
  { code: "TC", name: "Turks and Caicos Islands", dialCode: "+1", flag: "TC" },
  { code: "VG", name: "British Virgin Islands", dialCode: "+1", flag: "VG" },
  { code: "VI", name: "U.S. Virgin Islands", dialCode: "+1", flag: "VI" },
  { code: "AI", name: "Anguilla", dialCode: "+1", flag: "AI" },
  { code: "MS", name: "Montserrat", dialCode: "+1", flag: "MS" },
  { code: "KY", name: "Cayman Islands", dialCode: "+1", flag: "KY" },
  { code: "BM", name: "Bermuda", dialCode: "+1", flag: "BM" },
  { code: "GL", name: "Greenland", dialCode: "+299", flag: "GL" },
  { code: "RU", name: "Russia", dialCode: "+7", flag: "RU" },
  { code: "KZ", name: "Kazakhstan", dialCode: "+7", flag: "KZ" },
  { code: "KG", name: "Kyrgyzstan", dialCode: "+996", flag: "KG" },
  { code: "TJ", name: "Tajikistan", dialCode: "+992", flag: "TJ" },
  { code: "TM", name: "Turkmenistan", dialCode: "+993", flag: "TM" },
  { code: "UZ", name: "Uzbekistan", dialCode: "+998", flag: "UZ" },
  { code: "AF", name: "Afghanistan", dialCode: "+93", flag: "AF" },
  { code: "PK", name: "Pakistan", dialCode: "+92", flag: "PK" },
  { code: "BD", name: "Bangladesh", dialCode: "+880", flag: "BD" },
  { code: "LK", name: "Sri Lanka", dialCode: "+94", flag: "LK" },
  { code: "MV", name: "Maldives", dialCode: "+960", flag: "MV" },
  { code: "BT", name: "Bhutan", dialCode: "+975", flag: "BT" },
  { code: "NP", name: "Nepal", dialCode: "+977", flag: "NP" },
  { code: "MM", name: "Myanmar", dialCode: "+95", flag: "MM" },
  { code: "LA", name: "Laos", dialCode: "+856", flag: "LA" },
  { code: "KH", name: "Cambodia", dialCode: "+855", flag: "KH" },
  { code: "BN", name: "Brunei", dialCode: "+673", flag: "BN" },
  { code: "TL", name: "East Timor", dialCode: "+670", flag: "TL" },
  { code: "MN", name: "Mongolia", dialCode: "+976", flag: "MN" },
  { code: "KP", name: "North Korea", dialCode: "+850", flag: "KP" },
  { code: "MO", name: "Macau", dialCode: "+853", flag: "MO" },
  { code: "TR", name: "Turkey", dialCode: "+90", flag: "TR" },
  { code: "IL", name: "Israel", dialCode: "+972", flag: "IL" },
  { code: "PS", name: "Palestine", dialCode: "+970", flag: "PS" },
  { code: "JO", name: "Jordan", dialCode: "+962", flag: "JO" },
  { code: "LB", name: "Lebanon", dialCode: "+961", flag: "LB" },
  { code: "SY", name: "Syria", dialCode: "+963", flag: "SY" },
  { code: "IQ", name: "Iraq", dialCode: "+964", flag: "IQ" },
  { code: "IR", name: "Iran", dialCode: "+98", flag: "IR" },
  { code: "KW", name: "Kuwait", dialCode: "+965", flag: "KW" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "SA" },
  { code: "QA", name: "Qatar", dialCode: "+974", flag: "QA" },
  { code: "BH", name: "Bahrain", dialCode: "+973", flag: "BH" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "AE" },
  { code: "OM", name: "Oman", dialCode: "+968", flag: "OM" },
  { code: "YE", name: "Yemen", dialCode: "+967", flag: "YE" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function PhoneNumberInput({
  id,
  name,
  className,
  placeholder = "Enter phone number",
  value,
  onChange,
  required,
}: PhoneNumberInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]); // Default to US
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
    // Reset display value to just the phone number part when selecting from dropdown
    setDisplayValue(phoneNumber);
  };

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    setHighlightedIndex(-1);
    
    // Auto-focus search input when opening dropdown
    if (newIsOpen && searchRef.current) {
      // Use requestAnimationFrame to ensure the DOM is updated
      requestAnimationFrame(() => {
        if (searchRef.current) {
          searchRef.current.focus();
        }
      });
    }
  };

  const filteredCountries = countryCodes.filter(country => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    const searchTrimmed = searchTerm.trim();
    
    // Search by country name
    const nameMatch = country.name.toLowerCase().includes(searchLower);
    
    // Search by country code (2-letter code)
    const codeMatch = country.code.toLowerCase().includes(searchLower);
    
    // Search by dial code (with or without +)
    const dialCodeMatch = country.dialCode.includes(searchTrimmed) || 
                         country.dialCode.replace('+', '').includes(searchTrimmed.replace('+', ''));
    
    return nameMatch || codeMatch || dialCodeMatch;
  });

  // Handle direct country code input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHighlightedIndex(-1);
    
    // If user types a country code directly (e.g., "+91", "91", "IN", "India")
    if (value.trim()) {
      const trimmedValue = value.trim();
      
      // Check if it's a dial code (starts with + or is just numbers)
      if (trimmedValue.startsWith('+') || /^\d+$/.test(trimmedValue)) {
        const dialCode = trimmedValue.startsWith('+') ? trimmedValue : `+${trimmedValue}`;
        const matchingCountry = countryCodes.find(country => 
          country.dialCode === dialCode || 
          country.dialCode.replace('+', '') === trimmedValue
        );
        
        if (matchingCountry) {
          setSelectedCountry(matchingCountry);
          setSearchTerm("");
          setIsOpen(false);
        }
      }
      
      // Check if it's a 2-letter country code
      if (trimmedValue.length === 2 && /^[A-Za-z]{2}$/.test(trimmedValue)) {
        const matchingCountry = countryCodes.find(country => 
          country.code.toLowerCase() === trimmedValue.toLowerCase()
        );
        
        if (matchingCountry) {
          setSelectedCountry(matchingCountry);
          setSearchTerm("");
          setIsOpen(false);
        }
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
          handleCountrySelect(filteredCountries[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    
    // Check if user is typing a country code directly (starts with +)
    if (newValue.startsWith('+')) {
      // Find matching country by dial code
      const matchingCountry = countryCodes.find(country => {
        const dialCodeWithoutPlus = country.dialCode.replace('+', '');
        const inputWithoutPlus = newValue.replace('+', '');
        
        // Check if input starts with this country's dial code
        if (inputWithoutPlus.startsWith(dialCodeWithoutPlus)) {
          // Make sure it's not a partial match of a longer dial code
          const remainingInput = inputWithoutPlus.substring(dialCodeWithoutPlus.length);
          // If there's remaining input, it should be digits (phone number)
          return remainingInput === '' || /^\d+$/.test(remainingInput);
        }
        return false;
      });
      
      if (matchingCountry) {
        // Extract the phone number part (after the country code)
        const dialCodeWithoutPlus = matchingCountry.dialCode.replace('+', '');
        const inputWithoutPlus = newValue.replace('+', '');
        const phoneNumberPart = inputWithoutPlus.substring(dialCodeWithoutPlus.length);
        
        // Update selected country and phone number
        setSelectedCountry(matchingCountry);
        setPhoneNumber(phoneNumberPart);
        
        // Create a synthetic event with the full phone number
        if (onChange) {
          const syntheticEvent = {
            target: { 
              value: newValue, 
              name: name || "" 
            }
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
        return;
      }
    }
    
    // Regular phone number input (without country code)
    setPhoneNumber(newValue);
    
    // Create a synthetic event with the full phone number
    if (onChange) {
      const syntheticEvent = {
        target: { 
          value: `${selectedCountry.dialCode} ${newValue}`, 
          name: name || "" 
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      // Small delay to ensure the dropdown is fully rendered
      const timer = setTimeout(() => {
        if (searchRef.current) {
          searchRef.current.focus();
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Country Code Dropdown */}
      <div ref={dropdownRef} className="absolute left-0 top-0 z-10">
        <div
          className="flex items-center px-3 py-3 border-r border-[#ECE9E2] bg-transparent cursor-pointer min-w-[120px] h-full"
          onClick={handleToggle}
        >
          <ReactCountryFlag 
            countryCode={selectedCountry.flag} 
            svg 
            style={{
              width: '1.2em',
              height: '1.2em',
              marginRight: '0.5rem'
            }}
          />
          <span className="text-sm text-[#2D2A2E] font-medium">{selectedCountry.dialCode}</span>
          <ChevronDown className={`h-4 w-4 text-[#CBB49A] ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-[#ECE9E2] rounded-xl shadow-lg max-h-60 overflow-hidden min-w-[320px] animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="p-2 border-b border-[#ECE9E2]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A9A29D]" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Type country name, code (IN), or dial code (+91 or 91)..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  className="w-full pl-10 pr-3 py-2 border border-[#ECE9E2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-all duration-200"
                />
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <div
                    key={country.code}
                    className={`px-3 py-2 cursor-pointer flex items-center space-x-2 text-sm ${
                      index === highlightedIndex 
                        ? 'bg-[#CBB49A]/20' 
                        : 'hover:bg-[#F8F7F4]'
                    }`}
                    onClick={() => handleCountrySelect(country)}
                  >
                    <ReactCountryFlag 
                      countryCode={country.flag} 
                      svg 
                      style={{
                        width: '1.2em',
                        height: '1.2em'
                      }}
                    />
                    <span className="text-[#2D2A2E] flex-1">{country.name}</span>
                    <span className="text-[#A9A29D] font-medium">{country.dialCode}</span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-[#A9A29D]">No countries found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Phone Number Input */}
      <input
        id={id}
        name={name}
        type="tel"
        className={`${className} pl-[140px] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]`}
        placeholder="Enter phone number"
        value={displayValue}
        onChange={handlePhoneChange}
        required={required}
      />
    </div>
  );
}
