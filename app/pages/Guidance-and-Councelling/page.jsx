'use client';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiArrowRight,
  FiSearch,
  FiBookOpen,
  FiTarget,
  FiUsers,
  FiAward,
  FiStar,
  FiShield,
  FiMusic,
  FiHeart,
  FiAlertTriangle,
  FiPhone,
  FiMail,
  FiPhoneCall,
  FiMapPin,
  FiPlus,
  FiX,
  FiFilter,
  FiRotateCw,
  FiEdit3,
  FiTrash2,
  FiMessageCircle,
  FiSave,
  FiImage,
  FiUpload,
  FiEye
} from 'react-icons/fi';

// Modern Modal Component
const ModernModal = ({ children, open, onClose, maxWidth = '700px' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden"
        style={{ 
          width: '85%',
          maxWidth: maxWidth,
          maxHeight: '85vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Modern Card Component
const CounselingCard = ({ session, onView, index }) => {
  const [imageError, setImageError] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'from-blue-500 to-cyan-500',
      emotional: 'from-purple-500 to-pink-500',
      devotion: 'from-purple-500 to-pink-500',
      worship: 'from-purple-500 to-pink-500',
      support: 'from-green-500 to-emerald-500',
      drugs: 'from-red-500 to-rose-500',
      health: 'from-green-500 to-emerald-500',
      relationship: 'from-pink-500 to-rose-500',
      peer: 'from-indigo-500 to-blue-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      academic: FiTarget,
      emotional: FiHeart,
      devotion: FiHeart,
      worship: FiMusic,
      support: FiPhoneCall,
      drugs: FiAlertTriangle,
      health: FiUsers,
      relationship: FiUsers,
      peer: FiUsers
    };
    return icons[category] || FiBookOpen;
  };

  const CategoryIcon = getCategoryIcon(session?.category);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md">
      {/* Image Section */}
      {session?.image ? (
        <div className="relative h-40 overflow-hidden">
          <img
            src={session.image}
            alt={session.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-3 right-3">
            {session?.featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500">
                <FiStar className="w-3 h-3 mr-1" />
                Featured
              </span>
            )}
            {session?.isSupport && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500">
                <FiPhoneCall className="w-3 h-3 mr-1" />
                24/7 Support
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="relative h-24 bg-gradient-to-r from-blue-500 to-cyan-500">
          <div className="absolute top-3 right-3">
            {session?.featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500">
                <FiStar className="w-3 h-3 mr-1" />
                Featured
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="font-bold text-sm">{session?.counselor}</h3>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(session?.category)}`}>
            <CategoryIcon className="w-3 h-3" />
            {session?.type || 'Counseling Session'}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            session?.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
            session?.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
            'bg-yellow-100 text-yellow-800 border-yellow-200'
          } border`}>
            {session?.status?.charAt(0).toUpperCase() + session?.status?.slice(1) || 'Scheduled'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base mb-2 hover:text-blue-600 transition-colors">
          {session?.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {session?.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FiCalendar className="text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {session?.date === 'Always Available' || session?.date === 'Monday - Friday' 
                ? session.date 
                : session?.date 
                  ? new Date(session.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    }) 
                  : 'Not set'
              }
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FiClock className="text-gray-400 flex-shrink-0" />
            <span>{session?.time || 'Not set'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FiUser className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{session?.counselor || 'Not specified'}</span>
          </div>
          {session?.location && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <FiMapPin className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{session.location}</span>
            </div>
          )}
        </div>

        {/* Priority and Action */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              session?.priority === 'high' ? 'bg-red-500' :
              session?.priority === 'medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`} />
            <span className="text-xs text-gray-500 capitalize">
              {session?.priority || 'medium'} priority
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Details
            <FiArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Support Team Card
const SupportTeamCard = ({ member, onContact }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-5">
        {/* Profile */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
            <FiUser className="text-white text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
            <p className="text-blue-600 text-sm font-medium">{member.role}</p>
          </div>
        </div>

        {/* Specialization */}
        <p className="text-gray-600 text-sm mb-4">{member.specialization}</p>

        {/* Availability and Contact */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FiClock className="text-green-500 flex-shrink-0" />
            <span>{member.availability}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FiPhone className="text-blue-500 flex-shrink-0" />
            <span>{member.contact}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mb-4">
          <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
        </div>

        {/* Action */}
        <button
          onClick={onContact}
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Contact Now
        </button>
      </div>
    </div>
  );
};

// Stats Card Component
const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">{stat.label}</p>
          <p className="text-lg font-bold text-gray-900">{stat.number}</p>
        </div>
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-opacity-10 rounded-lg">
          <Icon className="text-lg text-blue-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500">{stat.sublabel}</p>
    </div>
  );
};

// Session Detail Modal
const SessionDetailModal = ({ session, onClose, onContact }) => {
  if (!session) return null;

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'from-blue-500 to-cyan-500',
      emotional: 'from-purple-500 to-pink-500',
      devotion: 'from-purple-500 to-pink-500',
      worship: 'from-purple-500 to-pink-500',
      support: 'from-green-500 to-emerald-500',
      drugs: 'from-red-500 to-rose-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      academic: FiTarget,
      emotional: FiHeart,
      devotion: FiHeart,
      worship: FiMusic,
      support: FiPhoneCall,
      drugs: FiAlertTriangle,
      health: FiUsers,
      relationship: FiUsers,
      peer: FiUsers
    };
    return icons[category] || FiBookOpen;
  };

  const CategoryIcon = getCategoryIcon(session.category);

  return (
    <ModernModal open={true} onClose={onClose}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{session.title}</h2>
              <p className="text-blue-100 opacity-90 text-sm">
                {session.type} • {session.counselor}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg cursor-pointer">
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[calc(85vh-150px)] overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Image */}
          {session.image && (
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={session.image}
                alt={session.title}
                className="w-full h-full object-cover"
              />
              {session.featured && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500">
                    <FiStar className="w-3 h-3 mr-1" />
                    Featured Session
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Status and Priority */}
          <div className="flex gap-3">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium">Status</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                session?.status === 'active' ? 'bg-green-100 text-green-800' :
                session?.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {session?.status?.charAt(0).toUpperCase() + session?.status?.slice(1) || 'Scheduled'}
              </span>
            </div>
            <div className="flex-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium">Priority</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${
                session.priority === 'high' ? 'from-red-500 to-rose-500' :
                session.priority === 'medium' ? 'from-amber-500 to-orange-500' :
                'from-emerald-500 to-green-500'
              }`}>
                {session.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
              {session.description}
            </p>
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <FiCalendar className="text-blue-500" />
                <div>
                  <p className="text-xs text-blue-600 font-medium">Date</p>
                  <p className="text-sm font-bold text-gray-800">
                    {session.date === 'Always Available' || session.date === 'Monday - Friday' 
                      ? session.date 
                      : session.date 
                        ? new Date(session.date).toLocaleDateString('en-US', { 
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) 
                        : 'Not set'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <FiClock className="text-green-500" />
                <div>
                  <p className="text-xs text-green-600 font-medium">Time</p>
                  <p className="text-sm font-bold text-gray-800">{session.time || 'Not set'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <FiUser className="text-purple-500" />
                <div>
                  <p className="text-xs text-purple-600 font-medium">Counselor</p>
                  <p className="text-sm font-bold text-gray-800">{session.counselor}</p>
                </div>
              </div>

              {session.location && (
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <FiMapPin className="text-red-500" />
                  <div>
                    <p className="text-xs text-red-600 font-medium">Location</p>
                    <p className="text-sm font-bold text-gray-800">{session.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {session.notes && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Additional Notes</h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                {session.notes}
              </p>
            </div>
          )}

          {/* Support Session Info */}
          {session.isSupport && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <FiPhoneCall className="text-green-600 text-lg" />
                <h3 className="font-bold text-gray-900">24/7 Support Available</h3>
              </div>
              <p className="text-gray-600 text-sm">
                This support service is available {session.date === 'Always Available' ? '24/7' : 'during specified hours'} to help you with any concerns or challenges you may be facing.
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
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg transition-all duration-200 font-medium"
          >
            <span className="text-sm">Close</span>
          </button>
          {session.isSupport ? (
            <button
              onClick={onContact}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-lg transition-all duration-200 font-medium"
            >
              <span className="text-sm">Contact Support</span>
            </button>
          ) : (
            <button
              onClick={() => toast.info('Session booking feature coming soon!')}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-lg transition-all duration-200 font-medium"
            >
              <span className="text-sm">Join Session</span>
            </button>
          )}
        </div>
      </div>
    </ModernModal>
  );
};

export default function StudentCounseling() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [counselingSessions, setCounselingSessions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Support team data
  const supportTeam = [
    {
      id: 1,
      name: 'School Matron',
      role: '24/7 Student Support',
      specialization: 'Health & Wellness Support',
      availability: '24/7 Emergency Support',
      contact: 'Emergency Hotline',
      description: 'Available round the clock for all student health and wellness concerns',
      priority: 'high'
    },
    {
      id: 2,
      name: 'School Patron',
      role: '24/7 Guidance',
      specialization: 'Academic & Personal Guidance',
      availability: '24/7 On-call',
      contact: 'Guidance Hotline',
      description: 'Always available for academic guidance and personal development support',
      priority: 'high'
    },
    {
      id: 3,
      name: 'Ms. Nzyko',
      role: 'Guidance Counselor',
      specialization: 'Personal Counseling & Career Guidance',
      availability: 'Mon-Fri, 8:00 AM - 4:00 PM',
      contact: 'Guidance Office',
      description: 'Professional counseling services for personal growth and career development',
      priority: 'medium'
    }
  ];

  // Stats data
  const stats = [
    { 
      icon: FiCalendar, 
      number: '15+', 
      label: 'Active Sessions', 
      sublabel: 'This month'
    },
    { 
      icon: FiPhoneCall, 
      number: '24/7', 
      label: 'Support', 
      sublabel: 'Available'
    },
    { 
      icon: FiShield, 
      number: '100%', 
      label: 'Confidential', 
      sublabel: 'All sessions'
    },
    { 
      icon: FiUsers, 
      number: '8', 
      label: 'Categories', 
      sublabel: 'Available'
    }
  ];

  // Fetch counseling sessions
  const fetchCounselingSessions = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await fetch('/api/guidance');
      const result = await response.json();
      
      if (result.success) {
        const apiSessions = result.events || [];
        const allSessions = [...getDefaultSessions(), ...apiSessions, ...getSupportSessions()];
        setCounselingSessions(allSessions);
        
        // Generate categories dynamically
        const uniqueCategories = generateCategories(allSessions);
        setCategories(uniqueCategories);
        
        if (showRefresh) {
          toast.success('Data refreshed successfully!');
        }
      } else {
        throw new Error(result.error || 'Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load counseling sessions');
      const allSessions = getAllSessions();
      setCounselingSessions(allSessions);
      setCategories(generateCategories(allSessions));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper functions
  const generateCategories = (sessions) => {
    const categorySet = new Set();
    
    const categories = [{ id: 'all', name: 'All Sessions', icon: FiBookOpen }];
    
    sessions.forEach(session => {
      if (session.category && !categorySet.has(session.category)) {
        categorySet.add(session.category);
        const IconComponent = getCategoryIcon(session.category);
        categories.push({
          id: session.category,
          name: getCategoryDisplayName(session.category),
          icon: IconComponent
        });
      }
    });
    
    return categories;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      academic: FiTarget,
      emotional: FiHeart,
      devotion: FiHeart,
      worship: FiMusic,
      support: FiPhoneCall,
      drugs: FiAlertTriangle,
      health: FiUsers,
      relationship: FiUsers,
      peer: FiUsers
    };
    return icons[category] || FiBookOpen;
  };

  const getCategoryDisplayName = (category) => {
    const names = {
      academic: 'Academic',
      emotional: 'Emotional',
      devotion: 'Devotion',
      worship: 'Worship',
      support: '24/7 Support',
      drugs: 'Drugs Awareness',
      health: 'Health',
      relationship: 'Relationship',
      peer: 'Peer Support'
    };
    return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getDefaultSessions = () => [
    {
      id: 1,
      title: 'Thursday Devotion Session',
      counselor: 'School Chaplain',
      date: getNextThursday(),
      time: '10:00 AM - 11:00 AM',
      type: 'Spiritual Session',
      category: 'devotion',
      status: 'scheduled',
      description: 'Weekly devotion session to strengthen students in religious study and worship. Strengthen your faith and build spiritual resilience.',
      notes: 'Focus on spiritual growth and moral development. Bring your Bible and notebook.',
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
      featured: true,
      location: 'School Chapel'
    },
    {
      id: 2,
      title: 'Sunday Youth Worship',
      counselor: 'Youth Leaders & CU',
      date: getNextSunday(),
      time: '2:00 PM - 4:00 PM',
      type: 'Youth Worship',
      category: 'worship',
      status: 'scheduled',
      description: 'Youth worship session with CU and YCS active worship groups. Experience powerful praise and worship with fellow students.',
      notes: 'Music, praise, and fellowship. All students welcome.',
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      featured: true,
      location: 'Nyaribu Church'
    },
    {
      id: 3,
      title: 'University Guidance Session',
      counselor: 'Mr. James Omondi',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '10:00 AM - 11:00 AM',
      type: 'Career Counseling',
      category: 'academic',
      status: 'scheduled',
      description: 'Comprehensive university applications and career pathways discussion. Get guidance on course selection and scholarship opportunities.',
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      featured: false,
      location: 'Guidance Office'
    },
    {
      id: 4,
      title: 'Drug Awareness Program',
      counselor: 'Health Department',
      date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      time: '2:00 PM - 3:30 PM',
      type: 'Awareness Workshop',
      category: 'drugs',
      status: 'scheduled',
      description: 'Drug abuse awareness and prevention program. Learn about the dangers of substance abuse and healthy alternatives.',
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1551376347-075b0121a65b?w=800&q=80',
      featured: true,
      location: 'School Hall'
    }
  ];

  const getSupportSessions = () => [
    {
      id: 'support-1',
      title: '24/7 Matron Support',
      counselor: 'School Matron',
      date: 'Always Available',
      time: '24/7',
      type: 'Emergency Support',
      category: 'support',
      status: 'active',
      description: 'Round-the-clock health and wellness support. Immediate assistance for any health concerns or emergencies.',
      notes: 'Available anytime for medical emergencies, health consultations, and wellness support.',
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
      featured: true,
      isSupport: true,
      location: 'Matron\'s Office'
    },
    {
      id: 'support-2',
      title: '24/7 Patron Guidance',
      counselor: 'School Patron',
      date: 'Always Available',
      time: '24/7',
      type: 'Guidance Support',
      category: 'support',
      status: 'active',
      description: 'Always available for academic guidance, personal development, and emergency counseling.',
      notes: 'On-call support for academic guidance and personal development issues.',
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1551836026-d5c88ac5d691?w=800&q=80',
      featured: true,
      isSupport: true,
      location: 'Patron\'s Office'
    },
    {
      id: 'support-3',
      title: 'Personal Guidance - Ms. Nzyko',
      counselor: 'Ms. Nzyko',
      date: 'Monday - Friday',
      time: '8:00 AM - 4:00 PM',
      type: 'Professional Counseling',
      category: 'support',
      status: 'active',
      description: 'Professional counseling services for personal growth, career guidance, and emotional support.',
      notes: 'Schedule appointments for personalized counseling sessions.',
      priority: 'medium',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
      featured: true,
      isSupport: true,
      location: 'Guidance Office'
    }
  ];

  const getAllSessions = () => {
    return [...getDefaultSessions(), ...getSupportSessions()];
  };

  function getNextThursday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7;
    const nextThursday = new Date(today);
    nextThursday.setDate(today.getDate() + daysUntilThursday);
    return nextThursday.toISOString().split('T')[0];
  }

  function getNextSunday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = (0 - dayOfWeek + 7) % 7 || 7;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
    return nextSunday.toISOString().split('T')[0];
  }

  useEffect(() => {
    fetchCounselingSessions();
  }, []);

  // Filter sessions
  const filteredSessions = counselingSessions.filter(session => {
    const matchesTab = activeTab === 'all' || session.category === activeTab;
    const matchesSearch = searchTerm === '' || 
      session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.counselor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleContactSupport = (member) => {
    toast.success(`Contacting ${member.name}...`);
    // Implement contact logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 text-sm mt-3 font-medium">Loading Counseling Sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <FiHeart className="text-white text-lg w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                  Student Counseling & Support
                </h1>
                <p className="text-gray-600 mt-1">Comprehensive support for academic, emotional, and spiritual well-being</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <button
              onClick={() => fetchCounselingSessions(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-xs border border-gray-200 font-medium disabled:opacity-50 text-sm md:text-base"
            >
              <FiRotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => toast.info('Request counseling feature coming soon!')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-lg font-medium text-sm md:text-base"
            >
              <FiPlus className="w-4 h-4" />
              Request Counseling
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* 24/7 Support Team Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <FiPhoneCall className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">24/7 Support Team</h2>
              </div>
              <p className="text-gray-600">Always available to support you anytime, anywhere</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {supportTeam.map((member) => (
              <SupportTeamCard
                key={member.id}
                member={member}
                onContact={() => handleContactSupport(member)}
              />
            ))}
          </div>
        </div>

        {/* Counseling Sessions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Available Counseling Sessions</h2>
              <p className="text-gray-600">Browse and join sessions for support and guidance</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-3 mt-4 lg:mt-0">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm w-full lg:w-64"
                />
              </div>
              
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
              >
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap text-sm font-medium ${
                    activeTab === category.id
                      ? 'bg-blue-500 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Sessions Grid */}
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="text-gray-400 w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sessions Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || activeTab !== 'all' 
                  ? 'No sessions match your current filters. Try adjusting your search criteria.' 
                  : 'No counseling sessions available at the moment.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session, index) => (
                <CounselingCard 
                  key={session.id || index}
                  session={session}
                  index={index}
                  onView={() => setSelectedSession(session)}
                />
              ))}
            </div>
          )}
          
          {/* Results Count */}
          {filteredSessions.length > 0 && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredSessions.length}</span> of{' '}
                <span className="font-semibold">{counselingSessions.length}</span> sessions
              </div>
            </div>
          )}
        </div>

        {/* Information Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <FiShield className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Confidential & Safe Environment</h3>
              <p className="text-gray-600 mb-3">
                All counseling sessions are confidential and conducted in a safe, supportive environment. 
                Our trained counselors and support staff are here to help you with any challenges you may be facing.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiShield className="text-green-500" />
                  <span>100% Confidential</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FiHeart className="text-red-500" />
                  <span>Non-judgmental Support</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FiPhoneCall className="text-blue-500" />
                  <span>24/7 Availability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onContact={() => {
            setSelectedSession(null);
            toast.success('Contacting support...');
          }}
        />
      )}
    </div>
  );
}