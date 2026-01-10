'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { toast, Toaster } from 'sonner';
import { FiPlus, FiSearch, FiFilter, FiEdit3, FiTrash2, FiBook, FiBarChart2, FiUser, FiUsers, FiAlertTriangle, FiMessageCircle, FiClock, FiCalendar, FiSave, FiX, FiImage, FiUpload, FiRotateCw, FiEye, FiChevronRight, FiCheck, FiChevronDown, FiChevronUp, FiAlertCircle, FiUserPlus, FiUserCheck, FiBriefcase, FiAward, FiMail, FiPhone, FiShield, FiArrowLeft } from 'react-icons/fi';
import CircularProgress from "@mui/material/CircularProgress";

// ============= MODERN MODAL COMPONENTS =============

// Modern Team Detail Modal Component
const ModernTeamDetailModal = ({ team, onClose, onEdit }) => {
  if (!team) return null;

  // Member card component for the modal
const MemberCard = ({ member, type, assistant = null }) => {
  if (!member) return null;

  const getTypeConfig = (type) => {
    const configs = {
      patron: {
        bgGradient: 'from-purple-50/50 to-white',
        borderColor: 'border-purple-100/60',
        textColor: 'text-purple-600',
        badgeColor: 'bg-purple-100/80 text-purple-700',
        icon: <FiAward className="w-3 h-3" />,
        label: 'Patron'
      },
      matron: {
        bgGradient: 'from-pink-50/50 to-white',
        borderColor: 'border-pink-100/60',
        textColor: 'text-pink-600',
        badgeColor: 'bg-pink-100/80 text-pink-700',
        icon: <FiUserCheck className="w-3 h-3" />,
        label: 'Matron'
      },
      teacher: {
        bgGradient: 'from-blue-50/50 to-white',
        borderColor: 'border-blue-100/60',
        textColor: 'text-blue-600',
        badgeColor: 'bg-blue-100/80 text-blue-700',
        icon: <FiBriefcase className="w-3 h-3" />,
        label: 'Guidance Teacher'
      }
    };
    return configs[type] || configs.teacher;
  };

  const config = getTypeConfig(type);

  return (
    <div className={`relative rounded-[2rem] border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
        
        {/* Image Section - Scaled Down slightly */}
        <div className="relative shrink-0">
          <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-white shadow-xl">
            {member.image ? (
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200">
                <FiUser className="text-slate-400 w-10 h-10" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-md">
            <FiCheck className="text-white w-3 h-3" />
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${config.badgeColor} flex items-center gap-1.5`}>
              {config.icon} {config.label}
            </span>
            {member.title && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-full">
                {member.title}
              </span>
            )}
          </div>

          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1 tracking-tight">
            {member.name}
          </h3>

          {/* Bio - Muted and smaller */}
          {member.bio && (
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
              {member.bio}
            </p>
          )}

          {/* Contact Buttons - Replaced plain icons */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            {member.phone && (
              <a href={`tel:${member.phone}`} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:border-emerald-200 hover:text-emerald-600 transition-all shadow-sm">
                <FiPhone className="w-3 h-3" /> Call
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm">
                <FiMail className="w-3 h-3" /> Email
              </a>
            )}
          </div>

          {/* Assistant Sub-Card - Compacted */}
          {assistant && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white shadow-sm">
                  {assistant.image ? (
                    <img src={assistant.image} alt={assistant.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <FiUser className="text-slate-400 w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 truncate">{assistant.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Assistant Teacher</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

 return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    {/* Modal Container - Reduced width to 2xl and padding */}
    <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      
      {/* Close Button - Smaller & more subtle */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-1.5 bg-white/20 backdrop-blur-md text-white rounded-full border border-white/30 transition-all active:scale-90 hover:bg-white/40"
      >
        <FiX size={18} />
      </button>

      {/* 1. Header - Reduced height and font sizes */}
      <div className="relative h-32 sm:h-40 w-full shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600" />
        <div className="relative h-full flex flex-col justify-end p-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Guidance Team
              </h2>
              <p className="text-white/70 text-xs">
                Official project oversight team
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <FiShield className="text-white w-3 h-3" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">Official</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Area - Compact padding */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
        <div className="space-y-6">
          
          {/* Summary Stats - More compact grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Patron', color: 'purple', icon: FiAward, val: team.patron },
              { label: 'Matron', color: 'pink', icon: FiUserCheck, val: team.matron },
              { label: 'Teacher', color: 'blue', icon: FiBriefcase, val: team.teacher }
            ].map((item) => (
              <div key={item.label} className={`p-3 bg-gradient-to-b from-${item.color}-50/50 to-white rounded-2xl border border-${item.color}-100/50 text-center`}>
                <item.icon className={`text-${item.color}-500 w-4 h-4 mx-auto mb-1`} />
                <p className={`text-[9px] font-bold text-${item.color}-600 uppercase tracking-tighter`}>{item.label}</p>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {item.val ? item.val.name.split(' ')[0] : 'None'}
                </p>
              </div>
            ))}
          </div>

          {/* Team Members List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Profile Details</h3>
            </div>
            
            <div className="space-y-4">
              {team.patron && <MemberCard member={team.patron} type="patron" />}
              {team.matron && <MemberCard member={team.matron} type="matron" />}
              {team.teacher && <MemberCard member={team.teacher} type="teacher" assistant={team.teacher?.assistant} />}
              
              {!team.patron && !team.matron && !team.teacher && (
                <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                  <FiUsers className="text-slate-200 w-10 h-10 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400">No members assigned</p>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps - Smaller font */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-4">
            <div className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              <span>Updated {new Date(team.updatedAt).toLocaleDateString()}</span>
            </div>
            <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* 3. Action Footer - Smaller button height */}
      <div className="shrink-0 p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-[1.5] h-11 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <FiArrowLeft size={14} /> Close
          </button>
          
          {onEdit && (
            <button
              onClick={() => { onClose(); onEdit(); }}
              className="flex-1 h-11 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <FiEdit3 size={14} /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

const ModernSessionDetailModal = ({ event, onClose, onEdit }) => {
  if (!event) return null;

  const categoryConfig = CATEGORY_CONFIG[event?.category];

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'bg-rose-500',
      Medium: 'bg-amber-500',
      Low: 'bg-emerald-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const formatFullDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch { return dateString || 'Date not set'; }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Compact Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-1.5 bg-white/20 backdrop-blur-md text-white rounded-full border border-white/30 transition-all active:scale-90 hover:bg-white/40"
        >
          <FiX size={18} />
        </button>

        {/* 1. Hero Image - Reduced Height */}
        <div className="relative h-48 sm:h-56 w-full shrink-0">
          <img
            src={event.image || (categoryConfig?.presetImage || '/default-event.jpg')}
            alt="Session"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />
          
          <div className="absolute bottom-4 left-6 flex gap-1.5">
            <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              {event.category || 'Guidance'}
            </span>
            <span className={`px-3 py-1 text-white rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${getPriorityColor(event.priority)}`}>
              <FiAlertCircle size={10} /> {event.priority}
            </span>
          </div>
        </div>

        {/* 2. Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-white">
          <div className="space-y-6">
            
            {/* Title & Metadata - Scaled Down Fonts */}
            <section className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Counseling Session
              </h2>
              
              <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="text-blue-500" />
                  {formatFullDate(event.date)}
                </div>
                <div className="flex items-center gap-1.5">
                  <FiClock className="text-amber-500" />
                  {event.time}
                </div>
                <div className="flex items-center gap-1.5">
                  <FiUser className="text-purple-500" />
                  {event.counselor || 'Unassigned'}
                </div>
              </div>
            </section>

            {/* Description - Reduced font size and line height */}
            <section className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Session Details</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {event.description || 'No description available.'}
              </p>
            </section>

            {/* Stats Grid - More Compact */}
            <section className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Category</p>
                <p className="text-xs font-bold text-slate-900 truncate">{event.category || 'General'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Type</p>
                <p className="text-xs font-bold text-slate-900 truncate">{event.type || 'Guidance'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Priority</p>
                <p className="text-xs font-bold text-slate-900">{event.priority || 'Medium'}</p>
              </div>
            </section>

            {/* Notes Section - Compacted */}
            {event.notes && (
              <section className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Additional Notes</h3>
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                  <p className="text-slate-600 text-xs leading-relaxed">{event.notes}</p>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* 3. Action Footer - Smaller Buttons */}
        <div className="shrink-0 p-4 bg-slate-50 border-t border-slate-100">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-[1.5] h-11 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-slate-800"
            >
              <FiArrowLeft size={14} />
              Close
            </button>
            
            <button
              onClick={() => { onClose(); onEdit(); }}
              className="flex-1 h-11 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all hover:border-indigo-200"
            >
              <FiEdit3 size={14} />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= UTILITY COMPONENTS =============

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  itemName = "this counseling session",
  loading = false 
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-red-600 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <FiAlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
              <p className="text-rose-100 opacity-90 text-sm">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-rose-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-8 h-8 text-rose-600" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete "{itemName}"?
            </h3>
            
            <p className="text-gray-600 mb-1">
              Are you sure you want to delete this counseling session?
            </p>
            <p className="text-gray-500 text-sm">
              All associated data will be permanently removed.
            </p>
          </div>

          {/* Details Warning */}
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-rose-800">
                  Warning: This action is irreversible
                </p>
                <p className="text-xs text-rose-600 mt-1">
                  The session record will be permanently deleted from the database.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl font-bold text-base disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 text-white py-3.5 rounded-xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <FiTrash2 className="w-5 h-5" />
                  <span>Delete Session</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Category configuration with preset images
const CATEGORY_CONFIG = {
  Drugs: {
    icon: <FiAlertTriangle className="text-red-500" />,
    color: 'red',
    presetImage: '/drugs.png',
    label: '🚫 Drugs'
  },
  Relationships: {
    icon: <FiUsers className="text-pink-500" />,
    color: 'pink',
    presetImage: '/love.jpg',
    label: '💕 Relationships'
  },
  Academics: {
    icon: <FiBook className="text-blue-500" />,
    color: 'blue',
    presetImage: '/academics.jpg',
    label: '📚 Academics'
  },
  Worship: {
    icon: <FiUser className="text-purple-500" />,
    color: 'purple',
    presetImage: '/worship.jpg',
    label: '🙏 Worship'
  },
  Discipline: {
    icon: <FiBarChart2 className="text-orange-500" />,
    color: 'orange',
    presetImage: '/discipline.jpg',
    label: '⚖️ Discipline'
  }
};

// Modern Modal Component with Increased Dimensions
const ModernModal = ({ children, open, onClose, maxWidth = '910px' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ 
          width: '90%',
          maxWidth: maxWidth,
          maxHeight: '94vh',
          minHeight: '600px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Modern Dropdown Component
const ModernDropdown = ({ 
  value, 
  onChange, 
  options, 
  label, 
  disabled = false,
  placeholder = "Select..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-bold text-gray-800 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg text-left flex items-center justify-between ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && (
            <span className="flex-shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>
        {!disabled && (
          <FiChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 flex items-center gap-2 ${
                  value === option.value
                    ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <span className="truncate">{option.label}</span>
                {value === option.value && (
                  <FiCheck className="ml-auto text-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Modern Card Component
const CounselingEventCard = ({ event, onEdit, onDelete, onView, index }) => {
  const [imageError, setImageError] = useState(false);

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'bg-gradient-to-r from-red-500 to-rose-500',
      Medium: 'bg-gradient-to-r from-amber-500 to-orange-500',
      Low: 'bg-gradient-to-r from-emerald-500 to-green-500'
    };
    return colors[priority] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getCategoryColor = (category) => {
    const colors = {
      Drugs: 'bg-red-100 text-red-800 border-red-200',
      Relationships: 'bg-pink-100 text-pink-800 border-pink-200',
      Worship: 'bg-purple-100 text-purple-800 border-purple-200',
      Discipline: 'bg-orange-100 text-orange-800 border-orange-200',
      Academics: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const categoryConfig = CATEGORY_CONFIG[event?.category];

  return (
    <div className="bg-white rounded-[1.5rem] shadow-lg border border-gray-100 overflow-hidden transition-none">
      {/* Image Section - Modernized */}
      {event?.image && !imageError ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={`Counseling session with ${event.counselor}`}
            className="w-full h-full object-cover object-center"
            onError={() => setImageError(true)}
          />
          {/* Modern Priority Badge */}
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-sm shadow-sm ${getPriorityColor(event.priority)}`}>
              {event.priority}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          {/* Modern Gradient Fallback */}
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-sm shadow-sm ${getPriorityColor(event?.priority)}`}>
              {event?.priority || 'MEDIUM'}
            </span>
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <FiUser className="text-blue-600" />
              </div>
              <div>
                <span className="block text-[9px] text-gray-500 font-black uppercase tracking-[0.1em]">Counselor</span>
                <h3 className="font-black text-base text-gray-900">{event?.counselor || 'Unassigned'}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content - Modernized */}
      <div className="p-5">
        {/* Modern Category Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-black uppercase tracking-wider border mb-4 ${getCategoryColor(event?.category)}`}>
          {categoryConfig?.icon || <FiMessageCircle className="text-gray-500" />}
          <span>{event?.category || 'General'}</span>
        </div>

        {/* Description - Modern Typography */}
        <p className="text-gray-800 mb-4 text-sm font-medium leading-relaxed line-clamp-2">
          {event?.description || 'No description provided'}
        </p>

        {/* Details - Modern Layout */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <FiCalendar className="text-gray-500" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-[0.1em]">Date</span>
              <span className="text-sm font-bold text-gray-700 truncate">
                {event?.date ? new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                }) : 'No date'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <FiClock className="text-gray-500" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-[0.1em]">Time</span>
              <span className="text-sm font-bold text-gray-700">{event?.time || 'No time'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <FiUser className="text-gray-500" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] text-gray-400 font-black uppercase tracking-[0.1em]">Counselor</span>
              <span className="text-sm font-bold text-gray-700 truncate">{event?.counselor || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Modern Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest transition-none active:bg-gray-200 flex items-center justify-center gap-2"
          >
            <FiEye size={14} />
            View
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-none active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <FiEdit3 size={14} />
            Edit
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-3 bg-red-50 text-red-500 rounded-xl border border-red-100 transition-none active:bg-red-100"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <CircularProgress size={36} thickness={6} />

      <div
        style={{
          fontSize: "18px",
          color: "#6b7280",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        Loading sessions from the database…
      </div>
    </div>
  </div>
);

// Enhanced Edit Dialog - Only Custom Image Selection
const GuidanceEditDialog = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    counselor: '',
    category: 'Academics',
    description: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'Guidance',
    priority: 'Medium',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  // Dropdown state for category
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Category options
  const categoryOptions = useMemo(() => 
    Object.entries(CATEGORY_CONFIG).map(([value, config]) => ({
      value,
      label: config.label,
      icon: config.icon
    })), []
  );

  const selectedCategory = categoryOptions.find(opt => opt.value === formData.category);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (event) {
      setFormData({
        counselor: event.counselor || '',
        category: event.category || 'Academics',
        description: event.description || '',
        notes: event.notes || '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        time: event.time || '09:00',
        type: event.type || 'Guidance',
        priority: event.priority || 'Medium',
      });
      
      // Set image preview if exists
      if (event.image) {
        setImagePreview(event.image);
      }
    }
  }, [event]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    toast.success('Image uploaded successfully!');
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setImagePreview('');
    toast.info('Image removed');
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category }));
    setIsCategoryOpen(false);
  };

  const handleSave = async () => {
    if (!formData.counselor.trim()) {
      toast.error('Please enter counselor name');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter session description');
      return;
    }

    setIsSaving(true);
    
    const loadingToast = toast.loading('Saving session...');
    
    try {
      const submitData = new FormData();
      
      submitData.append('counselor', formData.counselor);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('notes', formData.notes);
      submitData.append('date', formData.date);
      submitData.append('time', formData.time);
      submitData.append('type', formData.type);
      submitData.append('priority', formData.priority);

      // Only append image if uploaded
      if (uploadedFile) {
        submitData.append('image', uploadedFile);
      }

      let url = '/api/guidance';
      let method = 'POST';

      if (event?.id) {
        url = `/api/guidance/${event.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        body: submitData,
      });

      const result = await response.json();
      
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success(event ? 'Session updated successfully!' : 'Session created successfully!');
        onSave();
      } else {
        throw new Error(result.error || 'An error occurred');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ModernModal open={true} onClose={onCancel}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{event ? 'Edit' : 'Create'} Counseling Session</h2>
              <p className="text-sm opacity-90">Upload a custom image for this session</p>
            </div>
          </div>
          <button 
            onClick={onCancel} 
            className="p-2 rounded-lg cursor-pointer"
            disabled={isSaving}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[calc(94vh-150px)]">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-6 space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="block text-base font-bold text-gray-900 mb-3">
              Session Image (Optional)
            </label>
            
            {/* Image Preview */}
            <div className="flex justify-center">
              {imagePreview ? (
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-gray-300 shadow-lg">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeUploadedFile}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                    disabled={isSaving}
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-48 h-48 rounded-2xl border-3 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-gray-100 transition-colors"
                >
                  <FiUpload className="text-gray-400 text-4xl mb-3" />
                  <p className="text-sm font-medium text-gray-600">Click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (max 5MB)</p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90"
                disabled={isSaving}
              >
                <FiUpload className="w-4 h-4" />
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Upload a custom image for this session. Leave empty if no image needed.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Counselor Name */}
            <div className="md:col-span-2">
              <label className="block text-base font-bold text-gray-900 mb-3">
                Counselor Name *
              </label>
              <input
                type="text"
                required
                value={formData.counselor}
                onChange={(e) => updateField('counselor', e.target.value)}
                className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter counselor's full name"
                disabled={isSaving}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-3">
                Category *
              </label>
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => !isSaving && setIsCategoryOpen(!isCategoryOpen)}
                  className={`w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl text-left flex items-center justify-between ${
                    isSaving ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-gray-400'
                  }`}
                  disabled={isSaving}
                >
                  <div className="flex items-center gap-3">
                    {selectedCategory?.icon && (
                      <span className="flex-shrink-0 text-lg">{selectedCategory.icon}</span>
                    )}
                    <span className="font-medium text-gray-800">{selectedCategory?.label || 'Select Category'}</span>
                  </div>
                  {!isSaving && (
                    <FiChevronDown className={`text-gray-500 text-lg transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                {isCategoryOpen && !isSaving && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                    <div className="py-1">
                      {categoryOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleCategorySelect(option.value)}
                          className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm sm:text-base ${
                            formData.category === option.value
                              ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {option.icon && (
                            <span className="flex-shrink-0">{option.icon}</span>
                          )}
                          <span>{option.label}</span>
                          {formData.category === option.value && (
                            <FiCheck className="ml-auto text-indigo-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-3">
                Session Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
                className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl cursor-pointer bg-white"
                disabled={isSaving}
              >
                <option value="Guidance" className="py-2">💬 Guidance Session</option>
                <option value="Counseling" className="py-2">🧠 Individual Counseling</option>
                <option value="Group Session" className="py-2">👥 Group Session</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-3">
                Session Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl"
                disabled={isSaving}
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-3">
                Session Time *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
                className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl"
                disabled={isSaving}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-base font-bold text-gray-900 mb-3">
                Priority Level *
              </label>
              <select
                required
                value={formData.priority}
                onChange={(e) => updateField('priority', e.target.value)}
                className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl cursor-pointer bg-white"
                disabled={isSaving}
              >
                <option value="Low" className="py-2 text-green-700">💚 Low Priority</option>
                <option value="Medium" className="py-2 text-yellow-700">💛 Medium Priority</option>
                <option value="High" className="py-2 text-red-700">🧡 High Priority</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-base font-bold text-gray-900 mb-3">
                Session Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows="4"
                className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl resize-none"
                placeholder="Describe the purpose and focus of this counseling session..."
                disabled={isSaving}
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-base font-bold text-gray-900 mb-3">
                Additional Notes & Observations
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows="4"
                className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl resize-none"
                placeholder="Add any important notes, observations, or follow-up requirements..."
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-full font-bold text-base disabled:opacity-50 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-full font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-3"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  <span>{event ? 'Update Session' : 'Create Session'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </ModernModal>
  );
};

// Team Card Component
const GuidanceTeamCard = ({ team, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Guidance Team</h3>
          <p className="text-gray-500 text-xs">Updated recently</p>
        </div>
<div className="flex items-center gap-1 sm:gap-2">
  <button
    onClick={(e) => {
      e.stopPropagation();
      onView();
    }}
    title="View Team"
    className="px-2.5 py-1 text-xs sm:text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all whitespace-nowrap"
  >
    View
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      onEdit();
    }}
    title="Edit Team"
    className="px-2.5 py-1 text-xs sm:text-sm font-medium rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all whitespace-nowrap"
  >
    Edit
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      onDelete();
    }}
    title="Delete Team"
    className="px-2.5 py-1 text-xs sm:text-sm font-medium rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-all whitespace-nowrap"
  >
    Delete
  </button>
</div>

      </div>
      
      {/* Team Members Preview - Modern Design with Images */}
      <div className="space-y-3 md:space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-[0.15em]">
              Team Members
            </h3>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
          </div>
          
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-full border border-slate-200/60">
            <FiShield className="w-3 h-3 text-emerald-500" />
            <span className="text-xs font-medium text-slate-600">Verified</span>
          </div>
        </div>

<div className="flex flex-col gap-6 w-full py-8">

  {/* --- 1. PATRON SECTION --- */}
  {team.patron && (
    <div className="relative w-full max-w-md mx-auto group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[2rem] blur-xl opacity-50" />
      <div className="relative flex items-center gap-5 p-4 bg-white/80 backdrop-blur-xl rounded-[1.75rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-slate-50/50 shadow-inner">
            {team.patron.image ? (
              <img src={team.patron.image} alt={team.patron.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <FiAward className="text-slate-400 w-7 h-7" />
              </div>
            )}
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-sm"></span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500/80 mb-1">Official Patron</span>
            <h4 className="text-base font-bold text-slate-900 truncate tracking-tight">{team.patron.name}</h4>
            <p className="text-[11px] font-medium text-slate-400 truncate mb-3">{team.patron.title || "Project Lead"}</p>
            <div className="flex items-center gap-2">
              <a href={`tel:${team.patron.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200 active:scale-95 transition-all">
                <FiPhone size={11} /><span className="text-[10px] font-bold">{team.patron.phone}</span>
              </a>
              <a href={`mailto:${team.patron.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 active:bg-slate-50 transition-all">
                <FiMail size={11} /><span className="text-[10px] font-bold">{team.patron.email}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-2 opacity-10"><FiAward size={40} className="rotate-12 text-indigo-900" /></div>
      </div>
    </div>
  )}

  {/* --- 2. MATRON SECTION --- */}
  {team.matron && (
    <div className="relative w-full max-w-md mx-auto group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-[2rem] blur-xl opacity-50" />
      <div className="relative flex items-center gap-5 p-4 bg-white/80 backdrop-blur-xl rounded-[1.75rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-slate-50/50 shadow-inner">
            {team.matron.image ? (
              <img src={team.matron.image} alt={team.matron.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-rose-200">
                <FiUserCheck className="text-rose-400 w-7 h-7" />
              </div>
            )}
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-sm"></span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500/80 mb-1">Matron</span>
            <h4 className="text-base font-bold text-slate-900 truncate tracking-tight">{team.matron.name}</h4>
            <p className="text-[11px] font-medium text-slate-400 truncate mb-3">{team.matron.title || "Department Head"}</p>
            <div className="flex items-center gap-2">
              <a href={`tel:${team.matron.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white shadow-sm shadow-rose-200 active:scale-95 transition-all">
                <FiPhone size={11} /><span className="text-[10px] font-bold">{team.matron.phone}</span>
              </a>
              <a href={`mailto:${team.matron.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 active:bg-slate-50 transition-all">
                <FiMail size={11} /><span className="text-[10px] font-bold">{team.matron.email}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-2 opacity-10"><FiShield size={40} className="rotate-12 text-rose-900" /></div>
      </div>
    </div>
  )}

  {/* --- 3. TEACHER SECTION --- */}
  {team.teacher && (
    <div className="relative w-full max-w-md mx-auto group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-[2rem] blur-xl opacity-50" />
      <div className="relative flex items-center gap-5 p-4 bg-white/80 backdrop-blur-xl rounded-[1.75rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-slate-50/50 shadow-inner">
            {team.teacher.image ? (
              <img src={team.teacher.image} alt={team.teacher.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                <FiBriefcase className="text-blue-400 w-7 h-7" />
              </div>
            )}
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-sm"></span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500/80 mb-1">Guidance Teacher</span>
            <h4 className="text-base font-bold text-slate-900 truncate tracking-tight">{team.teacher.name}</h4>
            <p className="text-[11px] font-medium text-slate-400 truncate mb-3">{team.teacher.title || "Senior Instructor"}</p>
            <div className="flex items-center gap-2">
              <a href={`tel:${team.teacher.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-200 active:scale-95 transition-all">
                <FiPhone size={11} /><span className="text-[10px] font-bold">{team.teacher.phone}</span>
              </a>
              <a href={`mailto:${team.teacher.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 active:bg-slate-50 transition-all">
                <FiMail size={11} /><span className="text-[10px] font-bold">{team.teacher.email}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-2 opacity-10"><FiBriefcase size={40} className="rotate-12 text-blue-900" /></div>
      </div>
    </div>
  )}

  {/* --- 4. ASSISTANT TEACHER SECTION --- */}
  {team.teacher?.assistant && (
    <div className="relative w-full max-w-md mx-auto group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-400/10 to-amber-500/10 rounded-[2rem] blur-xl opacity-50" />
      <div className="relative flex items-center gap-5 p-4 bg-white/80 backdrop-blur-xl rounded-[1.75rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-slate-50/50 shadow-inner">
            {team.teacher.assistant.image ? (
              <img src={team.teacher.assistant.image} alt={team.teacher.assistant.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <FiUserPlus className="text-slate-400 w-7 h-7" />
              </div>
            )}
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-sm"></span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500/80 mb-1">Assistant Teacher</span>
            <h4 className="text-base font-bold text-slate-900 truncate tracking-tight">{team.teacher.assistant.name}</h4>
            <p className="text-[11px] font-medium text-slate-400 truncate mb-3">{team.teacher.assistant.title || "Assistant"}</p>
            <div className="flex items-center gap-2">
              <a href={`tel:${team.teacher.assistant.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white shadow-sm shadow-slate-200 active:scale-95 transition-all">
                <FiPhone size={11} /><span className="text-[10px] font-bold">{team.teacher.assistant.phone}</span>
              </a>
              <a href={`mailto:${team.teacher.assistant.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 active:bg-slate-50 transition-all">
                <FiMail size={11} /><span className="text-[10px] font-bold">{team.teacher.assistant.email}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-2 opacity-10"><FiUserPlus size={40} className="rotate-12 text-slate-900" /></div>
      </div>
    </div>
  )}

</div>
        
        {!team.patron && !team.matron && !team.teacher && (
          <div className="relative group max-w-[300px] mx-auto rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center transition-all duration-500 hover:border-indigo-200 hover:bg-white">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-100/40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-3xl bg-white shadow-sm border border-slate-100 flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-500">
                  <FiUsers className="text-slate-300 w-8 h-8 group-hover:text-indigo-400 transition-colors duration-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-200 border-2 border-white rounded-full" />
              </div>

              <h4 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">
                No Team Assigned
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-8 px-2">
                Start building your team by adding a Patron, Matron, or Teacher to this project.
              </p>

              <button className="px-6 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 shadow-sm hover:shadow-md hover:border-indigo-100 hover:text-indigo-600 transition-all active:scale-95">
                + Add Member
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Guidance Team Modal Component (Create/Edit)
// Guidance Team Modal Component - SIMPLIFIED VERSION (No toggles, no dropdowns)
// Modern Team Member Modal Component
const ModernMemberModal = ({ 
  open, 
  onClose, 
  member = null,
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'teacher',
    title: '',
    phone: '',
    email: '',
    bio: '',
    image: null,
    imagePreview: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form when editing
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        role: member.role || 'teacher',
        title: member.title || '',
        phone: member.phone || '',
        email: member.email || '',
        bio: member.bio || '',
        image: null,
        imagePreview: member.image || '',
      });
    } else {
      // Reset form for new member
      setFormData({
        name: '',
        role: 'teacher',
        title: '',
        phone: '',
        email: '',
        bio: '',
        image: null,
        imagePreview: '',
      });
    }
  }, [member]);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, JPEG)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: e.target.result,
      }));
    };
    reader.readAsDataURL(file);
    
    toast.success('Image uploaded successfully!');
  };
  
  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: '',
    }));
    toast.info('Image removed');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('role', formData.role);
      submitData.append('title', formData.title);
      submitData.append('phone', formData.phone);
      submitData.append('email', formData.email);
      submitData.append('bio', formData.bio);
      
      // Only append image if a new one is uploaded
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      // If editing and image was removed
      if (member && member.image && !formData.imagePreview) {
        submitData.append('removeImage', 'true');
      }
      
      let url = '/api/team-members';
      let method = 'POST';
      
      if (member?.id) {
        url = `/api/team-members/${member.id}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        body: submitData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(member ? 'Member updated successfully!' : 'Member created successfully!');
        onSave();
        onClose();
      } else {
        throw new Error(result.error || 'An error occurred');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!open) return null;
  
  const isEditMode = !!member;
  
  // Role icons and colors
  const roleOptions = [
    { value: 'teacher', label: 'Guidance Teacher', icon: <FiBriefcase />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { value: 'patron', label: 'Patron', icon: <FiAward />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { value: 'matron', label: 'Matron', icon: <FiUserCheck />, color: 'text-pink-600', bgColor: 'bg-pink-100' },
    { value: 'assistant', label: 'Assistant', icon: <FiUserPlus />, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  ];
  
  const selectedRole = roleOptions.find(r => r.value === formData.role) || roleOptions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-all"
          disabled={isLoading}
        >
          <FiX className="w-5 h-5" />
        </button>
        
        {/* Header - Modern Gradient */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${selectedRole.bgColor} ${selectedRole.color}`}>
              {selectedRole.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {isEditMode ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <p className="text-indigo-100 text-sm opacity-90">
                {isEditMode ? 'Update member details' : 'Create a new guidance team member'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload Section - Modern Design */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {formData.imagePreview ? (
                  <div className="relative">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      disabled={isLoading}
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-xl flex flex-col items-center justify-center">
                    <FiUser className="text-gray-400 w-12 h-12 mb-2" />
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                id="memberImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading}
              />
              <label
                htmlFor="memberImage"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl font-medium hover:from-blue-100 hover:to-indigo-100 transition-all cursor-pointer border border-blue-100"
              >
                <FiUpload className="w-4 h-4" />
                {formData.imagePreview ? 'Change Image' : 'Upload Image'}
              </label>
              <p className="text-xs text-gray-500 mt-2">Max 5MB • PNG, JPG, JPEG</p>
            </div>
            
            {/* Form Fields Grid */}
            <div className="space-y-5">
              
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Enter member's full name"
                  disabled={isLoading}
                />
              </div>
              
              {/* Role Selection - Modern Toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Role *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => !isLoading && setFormData(prev => ({ ...prev, role: option.value }))}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        formData.role === option.value
                          ? `${option.bgColor} border-${option.color.split('-')[1]}-300 shadow-sm`
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      disabled={isLoading}
                    >
                      <span className={`text-lg mb-1 ${formData.role === option.value ? option.color : 'text-gray-500'}`}>
                        {option.icon}
                      </span>
                      <span className={`text-xs font-medium ${
                        formData.role === option.value ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                        {option.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Title / Position
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="e.g., Head Counselor, Senior Teacher"
                  disabled={isLoading}
                />
              </div>
              
              {/* Contact Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiPhone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="+123 456 7890"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiMail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="member@school.edu"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              
              {/* Bio/Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Bio / Description
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows="4"
                  className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  placeholder="Brief description about the team member's role, experience, or background..."
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    <span>{isEditMode ? 'Update Member' : 'Create Member'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Modern Team Card Component
const ModernTeamCard = ({ member, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  
  // Role configuration
  const getRoleConfig = (role) => {
    const configs = {
      teacher: {
        icon: <FiBriefcase className="w-4 h-4" />,
        color: 'bg-gradient-to-r from-blue-500 to-blue-600',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-100',
        label: 'Teacher'
      },
      patron: {
        icon: <FiAward className="w-4 h-4" />,
        color: 'bg-gradient-to-r from-purple-500 to-purple-600',
        textColor: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-100',
        label: 'Patron'
      },
      matron: {
        icon: <FiUserCheck className="w-4 h-4" />,
        color: 'bg-gradient-to-r from-pink-500 to-pink-600',
        textColor: 'text-pink-600',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-100',
        label: 'Matron'
      },
      assistant: {
        icon: <FiUserPlus className="w-4 h-4" />,
        color: 'bg-gradient-to-r from-gray-500 to-gray-600',
        textColor: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-100',
        label: 'Assistant'
      }
    };
    return configs[role] || configs.teacher;
  };
  
  const roleConfig = getRoleConfig(member.role);
  
  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Background accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${roleConfig.color}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                {member.image && !imageError ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${roleConfig.bgColor}`}>
                    <div className={`p-2 rounded-full ${roleConfig.bgColor}`}>
                      {roleConfig.icon}
                    </div>
                  </div>
                )}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            
            {/* Name and Role */}
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-lg truncate">{member.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${roleConfig.bgColor} ${roleConfig.textColor} border ${roleConfig.borderColor}`}>
                  {roleConfig.icon}
                  {roleConfig.label}
                </span>
                {member.title && (
                  <span className="text-xs text-gray-500 truncate">• {member.title}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Menu */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <FiEdit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="space-y-3 mb-4">
          {member.phone && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <FiPhone className="text-gray-500 w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-gray-400">Phone</span>
                <p className="font-medium text-gray-800 truncate">{member.phone}</p>
              </div>
            </div>
          )}
          
          {member.email && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <FiMail className="text-gray-500 w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-gray-400">Email</span>
                <p className="font-medium text-gray-800 truncate">{member.email}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Bio Preview */}
        {member.bio && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {member.bio}
            </p>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiCalendar className="w-3 h-3" />
            <span>Added {formatDate(member.createdAt)}</span>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FiPhone className="w-3 h-3" />
                Call
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiMail className="w-3 h-3" />
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



// In your main component, add these states and functions:

// State for members
const [teamMembers, setTeamMembers] = useState([]);
const [membersLoading, setMembersLoading] = useState(true);
const [memberModal, setMemberModal] = useState({
  open: false,
  member: null,
});
const [deleteMemberModal, setDeleteMemberModal] = useState({
  open: false,
  memberId: null,
  memberName: '',
  loading: false,
});

// Fetch team members
const fetchTeamMembers = async () => {
  setMembersLoading(true);
  try {
    const response = await fetch('/api/team-members');
    const result = await response.json();
    
    if (result.success) {
      setTeamMembers(result.members || []);
    } else {
      throw new Error(result.error || 'Failed to fetch team members');
    }
  } catch (error) {
    console.error('Error fetching team members:', error);
    toast.error('Failed to load team members');
    setTeamMembers([]);
  } finally {
    setMembersLoading(false);
  }
};

// Delete member handler
const handleDeleteMember = (member) => {
  setDeleteMemberModal({
    open: true,
    memberId: member.id,
    memberName: member.name,
    loading: false,
  });
};

const confirmDeleteMember = async () => {
  setDeleteMemberModal(prev => ({ ...prev, loading: true }));

  try {
    const response = await fetch(`/api/team-members/${deleteMemberModal.memberId}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    
    if (result.success) {
      await fetchTeamMembers();
      toast.success('Team member deleted successfully!');
      setDeleteMemberModal({ open: false, memberId: null, memberName: '', loading: false });
    } else {
      throw new Error(result.error || 'Error deleting member');
    }
  } catch (error) {
    toast.error(error.message || 'Error deleting member');
    setDeleteMemberModal(prev => ({ ...prev, loading: false }));
  }
};

// Add to useEffect
useEffect(() => {
  fetchEvents();
  fetchTeamMembers(); // Replace fetchTeams with this
}, []);

// Replace the team section in your main component with:
<div className="mb-6">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Guidance Team Members</h2>
      <p className="text-gray-600 text-sm mt-1">Manage school guidance team members</p>
    </div>
    <button
      onClick={() => setMemberModal({ open: true, member: null })}
      className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-base font-bold tracking-tight shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <FiUserPlus className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:-rotate-12" />
      <span className="relative">Add Team Member</span>
    </button>
  </div>
  
  {membersLoading ? (
    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-6">
        <FiUsers className="text-blue-600 w-7 h-7" />
      </div>
      <CircularProgress size={24} className="mb-4" />
      <h3 className="text-lg font-bold text-gray-900 mb-2">Loading Team Members</h3>
      <p className="text-gray-600">Please wait while we fetch team members data</p>
    </div>
  ) : teamMembers.length === 0 ? (
    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl mb-6">
        <FiUsers className="text-gray-400 w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">No Team Members Yet</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        Start building your guidance team by adding patrons, matrons, and guidance teachers.
      </p>
      <button
        onClick={() => setMemberModal({ open: true, member: null })}
        className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition-all"
      >
        <FiUserPlus className="w-5 h-5" />
        Add First Member
      </button>
    </div>
  ) : (
    <>
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
            <FiUsers className="text-blue-500 w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Patrons</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.role === 'patron').length}
              </p>
            </div>
            <FiAward className="text-purple-500 w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-pink-700 uppercase tracking-wider mb-1">Matrons</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.role === 'matron').length}
              </p>
            </div>
            <FiUserCheck className="text-pink-500 w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Teachers</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter(m => m.role === 'teacher').length}
              </p>
            </div>
            <FiBriefcase className="text-gray-600 w-8 h-8" />
          </div>
        </div>
      </div>
      
      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {teamMembers.map((member) => (
          <ModernTeamCard
            key={member.id}
            member={member}
            onEdit={() => setMemberModal({ open: true, member })}
            onDelete={() => handleDeleteMember(member)}
          />
        ))}
      </div>
    </>
  )}
</div>

// Add the modals at the bottom of your main component:
{/* Modern Member Modal */}
<ModernMemberModal
  open={memberModal.open}
  onClose={() => setMemberModal({ open: false, member: null })}
  member={memberModal.member}
  onSave={fetchTeamMembers}
/>

{/* Delete Confirmation Modal for Members */}
<DeleteConfirmationModal
  open={deleteMemberModal.open}
  onClose={() => setDeleteMemberModal({ open: false, memberId: null, memberName: '', loading: false })}
  onConfirm={confirmDeleteMember}
  itemName={deleteMemberModal.memberName}
  loading={deleteMemberModal.loading}
/>
// Main Component
export default function GuidanceCounselingTab() {
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamModal, setTeamModal] = useState({
    open: false,
    mode: 'view', // 'view', 'create', 'edit'
    team: null,
  });
  const [teamDeleteModal, setTeamDeleteModal] = useState({
    open: false,
    teamId: null,
    loading: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    eventId: null,
    eventName: '',
    loading: false
  });

  // Fetch events from API
  const fetchEvents = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await fetch('/api/guidance');
      const result = await response.json();
      
      if (result.success) {
        setEvents(result.events || []);
        if (showRefresh) {
          toast.success('Data refreshed successfully!');
        }
      } else {
        throw new Error(result.error || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load counseling sessions');
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch teams from API
  const fetchTeams = async () => {
    setTeamLoading(true);
    try {
      const response = await fetch('/api/guidanceteam');
      const result = await response.json();
      
      if (result.success) {
        setTeams(result.teams || []);
      } else {
        throw new Error(result.error || 'Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load guidance teams');
      setTeams([]);
    } finally {
      setTeamLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchTeams();
  }, []);

  const handleNewEvent = () => {
    setCurrentEvent(null);
    setIsEditing(true);
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsEditing(true);
  };

  const handleView = (event) => {
    setCurrentEvent(event);
    setIsViewing(true);
  };

  // Event delete handlers
  const handleDelete = (event) => {
    setDeleteModal({
      open: true,
      eventId: event?.id,
      eventName: event?.counselor || 'this session',
      loading: false
    });
  };

  const confirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`/api/guidance/${deleteModal.eventId}`, {
        method: 'DELETE' 
      });
      const result = await response.json();
      
      if (result.success) {
        await fetchEvents();
        toast.success('Counseling session deleted successfully!');
        setDeleteModal({ open: false, eventId: null, eventName: '', loading: false });
      } else {
        throw new Error(result.error || 'Error deleting session');
      }
    } catch (error) {
      toast.error(error.message || 'Error deleting session');
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Team handlers
  const handleCreateTeam = () => {
    setTeamModal({
      open: true,
      mode: 'create',
      team: null,
    });
  };

  const handleViewTeam = (team) => {
    setTeamModal({
      open: true,
      mode: 'view',
      team,
    });
  };

  const handleEditTeam = (team) => {
    setTeamModal({
      open: true,
      mode: 'edit',
      team,
    });
  };

  const handleDeleteTeam = (team) => {
    setTeamDeleteModal({
      open: true,
      teamId: team?.id,
      loading: false,
    });
  };

  const confirmDeleteTeam = async () => {
    setTeamDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`/api/guidanceteam/${teamDeleteModal.teamId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        await fetchTeams();
        toast.success('Guidance team deleted successfully!');
        setTeamDeleteModal({ open: false, teamId: null, loading: false });
      } else {
        throw new Error(result.error || 'Error deleting team');
      }
    } catch (error) {
      toast.error(error.message || 'Error deleting team');
      setTeamDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (!event) return false;
      
      const matchesSearch = 
        (event.counselor?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (event.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (event.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (event.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || event.priority === filterPriority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [events, searchTerm, filterCategory, filterPriority]);

  // Stats for the header
  const stats = {
    total: events.length,
    high: events.filter(e => e?.priority === 'High').length,
    today: events.filter(e => {
      if (!e?.date) return false;
      const eventDate = new Date(e.date);
      const today = new Date();
      return eventDate.toDateString() === today.toDateString();
    }).length
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <CircularProgress size={48} />

          <p className="text-gray-700 text-lg mt-4 font-medium">
            Loading Sessions…
          </p>

          <p className="text-gray-400 text-sm mt-1">
            Please wait while we fetch sessions data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      {/* Delete Confirmation Modals */}
      <DeleteConfirmationModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, eventId: null, eventName: '', loading: false })}
        onConfirm={confirmDelete}
        itemName={deleteModal.eventName}
        loading={deleteModal.loading}
      />
      
      <DeleteConfirmationModal
        open={teamDeleteModal.open}
        onClose={() => setTeamDeleteModal({ open: false, teamId: null, loading: false })}
        onConfirm={confirmDeleteTeam}
        itemName="this guidance team"
        loading={teamDeleteModal.loading}
      />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl">
                <FiMessageCircle className="text-white text-lg w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Guidance & Counseling
                </h1>
                <p className="text-gray-600 mt-1">Manage student counseling sessions and guidance team</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <button
              onClick={() => {
                fetchEvents(true);
                fetchTeams();
              }}
              disabled={refreshing}
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 md:py-3 rounded-full border border-gray-300 font-medium disabled:opacity-50 text-sm md:text-base"
            >
              <FiRotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleNewEvent}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 md:px-4 py-2 md:py-3 rounded-full font-medium text-sm md:text-base"
            >
              <FiPlus className="w-4 h-4" />
              Create Session
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Total Sessions</p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">{stats.total}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <FiMessageCircle className="text-purple-600 text-base w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">High Priority</p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">{stats.high}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <FiAlertTriangle className="text-red-600 text-base w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Today</p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">{stats.today}</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <FiCalendar className="text-emerald-600 text-base w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Teams</p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">{teams.length}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <FiBarChart2 className="text-gray-600 text-base w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Guidance Team Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Guidance Team</h2>
              <p className="text-gray-600 text-sm">Manage school patrons, matrons, and guidance teachers</p>
            </div>
            <button
              onClick={handleCreateTeam}
              className="group relative inline-flex items-center justify-center gap-2 min-w-[44px] md:min-w-[140px] px-4 md:px-6 py-3 md:py-3.5 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white rounded-2xl md:rounded-full text-sm md:text-base font-bold tracking-tight shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.4)] transition-all duration-300 ease-out active:scale-95 active:shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2"
            >
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <FiUserPlus className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:-rotate-12" />
              <span className="relative whitespace-nowrap">Add Team</span>
            </button>
          </div>
          
          {teamLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <CircularProgress size={32} />
              <p className="text-gray-600 mt-4">Loading guidance teams...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <FiUsers className="text-gray-300 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Guidance Team</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create a guidance team to add patrons, matrons, and guidance teachers.
              </p>
              <button
                onClick={handleCreateTeam}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2.5 rounded-full font-medium"
              >
                <FiUserPlus className="w-4 h-4" />
                Create First Team
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team, index) => (
                <GuidanceTeamCard
                  key={team?.id || index}
                  team={team}
                  onView={() => handleViewTeam(team)}
                  onEdit={() => handleEditTeam(team)}
                  onDelete={() => handleDeleteTeam(team)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search counseling sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
              
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              
              <select 
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
              </select>
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterPriority('all');
                }}
                className="inline-flex items-center gap-2 px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
              >
                <FiFilter className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <FiMessageCircle className="text-gray-400 w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Counseling Sessions</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || filterCategory !== 'all' || filterPriority !== 'all' 
                  ? 'No sessions match your current filters. Try adjusting your search criteria.' 
                  : 'Start by creating your first counseling session.'
                }
              </p>
              <button
                onClick={handleNewEvent}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2.5 rounded-full font-medium"
              >
                <FiPlus className="w-4 h-4" />
                Create First Session
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEvents.map((event, index) => (
                <CounselingEventCard 
                  key={event?.id || index}
                  event={event}
                  index={index}
                  onEdit={() => handleEdit(event)}
                  onDelete={() => handleDelete(event)}
                  onView={() => handleView(event)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((event, index) => (
                <div
                  key={event?.id || index}
                  className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer"
                  onClick={() => handleView(event)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        event?.category === 'Academics' ? 'bg-blue-100' :
                        event?.category === 'Drugs' ? 'bg-red-100' :
                        event?.category === 'Relationships' ? 'bg-pink-100' :
                        event?.category === 'Worship' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        {CATEGORY_CONFIG[event?.category]?.icon || <FiMessageCircle className="text-gray-600" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{event?.counselor}</h3>
                        <p className="text-gray-600 text-xs">{event?.description?.length > 60 ? event.description.substring(0, 60) + '...' : event?.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {event?.date ? new Date(event.date).toLocaleDateString() : 'No date'} • {event?.time}
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white mt-1 ${
                        event?.priority === 'High' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                        event?.priority === 'Medium' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                        'bg-gradient-to-r from-emerald-500 to-green-500'
                      }`}>
                        {event?.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Results Count */}
          {filteredEvents.length > 0 && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredEvents.length}</span> of{' '}
                <span className="font-semibold">{events.length}</span> sessions
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isEditing && (
        <GuidanceEditDialog
          event={currentEvent}
          onSave={() => {
            setIsEditing(false);
            setCurrentEvent(null);
            fetchEvents();
          }}
          onCancel={() => {
            setIsEditing(false);
            setCurrentEvent(null);
          }}
        />
      )}

      {isViewing && (
        <ModernSessionDetailModal
          event={currentEvent}
          onClose={() => {
            setIsViewing(false);
            setCurrentEvent(null);
          }}
          onEdit={() => {
            setIsViewing(false);
            setIsEditing(true);
          }}
        />
      )}

      <GuidanceTeamModal
        open={teamModal.open}
        onClose={() => setTeamModal({ open: false, mode: 'view', team: null })}
        mode={teamModal.mode}
        team={teamModal.team}
        onSave={fetchTeams}
      />
    </div>
  );
}