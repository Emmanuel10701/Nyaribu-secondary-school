'use client';

import { useState, useEffect } from 'react';
import { 
  FiUser, FiLock, FiAlertCircle, FiX, 
  FiHelpCircle, FiBook, FiShield, FiClock,
  FiLogIn, FiEdit2, FiCheckCircle
} from 'react-icons/fi';
import { IoSchool } from 'react-icons/io5';

import CircularProgress from "@mui/material/CircularProgress";


export default function StudentLoginModal({ 
  isOpen, 
  onClose, 
  onLogin,
  isLoading = false,
  error = null,
  requiresContact = false
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: ''
  });
  const [localError, setLocalError] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (error) {
      setLocalError(error);
      if (requiresContact) {
        setShowContactInfo(true);
      }
    } else {
      setLocalError(null);
      setShowContactInfo(false);
    }
  }, [error, requiresContact]);

  if (!isOpen) return null;

  const validateInputs = () => {
    const errors = {};
    
    // Name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your name';
    } else {
      const nameParts = formData.fullName.trim().split(/\s+/).filter(part => part.length > 0);
      if (nameParts.length < 1) {
        errors.fullName = 'Please enter at least your first name';
      }
    }

    // Admission number validation
    if (!formData.admissionNumber.trim()) {
      errors.admissionNumber = 'Please enter your admission number';
    } else if (!/^[A-Z0-9]{2,10}$/i.test(formData.admissionNumber.trim())) {
      errors.admissionNumber = 'Admission number should be 2-10 letters or numbers';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);
    setShowContactInfo(false);
    setValidationErrors({});
    
    if (!validateInputs()) {
      return;
    }

    onLogin(formData.fullName.trim(), formData.admissionNumber.trim());
  };

  const handleClear = () => {
    setFormData({ fullName: '', admissionNumber: '' });
    setLocalError(null);
    setShowContactInfo(false);
    setValidationErrors({});
  };

  const handleClose = () => {
    handleClear();
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (localError) setLocalError(null);
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Example student names from your database
  const studentExamples = [
    { name: "Sofia John Kiplagat", admission: "2903" },
    { name: "Emily Kiprono Gonzalez", admission: "2902" },
    { name: "John Doe", admission: "1234" },
    { name: "Mary Jane", admission: "5678" },
    { name: "Ahmed Mohamed", admission: "9012" }
  ];

  const nameFormats = [
    "Sofia Kiplagat",
    "Sofia John Kiplagat", 
    "SOFIA KIPLAGAT",
    "sofia kiplagat",
    "S. Kiplagat",
    "Kiplagat Sofia",
    "John Kiplagat"
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-1 sm:p-2 animate-fadeIn overflow-y-auto">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl w-full max-w-3xl border-2 border-blue-200 overflow-hidden transform transition-all duration-300 scale-100 my-auto max-h-[85vh] flex flex-col">
        {/* Header - Compact */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 px-4 py-3 sm:px-5 sm:py-3 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <IoSchool className="text-lg sm:text-xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Student Login Portal</h2>
                <p className="text-blue-100/90 text-xs mt-0.5">Access your learning resources</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-xl transition-colors"
              aria-label="Close"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>

        {/* Body - Compact Scrollable */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-grow">
          {/* Flexible Name Instructions - Compact */}
          <div className="mb-3 sm:mb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2.5 sm:p-3 border border-emerald-200">
            <div className="flex items-start gap-2">
              <FiCheckCircle className="text-emerald-600 text-sm mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xs font-bold text-emerald-800 mb-0.5">Flexible Name Entry</h3>
                <p className="text-emerald-700 text-xs">
                  Any format: uppercase, lowercase, 2 or 3 names, any order
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {nameFormats.slice(0, 3).map((format, idx) => (
                    <span 
                      key={idx}
                      onClick={() => handleInputChange('fullName', format)}
                      className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs cursor-pointer hover:bg-emerald-200 transition-colors border border-emerald-300"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error/Contact Info Section - Compact */}
          {(showContactInfo || localError) && (
            <div className="mb-3 sm:mb-4 animate-slideDown">
              <div className="flex items-start gap-2 mb-2">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 border ${showContactInfo ? 'bg-red-100 border-red-200' : 'bg-yellow-100 border-yellow-200'}`}>
                  <FiAlertCircle className={`text-sm ${showContactInfo ? 'text-red-600' : 'text-yellow-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                    {showContactInfo ? 'Record Verification Needed' : 'Login Issue'}
                  </h3>
                  <p className="text-gray-600 text-xs">
                    {localError}
                  </p>
                  
                  {showContactInfo && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-blue-700">
                        <FiHelpCircle className="text-blue-500 text-xs" />
                        <span className="font-medium">You can:</span>
                      </div>
                      <ol className="text-xs text-gray-700 space-y-0.5 pl-3">
                        <li className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px]">1</span>
                          <span>Re-enter details below</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px]">2</span>
                          <span>Contact class teacher</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px]">3</span>
                          <span>Visit school office</span>
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Login Form - Compact */}
          <div>
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                  <FiShield className="text-blue-700 text-sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Secure Student Login</h3>
                  <div className="flex items-center gap-1 text-gray-600 text-xs">
                    <FiClock className="text-blue-500 text-xs" />
                    <span>Session: <strong>2 hours</strong></span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-2.5 sm:p-3 border border-blue-200">
                <p className="text-blue-700 text-xs">
                  <strong>Note:</strong> Use official admission number. Names in any format.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Name Input - Compact */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <FiUser className="text-blue-600 text-xs" />
                    Your Name (Any Format)
                  </label>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    Flexible
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Examples: Sofia Kiplagat, SOFIA KIPLAGAT, S. Kiplagat, Kiplagat Sofia"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm placeholder:text-gray-400 ${
                    validationErrors.fullName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                  autoComplete="name"
                  aria-label="Full Name"
                />
                {validationErrors.fullName && (
                  <p className="text-red-600 text-[10px] mt-0.5">{validationErrors.fullName}</p>
                )}
                <div className="mt-1.5">
                  <p className="text-gray-500 text-[10px] mb-1">Click examples:</p>
                  <div className="flex flex-wrap gap-1">
                    {studentExamples.slice(0, 3).map((student, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          handleInputChange('fullName', student.name);
                          handleInputChange('admissionNumber', student.admission);
                        }}
                        className="px-1.5 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-[10px] transition-colors border border-blue-300"
                      >
                        {student.name.split(' ')[0]} - {student.admission}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Admission Number Input - Compact */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <FiLock className="text-blue-600 text-xs" />
                    Admission Number
                  </label>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    Unique ID
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.admissionNumber}
                  onChange={(e) => handleInputChange('admissionNumber', e.target.value.toUpperCase())}
                  placeholder="Enter your unique admission number"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-xs sm:text-sm placeholder:text-gray-400 ${
                    validationErrors.admissionNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                  autoComplete="off"
                  aria-label="Admission Number"
                />
                {validationErrors.admissionNumber && (
                  <p className="text-red-600 text-[10px] mt-0.5">{validationErrors.admissionNumber}</p>
                )}
                <div className="mt-1.5">
                  <p className="text-gray-500 text-[10px] mb-1">Format: 2-10 letters/numbers</p>
                  <div className="flex flex-wrap gap-1">
                    {['1234', 'AB12', '2023001', 'STU456'].map((example, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInputChange('admissionNumber', example)}
                        className="px-1.5 py-0.5 bg-green-100 hover:bg-green-200 text-green-700 rounded text-[10px] transition-colors border border-green-300"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

<div className="flex gap-2 pt-1 flex-nowrap">
  <button
    type="button"
    onClick={handleClear}
    disabled={isLoading}
    className="
      flex-1
      py-2.5
      px-4
      bg-gray-200
      text-gray-700
      rounded-lg
      font-bold
      text-sm
      disabled:opacity-50
      disabled:cursor-not-allowed
      flex items-center justify-center gap-2
      order-2 sm:order-1
    "
  >
    Clear All
  </button>

  <button
    type="submit"
    disabled={
      isLoading ||
      !formData.fullName.trim() ||
      !formData.admissionNumber.trim()
    }
    className="
      flex-1
      py-2.5
      px-4
      bg-blue-700
      text-white
      rounded-lg
      font-bold
      text-sm
      disabled:opacity-70
      disabled:cursor-not-allowed
      flex items-center justify-center gap-2
      order-1 sm:order-2
    "
  >
    {isLoading ? (
      <span className="flex items-center gap-2">
        <CircularProgress size={16} thickness={4} sx={{ color: "white" }} />
        Verifying...
      </span>
    ) : (
      <span className="flex items-center gap-2">
        <FiLogIn className="text-sm" />
        Login to Portal
      </span>
    )}
  </button>
</div>

            </form>

            {/* Features - Compact */}
            <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="text-center p-1.5 sm:p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <FiBook className="text-blue-600 text-xs sm:text-sm mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-blue-800">Resources</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
                  <FiShield className="text-emerald-600 text-xs sm:text-sm mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-emerald-800">Secure</p>
                </div>
                <div className="text-center p-1.5 sm:p-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <FiClock className="text-purple-600 text-xs sm:text-sm mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-purple-800">2 Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex-shrink-0">
          <p className="text-center text-gray-600 text-[10px] sm:text-xs">
            For assistance: Contact class teacher or school office
          </p>
        </div>
      </div>

      {/* Global Styles for Responsiveness */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .text-xl { font-size: 1.125rem; }
          .text-lg { font-size: 1rem; }
          .text-base { font-size: 0.875rem; }
        }
        
        @media (max-width: 480px) {
          .text-xl { font-size: 1rem; }
          .max-w-3xl { max-width: 95vw; }
        }
        
        /* Prevent zoom issues */
        html {
          text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        
        body {
          overflow-x: hidden;
        }
        
        /* Animation for error messages */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        
        /* Prevent iOS zoom on input focus */
        @media screen and (max-width: 768px) {
          input, select, textarea {
            font-size: 16px !important;
          }
        }
        
        /* Responsive handling for high zoom levels */
        @media (min-width: 768px) and (max-width: 1200px) {
          .max-w-3xl {
            max-width: 85vw !important;
          }
        }
        
        /* For very small screens */
        @media (max-width: 320px) {
          .max-w-3xl {
            max-width: 98vw !important;
            margin: 0.25rem;
          }
        }
        
        /* Custom scrollbar for modal body */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}