
"use client"
import React, { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiArrowLeft, 
  FiBook, 
  FiMail, 
  FiCalendar, 
  FiBookOpen, 
  FiUsers, 
  FiBell,
  FiSearch,
  FiAlertCircle,
  FiMapPin,
  FiGlobe,
  FiChevronRight
} from 'react-icons/fi';

const Modern404 = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const quickLinks = [
    { name: 'Home Base', href: '/', icon: FiHome, description: 'Back to assembly' },
    { name: 'Academics', href: '/pages/academics', icon: FiBook, description: 'Course directory' },
    { name: 'Library', href: '/pages/gallery', icon: FiBookOpen, description: 'School resources' },
    { name: 'Admissions', href: '/pages/admissions', icon: FiUsers, description: 'Join our family' },
    { name: 'Schedule', href: '/pages/eventsandnews', icon: FiCalendar, description: 'Upcoming terms' },
    { name: 'Support', href: '/pages/contact', icon: FiMail, description: 'Talk to the office' },
  ];

  const errorMessages = [
    "Looks like this page skipped class!",
    "This page is on a field trip!",
    "Assignment not found!",
    "This lesson hasn't been scheduled yet!",
    "Page is in detention!",
    "This classroom is empty!",
    "Lesson plan missing!",
    "This page graduated early!"
  ];

  useEffect(() => {
    setCurrentMessage(Math.floor(Math.random() * errorMessages.length));
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % errorMessages.length);
    }, 5000);
    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden relative font-sans text-slate-900 antialiased">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute top-1/4 -left-8 text-blue-600 scale-[4] rotate-12"><FiGlobe /></div>
        <div className="absolute bottom-1/4 -right-8 text-amber-600 scale-[4] -rotate-12"><FiMapPin /></div>
        <div className="absolute top-1/2 left-1/4 text-slate-600 scale-[3] rotate-45"><FiSearch /></div>
        <div className="absolute top-3/4 right-1/3 text-purple-600 scale-[3] -rotate-45"><FiAlertCircle /></div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 md:py-12 relative z-10">
        <div className="container mx-auto max-w-6xl w-full">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
            
            {/* Left Side: Error Message Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold tracking-wide">
                <FiBell className="text-base animate-pulse" />
                <span>School Announcement</span>
              </div>

              <div className="relative">
                <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-slate-900 flex justify-center lg:justify-start items-baseline">
                  <span className="text-blue-700">4</span>
                  <span className="text-amber-500 mx-1 md:mx-2">0</span>
                  <span className="text-blue-700">4</span>
                </h1>
                <div className="h-2 w-32 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto lg:mx-0 mt-2 md:mt-4 rounded-full"></div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                  {errorMessages[currentMessage]}
                </h2>
                <p className="text-base md:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Even top students lose their way. This page seems to have wandered off-campus. 
                  Let's guide you back to your studies with the options below.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a 
                  href="/" 
                  className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transform hover:-translate-y-0.5"
                >
                  <FiHome className="text-xl group-hover:scale-110 transition-transform duration-300" />
                  <span>Back to Assembly</span>
                  <FiChevronRight className="text-lg opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                </a>
                <button 
                  onClick={() => window.history.back()}
                  className="group flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FiArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>Previous Lesson</span>
                </button>
              </div>
            </div>

            {/* Right Side: Quick Links Section */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-[2rem] sm:rounded-[3rem] blur-xl opacity-60 -z-10"></div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8 md:p-10">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <FiMapPin className="text-blue-600" />
                      Campus Directory
                    </h3>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {quickLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a 
                          key={link.name} 
                          href={link.href} 
                          className="group p-3 sm:p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white rounded-lg transition-all duration-300 group-hover:scale-110">
                              <Icon className="text-lg sm:text-xl" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                                {link.name}
                              </h4>
                              <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors truncate italic">
                                {link.description}
                              </p>
                            </div>
                            <FiChevronRight className="text-slate-400 group-hover:text-blue-500 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-100">
                    <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden">
                      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-left space-y-1">
                          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Enrollment Status</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-black text-amber-400">500+</span>
                            <span className="text-sm text-slate-300 italic">Active Scholars</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">Need immediate assistance?</p>
                        </div>
                        <a 
                          href="/pages/contact"
                          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <FiMail className="text-sm" />
                          Contact Office
                        </a>
                      </div>
                      {/* Abstract Design Element */}
                      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 -rotate-45 translate-x-8 -translate-y-8 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <footer className="mt-8 md:mt-12 lg:mt-16 text-center">
            <p className="text-slate-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} Nyaribo Secondary School
              <span className="mx-2 text-slate-300">•</span>
              Excellence in Education
              <span className="mx-2 text-slate-300">•</span>
              <a href="/sitemap" className="text-blue-600 hover:text-blue-800 transition-colors">
                Site Map
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Modern404;