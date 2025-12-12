'use client'

import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Search,
  Filter,
  X,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Users,
  RefreshCw,
  Star,
  GraduationCap,
  Hash,
  TrendingUp,
  TrendingDown,
  Grid,
  List,
  Download,
  Percent,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Award,
  Trophy
} from 'lucide-react'

// ====================================================================
// DECISION MAKING DASHBOARD COMPONENT
// ====================================================================

export default function EnhancedDecisionDashboard() {
  // Main State
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // View States
  const [activeView, setActiveView] = useState('all') // 'all', 'pending', 'decided'
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterStream, setFilterStream] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  
  // Decision State
  const [decisionData, setDecisionData] = useState({
    status: '',
    notes: '',
    admissionClass: '',
    assignedStream: '',
    reportingDate: '',
    feeStructure: '',
    conditions: '',
    conditionDeadline: '',
    rejectionReason: '',
    alternativeSuggestions: '',
    waitlistPosition: '',
    waitlistNotes: '',
    sendEmail: true,
    admissionOfficer: 'Admissions Committee'
  })
  
  // Loading States
  const [loadingStates, setLoadingStates] = useState({
    detail: false,
    decision: false
  })
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    interviewScheduled: 0,
    interviewed: 0,
    accepted: 0,
    conditional: 0,
    waitlisted: 0,
    rejected: 0,
    withdrawn: 0,
    decisionRate: 0
  })
  
  // Stream data
  const streams = [
    { value: 'SCIENCE', label: 'Science', icon: '🔬', color: 'from-blue-500 to-cyan-500' },
    { value: 'ARTS', label: 'Arts', icon: '🎨', color: 'from-purple-500 to-pink-500' },
    { value: 'BUSINESS', label: 'Business', icon: '💼', color: 'from-green-500 to-emerald-500' },
    { value: 'TECHNICAL', label: 'Technical', icon: '⚙️', color: 'from-orange-500 to-red-500' }
  ]
  
  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'INTERVIEWED', label: 'Interviewed', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'ACCEPTED', label: 'Accepted', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { value: 'CONDITIONAL_ACCEPTANCE', label: 'Conditional', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { value: 'WAITLISTED', label: 'Waitlisted', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { value: 'REJECTED', label: 'Rejected', color: 'bg-rose-100 text-rose-800 border-rose-200' }
  ]
  
  // Decision types
  const decisionTypes = [
    { value: 'ACCEPTED', label: 'Accept', color: 'bg-emerald-500 hover:bg-emerald-600', icon: CheckCircle2 },
    { value: 'CONDITIONAL_ACCEPTANCE', label: 'Conditional', color: 'bg-teal-500 hover:bg-teal-600', icon: ShieldCheck },
    { value: 'WAITLISTED', label: 'Waitlist', color: 'bg-amber-500 hover:bg-amber-600', icon: Clock },
    { value: 'REJECTED', label: 'Reject', color: 'bg-rose-500 hover:bg-rose-600', icon: XCircle },
    { value: 'INTERVIEW_SCHEDULED', label: 'Schedule Interview', color: 'bg-indigo-500 hover:bg-indigo-600', icon: Calendar },
    { value: 'UNDER_REVIEW', label: 'Mark for Review', color: 'bg-blue-500 hover:bg-blue-600', icon: Eye }
  ]
  
  // Fetch applications
  useEffect(() => {
    fetchApplications()
  }, [])
  
  const fetchApplications = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/applyadmission')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        const apps = data.applications || []
        setApplications(apps)
        updateStats(apps)
      } else {
        toast.error(data.error || 'Failed to load applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Network error. Please check your connection.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }
  
  const updateStats = (apps) => {
    const newStats = {
      total: apps.length,
      pending: 0,
      underReview: 0,
      interviewScheduled: 0,
      interviewed: 0,
      accepted: 0,
      conditional: 0,
      waitlisted: 0,
      rejected: 0,
      withdrawn: 0,
      decisionRate: 0
    }
    
    apps.forEach(app => {
      if (app.status === 'PENDING') newStats.pending++
      if (app.status === 'UNDER_REVIEW') newStats.underReview++
      if (app.status === 'INTERVIEW_SCHEDULED') newStats.interviewScheduled++
      if (app.status === 'INTERVIEWED') newStats.interviewed++
      if (app.status === 'ACCEPTED') newStats.accepted++
      if (app.status === 'CONDITIONAL_ACCEPTANCE') newStats.conditional++
      if (app.status === 'WAITLISTED') newStats.waitlisted++
      if (app.status === 'REJECTED') newStats.rejected++
      if (app.status === 'WITHDRAWN') newStats.withdrawn++
    })
    
    // Calculate decision rate
    const decided = apps.filter(app => 
      app.status !== 'PENDING' && app.status !== 'UNDER_REVIEW'
    ).length
    newStats.decisionRate = newStats.total > 0 
      ? Math.round((decided / newStats.total) * 100) 
      : 0
    
    setStats(newStats)
  }
  
  // Filter and categorize applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter(app => {
        const matchesSearch = 
          (app.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (app.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (app.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (app.phone?.includes(searchTerm) || false) ||
          (app.applicationNumber?.includes(searchTerm) || false)
        
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus
        const matchesStream = filterStream === 'all' || app.preferredStream === filterStream
        
        // Date filtering
        let matchesDate = true
        if (startDate || endDate) {
          const appDate = new Date(app.createdAt)
          if (startDate) {
            const start = new Date(startDate)
            if (appDate < start) matchesDate = false
          }
          if (endDate) {
            const end = new Date(endDate)
            if (appDate > end) matchesDate = false
          }
        }
        
        // View filtering
        let matchesView = true
        if (activeView === 'pending') {
          matchesView = app.status === 'PENDING' || app.status === 'UNDER_REVIEW'
        } else if (activeView === 'decided') {
          matchesView = app.status !== 'PENDING' && app.status !== 'UNDER_REVIEW'
        }
        
        return matchesSearch && matchesStatus && matchesStream && matchesDate && matchesView
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          case 'oldest':
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
          case 'name-asc':
            return `${a.firstName || ''} ${a.lastName || ''}`.localeCompare(`${b.firstName || ''} ${b.lastName || ''}`)
          case 'name-desc':
            return `${b.firstName || ''} ${b.lastName || ''}`.localeCompare(`${a.firstName || ''} ${a.lastName || ''}`)
          case 'score-high':
            return (b.kcpeMarks || 0) - (a.kcpeMarks || 0)
          case 'score-low':
            return (a.kcpeMarks || 0) - (b.kcpeMarks || 0)
          default:
            return 0
        }
      })
  }, [applications, searchTerm, filterStatus, filterStream, startDate, endDate, activeView, sortBy])
  
  // Get applications for current view
  const currentApplications = useMemo(() => {
    return filteredApplications
  }, [filteredApplications])
  
  // View application details
  const viewApplicationDetails = async (application) => {
    try {
      setLoadingStates(prev => ({ ...prev, detail: true }))
      const response = await fetch(`/api/applyadmission/${application.id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setSelectedApplication(data.application)
        setShowDetailModal(true)
      } else {
        toast.error(data.error || 'Failed to load application details')
      }
    } catch (error) {
      console.error('Error fetching application details:', error)
      toast.error('Network error')
    } finally {
      setLoadingStates(prev => ({ ...prev, detail: false }))
    }
  }
  
  // Open decision modal
  const openDecisionModal = (application, decisionType = null) => {
    setSelectedApplication(application)
    setDecisionData({
      status: decisionType || application.status,
      notes: '',
      admissionClass: application.admissionClass || '',
      assignedStream: application.assignedStream || application.preferredStream || '',
      reportingDate: application.reportingDate || '',
      feeStructure: '',
      conditions: application.conditions || '',
      conditionDeadline: application.conditionDeadline || '',
      rejectionReason: application.rejectionReason || '',
      alternativeSuggestions: application.alternativeSuggestions || '',
      waitlistPosition: application.waitlistPosition || '',
      waitlistNotes: application.waitlistNotes || '',
      sendEmail: true,
      admissionOfficer: 'Admissions Committee'
    })
    setShowDecisionModal(true)
  }
  
  // Update application status
  const updateApplicationStatus = async () => {
    if (!selectedApplication) return
    
    try {
      setLoadingStates(prev => ({ ...prev, decision: true }))
      
      const requestBody = {
        status: decisionData.status,
        notes: decisionData.notes,
        admissionOfficer: decisionData.admissionOfficer,
        decisionDate: new Date().toISOString()
      }
      
      // Add decision-specific data
      if (decisionData.status === 'ACCEPTED') {
        requestBody.assignedStream = decisionData.assignedStream
        requestBody.admissionClass = decisionData.admissionClass
        requestBody.reportingDate = decisionData.reportingDate
        requestBody.admissionDate = new Date().toISOString()
      } else if (decisionData.status === 'REJECTED') {
        requestBody.rejectionReason = decisionData.rejectionReason
        requestBody.alternativeSuggestions = decisionData.alternativeSuggestions
        requestBody.rejectionDate = new Date().toISOString()
      } else if (decisionData.status === 'WAITLISTED') {
        requestBody.waitlistPosition = decisionData.waitlistPosition
        requestBody.waitlistNotes = decisionData.waitlistNotes
      } else if (decisionData.status === 'CONDITIONAL_ACCEPTANCE') {
        requestBody.conditions = decisionData.conditions
        requestBody.conditionDeadline = decisionData.conditionDeadline
      }
      
      const response = await fetch(`/api/applyadmission/${selectedApplication.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Application ${decisionData.status.toLowerCase()} successfully`)
        
        // Update local state
        const updatedApplications = applications.map(app => 
          app.id === selectedApplication.id ? { 
            ...app, 
            ...requestBody,
            status: decisionData.status
          } : app
        )
        
        setApplications(updatedApplications)
        updateStats(updatedApplications)
        
        // Close modal
        setShowDecisionModal(false)
        setSelectedApplication(null)
        setDecisionData({
          status: '',
          notes: '',
          admissionClass: '',
          assignedStream: '',
          reportingDate: '',
          feeStructure: '',
          conditions: '',
          conditionDeadline: '',
          rejectionReason: '',
          alternativeSuggestions: '',
          waitlistPosition: '',
          waitlistNotes: '',
          sendEmail: true,
          admissionOfficer: 'Admissions Committee'
        })
      } else {
        toast.error(data.error || 'Failed to update application')
      }
    } catch (error) {
      console.error('Error updating application:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setLoadingStates(prev => ({ ...prev, decision: false }))
    }
  }
  
  // Calculate application score
  const getApplicationScore = (application) => {
    let score = 0
    
    if (application.kcpeMarks) {
      score += (application.kcpeMarks / 500) * 40
    }
    
    if (application.meanGrade && ['A', 'A-'].includes(application.meanGrade.toUpperCase())) score += 20
    
    const hasExtracurricular = application.sportsInterests || application.clubsInterests || application.talents
    if (hasExtracurricular) score += 10
    
    const completeFields = ['fatherName', 'motherName', 'medicalCondition', 'bloodGroup']
    const completed = completeFields.filter(field => application[field]).length
    score += (completed / completeFields.length) * 20
    
    return Math.min(100, Math.round(score))
  }
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-r from-emerald-500 to-green-500'
    if (score >= 60) return 'bg-gradient-to-r from-blue-500 to-cyan-500'
    if (score >= 40) return 'bg-gradient-to-r from-amber-500 to-orange-500'
    return 'bg-gradient-to-r from-rose-500 to-red-500'
  }
  
  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status)
    if (!statusConfig) return null
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
        {statusConfig.label}
      </span>
    )
  }
  
  const getStreamBadge = (streamValue) => {
    const stream = streams.find(s => s.value === streamValue) || streams[0]
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200">
        <span>{stream.icon}</span>
        {stream.label}
      </span>
    )
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A'
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
  
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-6 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="h-2 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-xl shadow-xs border border-gray-100">
              <GraduationCap className="text-blue-600 text-lg w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent">
                Nyaribu Admissions Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Review and make decisions on admission applications</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={fetchApplications}
            disabled={refreshing}
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xs border border-gray-200 font-medium cursor-pointer disabled:opacity-50 text-sm md:text-base"
          >
            <RefreshCw className={`text-sm w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium cursor-pointer text-sm md:text-base">
            <Download className="text-sm w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveView('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeView === 'all'
              ? 'bg-gray-800 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            All Applications ({stats.total})
          </div>
        </button>
        <button
          onClick={() => setActiveView('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeView === 'pending'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Decisions ({stats.pending + stats.underReview})
          </div>
        </button>
        <button
          onClick={() => setActiveView('decided')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeView === 'decided'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Decisions Made ({stats.total - (stats.pending + stats.underReview)})
          </div>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, icon: Users, color: 'blue', change: 'applications' },
          { label: 'Pending', value: stats.pending + stats.underReview, icon: Clock, color: 'yellow', change: 'needs review' },
          { label: 'Accepted', value: stats.accepted, icon: CheckCircle2, color: 'emerald', change: 'admissions' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'rose', change: 'rejections' },
          { label: 'Interview', value: stats.interviewScheduled + stats.interviewed, icon: UserCheck, color: 'purple', change: 'interviews' },
          { label: 'Decision Rate', value: `${stats.decisionRate}%`, icon: Percent, color: 'indigo', change: 'processed' }
        ].map((stat, index) => (
          <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-3 md:p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
              <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                <stat.icon className={`text-${stat.color}-600 text-base w-4 h-4`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            
            <select 
              value={filterStream}
              onChange={(e) => setFilterStream(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="all">All Streams</option>
              {streams.map(stream => (
                <option key={stream.value} value={stream.value}>{stream.label}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="From"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="To"
              />
            </div>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="score-high">Highest Score</option>
              <option value="score-low">Lowest Score</option>
            </select>
            
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'} hover:bg-gray-50 transition-all duration-200`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'} hover:bg-gray-50 transition-all duration-200`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : currentApplications.length === 0 ? (
        <div className="col-span-full text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60">
          <Users className="text-gray-400 w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600 mb-4">
            {activeView === 'pending' 
              ? 'No pending applications to review'
              : activeView === 'decided'
              ? 'No decisions have been made yet'
              : 'No applications match your filters'
            }
          </p>
        </div>
      ) : (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 md:gap-6`}>
          {currentApplications.map((application) => {
            const score = getApplicationScore(application)
            
            return (
              <div 
                key={application.id} 
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 md:p-6 hover:shadow-md transition-all duration-300 hover:border-gray-300/60"
              >
                {/* Header with applicant info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <User className="text-white w-6 h-6" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${score >= 80 ? 'bg-gradient-to-r from-red-500 to-pink-500' : score >= 60 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'} rounded-full flex items-center justify-center`}>
                          <Star className="text-white w-3 h-3" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {application.firstName} {application.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {calculateAge(application.dateOfBirth)} years • {application.gender}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(application.status)}
                        {getStreamBadge(application.preferredStream)}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="text-gray-400 w-4 h-4" />
                        <span className="truncate">{application.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="text-gray-400 w-4 h-4" />
                        <span>{application.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="text-gray-400 w-4 h-4" />
                        <span>{application.county}</span>
                      </div>
                      
                      {application.kcpeMarks && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">KCPE Score:</span>
                          <span className="text-lg font-bold text-gray-900">{application.kcpeMarks}/500</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Application Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Application Score</span>
                    <span className="text-lg font-bold text-gray-900">{score}/100</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getScoreColor(score)}`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Decision buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => viewApplicationDetails(application)}
                    disabled={loadingStates.detail}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all duration-200 text-sm font-medium flex-1 disabled:opacity-50"
                  >
                    {loadingStates.detail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                    View Details
                  </button>
                  
                  {(activeView === 'pending' || activeView === 'all') && (
                    <button
                      onClick={() => openDecisionModal(application)}
                      className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-all duration-200 text-sm font-medium flex-1"
                    >
                      <Edit className="w-4 h-4" />
                      Make Decision
                    </button>
                  )}
                </div>

                {/* Quick decision buttons for pending applications */}
                {(activeView === 'pending' || activeView === 'all') && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {decisionTypes.slice(0, 4).map(decision => (
                      <button
                        key={decision.value}
                        onClick={() => openDecisionModal(application, decision.value)}
                        className={`inline-flex items-center justify-center gap-1 px-3 py-2 ${decision.color} text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium`}
                      >
                        <decision.icon className="w-4 h-4" />
                        {decision.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(application.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-3 h-3" />
                    <span>{application.applicationNumber}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Application Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Application Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800">
                    <strong>Application Number:</strong> {selectedApplication.applicationNumber}<br />
                    <strong>Status:</strong> {selectedApplication.status}<br />
                    <strong>Submitted:</strong> {formatDate(selectedApplication.createdAt)}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{selectedApplication.firstName} {selectedApplication.middleName} {selectedApplication.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gender & Age</p>
                        <p className="font-medium">{selectedApplication.gender}, {calculateAge(selectedApplication.dateOfBirth)} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-medium">{formatDate(selectedApplication.dateOfBirth)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Nationality</p>
                        <p className="font-medium">{selectedApplication.nationality}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedApplication.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{selectedApplication.postalAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">County</p>
                        <p className="font-medium">{selectedApplication.county}, {selectedApplication.constituency}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Academic Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      Academic Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Previous School</p>
                        <p className="font-medium">{selectedApplication.previousSchool}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Previous Class</p>
                        <p className="font-medium">{selectedApplication.previousClass}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">KCPE Marks</p>
                        <p className="font-medium">{selectedApplication.kcpeMarks || 'N/A'}/500</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Preferred Stream</p>
                        <p className="font-medium">{selectedApplication.preferredStream}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Parent/Guardian Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Parent/Guardian Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Father's Name</p>
                        <p className="font-medium">{selectedApplication.fatherName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Mother's Name</p>
                        <p className="font-medium">{selectedApplication.motherName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Guardian's Name</p>
                        <p className="font-medium">{selectedApplication.guardianName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Guardian's Phone</p>
                        <p className="font-medium">{selectedApplication.guardianPhone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    openDecisionModal(selectedApplication)
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                >
                  Make Decision
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {showDecisionModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Make Decision</h3>
              <button
                onClick={() => setShowDecisionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800">
                    <strong>Applicant:</strong> {selectedApplication.firstName} {selectedApplication.lastName}<br />
                    <strong>Application:</strong> {selectedApplication.applicationNumber}<br />
                    <strong>Current Status:</strong> {selectedApplication.status}
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Decision Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {decisionTypes.map(decision => (
                      <button
                        key={decision.value}
                        onClick={() => setDecisionData({...decisionData, status: decision.value})}
                        className={`p-4 border rounded-lg text-left transition-all duration-200 cursor-pointer ${
                          decisionData.status === decision.value
                            ? 'ring-2 ring-blue-500 border-blue-500'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${decision.color.split(' ')[0]}`}>
                            <decision.icon className="text-white w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-medium text-sm">{decision.label}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Additional fields based on decision type */}
                {decisionData.status === 'ACCEPTED' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Stream</label>
                      <select 
                        value={decisionData.assignedStream}
                        onChange={(e) => setDecisionData({...decisionData, assignedStream: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Stream</option>
                        {streams.map(stream => (
                          <option key={stream.value} value={stream.value}>{stream.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Admission Class</label>
                        <input
                          type="text"
                          value={decisionData.admissionClass}
                          onChange={(e) => setDecisionData({...decisionData, admissionClass: e.target.value})}
                          placeholder="e.g., Form 1A"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Date</label>
                        <input
                          type="date"
                          value={decisionData.reportingDate}
                          onChange={(e) => setDecisionData({...decisionData, reportingDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {decisionData.status === 'REJECTED' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                      <textarea
                        value={decisionData.rejectionReason}
                        onChange={(e) => setDecisionData({...decisionData, rejectionReason: e.target.value})}
                        placeholder="Enter reason for rejection..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Suggestions</label>
                      <textarea
                        value={decisionData.alternativeSuggestions}
                        onChange={(e) => setDecisionData({...decisionData, alternativeSuggestions: e.target.value})}
                        placeholder="Suggest alternative schools or paths..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                      />
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Decision Notes</label>
                  <textarea
                    value={decisionData.notes}
                    onChange={(e) => setDecisionData({...decisionData, notes: e.target.value})}
                    placeholder="Add notes about this decision..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={decisionData.sendEmail}
                    onChange={(e) => setDecisionData({...decisionData, sendEmail: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="sendEmail" className="text-sm text-gray-700">
                    Send email notification to applicant
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={updateApplicationStatus}
                  disabled={!decisionData.status || loadingStates.decision}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingStates.decision ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Submit Decision'
                  )}
                </button>
                <button
                  onClick={() => setShowDecisionModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}