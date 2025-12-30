'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CircularProgress, Modal, Box, Chip, Alert, Snackbar } from '@mui/material';
import * as XLSX from 'xlsx';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar, ComposedChart, Scatter
} from 'recharts';
import {
  FiUpload, FiFile, FiDownload, FiUsers, FiUser, FiFilter, FiSearch,
  FiEye, FiEdit, FiTrash2, FiRefreshCw, FiCheckCircle, FiXCircle,
  FiAlertCircle, FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar,
  FiMail, FiPhone, FiMapPin, FiX, FiList, FiGrid, FiSettings,
  FiArrowLeft, FiArrowRight, FiSave, FiInfo, FiUserCheck, FiBook,
  FiSort, FiSortAsc, FiSchool, FiChevronRight, FiChevronUp, FiChevronDown,
  FiHome, FiUserPlus, FiClock, FiPercent, FiGlobe, FiBookOpen,
  FiHeart, FiCpu, FiSparkles, FiPlay, FiTarget, FiAward,
  FiMessageCircle, FiImage, FiTrendingDown, FiActivity, FiDollarSign,
  FiCreditCard, FiShield, FiLock, FiUnlock, FiBell, FiPrinter,
  FiCalendar as FiCalendarIcon, FiFileText, FiCheck, FiArchive,
  FiRepeat, FiTrendingUp as FiTrendingUpIcon, FiTrendingDown as FiTrendingDownIcon,
  FiMoreVertical, FiExternalLink, FiCopy, FiTag, FiCodesandbox,
  FiPercent as FiPercentIcon, FiStar, FiAward as FiAwardIcon,
  FiBook as FiBookIcon, FiTarget as FiTargetIcon
} from 'react-icons/fi';
import {
  IoPeopleCircle, IoNewspaper, IoClose, IoStatsChart,
  IoAnalytics, IoSchool, IoDocumentText, IoSparkles,
  IoCash, IoCard, IoWallet, IoReceipt, IoCheckmarkCircle,
  IoAlertCircle, IoTime, IoCalendarClear, IoDocuments,
  IoStatsChart as IoStatsChartIcon, IoFilter as IoFilterIcon,
  IoPodium, IoRibbon, IoMedal, IoTrophy, IoSchool as IoSchoolIcon,
  IoLibrary, IoCalculator, IoClipboard, IoStatsChartOutline,
  IoPieChart as IoPieChartIcon, IoBarChart as IoBarChartIcon,
  IoLineChart as IoLineChartIcon, IoAnalytics as IoAnalyticsIcon
} from 'react-icons/io5';

