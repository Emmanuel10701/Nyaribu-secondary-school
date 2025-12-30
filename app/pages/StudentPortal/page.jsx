'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  FiSearch, FiFilter, FiDownload, FiCalendar, FiBook, FiUser, FiClock,
  FiCheckCircle, FiAlertCircle, FiArrowRight, FiEye, FiUpload, FiBarChart2,
  FiAward, FiX, FiTarget, FiFileText, FiMessageSquare, FiChevronLeft,
  FiChevronRight, FiHome, FiStar, FiBookOpen, FiUsers, FiBookmark, FiFile,
  FiFolder, FiVideo, FiImage, FiMusic, FiExternalLink, FiGrid, FiList,
  FiRefreshCw, FiPlayCircle, FiTrendingUp, FiShield, FiActivity, FiFilePlus,
  FiPlay, FiMic, FiCamera, FiPackage, FiFlag, FiZap, FiAlertTriangle,
  FiClipboard, FiArchive, FiThumbsUp, FiSend, FiBell, FiGlobe, FiHelpCircle,
  FiLogOut, FiLock, FiLogIn, FiDollarSign, FiCreditCard, FiPercent, FiTrendingDown,
  FiChevronDown, FiChevronUp, FiLayers, FiDatabase, FiSliders
} from 'react-icons/fi';
import StudentLoginModal from '../../components/studentloginmodel/page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const ASSIGNMENTS_API = `${API_BASE_URL}/api/assignment`;
const RESOURCES_API = `${API_BASE_URL}/api/resources`;

// Configuration
const RESOURCE_TYPES = [
  { id: 'all', label: 'All Types', color: 'gray', icon: <FiLayers className="text-gray-600" /> },
  { id: 'document', label: 'Documents', color: 'blue', icon: <FiFileText className="text-blue-500" /> },
  { id: 'pdf', label: 'PDFs', color: 'red', icon: <FiFileText className="text-red-500" /> },
  { id: 'video', label: 'Videos', color: 'purple', icon: <FiVideo className="text-purple-500" /> },
  { id: 'presentation', label: 'Presentations', color: 'orange', icon: <FiBarChart2 className="text-orange-500" /> },
  { id: 'worksheet', label: 'Worksheets', color: 'emerald', icon: <FiFilePlus className="text-emerald-500" /> },
  { id: 'audio', label: 'Audio', color: 'indigo', icon: <FiMic className="text-indigo-500" /> },
  { id: 'image', label: 'Images', color: 'pink', icon: <FiImage className="text-pink-500" /> }
];

const ASSIGNMENT_STATUS = [
  { id: 'all', label: 'All Status', color: 'gray', icon: <FiClipboard className="text-gray-600" /> },
  { id: 'assigned', label: 'Assigned', color: 'blue', icon: <FiFlag className="text-blue-500" /> },
  { id: 'reviewed', label: 'Reviewed', color: 'green', icon: <FiCheckCircle className="text-green-500" /> },
  { id: 'completed', label: 'Completed', color: 'purple', icon: <FiAward className="text-purple-500" /> },
  { id: 'extended', label: 'Extended', color: 'orange', icon: <FiClock className="text-orange-500" /> }
];

const ITEMS_PER_PAGE = {
  assignments: 6,
  resources: 8
};

// Helper functions
const getBadgeColorStyles = (colorName) => {
  const map = {
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    emerald: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    orange: 'bg-orange-100 text-orange-800 border border-orange-200',
    violet: 'bg-violet-100 text-violet-800 border border-violet-200',
    pink: 'bg-pink-100 text-pink-800 border border-pink-200',
    teal: 'bg-teal-100 text-teal-800 border border-teal-200',
    slate: 'bg-slate-100 text-slate-800 border border-slate-200',
    red: 'bg-red-100 text-red-800 border border-red-200',
    green: 'bg-green-100 text-green-800 border border-green-200',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
    indigo: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    gray: 'bg-gray-100 text-gray-800 border border-gray-200',
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
      return <FiDatabase className="text-green-500" />;
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
      return <FiMic className="text-indigo-500" />;
    default:
      return <FiFile className="text-gray-600" />;
  }
};

const getResourceTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'video':
      return <FiVideo className="text-purple-500" />;
    case 'document':
      return <FiFileText className="text-blue-500" />;
    case 'presentation':
      return <FiBarChart2 className="text-orange-500" />;
    case 'worksheet':
      return <FiFilePlus className="text-green-500" />;
    case 'audio':
      return <FiMic className="text-indigo-500" />;
    case 'image':
      return <FiImage className="text-pink-500" />;
    case 'pdf':
      return <FiFileText className="text-red-500" />;
    case 'spreadsheet':
      return <FiDatabase className="text-emerald-500" />;
    default:
      return <FiFile className="text-gray-600" />;
  }
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'reviewed': return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
    case 'assigned': return 'bg-gradient-to-r from-blue-500 to-blue-600';
    case 'extended': return 'bg-gradient-to-r from-amber-500 to-amber-600';
    case 'completed': return 'bg-gradient-to-r from-purple-500 to-purple-600';
    default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'reviewed': return <FiCheckCircle className="text-white" />;
    case 'assigned': return <FiClock className="text-white" />;
    case 'extended': return <FiAlertCircle className="text-white" />;
    case 'completed': return <FiAward className="text-white" />;
    default: return <FiClock className="text-white" />;
  }
};

// Fee status helper
const getFeeStatusColor = (balance, totalAmount) => {
  if (balance <= 0) return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
  if (balance < totalAmount * 0.5) return 'bg-gradient-to-r from-amber-500 to-amber-600';
  return 'bg-gradient-to-r from-rose-500 to-rose-600';
};

const getFeeStatusText = (balance) => {
  if (balance <= 0) return 'Paid in Full';
  if (balance < 1000) return 'Small Balance';
  return 'Payment Due';
};

