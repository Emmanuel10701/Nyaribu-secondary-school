'use client';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiArrowRight,
  FiShare2,
  FiSearch,
  FiHeart,
  FiX,
  FiLink,
  FiMessageCircle,
  FiPlus,
  FiFilter,
  FiRotateCw,
  FiEye,
  FiTrash2,
  FiEdit3
} from 'react-icons/fi';
import { 
  IoNewspaperOutline,
  IoCalendarClearOutline
} from 'react-icons/io5';

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

// Modern Card Component for Events
const EventCard = ({ event, onView, onShare, onCalendar, index }) => {
  const [imageError, setImageError] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'from-blue-500 to-cyan-500',
      cultural: 'from-purple-500 to-pink-500',
      sports: 'from-green-500 to-emerald-500',
      default: 'from-gray-500 to-gray-600'
    };
    return colors[category] || colors.default;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString || 'Date not set';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time not set';
    return timeString;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md">
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1541336032412-2048a678540d?w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-3 right-3">
          {event.featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500">
              Featured
            </span>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(event.category)}`}>
            {event.category || 'Event'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base mb-2 hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FiCalendar className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FiClock className="text-gray-400 flex-shrink-0" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FiMapPin className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{event.location || 'Location not set'}</span>
          </div>
          {event.attendees && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <FiUsers className="text-gray-400 flex-shrink-0" />
              <span>{event.attendees} attendees</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCalendar();
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
            title="Add to Calendar"
          >
            Add to Calendar
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Share"
            >
              <FiShare2 className="w-3 h-3 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
            >
              Details
              <FiArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Card Component for News
const NewsCard = ({ news, onView, onShare, index }) => {
  const [imageError, setImageError] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      achievement: 'from-green-500 to-emerald-500',
      development: 'from-blue-500 to-cyan-500',
      announcement: 'from-purple-500 to-pink-500',
      default: 'from-gray-500 to-gray-600'
    };
    return colors[category] || colors.default;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString || 'Date not set';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md">
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={news.image || 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=800&q=80'}
          alt={news.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(news.category)}`}>
            {news.category || 'News'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base mb-2 hover:text-blue-600 transition-colors line-clamp-2">
          {news.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {news.excerpt || news.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FiCalendar className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{formatDate(news.date)}</span>
          </div>
          {news.author && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <FiUsers className="text-gray-400 flex-shrink-0" />
              <span className="truncate">By {news.author}</span>
            </div>
          )}
          {news.likes && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <FiHeart className="text-red-400 flex-shrink-0" />
              <span>{news.likes} likes</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {formatDate(news.date)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Share"
            >
              <FiShare2 className="w-3 h-3 text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
            >
              Read
              <FiArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
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

// Share Modal Component
const ShareModal = ({ item, type = 'event', onClose }) => {
  const [copied, setCopied] = useState(false);

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: '📱',
      color: 'bg-green-100 hover:bg-green-200 text-green-800 border-green-200',
      action: () => {
        const text = `${item.title}\n\n${type === 'event' ? '🎉 Event Details:' : '📰 News:'}\n${item.description}\n\n${type === 'event' ? `📅 Date: ${item.date}\n⏰ Time: ${item.time}\n📍 Location: ${item.location}` : `📅 Published: ${item.date}`}\n\n🔗 Share this ${type}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200',
      action: () => {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      }
    },
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-200',
      action: () => {
        const text = `${item.title} - Check out this ${type === 'event' ? 'event' : 'news'}!`;
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      }
    },
    {
      name: 'Email',
      icon: '📧',
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200',
      action: () => {
        const subject = `${item.title} - ${type === 'event' ? 'Event' : 'News'}`;
        const body = `${item.description}\n\n${type === 'event' ? `Date: ${item.date}\nTime: ${item.time}\nLocation: ${item.location}` : `Published: ${item.date}`}\n\n`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    }
  ];

  const copyToClipboard = () => {
    const text = `${item.title}\n\n${item.description}\n\n${type === 'event' ? `Date: ${item.date} | Time: ${item.time} | Location: ${item.location}` : `Published: ${item.date}`}\n\n${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <ModernModal open={true} onClose={onClose}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <FiShare2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Share {type === 'event' ? 'Event' : 'News'}</h2>
              <p className="text-blue-100 opacity-90 text-sm">
                {item.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg cursor-pointer">
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {socialPlatforms.map((platform, index) => (
            <button
              key={index}
              onClick={platform.action}
              className={`p-4 rounded-xl border ${platform.color} transition-all duration-200 flex flex-col items-center justify-center gap-2`}
            >
              <span className="text-2xl">{platform.icon}</span>
              <span className="font-medium text-sm">{platform.name}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <button
            onClick={copyToClipboard}
            className="w-full p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-3"
          >
            <FiLink className="text-blue-600" />
            <span className="font-medium text-blue-700">
              {copied ? 'Copied!' : 'Copy Link to Clipboard'}
            </span>
          </button>
        </div>
      </div>
    </ModernModal>
  );
};

// Detail Modal Component
const DetailModal = ({ item, type = 'event', onClose, onAddToCalendar, onShare }) => {
  const formatFullDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString || 'Date not set';
    }
  };

  return (
    <ModernModal open={true} onClose={onClose}>
      {/* Header with Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image || (type === 'event' 
            ? 'https://images.unsplash.com/photo-1541336032412-2048a678540d?w=800&q=80'
            : 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=800&q=80')}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-xl font-bold">{item.title}</h2>
          <p className="text-sm opacity-90">
            {type === 'event' ? `📍 ${item.location}` : `📅 ${formatFullDate(item.date)}`}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <FiX className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3">Description</h3>
          <p className="text-gray-600 leading-relaxed">
            {item.description || item.excerpt}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {type === 'event' ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <FiCalendar className="text-blue-500" />
                <div>
                  <p className="text-xs text-blue-600 font-medium">Date</p>
                  <p className="text-sm font-bold text-gray-800">{formatFullDate(item.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <FiClock className="text-green-500" />
                <div>
                  <p className="text-xs text-green-600 font-medium">Time</p>
                  <p className="text-sm font-bold text-gray-800">{item.time || 'Time not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <FiMapPin className="text-red-500" />
                <div>
                  <p className="text-xs text-red-600 font-medium">Location</p>
                  <p className="text-sm font-bold text-gray-800">{item.location || 'Location not set'}</p>
                </div>
              </div>
              {item.attendees && (
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <FiUsers className="text-purple-500" />
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Expected Attendance</p>
                    <p className="text-sm font-bold text-gray-800">{item.attendees} attendees</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <FiCalendar className="text-blue-500" />
                <div>
                  <p className="text-xs text-blue-600 font-medium">Published Date</p>
                  <p className="text-sm font-bold text-gray-800">{formatFullDate(item.date)}</p>
                </div>
              </div>
              {item.author && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <FiUsers className="text-green-500" />
                  <div>
                    <p className="text-xs text-green-600 font-medium">Author</p>
                    <p className="text-sm font-bold text-gray-800">{item.author}</p>
                  </div>
                </div>
              )}
              <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.category === 'achievement' ? 'bg-green-100 text-green-800' :
                  item.category === 'development' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {item.category || 'News'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Content for news */}
        {type === 'news' && item.fullContent && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Full Story</h3>
            <div className="prose prose-sm max-w-none">
              {item.fullContent.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {type === 'event' ? (
            <button
              onClick={onAddToCalendar}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Add to Calendar
            </button>
          ) : null}
          <button
            onClick={onShare}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <FiShare2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </ModernModal>
  );
};

export default function EventsNewsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNewsShareModal, setShowNewsShareModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Categories
  const categories = [
    { id: 'all', name: 'All Events', icon: IoCalendarClearOutline },
    { id: 'academic', name: 'Academic', icon: IoNewspaperOutline },
    { id: 'cultural', name: 'Cultural', icon: FiHeart },
    { id: 'sports', name: 'Sports', icon: FiUsers }
  ];

  // Stats data
  const stats = [
    { 
      icon: IoCalendarClearOutline, 
      number: '15+', 
      label: 'Upcoming Events', 
      sublabel: 'This month'
    },
    { 
      icon: IoNewspaperOutline, 
      number: '8+', 
      label: 'News Articles', 
      sublabel: 'Latest updates'
    },
    { 
      icon: FiHeart, 
      number: '5', 
      label: 'Featured', 
      sublabel: 'Highlights'
    },
    { 
      icon: FiUsers, 
      number: '100%', 
      label: 'Community', 
      sublabel: 'Engagement'
    }
  ];

  // Fetch data from APIs
  const fetchEvents = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    }
    
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.success) {
        setEventsData(data.events || getSampleEvents());
        if (showRefresh) {
          toast.success('Events refreshed successfully!');
        }
      } else {
        throw new Error(data.error || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      setEventsData(getSampleEvents());
    } finally {
      if (showRefresh) {
        setRefreshing(false);
      }
    }
  };

  const fetchNews = async (showRefresh = false) => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.success) {
        setNewsData(data.news || getSampleNews());
        if (showRefresh) {
          toast.success('News refreshed successfully!');
        }
      } else {
        throw new Error(data.error || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news');
      setNewsData(getSampleNews());
    }
  };

  const fetchData = async (showRefresh = false) => {
    if (!showRefresh) {
      setLoading(true);
    }
    
    try {
      await Promise.all([
        fetchEvents(showRefresh),
        fetchNews(showRefresh)
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      if (!showRefresh) {
        setLoading(false);
      }
    }
  };

  // Sample data for fallback
  const getSampleEvents = () => [
    {
      id: 1,
      title: 'Annual Sports Day',
      description: 'Join us for our annual sports competition featuring various track and field events',
      date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      time: '9:00 AM - 4:00 PM',
      location: 'School Playground',
      category: 'sports',
      featured: true,
      attendees: 150,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'
    },
    {
      id: 2,
      title: 'Science Fair Exhibition',
      description: 'Showcase of innovative science projects by students',
      date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      time: '10:00 AM - 2:00 PM',
      location: 'Science Laboratory',
      category: 'academic',
      featured: true,
      attendees: 80,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80'
    },
    {
      id: 3,
      title: 'Cultural Festival',
      description: 'Celebration of diverse cultures with music, dance, and food',
      date: new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0],
      time: '2:00 PM - 6:00 PM',
      location: 'Main Hall',
      category: 'cultural',
      attendees: 200,
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80'
    }
  ];

  const getSampleNews = () => [
    {
      id: 1,
      title: 'School Wins Regional Science Competition',
      excerpt: 'Our students secured first place in the regional science competition',
      description: 'Nyaribu Secondary School students achieved outstanding results in the regional science competition, showcasing innovative projects and research.',
      date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      author: 'Science Department',
      category: 'achievement',
      likes: 45,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
      fullContent: 'Our students demonstrated exceptional scientific skills and innovation at the regional science competition held last week. The winning project focused on sustainable energy solutions using locally available materials. The achievement marks a significant milestone for our school\'s science department.'
    },
    {
      id: 2,
      title: 'New Library Resources Available',
      excerpt: 'Enhanced library facilities with digital resources now accessible',
      description: 'The school library has been upgraded with new books, computers, and digital learning resources for students.',
      date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
      author: 'Library Committee',
      category: 'development',
      likes: 32,
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80',
      fullContent: 'We are excited to announce the completion of our library enhancement project. The new facilities include:\n\n• 500+ new books across all subjects\n• 20 new computers with internet access\n• Digital learning platforms\n• Quiet study zones\n• Group collaboration spaces\n\nThe library is now open for extended hours to accommodate student needs.'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // Handle add to calendar
  const handleAddToCalendar = (event) => {
    try {
      const startDate = new Date(event.date);
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
      window.open(googleCalendarUrl, '_blank');
      toast.success('Added to Google Calendar');
    } catch (error) {
      toast.error('Failed to add to calendar');
    }
  };

  // Filter events based on search and category
  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || event.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const filteredNews = newsData.filter(news => {
    return searchTerm === '' || 
      news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshData = () => {
    fetchData(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 text-sm mt-3 font-medium">Loading Events & News...</p>
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
                <IoCalendarClearOutline className="text-white text-lg w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                  Events & News
                </h1>
                <p className="text-gray-600 mt-1">Stay updated with the latest happenings and achievements</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-xs border border-gray-200 font-medium disabled:opacity-50 text-sm md:text-base"
            >
              <FiRotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => toast.info('Event submission feature coming soon!')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-lg font-medium text-sm md:text-base"
            >
              <FiPlus className="w-4 h-4" />
              Submit Event
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events and news..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                value={activeTab}
                onChange={(e) => {
                  setActiveTab(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-2 px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700"
              >
                <FiFilter className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Events Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                <div className="text-sm text-gray-500">
                  {filteredEvents.length} events found
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveTab(category.id);
                        setCurrentPage(1);
                      }}
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

              {/* Events Grid */}
              {paginatedEvents.length === 0 ? (
                <div className="text-center py-12">
                  <IoCalendarClearOutline className="text-gray-400 w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchTerm || activeTab !== 'all' 
                      ? 'No events match your current filters. Try adjusting your search criteria.' 
                      : 'No upcoming events scheduled at the moment.'
                    }
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    {paginatedEvents.map((event, index) => (
                      <EventCard 
                        key={event.id || index}
                        event={event}
                        index={index}
                        onView={() => setSelectedEvent(event)}
                        onShare={() => {
                          setSelectedEvent(event);
                          setShowShareModal(true);
                        }}
                        onCalendar={() => handleAddToCalendar(event)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-gray-100">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            currentPage === page
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* News Sidebar */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
                <div className="text-sm text-gray-500">
                  {filteredNews.length} articles
                </div>
              </div>

              {/* News List */}
              <div className="space-y-4">
                {filteredNews.slice(0, 3).map((news, index) => (
                  <NewsCard 
                    key={news.id || index}
                    news={news}
                    index={index}
                    onView={() => setSelectedNews(news)}
                    onShare={() => {
                      setSelectedNews(news);
                      setShowNewsShareModal(true);
                    }}
                  />
                ))}
              </div>

              {filteredNews.length === 0 && (
                <div className="text-center py-8">
                  <IoNewspaperOutline className="text-gray-400 w-12 h-12 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No news articles available</p>
                </div>
              )}

              {/* View All Button */}
              {filteredNews.length > 3 && (
                <button
                  onClick={() => toast.info('More news feature coming soon!')}
                  className="w-full mt-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  View All News
                </button>
              )}

              {/* Quick Stats */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{eventsData.length}</div>
                    <div className="text-xs text-gray-600">Events</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{newsData.length}</div>
                    <div className="text-xs text-gray-600">News</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <FiMessageCircle className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Stay Connected</h3>
              <p className="text-gray-600 mb-3">
                Never miss an update! Share events and news with friends, add events to your calendar, 
                and stay informed about everything happening at Nyaribu Secondary School.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiShare2 className="text-blue-500" />
                  <span>Easy Sharing</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FiCalendar className="text-green-500" />
                  <span>Calendar Integration</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <IoNewspaperOutline className="text-purple-500" />
                  <span>Regular Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && !showShareModal && (
        <DetailModal
          item={selectedEvent}
          type="event"
          onClose={() => setSelectedEvent(null)}
          onAddToCalendar={() => handleAddToCalendar(selectedEvent)}
          onShare={() => {
            setSelectedEvent(null);
            setShowShareModal(true);
          }}
        />
      )}

      {/* News Detail Modal */}
      {selectedNews && !showNewsShareModal && (
        <DetailModal
          item={selectedNews}
          type="news"
          onClose={() => setSelectedNews(null)}
          onAddToCalendar={() => {}}
          onShare={() => {
            setSelectedNews(null);
            setShowNewsShareModal(true);
          }}
        />
      )}

      {/* Event Share Modal */}
      {showShareModal && selectedEvent && (
        <ShareModal
          item={selectedEvent}
          type="event"
          onClose={() => {
            setShowShareModal(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {/* News Share Modal */}
      {showNewsShareModal && selectedNews && (
        <ShareModal
          item={selectedNews}
          type="news"
          onClose={() => {
            setShowNewsShareModal(false);
            setSelectedNews(null);
          }}
        />
      )}
    </div>
  );
}