// Loading Spinner for Results
function ResultsLoadingSpinner({ message = "Loading academic results...", size = "medium" }) {
  const sizes = {
    small: { outer: 48, inner: 24 },
    medium: { outer: 64, inner: 32 },
    large: { outer: 80, inner: 40 }
  }

  const { outer, inner } = sizes[size]

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="relative">
            <CircularProgress 
              size={outer} 
              thickness={5}
              className="text-purple-600"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full" style={{ width: inner, height: inner }}></div>
            </div>
          </div>
          <div className="absolute -inset-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full blur-xl opacity-30"></div>
        </div>
        
        <div className="mt-8 space-y-3">
          <span className="block text-lg font-semibold text-gray-800">
            {message}
          </span>
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-purple-500 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Delete Confirmation Modal for Results
function ResultsDeleteModal({ 
  onClose, 
  onConfirm, 
  loading, 
  title = "Confirm Deletion",
  description = "This action cannot be undone",
  itemName = "",
  type = "result"
}) {
  const [confirmText, setConfirmText] = useState('')

  const getConfirmPhrase = () => {
    if (type === "batch") return "DELETE BATCH";
    if (type === "result") return "DELETE RESULT";
    return "DELETE";
  }

  const handleConfirm = () => {
    const phrase = getConfirmPhrase();
    if (confirmText === phrase) {
      onConfirm()
    } else {
      alert(`Please type "${phrase}" exactly to confirm deletion`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
              <FiAlertCircle className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-red-100 opacity-90 text-sm mt-1">{description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-red-200">
              <FiTrash2 className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete {itemName ? `"${itemName}"` : `this ${type}`}?
            </h3>
            <p className="text-gray-600 text-sm">
              This will permanently delete the academic result and cannot be recovered.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
              Type <span className="font-mono text-red-600 bg-red-50 px-3 py-1 rounded-lg text-xs border border-red-200">{getConfirmPhrase()}</span> to confirm:
            </label>
            <input 
              type="text" 
              value={confirmText} 
              onChange={(e) => setConfirmText(e.target.value)} 
              placeholder={`Type "${getConfirmPhrase()}" here`}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-base"
              autoFocus
            />
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-base disabled:opacity-50"
          >
            <FiXCircle className="text-base" /> Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={loading || confirmText !== getConfirmPhrase()}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white px-4 py-3 rounded-xl font-bold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <CircularProgress size={14} className="text-white" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="text-base" /> Delete Forever
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// File Upload Component for Results
function ResultsFileUpload({ onFileSelect, file, onRemove, dragActive, onDrag }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validExtensions = ['.csv', '.xlsx', '.xls', '.xlsm'];
    
    if (selectedFile) {
      const ext = selectedFile.name.toLowerCase();
      if (validExtensions.some(valid => ext.endsWith(valid))) {
        onFileSelect(selectedFile);
        alert('Results file selected successfully');
      } else {
        alert('Please upload a CSV or Excel file');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className={`border-3 border-dashed rounded-2xl p-10 text-center cursor-pointer ${
        dragActive 
          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 ring-4 ring-purple-100' 
          : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={(e) => {
        e.preventDefault();
        onDrag(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) handleFileChange({ target: { files } });
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <FiUpload className={`mx-auto text-3xl mb-4 ${
        dragActive ? 'text-purple-600' : 'text-gray-400'
      }`} />
      <p className="text-gray-800 mb-2 font-bold text-lg">
        {dragActive ? '📚 Drop results file here!' : file ? 'Click to replace file' : 'Drag & drop or click to upload results'}
      </p>
      <p className="text-sm text-gray-600">
        CSV, Excel (.xlsx, .xls) • Max 10MB • Include admission numbers
      </p>
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".csv,.xlsx,.xls,.xlsm"
        onChange={handleFileChange}
        className="hidden" 
      />
    </div>
  );
}

// Result Detail Modal
function ResultDetailModal({ result, student, onClose, onEdit, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!result) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'from-emerald-500 to-emerald-700';
      case 'A-': return 'from-emerald-400 to-emerald-600';
      case 'B+': return 'from-green-500 to-green-700';
      case 'B': return 'from-green-400 to-green-600';
      case 'B-': return 'from-blue-500 to-blue-700';
      case 'C+': return 'from-blue-400 to-blue-600';
      case 'C': return 'from-yellow-500 to-yellow-700';
      case 'C-': return 'from-yellow-400 to-yellow-600';
      case 'D+': return 'from-orange-500 to-orange-700';
      case 'D': return 'from-orange-400 to-orange-600';
      case 'E': return 'from-red-500 to-red-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const calculateOverall = () => {
    if (!result.subjects || !Array.isArray(result.subjects)) return { total: 0, average: 0, points: 0 };
    
    const subjects = result.subjects;
    const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
    const totalPoints = subjects.reduce((sum, s) => sum + (s.points || 0), 0);
    const average = subjects.length > 0 ? totalScore / subjects.length : 0;
    
    return {
      total: totalScore,
      average: parseFloat(average.toFixed(2)),
      points: totalPoints,
      count: subjects.length
    };
  };

  const overall = calculateOverall();

  return (
    <>
      <Modal open={true} onClose={onClose}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '95vw',
          maxWidth: '900px',
          maxHeight: '95vh',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                  <FiAward className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Academic Results Details</h2>
                  <p className="text-purple-100 opacity-90 text-sm mt-1">
                    Complete academic performance and subject analysis
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-white bg-opacity-20 rounded-2xl">
                <FiX className="text-xl" />
              </button>
            </div>
          </div>

          <div className="max-h-[calc(95vh-80px)] overflow-y-auto p-6">
            {/* Header Info */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center shadow-2xl ring-4 ring-purple-100 mx-auto md:mx-0">
                  <IoSchool className="text-white text-3xl" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {student ? `${student.firstName} ${student.lastName}` : 'Student'}
                  </h3>
                  <p className="text-gray-700 text-base font-semibold mt-2">
                    Admission #{result.admissionNumber}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-bold text-sm">
                      {result.form}
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-bold text-sm">
                      {result.term}
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-xl font-bold text-sm">
                      {result.academicYear}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Performance */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-300 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-purple-900">Overall Performance</h4>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-700">{overall.average}%</div>
                  <div className="text-sm text-purple-600 font-semibold">Average Score</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700">Total Score</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.total}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-blue-200">
                  <div className="text-sm font-semibold text-blue-700">Average</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.average}%</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-emerald-200">
                  <div className="text-sm font-semibold text-emerald-700">Total Points</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.points}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-amber-200">
                  <div className="text-sm font-semibold text-amber-700">Subjects</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.count}</div>
                </div>
              </div>
            </div>

            {/* Subject Performance Grid */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                  <FiBook className="text-blue-700 text-xl" />
                </div>
                Subject Performance
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.subjects && Array.isArray(result.subjects) && result.subjects.map((subject, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-gray-900 text-base truncate">{subject.subject}</h5>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getGradeColor(subject.grade)} text-white`}>
                        {subject.grade}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Score:</span>
                        <span className="font-bold text-gray-900">{subject.score}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Points:</span>
                        <span className="font-bold text-gray-900">{subject.points}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        style={{ width: `${subject.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Info */}
            {student && (
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-xl">
                    <FiUser className="text-emerald-700 text-xl" />
                  </div>
                  Student Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                    <p className="text-sm font-semibold text-gray-600">Full Name</p>
                    <p className="font-bold text-gray-900 text-base">
                      {student.firstName || ''} {student.middleName || ''} {student.lastName || ''}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                    <p className="text-sm font-semibold text-gray-600">Current Form</p>
                    <p className="font-bold text-gray-900 text-base">{student.form || 'Not set'}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                    <p className="text-sm font-semibold text-gray-600">Stream</p>
                    <p className="font-bold text-gray-900 text-base">{student.stream || 'Not set'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-200">
              <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl font-bold text-base shadow-xl"
              >
                <FiEdit className="text-lg" /> Edit Results
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl font-bold text-base shadow-xl"
              >
                <FiTrash2 className="text-lg" /> Delete Results
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      {showDeleteModal && (
        <ResultsDeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            onDelete(result.admissionNumber);
            setShowDeleteModal(false);
          }}
          loading={false}
          type="result"
          itemName={`Results for ${result.admissionNumber} - ${result.form} ${result.term} ${result.academicYear}`}
        />
      )}
    </>
  );
}

// Results Edit Modal
function ResultEditModal({ result, student, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    form: result?.form || '',
    term: result?.term || '',
    academicYear: result?.academicYear || '',
    subjects: result?.subjects || []
  });

  const [subjectEdits, setSubjectEdits] = useState([]);

  useEffect(() => {
    if (result?.subjects && Array.isArray(result.subjects)) {
      setSubjectEdits([...result.subjects]);
    }
  }, [result]);

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...subjectEdits];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    
    // Auto-calculate grade based on score
    if (field === 'score') {
      const score = parseFloat(value);
      if (!isNaN(score)) {
        newSubjects[index].grade = calculateGrade(score);
        newSubjects[index].points = calculatePoints(score);
      }
    }
    
    setSubjectEdits(newSubjects);
  };

  const addSubject = () => {
    setSubjectEdits([...subjectEdits, { subject: '', score: 0, grade: '', points: 0 }]);
  };

  const removeSubject = (index) => {
    setSubjectEdits(subjectEdits.filter((_, i) => i !== index));
  };

  const calculateGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'A-';
    if (score >= 60) return 'B+';
    if (score >= 55) return 'B';
    if (score >= 50) return 'B-';
    if (score >= 45) return 'C+';
    if (score >= 40) return 'C';
    if (score >= 35) return 'C-';
    if (score >= 30) return 'D+';
    if (score >= 25) return 'D';
    return 'E';
  };

  const calculatePoints = (score) => {
    const grade = calculateGrade(score);
    const pointMap = {
      'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
      'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'E': 1
    };
    return pointMap[grade] || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedResult = {
      ...formData,
      subjects: subjectEdits
    };
    await onSave(result.id, updatedResult);
  };

  const calculateOverall = () => {
    if (subjectEdits.length === 0) return { total: 0, average: 0, points: 0 };
    
    const totalScore = subjectEdits.reduce((sum, s) => sum + (parseFloat(s.score) || 0), 0);
    const totalPoints = subjectEdits.reduce((sum, s) => sum + (s.points || 0), 0);
    const average = subjectEdits.length > 0 ? totalScore / subjectEdits.length : 0;
    
    return {
      total: totalScore,
      average: parseFloat(average.toFixed(2)),
      points: totalPoints,
      count: subjectEdits.length
    };
  };

  const overall = calculateOverall();

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw',
        maxWidth: '900px',
        maxHeight: '95vh',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                <FiEdit className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit Academic Results</h2>
                <p className="text-purple-100 opacity-90 text-sm mt-1">
                  Update academic results for {student ? `${student.firstName} ${student.lastName}` : 'Student'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white bg-opacity-20 rounded-2xl">
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(95vh-80px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Info */}
            {student && (
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Student Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={`${student.firstName || ''} ${student.lastName || ''}`}
                      disabled
                      className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-50 text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Admission Number
                    </label>
                    <input
                      type="text"
                      value={result.admissionNumber}
                      disabled
                      className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-50 text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Current Form
                    </label>
                    <input
                      type="text"
                      value={student.form || 'Not set'}
                      disabled
                      className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl bg-gray-50 text-base"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Academic Information */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Form *
                  </label>
                  <select
                    required
                    value={formData.form}
                    onChange={(e) => setFormData({...formData, form: e.target.value})}
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                  >
                    <option value="">Select Form</option>
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Term *
                  </label>
                  <select
                    required
                    value={formData.term}
                    onChange={(e) => setFormData({...formData, term: e.target.value})}
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                  >
                    <option value="">Select Term</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                    placeholder="e.g., 2024/2025"
                    className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                  />
                </div>
              </div>
            </div>

            {/* Overall Performance Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-300">
              <h4 className="text-xl font-bold text-purple-900 mb-4">Performance Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700">Subjects</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.count}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700">Total Score</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.total}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700">Average</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.average}%</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700">Total Points</div>
                  <div className="text-2xl font-bold text-gray-900">{overall.points}</div>
                </div>
              </div>
            </div>

            {/* Subject Scores */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900">Subject Scores</h4>
                <button
                  type="button"
                  onClick={addSubject}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <FiPlus className="text-sm" /> Add Subject
                </button>
              </div>
              
              <div className="space-y-4">
                {subjectEdits.map((subject, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-300">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-bold text-gray-900">Subject {index + 1}</h5>
                      {subjectEdits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubject(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FiX className="text-sm" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Subject Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={subject.subject}
                          onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                          placeholder="e.g., Mathematics"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Score (%) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          max="100"
                          step="0.1"
                          value={subject.score}
                          onChange={(e) => handleSubjectChange(index, 'score', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Grade
                        </label>
                        <div className={`w-full px-4 py-3 border-2 rounded-xl font-bold text-center ${
                          subject.grade === 'A' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' :
                          subject.grade === 'B' ? 'border-green-300 bg-green-50 text-green-700' :
                          subject.grade === 'C' ? 'border-yellow-300 bg-yellow-50 text-yellow-700' :
                          subject.grade === 'D' ? 'border-orange-300 bg-orange-50 text-orange-700' :
                          subject.grade === 'E' ? 'border-red-300 bg-red-50 text-red-700' :
                          'border-gray-300 bg-gray-50 text-gray-700'
                        }`}>
                          {subject.grade || 'N/A'}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Points
                        </label>
                        <div className="w-full px-4 py-3 border-2 border-gray-300 bg-gray-50 rounded-xl font-bold text-center">
                          {subject.points || 0}
                        </div>
                      </div>
                    </div>
                    
                    {subject.score > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm font-semibold mb-1">
                          <span className="text-gray-700">Performance:</span>
                          <span className="text-purple-700">{subject.score}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                            style={{ width: `${subject.score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {subjectEdits.length === 0 && (
                  <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                    <FiBook className="text-gray-400 text-3xl mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">No subjects added yet</p>
                    <p className="text-gray-500 text-sm mt-1">Click "Add Subject" to start adding academic results</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 border-2 border-gray-400 text-gray-700 rounded-2xl font-bold text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || subjectEdits.length === 0}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl font-bold text-base shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <CircularProgress size={18} className="text-white" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="text-lg" />
                    <span>Update Academic Results</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}

// Statistics Card for Results
function ResultsStatisticsCard({ title, value, icon: Icon, color, trend = 0, prefix = '', suffix = '' }) {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return prefix + val.toLocaleString() + suffix;
    }
    return prefix + val + suffix;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="text-white text-2xl" />
        </div>
        <div className={`text-sm font-bold px-3 py-1 rounded-lg ${
          trend > 0 
            ? 'bg-green-100 text-green-800' 
            : trend < 0 
            ? 'bg-red-100 text-red-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : '0%'}
        </div>
      </div>
      <h4 className="text-3xl font-bold text-gray-900 mb-2">{formatValue(value)}</h4>
      <p className="text-gray-600 text-sm font-semibold">{title}</p>
    </div>
  );
}

// Results Chart Component
function ResultsChart({ 
  data, 
  type = 'bar', 
  title, 
  colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', 
    '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#8B5CF6'
  ],
  height = 400
}) {
  const chartColors = colors.slice(0, data.length);

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => [value, 'Count']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <RechartsTooltip 
                formatter={(value) => [`${value}%`, 'Average Score']}
              />
              <Legend />
              <Bar dataKey="value" name="Average Score (%)" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar name="Score" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <RechartsTooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <RechartsTooltip 
                formatter={(value) => [`${value}%`, 'Score']}
              />
              <Legend />
              <Bar dataKey="value" name="Score (%)" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-60 h-60 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full blur-3xl opacity-60" />
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center shadow-2xl ring-4 ring-purple-100">
              {type === 'pie' && <FiPieChart className="text-white text-xl" />}
              {type === 'bar' && <FiBarChart2 className="text-white text-xl" />}
              {type === 'radar' && <FiTarget className="text-white text-xl" />}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
              <p className="text-gray-600 text-sm">Academic performance analysis</p>
            </div>
          </div>
        </div>

        <div className="h-96">
          {data && data.length > 0 ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FiBarChart2 className="text-gray-300 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No data available for chart</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Filter Panel for Results
function ResultsFilterPanel({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  showAdvanced = false,
  onToggleAdvanced 
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters({ ...localFilters, [key]: value });
    onFilterChange(key, value);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      form: '',
      term: '',
      academicYear: '',
      subject: '',
      minScore: '',
      maxScore: '',
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl mb-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <IoFilterIcon className="text-purple-600" />
          Advanced Filters
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAdvanced}
            className="px-4 py-2 text-sm font-bold text-gray-700"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-sm font-bold text-red-600"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Admission number, student name..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Form
          </label>
          <select
            value={localFilters.form}
            onChange={(e) => handleFilterChange('form', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
          >
            <option value="">All Forms</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Term
          </label>
          <select
            value={localFilters.term}
            onChange={(e) => handleFilterChange('term', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
          >
            <option value="">All Terms</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Academic Year
          </label>
          <select
            value={localFilters.academicYear}
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
          >
            <option value="">All Years</option>
            <option value="2024/2025">2024/2025</option>
            <option value="2023/2024">2023/2024</option>
            <option value="2022/2023">2022/2023</option>
          </select>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={localFilters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              placeholder="e.g., Mathematics"
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Min Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={localFilters.minScore}
              onChange={(e) => handleFilterChange('minScore', e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Max Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={localFilters.maxScore}
              onChange={(e) => handleFilterChange('maxScore', e.target.value)}
              placeholder="100"
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
            >
              <option value="updatedAt">Last Updated</option>
              <option value="createdAt">Date Created</option>
              <option value="admissionNumber">Admission Number</option>
              <option value="averageScore">Average Score</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Component
export default function ModernResultsManagement() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [view, setView] = useState('dashboard');
  const [studentResults, setStudentResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: '', name: '' });
  
  const [filters, setFilters] = useState({
    search: '',
    form: '',
    term: '',
    academicYear: '',
    subject: '',
    minScore: '',
    maxScore: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  const [stats, setStats] = useState({
    totalResults: 0,
    averageScore: 0,
    topScore: 0,
    totalStudents: 0,
    formDistribution: {},
    termDistribution: {},
    subjectPerformance: {}
  });

  const [chartData, setChartData] = useState({
    formDistribution: [],
    termDistribution: [],
    subjectPerformance: [],
    gradeDistribution: []
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });

  const [formData, setFormData] = useState({
    term: 'Term 1',
    academicYear: '2024/2025',
    uploadedBy: 'Admin'
  });

  const fileInputRef = useRef(null);

  // Load student results
  const loadStudentResults = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/results?page=${page}&limit=${pagination.limit}&includeStudent=true`;
      
      if (filters.search) url += `&admissionNumber=${encodeURIComponent(filters.search)}`;
      if (filters.form) url += `&form=${encodeURIComponent(filters.form)}`;
      if (filters.term) url += `&term=${encodeURIComponent(filters.term)}`;
      if (filters.academicYear) url += `&academicYear=${encodeURIComponent(filters.academicYear)}`;
      if (filters.subject) url += `&subject=${encodeURIComponent(filters.subject)}`;
      if (filters.minScore) url += `&minScore=${encodeURIComponent(filters.minScore)}`;
      if (filters.maxScore) url += `&maxScore=${encodeURIComponent(filters.maxScore)}`;
      if (filters.sortBy) url += `&sortBy=${encodeURIComponent(filters.sortBy)}`;
      if (filters.sortOrder) url += `&sortOrder=${encodeURIComponent(filters.sortOrder)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to load results');
      
      if (data.success) {
        const validResults = (data.data?.results || []).filter(result => result.student);
        setStudentResults(validResults);
        setPagination({
          ...data.data?.pagination,
          total: validResults.length
        } || {
          page: page,
          limit: pagination.limit,
          total: validResults.length,
          pages: Math.ceil(validResults.length / pagination.limit)
        });
      } else {
        alert(data.error || 'Failed to load results');
      }
    } catch (error) {
      console.error('Failed to load results:', error);
      alert(error.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const res = await fetch('/api/results?action=stats');
      const data = await res.json();
      
      if (data.success) {
        const resultsRes = await fetch('/api/results?limit=1000&includeStudent=true');
        const resultsData = await resultsRes.json();
        
        if (resultsData.success) {
          const validResults = resultsData.data?.results?.filter(result => result.student) || [];
          
          // Calculate statistics
          let totalScore = 0;
          let topScore = 0;
          const formMap = new Map();
          const termMap = new Map();
          const subjectMap = new Map();
          const gradeMap = new Map();
          
          validResults.forEach(result => {
            const subjects = Array.isArray(result.subjects) ? result.subjects : 
              (typeof result.subjects === 'string' ? JSON.parse(result.subjects) : []);
            
            const studentTotal = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
            const studentAverage = subjects.length > 0 ? studentTotal / subjects.length : 0;
            
            totalScore += studentAverage;
            
            if (studentAverage > topScore) {
              topScore = studentAverage;
            }
            
            formMap.set(result.form, (formMap.get(result.form) || 0) + 1);
            termMap.set(result.term, (termMap.get(result.term) || 0) + 1);
            
            subjects.forEach(subject => {
              subjectMap.set(subject.subject, (subjectMap.get(subject.subject) || 0) + 1);
              gradeMap.set(subject.grade, (gradeMap.get(subject.grade) || 0) + 1);
            });
          });
          
          const averageScore = validResults.length > 0 ? totalScore / validResults.length : 0;
          
          setStats({
            totalResults: validResults.length,
            averageScore: parseFloat(averageScore.toFixed(2)),
            topScore: parseFloat(topScore.toFixed(2)),
            totalStudents: new Set(validResults.map(r => r.admissionNumber)).size,
            formDistribution: Object.fromEntries(formMap),
            termDistribution: Object.fromEntries(termMap),
            subjectPerformance: Object.fromEntries(subjectMap)
          });

          // Prepare chart data
          const formData = Array.from(formMap.entries()).map(([form, count]) => ({
            name: form,
            value: count
          }));

          const termData = Array.from(termMap.entries()).map(([term, count]) => ({
            name: term,
            value: count
          }));

          const subjectData = Array.from(subjectMap.entries()).slice(0, 10).map(([subject, count]) => ({
            name: subject,
            value: count
          }));

          const gradeData = Array.from(gradeMap.entries()).map(([grade, count]) => ({
            name: grade,
            value: count
          }));

          setChartData({
            formDistribution: formData,
            termDistribution: termData,
            subjectPerformance: subjectData,
            gradeDistribution: gradeData
          });
        }
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
      alert('Failed to load statistics');
    }
  };

  // Load upload history
  const loadUploadHistory = async (page = 1) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/results?action=uploads&page=${page}&limit=5`);
      const data = await res.json();
      if (data.success) {
        setUploadHistory(data.uploads || []);
      } else {
        alert('Failed to load upload history');
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      alert('Failed to load upload history');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Load student info for a result
  const loadStudentInfo = async (admissionNumber) => {
    try {
      const res = await fetch(`/api/results?action=student-results&admissionNumber=${admissionNumber}&includeStudent=true`);
      const data = await res.json();
      if (data.success) {
        return data.student || null;
      }
    } catch (error) {
      console.error('Failed to load student info:', error);
    }
    return null;
  };

  // Load student report
  const loadStudentReport = async (admissionNumber) => {
    try {
      const res = await fetch(`/api/results?action=student-report&admissionNumber=${admissionNumber}`);
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      console.error('Failed to load student report:', error);
    }
    return null;
  };

  // Initial load
  useEffect(() => {
    loadStudentResults();
    loadStatistics();
    loadUploadHistory();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      form: '',
      term: '',
      academicYear: '',
      subject: '',
      minScore: '',
      maxScore: '',
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    });
    loadStudentResults(1);
  };

  const handleSort = (field) => {
    const newSortOrder = filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: newSortOrder
    }));
    loadStudentResults(pagination.page);
  };

  const handleDrag = (active) => {
    setDragActive(active);
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    if (!formData.term || !formData.academicYear) {
      alert('Please select term and academic year');
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('term', formData.term);
    uploadFormData.append('academicYear', formData.academicYear);
    uploadFormData.append('uploadedBy', formData.uploadedBy);

    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        body: uploadFormData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      setResult(data);
      
      if (data.success) {
        alert(`✅ Upload successful! ${data.stats?.valid || 0} result records processed.`);
        
        await Promise.all([loadStudentResults(1), loadUploadHistory(1), loadStatistics()]);
        setFile(null);
        setFormData({
          term: 'Term 1',
          academicYear: '2024/2025',
          uploadedBy: 'Admin'
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (type, id, name) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      let url;
      let method = 'DELETE';
      
      if (deleteTarget.type === 'batch') {
        url = `/api/results?batchId=${deleteTarget.id}`;
      } else {
        url = `/api/results?resultId=${deleteTarget.id}`;
      }

      const res = await fetch(url, { method });
      const data = await res.json();
      
      if (data.success) {
        alert(data.message || 'Deleted successfully');
        await Promise.all([loadStudentResults(pagination.page), loadUploadHistory(1), loadStatistics()]);
        if (deleteTarget.type === 'result') {
          setSelectedResult(null);
          setSelectedStudent(null);
        }
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete');
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget({ type: '', id: '', name: '' });
    }
  };

  const updateResult = async (resultId, resultData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/results`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resultId, ...resultData })
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert('Academic results updated successfully');
        await loadStudentResults(pagination.page);
        setEditingResult(null);
        setSelectedResult(data.data);
      } else {
        alert(data.error || 'Failed to update results');
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update results');
    } finally {
      setLoading(false);
    }
  };

  const viewResultDetails = async (result) => {
    setSelectedResult(result);
    const student = await loadStudentInfo(result.admissionNumber);
    setSelectedStudent(student);
  };

  const editResult = async (result) => {
    setSelectedResult(result);
    const student = await loadStudentInfo(result.admissionNumber);
    setSelectedStudent(student);
    setEditingResult(result);
  };

  const downloadCSVTemplate = () => {
    const template = `admissionNumber,form,term,academicYear,Mathematics,English,Kiswahili,Biology,Chemistry,Physics,History,Geography,CRE
3407,Form 1,Term 1,2024/2025,85,78,82,76,80,79,81,77,83
3408,Form 2,Term 1,2024/2025,88,82,85,79,83,81,84,78,86
3409,Form 3,Term 1,2024/2025,91,85,88,82,86,84,87,81,89
3410,Form 4,Term 1,2024/2025,94,88,91,85,89,87,90,84,92`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('CSV template downloaded');
  };

  const downloadExcelTemplate = () => {
    try {
      const sampleData = [
        ['admissionNumber', 'form', 'term', 'academicYear', 'Mathematics', 'English', 'Kiswahili'],
        ['3407', 'Form 1', 'Term 1', '2024/2025', '85', '78', '82'],
        ['3408', 'Form 2', 'Term 1', '2024/2025', '88', '82', '85']
      ];

      const ws = XLSX.utils.aoa_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Academic Results");
      XLSX.writeFile(wb, 'results_template.xlsx');
      alert('Excel template downloaded');
    } catch (error) {
      console.error('Error downloading Excel template:', error);
      alert('Failed to download template');
    }
  };

  const exportResultsToCSV = () => {
    const validResults = studentResults.filter(result => result.student);
    
    if (validResults.length === 0) {
      alert('No valid results to export');
      return;
    }

    const headers = ['Admission Number', 'Student Name', 'Form', 'Term', 'Academic Year', 'Subjects', 'Average Score', 'Total Points'];
    const data = validResults.map(result => {
      const subjects = Array.isArray(result.subjects) ? result.subjects : 
        (typeof result.subjects === 'string' ? JSON.parse(result.subjects) : []);
      
      const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
      const averageScore = subjects.length > 0 ? totalScore / subjects.length : 0;
      const totalPoints = subjects.reduce((sum, s) => sum + (s.points || 0), 0);
      
      return [
        result.admissionNumber,
        result.student ? `${result.student.firstName} ${result.student.lastName}` : 'Unknown Student',
        result.form,
        result.term,
        result.academicYear,
        subjects.map(s => `${s.subject}: ${s.score}% (${s.grade})`).join('; '),
        parseFloat(averageScore.toFixed(2)),
        totalPoints
      ];
    });

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `academic_results_export_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`Exported ${validResults.length} academic results to CSV`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadStudentResults(newPage);
    }
  };

  const calculateResultAverage = (result) => {
    if (!result.subjects || !Array.isArray(result.subjects)) return 0;
    
    const subjects = result.subjects;
    const totalScore = subjects.reduce((sum, s) => sum + (s.score || 0), 0);
    return subjects.length > 0 ? parseFloat((totalScore / subjects.length).toFixed(2)) : 0;
  };

  const getGradeColor = (score) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-800';
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading && view === 'results' && studentResults.length === 0) {
    return <ResultsLoadingSpinner message="Loading academic results..." size="large" />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 rounded-2xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <IoSchool className="text-2xl text-yellow-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Academic Results Management</h1>
              <p className="text-purple-100 text-lg mt-2 max-w-2xl">
                Comprehensive academic results tracking, analysis, and reporting for all students
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => {
                setLoading(true);
                loadStatistics();
                loadStudentResults();
              }}
              disabled={loading}
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2 shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <CircularProgress size={16} color="inherit" thickness={6} />
              ) : (
                <FiRefreshCw className="text-base" />
              )}
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>

            <button
              onClick={exportResultsToCSV}
              disabled={studentResults.length === 0 || loading}
              className="text-white/80 px-6 py-3 rounded-xl font-bold text-base border border-white/20 flex items-center gap-2 disabled:opacity-50"
            >
              <FiDownload className="text-base" />
              Export Results
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-3 border-2 border-gray-200 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2 p-2">
          <button
            onClick={() => setView('dashboard')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base ${
              view === 'dashboard'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <IoAnalytics className="text-sm" />
            Dashboard
          </button>
          <button
            onClick={() => {
              setView('upload');
              setFile(null);
              setResult(null);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base ${
              view === 'upload'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <FiUpload className="text-sm" />
            Bulk Upload
          </button>
          <button
            onClick={() => {
              setView('results');
              loadStudentResults(1);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base ${
              view === 'results'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <FiBook className="text-sm" />
            Results ({stats.totalResults || 0})
          </button>
          <button
            onClick={() => {
              setView('history');
              loadUploadHistory(1);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base ${
              view === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl'
                : 'text-gray-700'
            }`}
          >
            <FiClock className="text-sm" />
            Upload History
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ResultsStatisticsCard
                title="Total Results"
                value={stats.totalResults}
                icon={FiBook}
                color="from-purple-500 to-purple-700"
                trend={8.5}
              />
              <ResultsStatisticsCard
                title="Average Score"
                value={stats.averageScore}
                icon={FiPercentIcon}
                color="from-blue-500 to-blue-700"
                trend={2.3}
                suffix="%"
              />
              <ResultsStatisticsCard
                title="Top Score"
                value={stats.topScore}
                icon={FiAward}
                color="from-emerald-500 to-emerald-700"
                trend={1.7}
                suffix="%"
              />
              <ResultsStatisticsCard
                title="Unique Students"
                value={stats.totalStudents}
                icon={FiUsers}
                color="from-indigo-500 to-indigo-700"
                trend={5.2}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ResultsChart
                data={chartData.formDistribution}
                type="pie"
                title="Form Distribution"
                colors={['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']}
                height={400}
              />
              <ResultsChart
                data={chartData.gradeDistribution}
                type="bar"
                title="Grade Distribution"
                height={400}
              />
            </div>

            {/* Recent Results */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Recent Academic Results</h3>
                <button
                  onClick={() => setView('results')}
                  className="px-4 py-2 text-purple-600 font-bold text-base flex items-center gap-2"
                >
                  View All <FiChevronRight />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Form/Term/Year</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Subjects</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Average Score</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {studentResults.slice(0, 5).map(result => {
                      const average = calculateResultAverage(result);
                      return (
                        <tr key={result.id}>
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">#{result.admissionNumber}</div>
                            {result.student && (
                              <div className="text-gray-600 text-sm">
                                {result.student.firstName} {result.student.lastName}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-gray-700">{result.form}</div>
                              <div className="text-sm text-gray-600">{result.term} {result.academicYear}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-700">
                              {result.subjects && Array.isArray(result.subjects) 
                                ? result.subjects.slice(0, 2).map(s => s.subject).join(', ')
                                : 'No subjects'}
                              {result.subjects && Array.isArray(result.subjects) && result.subjects.length > 2 && '...'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`font-bold text-xl ${getGradeColor(average).replace('bg-', 'text-')}`}>
                              {average}%
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  average >= 80 ? 'bg-emerald-500' :
                                  average >= 70 ? 'bg-green-500' :
                                  average >= 60 ? 'bg-blue-500' :
                                  average >= 50 ? 'bg-yellow-500' :
                                  average >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${average}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Upload View */}
        {view === 'upload' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-300">
                  <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-3">
                    <FiInfo className="text-purple-700 text-2xl" />
                    Upload Configuration
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Term *
                      </label>
                      <select
                        value={formData.term}
                        onChange={(e) => setFormData({...formData, term: e.target.value})}
                        className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                      >
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Academic Year *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.academicYear}
                        onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                        placeholder="e.g., 2024/2025"
                        className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-base"
                      />
                    </div>
                  </div>
                </div>

                <ResultsFileUpload
                  onFileSelect={handleFileSelect}
                  file={file}
                  onRemove={() => setFile(null)}
                  dragActive={dragActive}
                  onDrag={handleDrag}
                />

                {file && (
                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl">
                          {file.name.endsWith('.csv') ? (
                            <FiFile className="text-purple-700 text-3xl" />
                          ) : (
                            <IoDocumentText className="text-emerald-700 text-3xl" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg truncate max-w-[200px] md:max-w-none">{file.name}</p>
                          <div className="flex flex-col md:flex-row md:items-center gap-6 mt-2">
                            <span className="text-gray-600 font-semibold text-base">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <span className="px-3 py-1.5 bg-gray-100 rounded-lg font-bold text-gray-700 text-sm">
                              {file.name.split('.').pop().toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setFile(null)}
                          className="p-3 rounded-xl text-gray-600"
                        >
                          <FiX className="text-xl" />
                        </button>
                        <button
                          onClick={handleUpload}
                          disabled={uploading || !formData.term || !formData.academicYear}
                          className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl font-bold flex items-center gap-3 text-base shadow-xl disabled:opacity-50"
                        >
                          {uploading ? (
                            <>
                              <CircularProgress size={18} className="text-white" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <FiUpload className="text-base" />
                              <span>Upload Now</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Download Templates</h3>
                  <div className="space-y-4">
                    <button
                      onClick={downloadCSVTemplate}
                      className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
                    >
                      <FiFile className="text-purple-600 text-2xl" />
                      <span className="font-bold text-gray-900 text-base">CSV Template</span>
                    </button>
                    <button
                      onClick={downloadExcelTemplate}
                      className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
                    >
                      <IoDocumentText className="text-emerald-600 text-2xl" />
                      <span className="font-bold text-gray-900 text-base">Excel Template</span>
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-300 p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-purple-900 mb-6">Upload Guidelines</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-700 font-bold text-base">1</span>
                      </div>
                      <span className="text-purple-800 font-semibold text-base">Use provided templates for correct format</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-700 font-bold text-base">2</span>
                      </div>
                      <span className="text-purple-800 font-semibold text-base">Admission numbers must match existing students</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-700 font-bold text-base">3</span>
                      </div>
                      <span className="text-purple-800 font-semibold text-base">Include subject scores (0-100%)</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-700 font-bold text-base">4</span>
                      </div>
                      <span className="text-purple-800 font-semibold text-base">For Form 3/4, include only student's subject combinations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results View */}
        {view === 'results' && (
          <div className="space-y-8">
            {showFilters && (
              <ResultsFilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                showAdvanced={showFilters}
                onToggleAdvanced={() => setShowFilters(!showFilters)}
              />
            )}

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative max-w-full lg:max-w-lg">
                    <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadStudentResults(1)}
                      placeholder="Search by admission number or student name..."
                      className="w-full pl-14 pr-4 py-4 bg-white border-2 border-gray-400 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-600 text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1 lg:flex-none px-6 py-4 bg-white border-2 border-gray-400 rounded-2xl text-gray-700 font-bold flex items-center justify-center gap-3 text-base"
                  >
                    <IoFilterIcon />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>

                  <button
                    onClick={() => loadStudentResults(1)}
                    disabled={loading}
                    className="flex-1 lg:flex-none px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 text-base shadow-xl disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={18} className="text-white" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <FiSearch />
                        <span>Search</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <ResultsLoadingSpinner message="Loading academic results..." size="large" />
              </div>
            ) : (
              <>
                {studentResults.length > 0 ? (
                  <>
                    <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden shadow-2xl">
                      <div className="px-8 py-6 border-b-2 border-gray-300 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <h3 className="text-2xl font-bold text-gray-900">Academic Results ({pagination.total})</h3>
                          <div className="flex items-center gap-4">
                            <div className="text-gray-600 font-bold bg-white px-4 py-2 rounded-xl border-2 text-base">
                              Page {pagination.page} of {pagination.pages}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[768px]">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Student
                              </th>
                              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Academic Info
                              </th>
                              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Subject Performance
                              </th>
                              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Overall Score
                              </th>
                              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-2 divide-gray-200">
                            {studentResults.map(result => {
                              const average = calculateResultAverage(result);
                              const subjects = Array.isArray(result.subjects) ? result.subjects : 
                                (typeof result.subjects === 'string' ? JSON.parse(result.subjects) : []);
                              const topSubjects = subjects.slice(0, 2);
                              
                              return (
                                <tr key={result.id}>
                                  <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                        <FiUser className="text-white text-base" />
                                      </div>
                                      <div>
                                        <div className="font-bold text-gray-900 text-base">
                                          #{result.admissionNumber}
                                        </div>
                                        {result.student && (
                                          <div className="text-gray-600 text-sm">
                                            {result.student.firstName} {result.student.lastName}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-5">
                                    <div>
                                      <div className="font-bold text-gray-900">{result.form}</div>
                                      <div className="text-gray-600 text-sm">{result.term}</div>
                                      <div className="text-gray-500 text-xs">{result.academicYear}</div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-5">
                                    <div className="space-y-2">
                                      {topSubjects.map((subject, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                          <span className="text-gray-600 text-sm truncate max-w-[100px]">{subject.subject}</span>
                                          <span className={`font-bold text-sm px-2 py-1 rounded ${
                                            subject.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                                            subject.score >= 70 ? 'bg-green-100 text-green-800' :
                                            subject.score >= 60 ? 'bg-blue-100 text-blue-800' :
                                            subject.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                            subject.score >= 40 ? 'bg-orange-100 text-orange-800' :
                                            'bg-red-100 text-red-800'
                                          }`}>
                                            {subject.score}% ({subject.grade})
                                          </span>
                                        </div>
                                      ))}
                                      {subjects.length > 2 && (
                                        <div className="text-gray-500 text-xs">
                                          +{subjects.length - 2} more subjects
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-8 py-5">
                                    <div className="text-center">
                                      <div className={`text-2xl font-bold mb-1 ${
                                        average >= 80 ? 'text-emerald-700' :
                                        average >= 70 ? 'text-green-700' :
                                        average >= 60 ? 'text-blue-700' :
                                        average >= 50 ? 'text-yellow-700' :
                                        average >= 40 ? 'text-orange-700' :
                                        'text-red-700'
                                      }`}>
                                        {average}%
                                      </div>
                                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full ${
                                            average >= 80 ? 'bg-emerald-500' :
                                            average >= 70 ? 'bg-green-500' :
                                            average >= 60 ? 'bg-blue-500' :
                                            average >= 50 ? 'bg-yellow-500' :
                                            average >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                          }`}
                                          style={{ width: `${average}%` }}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => viewResultDetails(result)}
                                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm"
                                      >
                                        View
                                      </button>
                                      <button
                                        onClick={() => editResult(result)}
                                        className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDelete('result', result.id, `Results for ${result.admissionNumber}`)}
                                        className="px-3 py-2 bg-red-50 text-red-700 rounded-xl font-bold text-sm"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t-2 border-gray-300">
                        <div className="text-gray-700 font-bold text-base">
                          Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="p-3 rounded-xl border-2 border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiArrowLeft className="text-base" />
                          </button>
                          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            let pageNum;
                            if (pagination.pages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                              pageNum = i + 1;
                            } else if (pagination.page >= pagination.pages - 2) {
                              pageNum = pagination.pages - 4 + i;
                            } else {
                              pageNum = pagination.page - 2 + i;
                            }
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-12 h-12 rounded-xl font-bold text-sm ${
                                  pagination.page === pageNum
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-2xl'
                                    : 'border-2 border-gray-400'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className="p-3 rounded-xl border-2 border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiArrowRight className="text-base" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-300 shadow-xl">
                    <FiBook className="text-6xl text-gray-300 mx-auto mb-6" />
                    <p className="text-gray-600 text-xl font-bold mb-4">No academic results found</p>
                    {(filters.search || filters.form || filters.term) && (
                      <button
                        onClick={handleClearFilters}
                        className="text-purple-600 font-bold text-lg"
                      >
                        Clear filters to see all results
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* History View */}
        {view === 'history' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Upload History</h3>
                <p className="text-gray-600 mt-2 text-base">Track all your results upload activities</p>
              </div>
              <button
                onClick={() => loadUploadHistory(1)}
                disabled={historyLoading}
                className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 text-base shadow-xl disabled:opacity-50"
              >
                {historyLoading ? (
                  <>
                    <CircularProgress size={18} className="text-white" />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <FiRefreshCw />
                    <span>Refresh History</span>
                  </>
                )}
              </button>
            </div>

            {uploadHistory.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-300 shadow-xl">
                <FiClock className="text-6xl text-gray-300 mx-auto mb-6" />
                <p className="text-gray-500 text-xl font-bold mb-4">No upload history found</p>
                <p className="text-gray-400 text-base">Upload your first results file to see history here</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[768px]">
                    <thead className="bg-gradient-to-r from-gray-100 to-white">
                      <tr>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Upload Details
                        </th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Statistics
                        </th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-200">
                      {uploadHistory.map(upload => (
                        <tr key={upload.id}>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
                                <FiFile className="text-purple-700 text-xl" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-base truncate max-w-[250px] lg:max-w-md">
                                  {upload.fileName}
                                </div>
                                <div className="text-gray-600 mt-2 space-y-1">
                                  <div className="text-sm font-semibold">
                                    {upload.term} • {upload.academicYear}
                                  </div>
                                  <div className="text-sm">
                                    {new Date(upload.uploadDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    By: {upload.uploadedBy}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-5 py-2.5 rounded-xl text-sm font-bold ${
                              upload.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : upload.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {upload.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-2">
                              <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <span className="text-emerald-700 font-bold text-sm">{upload.validRows || 0} valid</span>
                                <span className="text-amber-700 font-bold text-sm">{upload.skippedRows || 0} skipped</span>
                                <span className="text-red-700 font-bold text-sm">{upload.errorRows || 0} errors</span>
                              </div>
                              <div className="text-gray-600 font-semibold text-sm">
                                Total: {upload.totalRows || 0} rows processed
                              </div>
                              {upload.resultCount > 0 && (
                                <div className="text-purple-700 font-bold text-sm">
                                  {upload.resultCount} result records created
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <button
                              onClick={() => handleDelete('batch', upload.id, upload.fileName)}
                              className="px-5 py-2.5 bg-red-50 text-red-700 rounded-xl font-bold text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedResult && !editingResult && (
        <ResultDetailModal
          result={selectedResult}
          student={selectedStudent}
          onClose={() => {
            setSelectedResult(null);
            setSelectedStudent(null);
          }}
          onEdit={() => editResult(selectedResult)}
          onDelete={(admissionNumber) => handleDelete('result', selectedResult.id, `Results for ${admissionNumber}`)}
        />
      )}

      {editingResult && (
        <ResultEditModal
          result={editingResult}
          student={selectedStudent}
          onClose={() => {
            setEditingResult(null);
            setSelectedResult(null);
            setSelectedStudent(null);
          }}
          onSave={updateResult}
          loading={loading}
        />
      )}

      {showDeleteModal && (
        <ResultsDeleteModal
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteTarget({ type: '', id: '', name: '' });
          }}
          onConfirm={confirmDelete}
          loading={loading}
          type={deleteTarget.type}
          itemName={deleteTarget.name}
        />
      )}
    </div>
  );
}