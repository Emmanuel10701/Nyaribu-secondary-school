'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiFilter,
  FiDownload,
  FiEye,
  FiX,
  FiClock,
  FiBarChart2,
  FiUsers,
  FiPaperclip,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiSave,
  FiUpload,
  FiBook,
  FiCalendar,
  FiFileText,
  FiLink,
  FiAward,
  FiMessageSquare,
  FiRotateCw,
  FiFolder,
  FiVideo,
  FiImage,
  FiStar, 
  FiMusic,
  FiFile,
  FiGlobe,
  FiShield,
  FiUser,
  FiCheck,
  FiArchive,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

// Material-UI Components
import CircularProgress from '@mui/material/CircularProgress';
import { Modal, Box, TextField, TextareaAutosize, Chip, Tooltip, Button } from '@mui/material';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ==========================================
// 1. ENHANCED CONFIGURATION
// ==========================================

const RESOURCE_TYPES = [
  { id: 'all', label: 'All Types', color: 'gray', icon: <FiFolder className="text-gray-500" /> },
  { id: 'document', label: 'Document', color: 'blue', icon: <FiFileText className="text-blue-500" /> },
  { id: 'pdf', label: 'PDF', color: 'red', icon: <FiFileText className="text-red-500" /> },
  { id: 'video', label: 'Video', color: 'purple', icon: <FiVideo className="text-purple-500" /> },
  { id: 'presentation', label: 'Presentation', color: 'orange', icon: <FiBarChart2 className="text-orange-500" /> },
  { id: 'worksheet', label: 'Worksheet', color: 'emerald', icon: <FiFile className="text-emerald-500" /> },
  { id: 'audio', label: 'Audio', color: 'indigo', icon: <FiMusic className="text-indigo-500" /> },
  { id: 'image', label: 'Image', color: 'pink', icon: <FiImage className="text-pink-500" /> },
  { id: 'archive', label: 'Archive', color: 'gray', icon: <FiArchive className="text-gray-500" /> }
];

const ACCESS_LEVELS = [
  { id: 'all', label: 'All Access', color: 'gray', icon: <FiUsers className="text-gray-500" /> },
  { id: 'student', label: 'Student', color: 'blue', icon: <FiUser className="text-blue-500" /> },
  { id: 'teacher', label: 'Teacher', color: 'green', icon: <FiUsers className="text-green-500" /> },
  { id: 'admin', label: 'Admin', color: 'purple', icon: <FiShield className="text-purple-500" /> }
];

const CATEGORIES = [
  'General', 'Lesson Notes', 'Past Papers', 'Reference Materials', 'Study Guides',
  'Worksheets', 'Presentations', 'Videos', 'Audio Resources', 'Other'
];

const SUBJECTS = [
  'Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Science', 'Computer Studies', 'Business Studies'
];

const CLASSES = [
 'Form 1', 'Form 2', 'Form 3', 'Form 4'
];

const ITEMS_PER_PAGE = 10;

// ==========================================
// 2. UTILITY FUNCTIONS
// ==========================================

const getBadgeColorStyles = (colorName) => {
  const map = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  return map[colorName] || map.slate;
};

const getFileIcon = (fileName) => {
  if (!fileName) return <FiFile className="text-gray-600" />;
  
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf':
      return <FiFileText className="text-red-500" />;
    case 'doc':
    case 'docx':
      return <FiFileText className="text-blue-500" />;
    case 'ppt':
    case 'pptx':
      return <FiBarChart2 className="text-orange-500" />;
    case 'xls':
    case 'xlsx':
      return <FiBarChart2 className="text-green-500" />;
    case 'mp4':
    case 'mov':
    case 'avi':
      return <FiVideo className="text-purple-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FiImage className="text-pink-500" />;
    case 'mp3':
    case 'wav':
      return <FiMusic className="text-indigo-500" />;
    case 'zip':
    case 'rar':
      return <FiArchive className="text-gray-500" />;
    default:
      return <FiFile className="text-gray-600" />;
  }
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// ==========================================
// 3. SUB-COMPONENTS
// ==========================================

