'use client';
import { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiMail,
  FiPhone,
  FiUser,
  FiAward,
  FiBook,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiX,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiEye,
  FiStar,
  FiShield,
  FiRotateCw,
  FiUpload,
  FiCheck,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
  FiAlertCircle
} from 'react-icons/fi';
import { 
  IoPeopleCircle,
  IoRocketOutline,
  IoSchoolOutline
} from 'react-icons/io5';
import { Modal, Box, Typography, CircularProgress, Alert, Snackbar } from '@mui/material';

// Modern Loading Spinner Component
function ModernLoadingSpinner({ message = "Loading...", size = "medium" }) {
  const sizes = {
    small: { outer: 60, inner: 24 },
    medium: { outer: 100, inner: 40 },
    large: { outer: 120, inner: 48 }
  }

  const { outer, inner } = sizes[size]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="relative">
            <CircularProgress 
              size={outer} 
              thickness={4}
              className="text-orange-600"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`bg-gradient-to-r from-orange-500 to-red-600 rounded-full opacity-20`}
                   style={{ width: inner, height: inner }}></div>
            </div>
          </div>
        </div>
        <div className="mt-8 space-y-2">
          <span className="block text-xl font-semibold text-gray-700 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            {message}
          </span>
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-orange-500 rounded-full" 
                   style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
function DeleteConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  type = 'single',
  count = 1,
  staffName = '',
  loading = false 
}) {
  return (
    <Modal open={open} onClose={loading ? undefined : onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '500px',
        bgcolor: 'background.paper',
        borderRadius: 3, boxShadow: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #fef3f7 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FiAlertTriangle className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Confirm Deletion</h2>
                <p className="text-red-100 opacity-90 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
            {!loading && (
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl cursor-pointer">
                <FiX className="text-xl" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
              <FiAlertTriangle className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {type === 'bulk' 
                  ? `Delete ${count} staff ${count === 1 ? 'member' : 'members'}?`
                  : `Delete "${staffName}"?`
                }
              </h3>
              <p className="text-gray-600">
                {type === 'bulk'
                  ? `You are about to delete ${count} staff ${count === 1 ? 'member' : 'members'}. All associated data will be permanently removed.`
                  : 'This staff member will be permanently deleted. All associated data will be removed.'
                }
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">
                <span className="font-bold">Warning:</span> This action cannot be undone. Please make sure you want to proceed.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            
            <button 
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <CircularProgress size={16} className="text-white" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 />
                  {type === 'bulk' ? `Delete ${count} Staff` : 'Delete Staff Member'}
                </>
              )}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

// Notification Component
function Notification({ 
  open, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  duration = 5000 
}) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (open) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        
        if (elapsed >= duration) {
          clearInterval(interval);
          onClose();
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [open, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          icon: 'text-green-600',
          iconBg: 'bg-green-100',
          progress: 'bg-green-500',
          title: 'text-green-800'
        };
      case 'error':
        return {
          bg: 'from-red-50 to-orange-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          iconBg: 'bg-red-100',
          progress: 'bg-red-500',
          title: 'text-red-800'
        };
      case 'warning':
        return {
          bg: 'from-yellow-50 to-orange-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
          progress: 'bg-yellow-500',
          title: 'text-yellow-800'
        };
      case 'info':
        return {
          bg: 'from-blue-50 to-cyan-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100',
          progress: 'bg-blue-500',
          title: 'text-blue-800'
        };
      default:
        return {
          bg: 'from-gray-50 to-gray-100',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          iconBg: 'bg-gray-100',
          progress: 'bg-gray-500',
          title: 'text-gray-800'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <FiCheckCircle className="text-xl" />;
      case 'error': return <FiAlertCircle className="text-xl" />;
      case 'warning': return <FiAlertTriangle className="text-xl" />;
      case 'info': return <FiInfo className="text-xl" />;
      default: return <FiInfo className="text-xl" />;
    }
  };

  const styles = getTypeStyles();

  if (!open) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md animate-slide-in">
      <div className={`bg-gradient-to-r ${styles.bg} border-2 ${styles.border} rounded-2xl shadow-xl overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 ${styles.iconBg} rounded-xl ${styles.icon}`}>
              {getIcon()}
            </div>
            <div className="flex-1">
              <h4 className={`font-bold ${styles.title} mb-1`}>{title}</h4>
              <p className="text-gray-700 text-sm">{message}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-200 hover:bg-opacity-50 rounded-lg cursor-pointer text-gray-500"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>
        <div className="h-1 bg-gray-200">
          <div 
            className={`h-full ${styles.progress} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// Modern Staff Detail Modal
function ModernStaffDetailModal({ staff, onClose, onEdit }) {
  if (!staff) return null

  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') {
      return '/male.png'; // Default image
    }
    
    // If it's already a full URL or starts with /, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // If it's a base64 string (from file upload), return as is
    if (imagePath.startsWith('data:image')) {
      return imagePath;
    }
    
    // If it's a path from API (without leading slash), add it
    if (imagePath.startsWith('staff/')) {
      return `/${imagePath}`;
    }
    
    // Default fallback
    return '/male.png';
  };

  const imageUrl = getImageUrl(staff.image);

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '95vh', bgcolor: 'background.paper',
        borderRadius: 3, boxShadow: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #fef3f7 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FiEye className="text-xl" />
              </div>
<div className="px-4 py-2 sm:px-0"> 
  {/* text-xl for mobile, scales up to text-2xl on larger screens */}
  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
    Staff Details
  </h2>
  
  {/* text-xs for mobile, scales to text-sm/base later. leading-tight prevents overlap */}
  <p className="text-xs md:text-sm text-orange-100 opacity-90 mt-0.5 md:mt-1 leading-tight">
    Complete overview of staff member
  </p>
</div>            </div>
          <div className="flex items-center gap-2 sm:gap-3">
  {/* Edit Button: Responsive padding and font size */}
  <button 
    onClick={() => onEdit(staff)} 
    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg cursor-pointer whitespace-nowrap"
  >
    <FiEdit className="text-xs sm:text-sm" /> 
    <span>Edit Staff</span>
  </button>

  {/* Close Button: Slightly smaller on mobile */}
  <button 
    onClick={onClose} 
    className="p-2 bg-white/10 text-white rounded-full cursor-pointer flex-shrink-0"
  >
    <FiX className="text-lg sm:text-xl" />
  </button>
</div>
          </div>
        </div>

        <div className="max-h-[calc(95vh-200px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4">
                  <img
                    src={imageUrl}
                    alt={staff.name}
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/male.png';
                    }}
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{staff.name}</h1>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        staff.status === 'active' ? 'bg-green-100 text-green-800' :
                        staff.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {staff.status || 'active'}
                      </span>
                      <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {staff.role}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium">{staff.position}</p>
                  </div>
                </div>
              </div>
<div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-2xl p-5 border border-gray-200 w-full lg:max-w-md shadow-sm">
  <h3 className="text-sm font-semibold text-gray-900 mb-5 flex items-center gap-2 border-b border-orange-100 pb-2">
    <FiBriefcase className="text-orange-600 text-xs" />
    Contact Information
  </h3>

  {/* Grid layout for structured mapping */}
  <div className="grid grid-cols-1 gap-4 text-[13px]">
    
    {/* Department */}
    <div className="flex flex-col">
      <span className="text-gray-400 text-[10px] uppercase tracking-wide">Department</span>
      <span className="text-gray-700 font-medium">{staff.department}</span>
    </div>

    {/* Email */}
    <div className="flex flex-col">
      <span className="text-gray-400 text-[10px] uppercase tracking-wide">Email Address</span>
      <span className="text-gray-700 font-medium break-all leading-tight">{staff.email}</span>
    </div>

    {/* Phone */}
    <div className="flex flex-col">
      <span className="text-gray-400 text-[10px] uppercase tracking-wide">Phone Number</span>
      <span className="text-gray-700 font-medium">{staff.phone}</span>
    </div>

  </div>
</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {staff.bio && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FiUser className="text-blue-600" />
                    Bio
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{staff.bio}</p>
                  </div>
                </div>
              )}

              {staff.expertise && staff.expertise.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FiStar className="text-purple-600" />
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {staff.expertise.map((exp, index) => (
                      <span 
                        key={index} 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-xl text-sm font-bold"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {staff.responsibilities && staff.responsibilities.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiBriefcase className="text-green-600" />
                  Key Responsibilities
                </h3>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <ul className="space-y-2">
                    {staff.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <FiCheck className="text-green-600 mt-1 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {staff.achievements && staff.achievements.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiAward className="text-yellow-600" />
                  Achievements
                </h3>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <ul className="space-y-3">
                    {staff.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-xl">
                          <FiAward className="text-sm" />
                        </div>
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <button 
              onClick={onClose} 
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg cursor-pointer"
            >
              Close
            </button>
            <button 
              onClick={() => onEdit(staff)} 
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg cursor-pointer"
            >
              <FiEdit /> Edit Staff
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

// Modern Staff Card Component
function ModernStaffCard({ staff, onEdit, onDelete, onView, selected, onSelect, actionLoading }) {
  const [imageError, setImageError] = useState(false)

  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') {
      return '/male.png'; // Default image
    }
    
    // If it's already a full URL or starts with /, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // If it's a base64 string (from file upload), return as is
    if (imagePath.startsWith('data:image')) {
      return imagePath;
    }
    
    // If it's a path from API (without leading slash), add it
    if (imagePath.startsWith('staff/')) {
      return `/${imagePath}`;
    }
    
    // Default fallback
    return '/male.png';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const imageUrl = getImageUrl(staff.image);

  return (
<div className={`bg-white rounded-[2rem] shadow-xl border ${
  selected ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-gray-100'
} w-full max-w-md overflow-hidden transition-none`}>
  
  {/* Image Section - Kept exactly as provided */}
  <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
    {!imageError ? (
     <img 
  src={imageUrl} 
  alt={staff.name} 
  onClick={() => onView(staff)}
  className="w-full h-full object-cover object-top cursor-pointer"
  onError={() => setImageError(true)} 
/>

    ) : (
      <div 
        onClick={() => onView(staff)} 
        className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300 cursor-pointer"
      >
        <FiUser className="text-5xl" />
      </div>
    )}

    {/* Overlay: Selection & Status */}
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm pointer-events-auto">
        <input 
          type="checkbox" 
          checked={selected} 
          onChange={(e) => onSelect(staff.id, e.target.checked)}
          className="w-4 h-4 text-orange-600 border-gray-200 rounded-full focus:ring-0 cursor-pointer" 
        />
      </div>
      
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${getStatusColor(staff.status)} pointer-events-auto`}>
        {staff.status || 'active'}
      </span>
    </div>
  </div>

  {/* Information Section - Modernized Mapping */}
  <div className="p-6">
    <div className="mb-6">
      <h3 
        onClick={() => onView(staff)} 
        className="text-2xl font-black text-slate-900 leading-tight cursor-pointer truncate"
      >
        {staff.name}
      </h3>
      {/* Email Mapping: Subtle and clean */}
      <p className="text-sm font-medium text-slate-400 mt-1 truncate">
        {staff.email || 'no-email@company.com'}
      </p>
    </div>
    
    {/* Grid Info Mapping: Optimized for mobile viewing */}
    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
      {/* Department Mapping */}
      <div className="space-y-1">
        <span className="block text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Department</span>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
           <span className="text-xs font-bold text-slate-700 truncate">{staff.department}</span>
        </div>
      </div>
      
      {/* Role Mapping */}
      <div className="space-y-1">
        <span className="block text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Role</span>
        <span className="text-xs font-bold text-slate-700 truncate block">{staff.role}</span>
      </div>

      {/* Position Mapping: Full width modern box */}
      <div className="col-span-2 p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100/50">
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em]">Phone Number</span>
          <span className="text-xs font-bold text-slate-800 truncate">{staff.phone}</span>
        </div>
        <FiBriefcase className="text-slate-300 text-lg shrink-0 ml-2" />
      </div>
    </div>

    {/* Modern Action Bar: No-hover, mobile-ready buttons */}
    <div className="flex items-center gap-3">
      <button 
        onClick={() => onView(staff)} 
        className="px-5 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-none active:bg-slate-200"
      >
        View
      </button>
      
      <button 
        onClick={() => onEdit(staff)} 
        disabled={actionLoading}
        className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-50 transition-none active:scale-[0.98]"
      >
        Edit Staff
      </button>
      
      <button 
        onClick={() => onDelete(staff)} 
        disabled={actionLoading}
        className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 disabled:opacity-50 transition-none active:bg-red-100"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  </div>
</div>



)
}