// Main Component
export default function StudentPortalPage() {
  // State
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedResourceType, setSelectedResourceType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentResourcePage, setCurrentResourcePage] = useState(1);
  const [allAssignments, setAllAssignments] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('assignments');
  const [assignmentsView, setAssignmentsView] = useState('grid');
  const [resourcesView, setResourcesView] = useState('grid');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [downloading, setDownloading] = useState({});
  
  // Student Auth State
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [requiresContact, setRequiresContact] = useState(false);

  // Student Results State
  const [studentResults, setStudentResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  // Fee Balance State - ADDED THIS
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState(null);
  const [feeBalance, setFeeBalance] = useState(null);
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  
  // Advanced filter states
  const [expandedFilters, setExpandedFilters] = useState({
    class: false,
    subject: false,
    teacher: false,
    status: false,
    resourceType: false
  });

  const fetchStudentResults = useCallback(async () => {
    if (!student?.admissionNumber) return;
    setResultsLoading(true);
    setResultsError(null);
    try {
      const resp = await fetch(`/api/results?action=student-results&admissionNumber=${encodeURIComponent(student.admissionNumber)}&includeStudent=true`);
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        setStudentResults([]);
        setResultsError(data.error || 'Not uploaded yet');
      } else {
        const results = Array.isArray(data.results) ? data.results : [];
        setStudentResults(results);
        if (results.length === 0) setResultsError('Not uploaded yet');
      }
    } catch (err) {
      console.error('Failed fetching student results:', err);
      setStudentResults([]);
      setResultsError('Not uploaded yet');
    } finally {
      setResultsLoading(false);
    }
  }, [student]);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('student_token');
        if (!savedToken) {
          setShowLoginModal(true);
          return;
        }

        const response = await fetch('/api/studentlogin', {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        });

        const data = await response.json();

        if (data.success && data.authenticated) {
          setStudent(data.student);
          setToken(savedToken);
          setShowLoginModal(false);
          
          // Set student's class as default filter
          if (data.student) {
            const studentClass = data.student.stream 
              ? `Form ${data.student.form} ${data.student.stream}`
              : `Form ${data.student.form}`;
            setSelectedClass(studentClass);
          }
          
          // Set auto-logout timer (2 hours)
          const logoutTimer = setTimeout(() => {
            toast.info('Your 2-hour session has expired. Please log in again.');
            handleLogout();
          }, 2 * 60 * 60 * 1000);

          return () => clearTimeout(logoutTimer);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
      }
    };

    checkAuth();
  }, []);

  // Fetch fee balance when student is logged in
  useEffect(() => {
    if (student && token) {
      fetchFeeBalance();
    }
  }, [student, token]);

  // Fetch fee balance from API
  const fetchFeeBalance = async () => {
    if (!student?.admissionNumber) return;
    
    setFeeLoading(true);
    setFeeError(null);
    
    try {
      // Use the fee balance API endpoint
      const response = await fetch(`/api/feebalances?admissionNumber=${student.admissionNumber}&action=student-fees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch fee balance`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setFeeBalance({
          summary: data.summary || {
            totalAmount: 0,
            totalPaid: 0,
            totalBalance: 0,
            recordCount: 0
          },
          details: data.feeBalances || [],
          student: data.student
        });
      } else {
        throw new Error(data.error || 'Failed to load fee balance');
      }
    } catch (err) {
      console.error('Error fetching fee balance:', err);
      setFeeError(err.message);
      toast.error('Could not load fee balance information');
    } finally {
      setFeeLoading(false);
    }
  };

  // Handle student login
  const handleStudentLogin = async (fullName, admissionNumber) => {
    setLoginLoading(true);
    setLoginError(null);
    setRequiresContact(false);

    try {
      const response = await fetch('/api/studentlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, admissionNumber })
      });

      const data = await response.json();

      if (data.success) {
        // Save token and student data
        localStorage.setItem('student_token', data.token);
        setStudent(data.student);
        setToken(data.token);
        setShowLoginModal(false);
        
        // Set student's class as default filter
        if (data.student) {
          const studentClass = data.student.stream 
            ? `Form ${data.student.form} ${data.student.stream}`
            : `Form ${data.student.form}`;
          setSelectedClass(studentClass);
        }
        
        toast.success('Login successful!', {
          description: `Welcome ${data.student.fullName}`
        });

        // Load data after successful login
        fetchAllAssignments();
        fetchAllResources();
        fetchFeeBalance();
        fetchStudentResults();
      } else {
        setLoginError(data.error);
        setRequiresContact(data.requiresContact || false);
        
        if (data.requiresContact) {
          toast.error('Student record not found', {
            description: 'Please contact your class teacher or school administrator'
          });
        } else {
          toast.error(data.error || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/studentlogin', { method: 'DELETE' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('student_token');
      setStudent(null);
      setToken(null);
      setShowLoginModal(true);
      setAllAssignments([]);
      setAllResources([]);
      setFeeBalance(null);
      setSelectedClass('all'); // Reset to all classes
      
      toast.info('You have been logged out');
    }
  };

  // API Integration for assignments
  const fetchAllAssignments = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${ASSIGNMENTS_API}?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.');
          handleLogout();
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.assignments)) {
        setAllAssignments(data.assignments);
      } else {
        throw new Error(data.error || 'Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // API Integration for resources
  const fetchAllResources = useCallback(async () => {
    if (!token) return;

    try {
      setResourcesLoading(true);
      
      const response = await fetch(`${RESOURCES_API}?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.resources)) {
        setAllResources(data.resources);
      } else {
        throw new Error('Invalid resources data format');
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setResourcesLoading(false);
    }
  }, [token]);

  // Load data when authenticated
  useEffect(() => {
    if (student && token) {
      fetchAllAssignments();
      fetchAllResources();
    }
  }, [student, token, fetchAllAssignments, fetchAllResources]);

  // Extract unique values for filters with priority sorting
  const extractFilterValues = (items, key, studentClass = null) => {
    const values = [...new Set(items.map(item => item[key]).filter(Boolean))];
    
    // If student class exists, prioritize it
    if (studentClass && values.includes(studentClass)) {
      const filtered = values.filter(v => v !== studentClass);
      return [studentClass, ...filtered];
    }
    
    return values.sort();
  };

  // Get classes with student's class first
  const classes = useMemo(() => {
    if (!student) return ['all', ...extractFilterValues(allAssignments, 'className')];
    
    const studentClass = student.stream 
      ? `Form ${student.form} ${student.stream}`
      : `Form ${student.form}`;
    
    const otherClasses = extractFilterValues(allAssignments, 'className', studentClass);
    return ['all', studentClass, ...otherClasses.filter(c => c !== studentClass && c !== 'all')];
  }, [allAssignments, student]);

  // Get subjects
  const subjects = useMemo(() => [
    'all',
    ...extractFilterValues(allAssignments, 'subject')
  ], [allAssignments]);

  // Get teachers
  const teachers = useMemo(() => [
    'all',
    ...extractFilterValues(allAssignments, 'teacher')
  ], [allAssignments]);

  // Filtering Logic with priority for student's class
  const filteredAssignments = useMemo(() => {
    const studentClass = student ? (student.stream 
      ? `Form ${student.form} ${student.stream}`
      : `Form ${student.form}`) : null;
    
    const assignmentsWithPriority = [...allAssignments].map(assignment => ({
      ...assignment,
      priority: assignment.className === studentClass ? 1 : 0
    })).sort((a, b) => b.priority - a.priority);
    
    return assignmentsWithPriority.filter(assignment => {
      const matchesClass = selectedClass === 'all' || assignment.className === selectedClass;
      const matchesSubject = selectedSubject === 'all' || assignment.subject === selectedSubject;
      const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
      const matchesTeacher = selectedTeacher === 'all' || assignment.teacher === selectedTeacher;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        assignment.title?.toLowerCase().includes(searchLower) ||
        assignment.teacher?.toLowerCase().includes(searchLower) ||
        assignment.description?.toLowerCase().includes(searchLower) ||
        assignment.subject?.toLowerCase().includes(searchLower);

      return matchesClass && matchesSubject && matchesStatus && matchesTeacher && matchesSearch;
    });
  }, [allAssignments, selectedClass, selectedSubject, selectedStatus, selectedTeacher, searchTerm, student]);

  const filteredResources = useMemo(() => {
    const studentClass = student ? (student.stream 
      ? `Form ${student.form} ${student.stream}`
      : `Form ${student.form}`) : null;
    
    const resourcesWithPriority = [...allResources].map(resource => ({
      ...resource,
      priority: resource.className === studentClass ? 1 : 0
    })).sort((a, b) => b.priority - a.priority);
    
    return resourcesWithPriority.filter(resource => {
      const matchesType = selectedResourceType === 'all' || resource.type === selectedResourceType;
      const matchesClass = selectedClass === 'all' || resource.className === selectedClass;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        resource.title?.toLowerCase().includes(searchLower) ||
        resource.subject?.toLowerCase().includes(searchLower) ||
        resource.description?.toLowerCase().includes(searchLower) ||
        resource.uploadedBy?.toLowerCase().includes(searchLower);

      return matchesType && matchesClass && matchesSearch;
    });
  }, [allResources, selectedResourceType, selectedClass, searchTerm, student]);

  // Pagination
  const totalAssignmentPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE.assignments);
  const paginatedAssignments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE.assignments;
    return filteredAssignments.slice(start, start + ITEMS_PER_PAGE.assignments);
  }, [filteredAssignments, currentPage]);

  const totalResourcePages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE.resources);
  const paginatedResources = useMemo(() => {
    const start = (currentResourcePage - 1) * ITEMS_PER_PAGE.resources;
    return filteredResources.slice(start, start + ITEMS_PER_PAGE.resources);
  }, [filteredResources, currentResourcePage]);

  // Download Functions
  const downloadFile = async (url, filename) => {
    const downloadId = `${url}-${Date.now()}`;
    
    try {
      if (!downloading[url]) {
        const toastId = toast.loading('Downloading file...');
        setDownloading(prev => ({ ...prev, [url]: true }));
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        setTimeout(() => {
          toast.dismiss(toastId);
          toast.success('Download started');
          setDownloading(prev => {
            const newState = { ...prev };
            delete newState[url];
            return newState;
          });
        }, 1000);
      }
    } catch (err) {
      toast.error('Download failed');
      setDownloading(prev => {
        const newState = { ...prev };
        delete newState[url];
        return newState;
      });
    }
  };

  const downloadAllAssignmentFiles = async (assignment) => {
    const files = [
      ...(assignment.assignmentFiles || []),
      ...(assignment.attachments || [])
    ].filter(Boolean);
    
    if (files.length === 0) {
      toast.info('No files available');
      return;
    }
    
    const toastId = toast.loading(`Preparing ${files.length} files for download...`);
    
    const downloadStates = {};
    files.forEach(file => {
      downloadStates[file] = true;
    });
    setDownloading(prev => ({ ...prev, ...downloadStates }));
    
    setTimeout(async () => {
      let successCount = 0;
      
      for (const file of files) {
        try {
          await downloadFile(file, file.split('/').pop());
          successCount++;
        } catch (err) {
          console.error('Error downloading file:', file, err);
        }
      }
      
      files.forEach(file => {
        setDownloading(prev => {
          const newState = { ...prev };
          delete newState[file];
          return newState;
        });
      });
      
      toast.dismiss(toastId);
      
      if (successCount > 0) {
        toast.success(`Successfully downloaded ${successCount} files`);
      }
    }, 500);
  };

  const downloadResource = (resource) => {
    if (downloading[resource.fileUrl]) {
      toast.info('Download already in progress');
      return;
    }
    
    downloadFile(resource.fileUrl, resource.title);
  };

  // Handlers
  const clearFilters = () => {
    setSelectedClass('all');
    setSelectedSubject('all');
    setSelectedTeacher('all');
    setSelectedStatus('all');
    setSelectedResourceType('all');
    setSearchTerm('');
    setCurrentPage(1);
    setCurrentResourcePage(1);
  };

  const handleRefresh = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    
    if (viewMode === 'assignments') {
      fetchAllAssignments();
    } else {
      fetchAllResources();
    }
    
    if (student?.admissionNumber) {
      fetchFeeBalance();
    }
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Show login modal if not authenticated
  if (!student || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
        <Toaster position="top-right" expand={true} richColors theme="light" />
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-4 sm:p-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Nyaribu Secondary School</h1>
                <p className="text-blue-200/90 text-xs sm:text-sm mt-0.5">Student Portal - Learning Resources & Assignments</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <FiLock className="text-sm sm:text-base" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-blue-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLock className="text-white text-2xl sm:text-3xl" />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Student Portal Login Required</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                Please log in with your full name and admission number to access learning resources, assignments, and fee balance.
              </p>
              
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 sm:px-6 py-3 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg transition-all duration-300"
              >
                <FiLogIn className="text-base sm:text-lg" />
                <span>Click to Login</span>
              </button>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">How to Login:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">1</div>
                    <p className="font-medium text-gray-700 text-xs sm:text-sm">Enter your full name</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1">2</div>
                    <p className="font-medium text-gray-700 text-xs sm:text-sm">Enter admission number</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">3</div>
                    <p className="font-medium text-gray-700 text-xs sm:text-sm">Access all features</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <StudentLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleStudentLogin}
          isLoading={loginLoading}
          error={loginError}
          requiresContact={requiresContact}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      <Toaster position="top-right" expand={true} richColors theme="light" />
      
      {/* Login Modal */}
      <StudentLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleStudentLogin}
        isLoading={loginLoading}
        error={loginError}
        requiresContact={requiresContact}
      />

      {/* Mobile Filter Overlay */}
      {isFilterSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsFilterSidebarOpen(false)}
        />
      )}

      {/* Header - Compact */}
      <header className="bg-white border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsFilterSidebarOpen(true)}
              className="lg:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <FiFilter size={18} />
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                <FiUser className="text-white text-sm" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-xs sm:text-sm">{student.fullName}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs text-gray-600">Form {student.form}</span>
                  {student.stream && (
                    <>
                      <span className="text-gray-400 text-[10px]">•</span>
                      <span className="text-[10px] sm:text-xs text-gray-600">{student.stream}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${viewMode}...`}
                className="block w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="px-2 py-1 text-xs text-gray-600 bg-transparent hover:bg-gray-100 rounded-lg transition-all flex items-center gap-1"
              title="Refresh"
            >
              <FiRefreshCw className={`text-sm ${(loading || resourcesLoading || feeLoading) ? "animate-spin" : ""}`} />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-2 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all flex items-center gap-1"
            >
              <FiLogOut className="text-sm" />
            </button>

            {/* View Toggle */}
            <div className="flex bg-transparent p-0.5 rounded-lg border border-gray-300/40 gap-0.5">
              <button
                onClick={() => setViewMode("assignments")}
                className={`px-2 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1
                  ${
                    viewMode === "assignments"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <FiClipboard size={12} />
                <span className="hidden sm:inline">Assignments</span>
              </button>
              <button
                onClick={() => setViewMode("resources")}
                className={`px-2 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1
                  ${
                    viewMode === "resources"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <FiFilePlus size={12} />
                <span className="hidden sm:inline">Resources</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          
          {/* Filter Sidebar - Modern Design */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 w-72 sm:w-80 bg-white lg:bg-transparent z-50 transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none overflow-y-auto lg:overflow-visible border-r lg:border-r-0 border-gray-200/50
            ${isFilterSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="p-3 sm:p-4 lg:p-0 lg:sticky lg:top-4 space-y-4">
              
              <div className="flex items-center justify-between lg:hidden mb-3">
                <h2 className="text-base font-bold text-gray-900">Filters</h2>
                <button onClick={() => setIsFilterSidebarOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <FiX size={18} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="lg:hidden mb-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Fee Balance Card - Modern */}
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <FiDollarSign className="text-white" />
                      </div>
                      Fee Balance
                    </h3>
                    {feeLoading ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : feeError ? (
                      <FiAlertCircle className="text-red-500 text-sm" />
                    ) : null}
                  </div>
                  
                  {feeLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  ) : feeError ? (
                    <p className="text-red-600 text-xs">Failed to load fee balance</p>
                  ) : feeBalance ? (
                    <>
                      <div className="flex items-end gap-2 mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          KES {feeBalance.summary.totalBalance.toLocaleString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getFeeStatusColor(feeBalance.summary.totalBalance, feeBalance.summary.totalAmount)} text-white`}>
                          {getFeeStatusText(feeBalance.summary.totalBalance)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Total Fees</span>
                          <span className="font-medium">KES {feeBalance.summary.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Total Paid</span>
                          <span className="font-medium text-emerald-600">KES {feeBalance.summary.totalPaid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Outstanding</span>
                          <span className="font-medium text-red-600">KES {feeBalance.summary.totalBalance.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setShowFeeDetails(true)}
                        className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all"
                      >
                        View Details
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-500 text-xs">No fee information available</p>
                  )}
                </div>
              </div>

              {/* Filter Controls */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <FiSliders className="text-blue-600" />
                      Filters
                    </h3>
                    {(selectedClass !== 'all' || selectedSubject !== 'all' || selectedTeacher !== 'all' || selectedStatus !== 'all' || selectedResourceType !== 'all' || searchTerm) && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <FiX size={12} /> Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {/* Class Filter - Modern */}
                  <div className="p-3">
                    <button
                      onClick={() => toggleFilter('class')}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <div className="flex items-center gap-2">
                        <FiUsers className="text-blue-600 text-sm" />
                        <span className="text-sm font-medium text-gray-900">Class</span>
                      </div>
                      {expandedFilters.class ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                    </button>
                    
                    {expandedFilters.class && (
                      <div className="mt-3 space-y-2">
                        {classes.map(cls => (
                          <label key={cls} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                            <input
                              type="radio"
                              name="class"
                              checked={selectedClass === cls}
                              onChange={() => setSelectedClass(cls)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex items-center justify-between flex-1">
                              <span className="text-sm text-gray-700">
                                {cls === 'all' ? 'All Classes' : cls}
                              </span>
                              {student && cls !== 'all' && cls === (student.stream ? `Form ${student.form} ${student.stream}` : `Form ${student.form}`) && (
                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Your Class</span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {viewMode === 'assignments' ? (
                    <>
                      {/* Subject Filter */}
                      <div className="p-3">
                        <button
                          onClick={() => toggleFilter('subject')}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <div className="flex items-center gap-2">
                            <FiBook className="text-blue-600 text-sm" />
                            <span className="text-sm font-medium text-gray-900">Subject</span>
                          </div>
                          {expandedFilters.subject ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                        </button>
                        
                        {expandedFilters.subject && (
                          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                            {subjects.map(subject => (
                              <label key={subject} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                <input
                                  type="radio"
                                  name="subject"
                                  checked={selectedSubject === subject}
                                  onChange={() => setSelectedSubject(subject)}
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {subject === 'all' ? 'All Subjects' : subject}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Teacher Filter */}
                      <div className="p-3">
                        <button
                          onClick={() => toggleFilter('teacher')}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <div className="flex items-center gap-2">
                            <FiUser className="text-blue-600 text-sm" />
                            <span className="text-sm font-medium text-gray-900">Teacher</span>
                          </div>
                          {expandedFilters.teacher ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                        </button>
                        
                        {expandedFilters.teacher && (
                          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                            {teachers.map(teacher => (
                              <label key={teacher} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                <input
                                  type="radio"
                                  name="teacher"
                                  checked={selectedTeacher === teacher}
                                  onChange={() => setSelectedTeacher(teacher)}
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {teacher === 'all' ? 'All Teachers' : teacher}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Status Filter */}
                      <div className="p-3">
                        <button
                          onClick={() => toggleFilter('status')}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-blue-600 text-sm" />
                            <span className="text-sm font-medium text-gray-900">Status</span>
                          </div>
                          {expandedFilters.status ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                        </button>
                        
                        {expandedFilters.status && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {ASSIGNMENT_STATUS.map(status => (
                              <label key={status.id} className="relative">
                                <input
                                  type="radio"
                                  name="status"
                                  checked={selectedStatus === status.id}
                                  onChange={() => setSelectedStatus(status.id)}
                                  className="sr-only peer"
                                />
                                <div className="p-2 border border-gray-200 rounded-lg text-center cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all hover:bg-gray-50">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="text-gray-600">{status.icon}</div>
                                    <span className="text-xs font-medium text-gray-700">{status.label}</span>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Resource Type Filter */
                    <div className="p-3">
                      <button
                        onClick={() => toggleFilter('resourceType')}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-center gap-2">
                          <FiFilePlus className="text-blue-600 text-sm" />
                          <span className="text-sm font-medium text-gray-900">Resource Type</span>
                        </div>
                        {expandedFilters.resourceType ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                      </button>
                      
                      {expandedFilters.resourceType && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {RESOURCE_TYPES.map(type => (
                            <label key={type.id} className="relative">
                              <input
                                type="radio"
                                name="resourceType"
                                checked={selectedResourceType === type.id}
                                onChange={() => setSelectedResourceType(type.id)}
                                className="sr-only peer"
                              />
                              <div className="p-2 border border-gray-200 rounded-lg text-center cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all hover:bg-gray-50">
                                <div className="flex flex-col items-center gap-1">
                                  <div className={`${type.color === 'gray' ? 'text-gray-600' : `text-${type.color}-500`}`}>
                                    {type.icon}
                                  </div>
                                  <span className="text-xs font-medium text-gray-700">{type.label}</span>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedClass !== 'all' || selectedSubject !== 'all' || selectedTeacher !== 'all' || selectedStatus !== 'all' || selectedResourceType !== 'all') && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                  <h4 className="text-xs font-bold text-gray-900 mb-2">Active Filters</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedClass !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Class: {selectedClass}
                        <button onClick={() => setSelectedClass('all')} className="hover:text-blue-900">
                          <FiX size={10} />
                        </button>
                      </span>
                    )}
                    {selectedSubject !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Subject: {selectedSubject}
                        <button onClick={() => setSelectedSubject('all')} className="hover:text-green-900">
                          <FiX size={10} />
                        </button>
                      </span>
                    )}
                    {selectedTeacher !== 'all' && viewMode === 'assignments' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Teacher: {selectedTeacher}
                        <button onClick={() => setSelectedTeacher('all')} className="hover:text-purple-900">
                          <FiX size={10} />
                        </button>
                      </span>
                    )}
                    {selectedStatus !== 'all' && viewMode === 'assignments' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Status: {selectedStatus}
                        <button onClick={() => setSelectedStatus('all')} className="hover:text-orange-900">
                          <FiX size={10} />
                        </button>
                      </span>
                    )}
                    {selectedResourceType !== 'all' && viewMode === 'resources' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                        Type: {selectedResourceType}
                        <button onClick={() => setSelectedResourceType('all')} className="hover:text-indigo-900">
                          <FiX size={10} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            
            {/* Header - Compact */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-1">
                  {viewMode === 'assignments' ? 'Your Assignments' : 'Learning Resources'}
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {viewMode === 'assignments' 
                    ? `Showing ${filteredAssignments.length} assignments (${filteredAssignments.filter(a => a.priority === 1).length} from your class)`
                    : `Showing ${filteredResources.length} resources (${filteredResources.filter(r => r.priority === 1).length} from your class)`}
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex bg-white p-0.5 rounded-lg border border-gray-300">
                  <button
                    onClick={() => viewMode === 'assignments' ? setAssignmentsView('grid') : setResourcesView('grid')}
                    className={`p-1.5 rounded ${(viewMode === 'assignments' ? assignmentsView : resourcesView) === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                  >
                    <FiGrid size={16} />
                  </button>
                  <button
                    onClick={() => viewMode === 'assignments' ? setAssignmentsView('list') : setResourcesView('list')}
                    className={`p-1.5 rounded ${(viewMode === 'assignments' ? assignmentsView : resourcesView) === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                  >
                    <FiList size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats - Compact */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 sm:mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700">
                    <FiClipboard className="text-white text-sm" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Total</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{allAssignments.length}</h4>
                <p className="text-gray-600 text-xs font-semibold">Assignments</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-700">
                    <FiFlag className="text-white text-sm" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Active</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{allAssignments.filter(a => a.status === 'assigned').length}</h4>
                <p className="text-gray-600 text-xs font-semibold">Pending</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700">
                    <FiCheckCircle className="text-white text-sm" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Done</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{allAssignments.filter(a => a.status === 'reviewed' || a.status === 'completed').length}</h4>
                <p className="text-gray-600 text-xs font-semibold">Reviewed/Completed</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-700">
                    <FiFilePlus className="text-white text-sm" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Available</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{allResources.length}</h4>
                <p className="text-gray-600 text-xs font-semibold">Resources</p>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-700">
                  <FiAlertCircle className="text-sm" />
                  <div>
                    <h3 className="font-bold text-sm">Error Loading Data</h3>
                    <p className="text-xs mt-0.5">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            {viewMode === 'assignments' ? (
              <>
                {/* Assignments View */}
                {loading ? (
                  <div className={assignmentsView === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-200/50 p-4 animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-2.5 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="space-y-1.5">
                          <div className="h-2 bg-gray-200 rounded w-full"></div>
                          <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200/50 p-6 text-center">
                    <FiClipboard className="text-3xl text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-900 mb-1">No assignments found</h3>
                    <p className="text-gray-600 text-xs mb-4">Try adjusting your filters or search terms</p>
                    <button
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-md transition-all"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : assignmentsView === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedAssignments.map((assignment) => (
                      <div key={assignment.id} className={`bg-white rounded-xl border-2 ${assignment.priority === 1 ? 'border-blue-500 border-l-4 border-l-blue-500' : 'border-gray-300'} p-4 shadow-sm hover:shadow-md transition-all duration-300 relative`}>
                        {assignment.priority === 1 && (
                          <div className="absolute -top-2 -left-2">
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Your Class</span>
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl ${getStatusColor(assignment.status)} flex items-center justify-center shadow-lg`}>
                              {getStatusIcon(assignment.status)}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                                {assignment.title}
                              </h4>
                              <p className="text-gray-600 font-semibold text-xs mt-0.5">{assignment.subject}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-semibold text-xs">Teacher</span>
                            <span className="font-bold text-gray-900 text-xs">{assignment.teacher}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-semibold text-xs">Class</span>
                            <span className="font-bold text-gray-900 text-xs">{assignment.className}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-semibold text-xs">Due Date</span>
                            <span className="font-bold text-gray-900 text-xs">
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-gray-600 text-xs mt-3 line-clamp-2">
                            {assignment.description || 'No description provided'}
                          </p>
                        </div>

                        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => setSelectedAssignment(assignment)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <FiEye className="text-xs" /> View
                          </button>
                          <button
                            onClick={() => downloadAllAssignmentFiles(assignment)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <FiDownload className="text-xs" /> Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className={`bg-white rounded-xl border ${assignment.priority === 1 ? 'border-l-4 border-l-blue-500' : 'border-gray-200/50'} p-4 shadow-sm hover:shadow-md transition-all`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {assignment.priority === 1 && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                                  Your Class
                                </span>
                              )}
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(assignment.status)}`}>
                                {getStatusIcon(assignment.status)}
                                <span className="capitalize">{assignment.status}</span>
                              </div>
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                                {assignment.className}
                              </span>
                              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-bold">
                                {assignment.subject}
                              </span>
                            </div>
                            
                            <h3 className="text-sm font-bold text-gray-900 mb-1">{assignment.title}</h3>
                            <p className="text-gray-600 text-xs mb-3 line-clamp-2">{assignment.description || 'No description provided'}</p>
                            
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <FiUser className="text-gray-400 text-xs" />
                                <span>{assignment.teacher}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiCalendar className="text-gray-400 text-xs" />
                                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => setSelectedAssignment(assignment)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-xs hover:shadow-md transition-all flex items-center gap-1.5"
                            >
                              <FiEye className="text-xs" /> Details
                            </button>
                            <button
                              onClick={() => downloadAllAssignmentFiles(assignment)}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold text-xs hover:shadow-md transition-all flex items-center gap-1.5"
                            >
                              <FiDownload className="text-xs" /> Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Assignment Pagination - Compact */}
                {totalAssignmentPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      Page {currentPage} of {totalAssignmentPages} • {filteredAssignments.length} assignments
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        <FiChevronLeft size={12} /> Prev
                      </button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalAssignmentPages) }, (_, i) => {
                          const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                          if (pageNum > totalAssignmentPages) return null;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-xs font-medium ${
                                currentPage === pageNum
                                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalAssignmentPages, p + 1))}
                        disabled={currentPage === totalAssignmentPages}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        Next <FiChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Resources View */}
                {resourcesLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-200/50 p-4 animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-2.5 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredResources.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200/50 p-6 text-center">
                    <FiFilePlus className="text-3xl text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-900 mb-1">No resources found</h3>
                    <p className="text-gray-600 text-xs mb-4">Try adjusting your filters or search terms</p>
                    <button
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-md transition-all"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : resourcesView === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paginatedResources.map((resource) => (
                      <div key={resource.id} className={`bg-white rounded-xl border-2 ${resource.priority === 1 ? 'border-blue-500 border-l-4 border-l-blue-500' : 'border-gray-300'} p-4 shadow-sm hover:shadow-md transition-all duration-300 relative`}>
                        {resource.priority === 1 && (
                          <div className="absolute -top-2 -left-2">
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Your Class</span>
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                              {getResourceTypeIcon(resource.type)}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                                {resource.title}
                              </h4>
                              <p className="text-gray-600 font-semibold text-xs mt-0.5">{resource.type}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-gray-600 text-xs line-clamp-2">
                            {resource.description || 'No description available'}
                          </p>

                          {resource.subject && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 font-semibold text-xs">Subject</span>
                              <span className="font-bold text-gray-900 text-xs">{resource.subject}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-semibold text-xs">Class</span>
                            <span className="font-bold text-gray-900 text-xs">{resource.className}</span>
                          </div>

                          {resource.fileSize && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 font-semibold text-xs">Size</span>
                              <span className="font-bold text-gray-900 text-xs">{resource.fileSize}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => setSelectedResource(resource)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <FiEye className="text-xs" /> View
                          </button>
                          <button
                            onClick={() => downloadResource(resource)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <FiDownload className="text-xs" /> Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedResources.map((resource) => (
                      <div
                        key={resource.id}
                        className={`bg-white rounded-xl border ${resource.priority === 1 ? 'border-l-4 border-l-blue-500' : 'border-gray-200/50'} p-4 shadow-sm hover:shadow-md transition-all`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                              {getResourceTypeIcon(resource.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                {resource.priority === 1 && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                                    Your Class
                                  </span>
                                )}
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-bold">
                                  {resource.type}
                                </span>
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                                  {resource.className}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-900 text-sm mb-0.5">{resource.title}</h3>
                              <p className="text-gray-600 text-xs mb-2 line-clamp-1">{resource.description}</p>
                              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                {resource.subject && (
                                  <span className="flex items-center gap-1">
                                    <FiBook className="text-gray-400 text-xs" /> {resource.subject}
                                  </span>
                                )}
                                {resource.uploadedBy && (
                                  <span className="flex items-center gap-1">
                                    <FiUser className="text-gray-400 text-xs" /> {resource.uploadedBy}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => setSelectedResource(resource)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-xs hover:shadow-md transition-all flex items-center gap-1.5"
                            >
                              <FiEye className="text-xs" /> Details
                            </button>
                            <button
                              onClick={() => downloadResource(resource)}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold text-xs hover:shadow-md transition-all flex items-center gap-1.5"
                            >
                              <FiDownload className="text-xs" /> Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Resource Pagination - Compact */}
                {totalResourcePages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      Page {currentResourcePage} of {totalResourcePages} • {filteredResources.length} resources
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentResourcePage(p => Math.max(1, p - 1))}
                        disabled={currentResourcePage === 1}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        <FiChevronLeft size={12} /> Prev
                      </button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalResourcePages) }, (_, i) => {
                          const pageNum = currentResourcePage <= 3 ? i + 1 : currentResourcePage - 2 + i;
                          if (pageNum > totalResourcePages) return null;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentResourcePage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-xs font-medium ${
                                currentResourcePage === pageNum
                                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentResourcePage(p => Math.min(totalResourcePages, p + 1))}
                        disabled={currentResourcePage === totalResourcePages}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        Next <FiChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* My Results */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900">My Results</h3>
                <span className="text-xs text-gray-500">Admission: {student.admissionNumber}</span>
              </div>
 
              {resultsLoading ? (
                <div className="text-xs text-gray-500">Loading results...</div>
              ) : resultsError ? (
                <div className="text-xs text-gray-600">Not uploaded yet</div>
              ) : studentResults.length === 0 ? (
                <div className="text-xs text-gray-600">Not uploaded yet</div>
              ) : (
                <div className="space-y-3 text-xs text-gray-700">
                  {studentResults.map((res) => {
                    const subjects = Array.isArray(res.subjects) ? res.subjects : (typeof res.subjects === 'string' ? JSON.parse(res.subjects) : []);
                    const total = subjects.reduce((s, it) => s + (it.score || 0), 0);
                    const avg = subjects.length ? (total / subjects.length).toFixed(2) : '0.00';
                    return (
                      <div key={`${res.admissionNumber}-${res.academicYear}-${res.term}`} className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{res.academicYear} • {res.term}</div>
                          <div className="text-right text-gray-600">
                            <div>Avg: {avg}</div>
                            <div>Points: {res.totalPoints ?? res.totalPoints}</div>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
                          {subjects.map((sub, i) => (
                            <div key={i} className="flex justify-between">
                              <span className="truncate pr-2">{sub.subject || sub.name}</span>
                              <span className="font-semibold">{sub.score ?? '-'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
  
            {/* Footer - Compact */}
            <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-emerald-50 px-4 py-2 rounded-full border border-blue-200 mb-3">
                <FiStar className="text-blue-600 text-xs" />
                <span className="font-semibold text-blue-700 text-xs">Soaring for Excellence in Education</span>
              </div>
              <p className="text-gray-600 text-xs">
                © {new Date().getFullYear()} Nyaribu Secondary School • Student Portal v2.0
              </p>
            </div>
          </main>
        </div>
      </div>

      {/* Fee Details Modal */}
      {showFeeDetails && feeBalance && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-2 sm:p-3 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-2xl my-4 sm:my-6">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Fee Balance Details</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Admission: {student.admissionNumber}</p>
              </div>
              <button
                onClick={() => setShowFeeDetails(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="text-lg text-gray-600" />
              </button>
            </div>

            <div className="p-3 sm:p-4 space-y-4 max-h-[calc(90vh-80px)] overflow-y-auto">
              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5 text-sm">
                  <FiDollarSign className="text-blue-600" />
                  Fee Summary
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p className="text-gray-600 text-xs mb-1">Total Fees</p>
                    <p className="text-lg font-bold text-gray-900">KES {feeBalance.summary.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-emerald-100">
                    <p className="text-gray-600 text-xs mb-1">Total Paid</p>
                    <p className="text-lg font-bold text-emerald-600">KES {feeBalance.summary.totalPaid.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-red-100">
                    <p className="text-gray-600 text-xs mb-1">Outstanding</p>
                    <p className="text-lg font-bold text-red-600">KES {feeBalance.summary.totalBalance.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-gray-600 text-xs mb-1">Payment Status</p>
                    <p className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${getFeeStatusColor(feeBalance.summary.totalBalance, feeBalance.summary.totalAmount)} text-white`}>
                      {getFeeStatusText(feeBalance.summary.totalBalance)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              {feeBalance.details && feeBalance.details.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-sm">Fee Breakdown by Term</h4>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-5 gap-2 p-3 bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-700">
                      <div>Term</div>
                      <div>Academic Year</div>
                      <div>Total</div>
                      <div>Paid</div>
                      <div>Balance</div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {feeBalance.details.map((fee, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2 p-3 hover:bg-gray-50 text-xs">
                          <div className="font-medium text-gray-900">{fee.term}</div>
                          <div className="text-gray-600">{fee.academicYear}</div>
                          <div className="text-gray-900">KES {fee.amount?.toLocaleString() || '0'}</div>
                          <div className="text-emerald-600">KES {fee.amountPaid?.toLocaleString() || '0'}</div>
                          <div className={`font-bold ${fee.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            KES {fee.balance?.toLocaleString() || '0'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    toast.info('Please visit the school accounts office for fee payment');
                    setShowFeeDetails(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-bold text-sm hover:shadow-md transition-all"
                >
                  Make Payment Inquiry
                </button>
                <button
                  onClick={() => setShowFeeDetails(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-bold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-2 sm:p-3 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-2xl my-4 sm:my-6">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between z-10">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">{selectedAssignment.title}</h3>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="text-lg text-gray-600" />
              </button>
            </div>

            <div className="p-3 sm:p-4 space-y-4 max-h-[calc(90vh-80px)] overflow-y-auto">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Subject</div>
                  <div className="font-semibold text-gray-900 text-sm">{selectedAssignment.subject}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Class</div>
                  <div className="font-semibold text-gray-900 text-sm">{selectedAssignment.className}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Teacher</div>
                  <div className="font-semibold text-gray-900 text-sm">{selectedAssignment.teacher}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Status</div>
                  <div className={`font-semibold text-sm ${selectedAssignment.status === 'assigned' ? 'text-blue-600' : 'text-gray-900'}`}>
                    {selectedAssignment.status}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Date Assigned</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {new Date(selectedAssignment.dateAssigned).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="text-xs text-red-600 mb-1">Due Date</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                  <FiFileText className="text-blue-600" /> Description
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedAssignment.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    downloadAllAssignmentFiles(selectedAssignment);
                    setSelectedAssignment(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-bold text-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <FiDownload className="text-base" /> 
                  <span>Download All Files</span>
                </button>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-bold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-2 sm:p-3 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-2xl my-4 sm:my-6">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between z-10">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">{selectedResource.title}</h3>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="text-lg text-gray-600" />
              </button>
            </div>

            <div className="p-3 sm:p-4 space-y-4 max-h-[calc(90vh-80px)] overflow-y-auto">
              {/* Resource Info */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg border border-blue-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  {getResourceTypeIcon(selectedResource.type)}
                </div>
                <div>
                  <div className="text-xs text-blue-600 font-semibold mb-0.5">LEARNING RESOURCE</div>
                  <div className="text-sm font-bold text-gray-900">{selectedResource.title}</div>
                  {selectedResource.subject && (
                    <div className="text-gray-600 text-xs">{selectedResource.subject}</div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Description</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedResource.description || 'No description available'}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {selectedResource.type && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Type</div>
                    <div className="font-semibold text-gray-900 text-sm">{selectedResource.type}</div>
                  </div>
                )}
                {selectedResource.fileSize && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Size</div>
                    <div className="font-semibold text-gray-900 text-sm">{selectedResource.fileSize}</div>
                  </div>
                )}
                {selectedResource.downloads !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Downloads</div>
                    <div className="font-semibold text-gray-900 text-sm">{selectedResource.downloads}</div>
                  </div>
                )}
                {selectedResource.uploadedBy && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Uploaded By</div>
                    <div className="font-semibold text-gray-900 text-sm">{selectedResource.uploadedBy}</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    downloadResource(selectedResource);
                    setSelectedResource(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-bold text-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <FiDownload className="text-base" /> 
                  <span>Download Resource</span>
                </button>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-bold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}