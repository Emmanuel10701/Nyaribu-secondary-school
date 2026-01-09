'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter,
  FiEdit3,
  FiTrash2,
  FiBook,
  FiBarChart2,
  FiUser,
  FiUsers,
  FiAlertTriangle,
  FiMessageCircle,
  FiClock,
  FiCalendar,
  FiSave,
  FiX,
  FiImage,
  FiUpload,
  FiRotateCw,
  FiEye,
  FiChevronRight,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle
} from 'react-icons/fi';
import CircularProgress from "@mui/material/CircularProgress";

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

// View Modal Component
const ViewEventModal = ({ event, onClose, onEdit }) => {
  if (!event) return null;

  const categoryConfig = CATEGORY_CONFIG[event?.category];

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'bg-gradient-to-r from-red-500 to-rose-500',
      Medium: 'bg-gradient-to-r from-amber-500 to-orange-500',
      Low: 'bg-gradient-to-r from-emerald-500 to-green-500'
    };
    return colors[priority] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  return (
    <ModernModal open={true} onClose={onClose}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Session Details</h2>
              <p className="text-blue-100 opacity-90 text-sm">
                {event?.counselor || 'No counselor'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg cursor-pointer">
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[calc(85vh-150px)]">
        <div className="p-4 space-y-4">
          {/* Image */}
          {event.image && (
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={event.image}
                alt={`Counseling session with ${event.counselor}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <FiUser className="text-blue-500" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Counselor</p>
                <p className="text-sm font-bold text-gray-800">{event.counselor}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              {categoryConfig?.icon || <FiMessageCircle className="text-gray-500" />}
              <div>
                <p className="text-xs text-purple-600 font-medium">Category</p>
                <p className="text-sm font-bold text-gray-800">{event.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
              <FiCalendar className="text-emerald-500" />
              <div>
                <p className="text-xs text-emerald-600 font-medium">Date</p>
                <p className="text-sm font-bold text-gray-800">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
              <FiClock className="text-amber-500" />
              <div>
                <p className="text-xs text-amber-600 font-medium">Time</p>
                <p className="text-sm font-bold text-gray-800">{event.time}</p>
              </div>
            </div>
          </div>

          {/* Priority and Type */}
          <div className="flex gap-3">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium">Session Type</p>
              <p className="text-sm font-bold text-gray-800">{event.type}</p>
            </div>
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium">Priority</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(event.priority)}`}>
                {event.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
              {event.description}
            </p>
          </div>

          {/* Notes */}
          {event.notes && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Notes</h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                {event.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-full font-medium"
          >
            <span className="text-sm">Close</span>
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2.5 rounded-full font-medium flex items-center justify-center gap-2"
          >
            <FiEdit3 className="w-4 h-4" />
            <span className="text-sm">Edit Session</span>
          </button>
        </div>
      </div>
    </ModernModal>
  );
};

// Main Component
export default function GuidanceCounselingTab() {
  const [events, setEvents] = useState([]);
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

  useEffect(() => {
    fetchEvents();
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

  // Updated handleDelete function to use modal
  const handleDelete = (event) => {
    setDeleteModal({
      open: true,
      eventId: event?.id,
      eventName: event?.counselor || 'this session',
      loading: false
    });
  };

  // Confirm delete function
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
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, eventId: null, eventName: '', loading: false })}
        onConfirm={confirmDelete}
        itemName={deleteModal.eventName}
        loading={deleteModal.loading}
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
                <p className="text-gray-600 mt-1">Manage student counseling sessions</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <button
              onClick={() => fetchEvents(true)}
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
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">View Mode</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`text-xs px-2 py-1 rounded-full ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`text-xs px-2 py-1 rounded-full ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    List
                  </button>
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <FiBarChart2 className="text-gray-600 text-base w-5 h-5" />
              </div>
            </div>
          </div>
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

      {/* Edit Dialog */}
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

      {/* View Dialog */}
      {isViewing && (
        <ViewEventModal
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
    </div>
  );
}