const Badge = ({ children, color = 'slate', className = '', icon }) => (
  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getBadgeColorStyles(color)} ${className}`}>
    {icon}
    {children}
  </span>
);

const StatsPill = ({ icon, value, label, color = 'blue' }) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200/50">
    <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
      {icon}
    </div>
    <div className="text-center">
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  </div>
);

const FilterDropdown = ({ label, value, options, onChange, icon, isOpen, setIsOpen }) => (
  <div className="relative">
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700"
    >
      {icon}
      {label}: {options.find(opt => opt.id === value)?.label || 'All'}
      {isOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
    </button>
    
    {isOpen && (
      <div className="absolute z-10 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
        <div className="max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-left ${
                value === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              {option.icon}
              <span className="text-sm">{option.label}</span>
              {value === option.id && <FiCheck className="ml-auto text-blue-600" />}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ResourceCard = ({ resource, onEdit, onView, onDelete, onDownload }) => {
  const resourceType = RESOURCE_TYPES.find(t => t.id === resource.type) || RESOURCE_TYPES[0];
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden flex flex-col h-full">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
            {resourceType.icon}
          </div>
          <Badge color={resourceType.color} icon={resourceType.icon}>
            {resourceType.label}
          </Badge>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {resource.description || 'No description available'}
        </p>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiBook className="text-blue-500" />
            <span className="font-medium">{resource.subject}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiFolder className="text-purple-500" />
            <span className="font-medium">{resource.className}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiFile className="text-emerald-500" />
            <span className="font-medium">{resource.fileSize || formatFileSize(resource.size)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiDownload className="text-orange-500" />
            <span className="font-medium">{resource.downloads || 0} downloads</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
            <FiUser className="text-gray-400" />
            Uploaded by: {resource.uploadedBy || 'System'}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiCalendar className="text-gray-400" />
            {formatDate(resource.createdAt)}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0 border-t border-gray-200/50">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onView(resource)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm font-semibold"
          >
            <FiEye /> View
          </button>
          <button
            onClick={() => onDownload(resource)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold"
          >
            <FiDownload /> Download
          </button>
          <button
            onClick={() => onEdit(resource)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-sm font-semibold"
          >
            <FiEdit /> Edit
          </button>
          <button
            onClick={() => onDelete(resource)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100 text-red-700 text-sm font-semibold"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN COMPONENT
// ==========================================

export default function ResourcesManager() {
  // State
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewResource, setViewResource] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    className: '',
    description: '',
    category: 'General',
    accessLevel: 'student',
    uploadedBy: '',
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Filter dropdown states
  const [typeOpen, setTypeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);

  // API Integration
  const fetchResources = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_BASE_URL}/api/resources`);
      const data = await response.json();
      
      if (data.success) {
        const allResources = data.resources || [];
        
        // Apply local filtering
        let filtered = allResources;
        
        if (searchTerm) {
          filtered = filtered.filter(resource =>
            resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (selectedType !== 'all') {
          filtered = filtered.filter(resource => resource.type === selectedType);
        }
        
        if (selectedCategory !== 'all') {
          filtered = filtered.filter(resource => resource.category === selectedCategory);
        }
        
        if (selectedSubject !== 'all') {
          filtered = filtered.filter(resource => resource.subject === selectedSubject);
        }
        
        if (selectedClass !== 'all') {
          filtered = filtered.filter(resource => resource.className === selectedClass);
        }
        
        if (selectedAccessLevel !== 'all') {
          filtered = filtered.filter(resource => resource.accessLevel === selectedAccessLevel);
        }
        
        setResources(allResources);
        setFilteredResources(filtered);
      } else {
        throw new Error(data.error || 'Failed to fetch resources');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources([]);
      setFilteredResources([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchResource = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/${id}`);
      const data = await response.json();
      
      if (data.success) {
        return data.resource;
      } else {
        throw new Error(data.error || 'Failed to fetch resource');
      }
    } catch (error) {
      console.error('Error fetching resource:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Apply filters when filter states change
  useEffect(() => {
    let filtered = resources;
    
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }
    
    if (selectedClass !== 'all') {
      filtered = filtered.filter(resource => resource.className === selectedClass);
    }
    
    if (selectedAccessLevel !== 'all') {
      filtered = filtered.filter(resource => resource.accessLevel === selectedAccessLevel);
    }
    
    setFilteredResources(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [resources, searchTerm, selectedType, selectedCategory, selectedSubject, selectedClass, selectedAccessLevel]);

  // Stats
  const stats = useMemo(() => [
    { 
      icon: <FiFolder className="text-blue-600 text-xl" />, 
      value: resources.length, 
      label: 'Total Resources',
      color: 'blue'
    },
    { 
      icon: <FiVideo className="text-purple-600 text-xl" />, 
      value: resources.filter(r => r.type === 'video').length, 
      label: 'Videos',
      color: 'purple'
    },
    { 
      icon: <FiFileText className="text-red-600 text-xl" />, 
      value: resources.filter(r => r.type === 'pdf').length, 
      label: 'PDFs',
      color: 'red'
    },
    { 
      icon: <FiUsers className="text-green-600 text-xl" />, 
      value: resources.filter(r => r.accessLevel === 'student').length, 
      label: 'Student Access',
      color: 'green'
    }
  ], [resources]);

  // Handlers
  const clearFilters = () => {
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedSubject('all');
    setSelectedClass('all');
    setSelectedAccessLevel('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      subject: '',
      className: '',
      description: '',
      category: 'General',
      accessLevel: 'student',
      uploadedBy: 'Admin',
      isActive: true
    });
    setSelectedFile(null);
    setEditingResource(null);
    setShowModal(true);
  };

  const handleEdit = async (resource) => {
    try {
      const fullResource = await fetchResource(resource.id);
      if (fullResource) {
        setFormData({
          title: fullResource.title,
          subject: fullResource.subject,
          className: fullResource.className,
          description: fullResource.description,
          category: fullResource.category,
          accessLevel: fullResource.accessLevel,
          uploadedBy: fullResource.uploadedBy,
          isActive: fullResource.isActive
        });
        setSelectedFile(null);
        setEditingResource(fullResource);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Failed to load resource details:', error);
    }
  };

  const handleView = async (resource) => {
    try {
      const fullResource = await fetchResource(resource.id);
      if (fullResource) {
        setViewResource(fullResource);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Failed to load resource details:', error);
    }
  };

  const handleDelete = (resource) => {
    setResourceToDelete(resource);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/${resourceToDelete.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchResources();
      } else {
        throw new Error(data.error || 'Failed to delete resource');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    } finally {
      setShowDeleteConfirm(false);
      setResourceToDelete(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.subject || !formData.className) {
      console.error('Title, subject, and class are required');
      return;
    }
    
    if (!selectedFile && !editingResource) {
      console.error('Please select a file to upload');
      return;
    }

    setSaving(true);
    setUploading(true);

    try {
      const submitData = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Add file if selected
      if (selectedFile) {
        submitData.append('file', selectedFile);
      }

      let response;
      let url;
      
      if (editingResource) {
        url = `${API_BASE_URL}/api/resources/${editingResource.id}`;
        response = await fetch(url, {
          method: 'PUT',
          body: submitData,
        });
      } else {
        url = `${API_BASE_URL}/api/resources`;
        response = await fetch(url, {
          method: 'POST',
          body: submitData,
        });
      }

      const data = await response.json();

      if (data.success) {
        await fetchResources();
        setShowModal(false);
        setSelectedFile(null);
      } else {
        throw new Error(data.error || data.details);
      }
    } catch (error) {
      console.error('Error saving resource:', error);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const downloadResource = async (resource) => {
    try {
      const response = await fetch(resource.fileUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = resource.fileName || resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const Pagination = () => {
    const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <p className="text-sm text-gray-600">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredResources.length)} of {filteredResources.length} resources
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
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
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg font-semibold ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                      : 'text-gray-700'
                  }`}
                >
                  {page}
                </button>
              </div>
            ))
          }

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      </div>
    );
  };

  if (loading && resources.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Resources</h2>
          <p className="text-gray-600">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200/50 sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold">
                NSS
              </div>
              <div className="hidden sm:block">
                <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  Resources Manager
                </span>
                <p className="text-xs text-gray-500 mt-0.5">Manage educational resources</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => fetchResources(true)}
              disabled={refreshing}
              className="p-2 sm:p-3 text-gray-600 rounded-xl"
              title="Refresh"
            >
              <FiRotateCw className={`${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={handleCreate}
              className="hidden sm:flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold"
            >
              <FiPlus /> New Resource
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Search and Filters Bar - TOP SECTION */}
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 text-base sm:text-lg" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resources by title, description..."
                  className="block w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl sm:rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm sm:text-base"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
            
            <button
              onClick={handleCreate}
              className="sm:hidden w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <FiPlus /> New Resource
            </button>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Resource Type Filter */}
              <FilterDropdown
                label="Type"
                value={selectedType}
                options={RESOURCE_TYPES}
                onChange={setSelectedType}
                icon={<FiFolder className="text-blue-500" />}
                isOpen={typeOpen}
                setIsOpen={setTypeOpen}
              />

              {/* Category Filter */}
              <FilterDropdown
                label="Category"
                value={selectedCategory}
                options={[
                  { id: 'all', label: 'All Categories', icon: <FiBook className="text-gray-500" /> },
                  ...CATEGORIES.map(cat => ({
                    id: cat,
                    label: cat,
                    icon: <FiBook className="text-blue-500" />
                  }))
                ]}
                onChange={setSelectedCategory}
                icon={<FiBook className="text-blue-500" />}
                isOpen={categoryOpen}
                setIsOpen={setCategoryOpen}
              />

              {/* Subject Filter */}
              <FilterDropdown
                label="Subject"
                value={selectedSubject}
                options={[
                  { id: 'all', label: 'All Subjects', icon: <FiBook className="text-gray-500" /> },
                  ...SUBJECTS.map(sub => ({
                    id: sub,
                    label: sub,
                    icon: <FiBook className="text-green-500" />
                  }))
                ]}
                onChange={setSelectedSubject}
                icon={<FiBook className="text-green-500" />}
                isOpen={subjectOpen}
                setIsOpen={setSubjectOpen}
              />

              {/* Class Filter */}
              <FilterDropdown
                label="Class"
                value={selectedClass}
                options={[
                  { id: 'all', label: 'All Classes', icon: <FiFolder className="text-gray-500" /> },
                  ...CLASSES.map(cls => ({
                    id: cls,
                    label: cls,
                    icon: <FiFolder className="text-purple-500" />
                  }))
                ]}
                onChange={setSelectedClass}
                icon={<FiFolder className="text-purple-500" />}
                isOpen={classOpen}
                setIsOpen={setClassOpen}
              />

              {/* Access Level Filter */}
              <FilterDropdown
                label="Access"
                value={selectedAccessLevel}
                options={ACCESS_LEVELS}
                onChange={setSelectedAccessLevel}
                icon={<FiShield className="text-blue-500" />}
                isOpen={accessOpen}
                setIsOpen={setAccessOpen}
              />
            </div>

            {/* Clear Filters Button */}
            {(selectedType !== 'all' || selectedCategory !== 'all' || selectedSubject !== 'all' || selectedClass !== 'all' || selectedAccessLevel !== 'all' || searchTerm) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 text-red-600 rounded-xl text-sm font-semibold"
              >
                <FiX /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main>
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                Learning Resources Manager
              </h1>
              <p className="text-gray-600 text-sm sm:text-lg">
                {loading ? 'Loading resources...' : `Showing ${filteredResources.length} educational resources`}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <StatsPill
                key={index}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                color={stat.color}
              />
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200/50 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/50 p-8 sm:p-12 text-center">
              <FiFolder className="text-4xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                    onDownload={downloadResource}
                  />
                ))}
              </div>

              {/* Pagination */}
              {filteredResources.length > ITEMS_PER_PAGE && (
                <div className="mt-8 pt-6 border-t border-gray-200/50">
                  <Pagination />
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200/50 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-emerald-50 px-6 py-3 rounded-full border border-blue-200 mb-4">
              <FiStar className="text-blue-600" />
              <span className="font-semibold text-blue-700">Soaring for Excellence in Education</span>
            </div>
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Nyaribu Secondary School • Resources Manager v2.0
            </p>
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal open={true} onClose={() => setShowModal(false)}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '95vh', bgcolor: 'background.paper',
            borderRadius: 3, boxShadow: 24, overflow: 'hidden',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
          }}>
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <FiFileText className="text-white text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingResource ? 'Edit Resource' : 'Upload New Resource'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-600"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(95vh-150px)] overflow-y-auto">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {editingResource ? 'Replace File (Optional)' : 'Upload File *'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resourceFile"
                    required={!editingResource}
                  />
                  <label htmlFor="resourceFile" className="cursor-pointer block text-center">
                    <FiUpload className="text-2xl text-blue-500 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-700">
                      {selectedFile ? selectedFile.name : 'Click to select a file'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported: PDF, DOC, PPT, XLS, Images, Videos, Audio (Max 10MB)
                    </p>
                  </label>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter resource title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Subject</option>
                    {SUBJECTS.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class *
                  </label>
                  <select
                    required
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Class</option>
                    {CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Access Level
                  </label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ACCESS_LEVELS.filter(l => l.id !== 'all').map(level => (
                      <option key={level.id} value={level.id}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter resource description..."
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                  Active (Visible to users)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200/50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {(saving || uploading) ? (
                    <>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      {editingResource ? 'Updating...' : 'Uploading...'}
                    </>
                  ) : (
                    <>
                      {editingResource ? <FiEdit /> : <FiUpload />}
                      {editingResource ? 'Update Resource' : 'Upload Resource'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </Box>
        </Modal>
      )}

      {/* View Resource Modal */}
      {showViewModal && viewResource && (
        <Modal open={true} onClose={() => setShowViewModal(false)}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '95vh', bgcolor: 'background.paper',
            borderRadius: 3, boxShadow: 24, overflow: 'hidden',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
          }}>
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    {getFileIcon(viewResource.fileName)}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Resource Details</h2>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 text-gray-600"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(95vh-150px)] overflow-y-auto">
              {/* Resource Info */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border border-blue-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                  {getFileIcon(viewResource.fileName)}
                </div>
                <div>
                  <div className="text-sm text-blue-600 font-semibold mb-1">EDUCATIONAL RESOURCE</div>
                  <div className="text-lg font-bold text-gray-900">{viewResource.title}</div>
                  <div className="text-gray-600">{viewResource.subject} • {viewResource.className}</div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">File Name</p>
                    <p className="text-gray-800 font-medium">{viewResource.fileName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">File Size</p>
                    <p className="text-gray-800 font-medium">{viewResource.fileSize || formatFileSize(viewResource.size)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Type</p>
                    <Badge color="blue" icon={getFileIcon(viewResource.fileName)}>
                      {viewResource.type || 'document'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Category</p>
                    <Badge color="green" icon={<FiBook className="text-green-500" />}>
                      {viewResource.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Uploaded By</p>
                    <p className="text-gray-800 font-medium">{viewResource.uploadedBy || 'System'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Upload Date</p>
                    <p className="text-gray-800 font-medium">{formatDate(viewResource.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Downloads</p>
                    <p className="text-gray-800 font-medium">{viewResource.downloads || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold mb-1">Access Level</p>
                    <Badge color="purple" icon={<FiShield className="text-purple-500" />}>
                      {viewResource.accessLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1">Description</p>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {viewResource.description || 'No description available'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-200/50">
                <button
                  onClick={() => {
                    downloadResource(viewResource);
                    setShowViewModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-3"
                >
                  <FiDownload className="text-lg" /> Download Resource
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                  <FiAlertCircle className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Confirm Deletion</h2>
                  <p className="text-red-100 opacity-90 mt-1 text-sm">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 border border-red-200">
                  <FiTrash2 className="text-red-600 text-lg" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Delete "{resourceToDelete?.title}"?</h3>
                <p className="text-gray-600 text-sm">This will permanently delete the resource and all associated data.</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setResourceToDelete(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-sm"
              >
                <FiX /> Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-3 rounded-xl font-bold text-sm"
              >
                <FiTrash2 /> Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}