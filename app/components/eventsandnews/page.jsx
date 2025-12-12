'use client';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiPlus, 
  FiSearch, 
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiClock,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiShare2,
  FiX,
  FiImage,
  FiBook,
  FiUpload,
  FiRotateCw,
  FiTrendingUp,
  FiAward,
  FiZap,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCheck,
  FiCheckCircle,
  FiGlobe,
  FiBell
} from 'react-icons/fi';
import { 
  IoNewspaperOutline,
  IoCalendarClearOutline 
} from 'react-icons/io5';
import { Modal, Box, CircularProgress, Badge } from '@mui/material';

// Import your local default images
import newsDefault from "../../../images/i.jpg";
import eventDefault from "../../../images/logo.jpg";

// Modern Loading Spinner Component
function ModernLoadingSpinner({ message = "Loading...", size = "medium" }) {
  const sizes = {
    small: { outer: 60, inner: 24 },
    medium: { outer: 100, inner: 40 },
    large: { outer: 120, inner: 48 }
  }

  const { outer, inner } = sizes[size]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="relative">
            <CircularProgress 
              size={outer} 
              thickness={4}
              className="text-purple-600"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`bg-gradient-to-r from-purple-500 to-pink-600 rounded-full opacity-20`}
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
              <div key={i} className="w-2 h-2 bg-purple-500 rounded-full" 
                   style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Modern Notification System Component
function ModernNotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications - replace with real API calls
  const mockNotifications = [
    {
      id: 1,
      type: 'news',
      title: 'New News Article Published',
      message: '"Annual Sports Day Results" has been published',
      time: '2 minutes ago',
      read: false,
      icon: <IoNewspaperOutline className="text-purple-600" />
    },
    {
      id: 2,
      type: 'event',
      title: 'Upcoming Event',
      message: 'Parent-Teacher Meeting tomorrow at 10 AM',
      time: '1 hour ago',
      read: false,
      icon: <IoCalendarClearOutline className="text-blue-600" />
    },
    {
      id: 3,
      type: 'system',
      title: 'System Update',
      message: 'New features added to News & Events Manager',
      time: '3 hours ago',
      read: true,
      icon: <FiTrendingUp className="text-green-600" />
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'news': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'system': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-xl bg-white border border-gray-200 shadow-sm cursor-pointer"
      >
        <FiBell className="text-xl text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="text-xs text-red-600 font-medium cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-xl border border-gray-200">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900 text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 font-medium cursor-pointer"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <FiBell className="text-3xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 rounded-b-2xl">
            <button
              onClick={() => setShowNotifications(false)}
              className="w-full text-center text-sm text-gray-600 font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Modern News/Event Card Component
function ModernItemCard({ item, type, onEdit, onDelete, onView }) {
  const [imageError, setImageError] = useState(false)

  const getImageUrl = (imagePath) => {
    if (!imagePath) return type === 'news' ? newsDefault : eventDefault
    if (imagePath.startsWith('http')) return imagePath
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  }

  const categories = {
    news: [
      { value: 'achievement', label: 'Achievements', color: 'emerald' },
      { value: 'sports', label: 'Sports', color: 'blue' },
      { value: 'academic', label: 'Academic', color: 'purple' },
      { value: 'infrastructure', label: 'Infrastructure', color: 'orange' },
      { value: 'community', label: 'Community', color: 'rose' }
    ],
    events: [
      { value: 'academic', label: 'Academic', color: 'purple' },
      { value: 'sports', label: 'Sports', color: 'blue' },
      { value: 'cultural', label: 'Cultural', color: 'emerald' },
      { value: 'social', label: 'Social', color: 'orange' }
    ]
  }

  const categoryInfo = categories[type].find(c => c.value === item.category)
  const imageUrl = getImageUrl(item.image)

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200">
      <div className="relative h-48 overflow-hidden">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={item.title} 
            onClick={() => onView(item)}
            className="w-full h-full object-cover cursor-pointer" 
            onError={() => setImageError(true)} 
          />
        ) : (
          <div 
            onClick={() => onView(item)} 
            className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer"
          >
            {type === 'news' ? (
              <IoNewspaperOutline className="text-2xl mb-2" />
            ) : (
              <IoCalendarClearOutline className="text-2xl mb-2" />
            )}
            <span className="text-sm">No Image</span>
          </div>
        )}
        
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            categoryInfo ? `bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800` : 'bg-gray-100 text-gray-800'
          }`}>
            {categoryInfo?.label}
          </span>
          {item.featured && (
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 
          onClick={() => onView(item)} 
          className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-purple-800 text-base mb-2 line-clamp-2 cursor-pointer"
        >
          {item.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 font-medium">
          {item.excerpt || item.description}
        </p>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-purple-600 font-bold">
              <FiCalendar className="text-xs" />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
            {type === 'events' && item.time && (
              <div className="flex items-center gap-1 text-blue-600 font-bold">
                <FiClock className="text-xs" />
                <span className="text-xs">{item.time}</span>
              </div>
            )}
          </div>
          
          {type === 'events' && item.location && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-green-600 font-bold">
                <FiMapPin className="text-xs" />
                <span className="text-xs truncate max-w-[120px]">{item.location}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onView(item)} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-xl shadow-md cursor-pointer text-xs font-bold"
            >
              View
            </button>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onEdit(item)} 
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-2 py-1 rounded-xl shadow-md cursor-pointer text-xs font-bold"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(item.id)} 
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-xl shadow-md cursor-pointer text-xs font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modern Item Modal Component
function ModernItemModal({ onClose, onSave, item, type, loading }) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    date: item?.date || new Date().toISOString().split('T')[0],
    time: item?.time || '',
    location: item?.location || '',
    category: item?.category || (type === 'news' ? 'achievement' : 'academic'),
    description: item?.description || (item?.excerpt || ''),
    content: item?.content || (item?.fullContent || ''),
    author: item?.author || 'School Administration',
    image: item?.image || '',
    featured: item?.featured || false,
    status: item?.status || 'draft'
  });

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(item?.image || (type === 'news' ? newsDefault : eventDefault))

  const categories = {
    news: [
      { value: 'achievement', label: 'Achievements', color: 'emerald' },
      { value: 'sports', label: 'Sports', color: 'blue' },
      { value: 'academic', label: 'Academic', color: 'purple' },
      { value: 'infrastructure', label: 'Infrastructure', color: 'orange' },
      { value: 'community', label: 'Community', color: 'rose' }
    ],
    events: [
      { value: 'academic', label: 'Academic', color: 'purple' },
      { value: 'sports', label: 'Sports', color: 'blue' },
      { value: 'cultural', label: 'Cultural', color: 'emerald' },
      { value: 'social', label: 'Social', color: 'orange' }
    ]
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData, item?.id);
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
        background: 'linear-gradient(135deg, #f8fafc 0%, #faf5ff 100%)'
      }}>
        {/* Header */}
        <div className={`p-6 text-white ${
          type === 'news' 
            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-700'
            : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl">
                {type === 'news' ? 
                  <IoNewspaperOutline className="text-xl" /> : 
                  <IoCalendarClearOutline className="text-xl" />
                }
              </div>
              <div>
                <h2 className="text-2xl font-bold">{item ? 'Edit' : 'Create'} {type === 'news' ? 'News' : 'Event'}</h2>
                <p className="text-white/90 opacity-90 mt-1">
                  Manage {type === 'news' ? 'news article' : 'event'} information
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
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                    <FiImage className="text-purple-600 text-lg" /> 
                    Featured Image
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 rounded-2xl object-cover shadow-lg border border-gray-200"
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
                            <FiUpload className="text-purple-500" />
                            <span className="text-sm font-bold text-gray-700">
                              {imageFile ? 'Change Image' : 'Upload Image'}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200">
                    <FiBook className="text-blue-600 text-lg" /> 
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    placeholder={`Enter ${type === 'news' ? 'news' : 'event'} title`}
                  />
                </div>

                {/* Category and Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                    >
                      {categories[type].map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                    />
                  </div>
                </div>

                {/* Event Specific Fields */}
                {type === 'events' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                        <FiClock className="text-green-600 text-lg" /> 
                        Time
                      </label>
                      <input
                        type="text"
                        value={formData.time}
                        onChange={(e) => handleChange('time', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                        placeholder="e.g., 9:00 AM - 5:00 PM"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-xl border border-orange-200">
                        <FiMapPin className="text-orange-600 text-lg" /> 
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                        placeholder="Enter event location"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-200">
                    <FiBook className="text-purple-600 text-lg" /> 
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                    placeholder={`Write a brief description...`}
                  />
                </div>

                {/* Full Content (News only) */}
                {type === 'news' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-xl border border-indigo-200">
                      <FiBook className="text-indigo-600 text-lg" /> 
                      Full Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleChange('content', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                      placeholder="Write the full article content..."
                    />
                  </div>
                )}

                {/* Author (News only) */}
                {type === 'news' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                      placeholder="Enter author name"
                    />
                  </div>
                )}

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleChange('featured', e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-bold text-gray-700">Featured Item</span>
                  </label>
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
                className={`px-8 py-3 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2 ${
                  type === 'news' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                }`}
              >
                {loading ? (
                  <>
                    <CircularProgress size={16} className="text-white" />
                    {item ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FiCheck />
                    {item ? 'Update' : 'Create'} {type === 'news' ? 'News' : 'Event'}
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

// Main News & Events Manager Component
export default function NewsEventsManager() {
  const [activeSection, setActiveSection] = useState('news');
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedPosts, setSelectedPosts] = useState(new Set());

  const categories = {
    news: [
      { value: 'achievement', label: 'Achievements', color: 'emerald' },
      { value: 'sports', label: 'Sports', color: 'blue' },
      { value: 'academic', label: 'Academic', color: 'purple' },
      { value: 'infrastructure', label: 'Infrastructure', color: 'orange' },
      { value: 'community', label: 'Community', color: 'rose' }
    ],
    events: [
      { value: 'academic', label: 'Academic', color: 'purple' },
      { value: 'sports', label: 'Sports', color: 'blue' },
      { value: 'cultural', label: 'Cultural', color: 'emerald' },
      { value: 'social', label: 'Social', color: 'orange' }
    ]
  };

  // Fetch news from API
  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.success) {
        setNews(data.news || []);
      } else {
        throw new Error(data.error || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    }
  };

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.success) {
        setEvents(data.events || []);
      } else {
        throw new Error(data.error || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchNews(), fetchEvents()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const items = activeSection === 'news' ? news : events;
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [activeSection, searchTerm, selectedCategory, news, events]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const endpoint = activeSection === 'news' ? `/api/news/${id}` : `/api/events/${id}`;
        const response = await fetch(endpoint, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          await fetchData();
          toast.success(`${activeSection === 'news' ? 'News' : 'Event'} deleted successfully!`);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error(`Error deleting ${activeSection}:`, error);
        toast.error(`Failed to delete ${activeSection}`);
      }
    }
  };

  const handleSubmit = async (formData, id) => {
    setSaving(true);
    try {
      const submitData = new FormData();
      
      submitData.append('title', formData.title.trim());
      submitData.append('category', formData.category);
      submitData.append('date', formData.date);
      submitData.append('featured', formData.featured.toString());

      if (activeSection === 'news') {
        submitData.append('excerpt', formData.description.trim());
        submitData.append('fullContent', (formData.content || formData.description).trim());
        submitData.append('author', formData.author.trim());
      } else {
        submitData.append('description', formData.description.trim());
        submitData.append('time', formData.time.trim());
        submitData.append('location', formData.location.trim());
      }

      let response;
      let endpoint;
      
      if (id) {
        endpoint = activeSection === 'news' ? `/api/news/${id}` : `/api/events/${id}`;
        response = await fetch(endpoint, {
          method: 'PUT',
          body: submitData,
        });
      } else {
        endpoint = activeSection === 'news' ? '/api/news' : '/api/events';
        response = await fetch(endpoint, {
          method: 'POST',
          body: submitData,
        });
      }

      const result = await response.json();

      if (result.success) {
        await fetchData();
        setShowModal(false);
        toast.success(
          `${activeSection === 'news' ? 'News' : 'Event'} ${
            id ? 'updated' : 'created'
          } successfully!`
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`Error saving ${activeSection}:`, error);
      toast.error(error.message || `Failed to ${id ? 'update' : 'create'} ${activeSection}`);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const calculatedStats = {
      totalNews: news.length,
      totalEvents: events.length,
      featuredNews: news.filter(n => n.featured).length,
      featuredEvents: events.filter(e => e.featured).length,
      todayNews: news.filter(n => new Date(n.date).toDateString() === new Date().toDateString()).length,
      upcomingEvents: events.filter(e => new Date(e.date) >= new Date()).length,
    };
    setStats(calculatedStats);
  }, [news, events]);

  const Pagination = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-700 font-medium">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
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
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
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

  if (loading && news.length === 0 && events.length === 0) return <ModernLoadingSpinner message="Loading News & Events..." size="medium" />

  return (
    <div className="space-y-6 p-4 min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Header Section with Notification Bell */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">News & Events Manager</h1>
            <p className="text-gray-600 text-sm lg:text-base">Manage school news articles and events</p>
          </div>
          <div className="flex items-center gap-3">
            <ModernNotificationSystem />
            <button onClick={fetchData} className="flex items-center gap-2 bg-gray-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-bold shadow-lg cursor-pointer text-sm">
              <FiRotateCw className={`text-xs ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={handleCreate} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl font-bold shadow-lg cursor-pointer text-sm">
              <FiPlus className="text-xs" /> Create {activeSection === 'news' ? 'News' : 'Event'}
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
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Total News</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.totalNews}</p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                <IoNewspaperOutline className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Total Events</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <IoCalendarClearOutline className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Featured News</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.featuredNews}</p>
              </div>
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl">
                <FiAward className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Featured Events</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.featuredEvents}</p>
              </div>
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <FiTrendingUp className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Today's News</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.todayNews}</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                <FiClock className="text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-bold text-gray-600 mb-1">Upcoming Events</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-2xl">
                <FiCalendar className="text-lg" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-full max-w-md">
          {[
            { id: 'news', label: 'News Articles', count: news.length, icon: IoNewspaperOutline },
            { id: 'events', label: 'Events', count: events.length, icon: IoCalendarClearOutline }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex-1 py-3 px-4 rounded-lg font-bold ${
                  activeSection === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <Icon className="text-lg" />
                  <span>{tab.label}</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20">
                    {tab.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeSection} by title or description...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-gray-50"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 cursor-pointer text-sm"
          >
            <option value="all">All Categories</option>
            {categories[activeSection].map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <button className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer">
            <FiShare2 /> Export
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {currentItems.map((item) => (
          <ModernItemCard 
            key={item.id} 
            item={item} 
            type={activeSection}
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onView={handleView}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentItems.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
          {activeSection === 'news' ? (
            <IoNewspaperOutline className="text-4xl lg:text-5xl text-gray-300 mx-auto mb-4" />
          ) : (
            <IoCalendarClearOutline className="text-4xl lg:text-5xl text-gray-300 mx-auto mb-4" />
          )}
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No items found' : `No ${activeSection} available`}
          </h3>
          <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search criteria' : `Start by creating your first ${activeSection === 'news' ? 'news article' : 'event'}`}
          </p>
          <button 
            onClick={handleCreate} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold shadow-lg flex items-center gap-2 mx-auto text-sm lg:text-base cursor-pointer"
          >
            <FiPlus /> Create {activeSection === 'news' ? 'News' : 'Event'}
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200">
          <Pagination />
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <ModernItemModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSubmit} 
          item={editingItem} 
          type={activeSection}
          loading={saving} 
        />
      )}
    </div>
  );
}