// Modern Staff Modal Component
function ModernStaffModal({ onClose, onSave, staff, loading }) {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    role: staff?.role || 'Teacher',
    position: staff?.position || '',
    department: staff?.department || 'Sciences',
    email: staff?.email || '',
    phone: staff?.phone || '',
    image: staff?.image || '/male.png',
    bio: staff?.bio || '',
    responsibilities: Array.isArray(staff?.responsibilities) ? staff.responsibilities : [],
    expertise: Array.isArray(staff?.expertise) ? staff.expertise : [],
    achievements: Array.isArray(staff?.achievements) ? staff.achievements : [],
    status: staff?.status || 'active'
  });

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(staff?.image || '/male.png')
  const [newResponsibility, setNewResponsibility] = useState('')
  const [newExpertise, setNewExpertise] = useState('')
  const [newAchievement, setNewAchievement] = useState('')

  const roles = ['Principal', 'Deputy Principal', 'Teacher', 'BOM Member', 'Support Staff', 'Librarian', 'Counselor'];
  const departments = ['Sciences', 'Mathematics', 'Languages', 'Humanities', 'Administration', 'Sports', 'Guidance'];

  useEffect(() => {
    if (staff) {
      // Get the correct image URL for preview
      const getPreviewUrl = (imgPath) => {
        if (!imgPath || typeof imgPath !== 'string') return '/male.png';
        if (imgPath.startsWith('/') || imgPath.startsWith('http') || imgPath.startsWith('data:image')) {
          return imgPath;
        }
        if (imgPath.startsWith('staff/')) {
          return `/${imgPath}`;
        }
        return '/male.png';
      };
      
      setImagePreview(getPreviewUrl(staff.image));
      setFormData(prev => ({
        ...prev,
        image: staff.image || '/male.png'
      }));
    }
  }, [staff]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target.result;
        setImagePreview(previewUrl);
        setFormData(prev => ({ ...prev, image: '' })); // Clear image path when uploading file
      };
      reader.readAsDataURL(file);
    }
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility('');
    }
  };

  const addExpertise = () => {
    if (newExpertise.trim()) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare form data
    const submitData = new FormData();
    
    submitData.append('name', formData.name);
    submitData.append('role', formData.role);
    submitData.append('position', formData.position);
    submitData.append('department', formData.department);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('bio', formData.bio);
    submitData.append('status', formData.status);
    
    submitData.append('responsibilities', JSON.stringify(formData.responsibilities));
    submitData.append('expertise', JSON.stringify(formData.expertise));
    submitData.append('achievements', JSON.stringify(formData.achievements));
    
    // Handle image
    if (imageFile) {
      // Upload new file
      submitData.append('image', imageFile);
    } else if (formData.image === '/male.png' || formData.image === '/female.png') {
      // Using default avatar - don't send image (backend will use default logic)
      submitData.append('image', '');
    } else if (formData.image) {
      // If image is already a path from API, we might need to handle differently
      // For now, don't send it (assuming backend will keep existing)
    }
    
    await onSave(submitData, staff?.id);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '95vh', bgcolor: 'background.paper',
        borderRadius: 3, boxShadow: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #fef3f7 100%)'
      }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FiUser className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{staff ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
                <p className="text-orange-100 opacity-90 mt-1">
                  Manage staff member information
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl cursor-pointer">
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(95vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-xl border border-orange-200">
                    <FiUpload className="text-orange-600 text-lg" /> 
                    Profile Image
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/male.png';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <div className="px-4 py-3 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center gap-2 bg-gray-50">
                            <FiUpload className="text-orange-500" />
                            <span className="text-sm font-bold text-gray-700">
                              {imageFile ? 'Change Image' : 'Upload Image'}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Avatar Selection */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2 font-medium">Or select a default avatar:</p>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('/male.png');
                            setFormData(prev => ({ ...prev, image: '/male.png' }));
                          }}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 ${
                            formData.image === '/male.png'
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <img
                            src="/male.png"
                            alt="Male Avatar"
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <span className="text-xs font-bold text-gray-700">Male Avatar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('/female.png');
                            setFormData(prev => ({ ...prev, image: '/female.png' }));
                          }}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 ${
                            formData.image === '/female.png'
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <img
                            src="/female.png"
                            alt="Female Avatar"
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <span className="text-xs font-bold text-gray-700">Female Avatar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200">
                    <FiUser className="text-blue-600 text-lg" /> 
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Role and Position */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Role *</label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Position</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => handleChange('position', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                      placeholder="e.g., Mathematics Teacher"
                    />
                  </div>
                </div>

                {/* Department and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Department *</label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                    >
                      <option value="active">Active</option>
                      <option value="on-leave">On Leave</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                    <FiMail className="text-green-600 text-lg" /> 
                    Contact Information
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                        placeholder="staff@katwanyaa.ac.ke"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                    <FiBook className="text-purple-600 text-lg" /> 
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                    placeholder="Brief biography about the staff member"
                  />
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Responsibilities</label>
                  <div className="space-y-2">
                    {formData.responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                          {resp}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('responsibilities', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FiX className="text-sm" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newResponsibility}
                        onChange={(e) => setNewResponsibility(e.target.value)}
                        placeholder="Enter responsibility"
                        className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                      />
                      <button
                        type="button"
                        onClick={addResponsibility}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expertise and Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expertise */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Expertise</label>
                <div className="space-y-2">
                  {formData.expertise.map((exp, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                        {exp}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('expertise', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FiX className="text-sm" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      placeholder="Enter expertise"
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                    />
                    <button
                      type="button"
                      onClick={addExpertise}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">Achievements</label>
                <div className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                        {achievement}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('achievements', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FiX className="text-sm" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Enter achievement"
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    />
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button 
                type="button"
                onClick={onClose}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg cursor-pointer"
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <CircularProgress size={16} className="text-white" />
                    {staff ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FiCheck />
                    {staff ? 'Update Staff' : 'Create Staff'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  )
}

// Main Staff Manager Component
export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [stats, setStats] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  
  // New states for delete confirmation and notification
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState('single'); // 'single' or 'bulk'
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    title: '',
    message: ''
  });

  const roles = ['Principal', 'Deputy Principal', 'Teacher', 'BOM Member', 'Support Staff', 'Librarian', 'Counselor'];
  const departments = ['Sciences', 'Mathematics', 'Languages', 'Humanities', 'Administration', 'Sports', 'Guidance'];

  // Fetch staff from API
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/staff');
      const data = await response.json();
      
      if (data.success) {
        setStaff(data.staff || []);
        setFilteredStaff(data.staff || []);
      } else {
        console.error('Failed to fetch staff:', data.error);
        setStaff([]);
        setFilteredStaff([]);
        showNotification('error', 'Fetch Failed', 'Failed to fetch staff data');
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaff([]);
      setFilteredStaff([]);
      showNotification('error', 'Error', 'Error fetching staff data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filtering and pagination
  useEffect(() => {
    let filtered = staff;

    if (searchTerm) {
      filtered = filtered.filter(staffMember =>
        staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staffMember.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(staffMember => staffMember.department === selectedDepartment);
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(staffMember => staffMember.role === selectedRole);
    }

    setFilteredStaff(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedRole, staff]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Notification handler
  const showNotification = (type, title, message) => {
    setNotification({
      open: true,
      type,
      title,
      message
    });
  };

  // CRUD Operations
  const handleCreate = () => {
    setEditingStaff(null);
    setShowModal(true);
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setShowModal(true);
  };

  const handleViewDetails = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDetailModal(true);
  };

  // Single delete handler
  const handleDelete = (staffMember) => {
    setStaffToDelete(staffMember);
    setDeleteType('single');
    setShowDeleteModal(true);
  };

  // Bulk delete handler
  const handleBulkDelete = () => {
    if (selectedPosts.size === 0) {
      showNotification('warning', 'No Selection', 'No staff members selected for deletion');
      return;
    }
    setDeleteType('bulk');
    setShowDeleteModal(true);
  };

  // Confirm delete (for both single and bulk)
  const confirmDelete = async () => {
    try {
      if (deleteType === 'single' && staffToDelete) {
        setBulkDeleting(true);
        const response = await fetch(`/api/staff/${staffToDelete.id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          await fetchStaff();
          showNotification('success', 'Deleted', `Staff member "${staffToDelete.name}" deleted successfully!`);
        } else {
          showNotification('error', 'Delete Failed', result.error || 'Failed to delete staff member');
        }
      } else if (deleteType === 'bulk') {
        setBulkDeleting(true);
        const deletedIds = [];
        const failedIds = [];
        
        // Delete each selected staff member
        for (const staffId of selectedPosts) {
          try {
            const response = await fetch(`/api/staff/${staffId}`, {
              method: 'DELETE',
            });
            
            const result = await response.json();
            
            if (result.success) {
              deletedIds.push(staffId);
            } else {
              console.error(`Failed to delete staff member ${staffId}:`, result.error);
              failedIds.push(staffId);
            }
          } catch (error) {
            console.error(`Error deleting staff member ${staffId}:`, error);
            failedIds.push(staffId);
          }
        }
        
        // Refresh the staff list
        await fetchStaff();
        
        // Clear selection
        setSelectedPosts(new Set());
        
        // Show appropriate notification
        if (deletedIds.length > 0 && failedIds.length === 0) {
          showNotification('success', 'Bulk Delete Successful', `Successfully deleted ${deletedIds.length} staff member(s)`);
        } else if (deletedIds.length > 0 && failedIds.length > 0) {
          showNotification('warning', 'Partial Success', `Deleted ${deletedIds.length} staff member(s), failed to delete ${failedIds.length}`);
        } else {
          showNotification('error', 'Delete Failed', 'Failed to delete selected staff members');
        }
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      showNotification('error', 'Error', 'Error during deletion');
    } finally {
      setBulkDeleting(false);
      setShowDeleteModal(false);
      setStaffToDelete(null);
    }
  };

  const handlePostSelect = (staffId, selected) => {
    setSelectedPosts(prev => { 
      const newSet = new Set(prev); 
      selected ? newSet.add(staffId) : newSet.delete(staffId); 
      return newSet 
    })
  }

  const handleSubmit = async (formData, id) => {
    setSaving(true);
    try {
      let response;
      if (id) {
        response = await fetch(`/api/staff/${id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        response = await fetch('/api/staff', {
          method: 'POST',
          body: formData,
        });
      }

      const result = await response.json();

      if (result.success) {
        await fetchStaff();
        setShowModal(false);
        showNotification('success', id ? 'Updated' : 'Created', `Staff member ${id ? 'updated' : 'created'} successfully!`);
      } else {
        showNotification('error', 'Save Failed', result.error || `Failed to ${id ? 'update' : 'create'} staff member`);
      }
    } catch (error) {
      console.error('Error saving staff member:', error);
      showNotification('error', 'Error', 'Error saving staff member');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const calculatedStats = {
      total: staff.length,
      teaching: staff.filter(s => s.role === 'Teacher').length,
      administration: staff.filter(s => s.role === 'Principal' || s.role === 'Deputy Principal').length,
      bom: staff.filter(s => s.role === 'BOM Member').length,
      active: staff.filter(s => s.status === 'active').length,
      onLeave: staff.filter(s => s.status === 'on-leave').length,
    };
    setStats(calculatedStats);
  }, [staff]);

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-700 font-medium">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStaff.length)} of {filteredStaff.length} staff members
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FiChevronLeft className="text-lg" />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => 
            page === 1 || 
            page === totalPages || 
            (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, index, array) => (
            <div key={page} className="flex items-center">
              {index > 0 && array[index - 1] !== page - 1 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => paginate(page)}
                className={`px-3 py-2 rounded-xl font-bold ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'text-gray-700'
                }`}
              >
                {page}
              </button>
            </div>
          ))
        }

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FiChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  );

  if (loading && staff.length === 0) return <ModernLoadingSpinner message="Loading staff data..." size="medium" />

  return (
    <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
      {/* Custom Notification */}
      <Notification
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => !bulkDeleting && setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        type={deleteType}
        count={deleteType === 'bulk' ? selectedPosts.size : 1}
        staffName={deleteType === 'single' ? staffToDelete?.name : ''}
        loading={bulkDeleting}
      />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg border border-orange-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Staff & BOM Management</h1>
            <p className="text-gray-600 text-sm lg:text-base">Manage teaching staff, administration, and board members</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={fetchStaff} className="flex items-center gap-2 bg-gray-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-bold shadow-lg cursor-pointer text-sm">
              <FiRotateCw className={`text-xs ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={handleCreate} className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-bold shadow-lg cursor-pointer text-sm">
              <FiPlus className="text-xs" /> Add Staff
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Total Staff</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <FiUser className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Teaching Staff</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.teaching}</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <FiBook className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Administration</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.administration}</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                <FiAward className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">BOM Members</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.bom}</p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                <FiShield className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Active</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                <FiCheckCircle className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">On Leave</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.onLeave}</p>
              </div>
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl">
                <FiCalendar className="text-lg" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff members by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-gray-50"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions - Only shows when items are selected */}
      {selectedPosts.size > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                <FiTrash2 className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-lg">
                  {selectedPosts.size} staff {selectedPosts.size === 1 ? 'member' : 'members'} selected
                </h3>
                <p className="text-red-700 text-sm">
                  You can perform bulk actions on selected items
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedPosts(new Set())}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg cursor-pointer text-sm"
              >
                Clear Selection
              </button>
              <button 
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2 text-sm"
              >
                {bulkDeleting ? (
                  <>
                    <CircularProgress size={16} className="text-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete Selected ({selectedPosts.size})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {currentStaff.map((staffMember) => (
          <ModernStaffCard 
            key={staffMember.id} 
            staff={staffMember} 
            onEdit={handleEdit} 
            onDelete={() => handleDelete(staffMember)} 
            onView={handleViewDetails} 
            selected={selectedPosts.has(staffMember.id)} 
            onSelect={handlePostSelect} 
            actionLoading={saving}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentStaff.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
          <FiUser className="text-4xl lg:text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No staff members found' : 'No staff members available'}
          </h3>
          <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first staff member'}
          </p>
          <button 
            onClick={handleCreate} 
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 mx-auto text-sm lg:text-base cursor-pointer"
          >
            <FiPlus /> Add Your First Staff Member
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredStaff.length > 0 && (
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200">
          <Pagination />
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <ModernStaffModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSubmit} 
          staff={editingStaff} 
          loading={saving} 
        />
      )}
      {showDetailModal && selectedStaff && (
        <ModernStaffDetailModal 
          staff={selectedStaff} 
          onClose={() => setShowDetailModal(false)} 
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}