'use client';
import { useState } from 'react';
import { 
  FiCalendar,
  FiClock,
  FiMapPin,
  FiShare2,
  FiArrowRight,
  FiBookOpen,
  FiTrendingUp,
  FiAward,
  FiCheckCircle
} from 'react-icons/fi';
import { IoLogoGoogle, IoRocketOutline } from 'react-icons/io5';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaGoogle, FaLink } from 'react-icons/fa';
import { GiGraduateCap } from 'react-icons/gi';
import Image from 'next/image';

const ModernEventsSection = ({ events = [], onViewAll, schoolInfo }) => {
  const [selectedEvent, setSelectedEvent] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Default events with modern content
  const defaultEvents = [
    {
      id: 1,
      title: "Academic Excellence Awards",
      category: "Academic",
      date: "2026-05-15",
      time: "9:00 AM",
      duration: "5 hours",
      location: "School Main Hall",
      description: "Annual celebration recognizing outstanding academic achievements. Featuring guest speakers, student presentations, and awards ceremony.",
      image: "/images/events/academic-day.jpg",
      highlights: ["Guest Speakers", "Awards Ceremony", "Student Presentations"]
    },
    {
      id: 2,
      title: "Sports Championship Finals",
      category: "Sports",
      date: "2026-05-22",
      time: "8:00 AM",
      duration: "8 hours",
      location: "School Playground",
      description: "Grand finale of the inter-house sports competition featuring track events, field events, and team sports championship.",
      image: "/images/events/sports-competition.jpg",
      highlights: ["Track Events", "Team Sports", "Championship Trophy"]
    },
    {
      id: 3,
      title: "Science & Tech Expo",
      category: "Science",
      date: "2026-06-05",
      time: "10:00 AM",
      duration: "5 hours",
      location: "Science Complex",
      description: "Showcasing innovative student projects in robotics, renewable energy, and digital technology with interactive demonstrations.",
      image: "/images/events/science-expo.jpg",
      highlights: ["Robotics", "Interactive Demos", "Tech Innovations"]
    },
    {
      id: 4,
      title: "Cultural Festival",
      category: "Cultural",
      date: "2026-06-12",
      time: "5:00 PM",
      duration: "3 hours",
      location: "School Auditorium",
      description: "Celebration of cultural diversity through traditional music, dance performances, drama, and art exhibitions.",
      image: "/images/events/cultural-festival.jpg",
      highlights: ["Music & Dance", "Drama", "Art Exhibitions"]
    }
  ];

  const displayEvents = events && events.length > 0 ? events : defaultEvents;
  const currentEvent = displayEvents[selectedEvent] || displayEvents[0];

  // Modern color palette
  const getCategoryColor = (category) => {
    const colors = {
      'academic': { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700', 
        border: 'border-blue-100',
        accent: 'bg-blue-500'
      },
      'sports': { 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700', 
        border: 'border-emerald-100',
        accent: 'bg-emerald-500'
      },
      'cultural': { 
        bg: 'bg-purple-50', 
        text: 'text-purple-700', 
        border: 'border-purple-100',
        accent: 'bg-purple-500'
      },
      'science': { 
        bg: 'bg-cyan-50', 
        text: 'text-cyan-700', 
        border: 'border-cyan-100',
        accent: 'bg-cyan-500'
      },
      'career': { 
        bg: 'bg-amber-50', 
        text: 'text-amber-700', 
        border: 'border-amber-100',
        accent: 'bg-amber-500'
      },
      'environmental': { 
        bg: 'bg-teal-50', 
        text: 'text-teal-700', 
        border: 'border-teal-100',
        accent: 'bg-teal-500'
      }
    };
    return colors[category?.toLowerCase()] || colors.academic;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'academic': <FiBookOpen className="w-4 h-4" />,
      'sports': <FiTrendingUp className="w-4 h-4" />,
      'cultural': <GiGraduateCap className="w-4 h-4" />,
      'career': <FiAward className="w-4 h-4" />,
      'science': <IoRocketOutline className="w-4 h-4" />,
      'environmental': <FiCheckCircle className="w-4 h-4" />
    };
    return icons[category?.toLowerCase()] || <FiCalendar className="w-4 h-4" />;
  };

  // Safe date parsing
  const parseDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = parseDate(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      full: date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      })
    };
  };

  // Modern Google Calendar integration
  const addToGoogleCalendar = (event) => {
    try {
      const eventDate = parseDate(event.date);
      const startTime = event.time || '09:00';
      
      // Parse time
      let hours = 9, minutes = 0;
      const timeMatch = startTime.match(/(\d+):?(\d+)?\s*(AM|PM)/i);
      
      if (timeMatch) {
        hours = parseInt(timeMatch[1]);
        minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const period = timeMatch[3].toUpperCase();
        
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
      }
      
      eventDate.setHours(hours, minutes, 0, 0);
      const endDate = new Date(eventDate.getTime() + (2 * 60 * 60 * 1000));
      
      // Format for Google Calendar
      const formatForGoogle = (date) => {
        return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
      };
      
      const url = new URL('https://calendar.google.com/calendar/render');
      url.searchParams.append('action', 'TEMPLATE');
      url.searchParams.append('text', event.title);
      url.searchParams.append('dates', `${formatForGoogle(eventDate)}/${formatForGoogle(endDate)}`);
      url.searchParams.append('details', event.description);
      url.searchParams.append('location', event.location);
      
      window.open(url.toString(), '_blank');
    } catch (error) {
      // Fallback URL
      const fallbackUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}`;
      window.open(fallbackUrl, '_blank');
    }
  };

  // Modern share function
  const handleShare = (platform) => {
    const eventUrl = `${window.location.origin}/events/${currentEvent.id}`;
    const text = `Check out "${currentEvent.title}" at ${schoolInfo?.name || 'Our School'}`;

    const shareConfig = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${eventUrl}`)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(eventUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(currentEvent.title)}&body=${encodeURIComponent(`${text}\n\n${eventUrl}`)}`,
      copy: eventUrl
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    if (platform === 'email') {
      window.location.href = shareConfig[platform];
    } else {
      window.open(shareConfig[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Modern Header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 mb-4">
            <span className="text-sm font-medium text-gray-600">EVENTS CALENDAR</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            School Events & Activities
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Stay updated with our latest programs and community engagements
          </p>
        </div>

        {/* Modern Split Layout */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          
          {/* Left Column - Event List (Modern Cards) */}
          <div className="lg:w-2/5">
            <div className="space-y-4">
              {displayEvents.map((event, index) => {
                const colors = getCategoryColor(event.category);
                const isSelected = selectedEvent === index;
                const date = formatDate(event.date);
                
                return (
                  <div
                    key={event.id || index}
                    onClick={() => setSelectedEvent(index)}
                    className={`group cursor-pointer rounded-xl p-4 transition-all duration-300 border-2 ${
                      isSelected 
                        ? 'border-gray-900 bg-gray-900 shadow-lg' 
                        : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Modern Date Badge */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-white text-gray-900' 
                          : 'bg-gray-50 text-gray-700 group-hover:bg-gray-100'
                      }`}>
                        <div className="text-lg font-bold leading-none">{date.day}</div>
                        <div className="text-xs uppercase font-medium mt-0.5">{date.month}</div>
                      </div>
                      
                      {/* Event Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} flex items-center gap-1.5`}>
                            {getCategoryIcon(event.category)}
                            {event.category}
                          </span>
                          <span className="text-xs font-medium text-gray-400">
                            {event.time}
                          </span>
                        </div>
                        
                        <h3 className={`font-semibold mb-2 ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        }`}>
                          {event.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <FiMapPin className={`w-4 h-4 ${
                            isSelected ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={`truncate ${
                            isSelected ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <FiArrowRight className="w-4 h-4" />
                          <span>Currently viewing details</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right Column - Featured Event (Modern Detail View) */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              
              {/* Hero Image with Gradient Overlay */}
              <div className="relative h-48 md:h-64 lg:h-72 w-full overflow-hidden">
                <Image
                  src={currentEvent.image || `/images/events/event-${selectedEvent + 1}.jpg`}
                  alt={currentEvent.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                  priority
                />
                
                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10" />
                
                {/* Floating Info */}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2.5 rounded-lg text-sm font-medium ${getCategoryColor(currentEvent.category).bg} ${getCategoryColor(currentEvent.category).text} flex items-center gap-2 backdrop-blur-sm`}>
                    {getCategoryIcon(currentEvent.category)}
                    {currentEvent.category}
                  </span>
                </div>
              </div>
              
              {/* Event Content */}
              <div className="p-6 md:p-8">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    {currentEvent.title}
                  </h2>
                  
                  {/* Modern Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FiCalendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Date</span>
                      </div>
                      <p className="text-gray-900 font-semibold">
                        {formatDate(currentEvent.date).full}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FiClock className="w-4 h-4" />
                        <span className="text-sm font-medium">Time</span>
                      </div>
                      <p className="text-gray-900 font-semibold">
                        {currentEvent.time}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FiMapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">Location</span>
                      </div>
                      <p className="text-gray-900 font-semibold">
                        {currentEvent.location}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-sm font-medium">Duration</span>
                      </div>
                      <p className="text-gray-900 font-semibold">
                        {currentEvent.duration || '2-3 hours'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-8">
                    <p className="text-gray-600 leading-relaxed">
                      {currentEvent.description}
                    </p>
                  </div>
                  
                  {/* Highlights (if any) */}
                  {currentEvent.highlights && (
                    <div className="mb-8">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                        Event Highlights
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentEvent.highlights.map((highlight, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Modern Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => addToGoogleCalendar(currentEvent)}
                    className="flex-1 py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all"
                  >
                    <IoLogoGoogle className="w-5 h-5" />
                    Add to Calendar
                  </button>
                  
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="flex-1 py-3.5 bg-white border-2 border-gray-900 text-gray-900 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all"
                  >
                    <FiShare2 className="w-5 h-5" />
                    Share Event
                  </button>
                </div>
              </div>
            </div>
            
            {/* View All Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={onViewAll}
                className="px-6 py-3 bg-transparent text-gray-700 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                View All School Events
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Share This Event</h3>
              <p className="text-sm text-gray-500">Let others know about this event</p>
            </div>
            
            {/* Share Options Grid */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { platform: 'whatsapp', icon: FaWhatsapp, color: 'bg-green-100 text-green-600' },
                { platform: 'twitter', icon: FaTwitter, color: 'bg-sky-100 text-sky-600' },
                { platform: 'facebook', icon: FaFacebookF, color: 'bg-blue-100 text-blue-600' },
                { platform: 'email', icon: FaGoogle, color: 'bg-red-100 text-red-600' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={item.platform}
                    onClick={() => handleShare(item.platform)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 capitalize">
                      {item.platform}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Copy Link */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Event Link</span>
                <button 
                  onClick={() => handleShare('copy')}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 active:scale-95 transition-all"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 font-mono truncate">
                {window.location.origin}/events/{currentEvent.id}
              </div>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-6 py-3 text-gray-500 font-medium text-sm hover:text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ModernEventsSection;