'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiHome, FiFileText, FiDollarSign, FiBook, FiRefreshCw, 
  FiUsers, FiActivity, FiHelpCircle, FiX, FiTrash2, FiMessageCircle,
  FiMapPin, FiPhone, FiMail, FiCalendar, FiAward, FiStar
} from 'react-icons/fi';
import { MdMessage, MdSchool } from 'react-icons/md';

const iconMap = {
  'home': FiHome, 'file': FiFileText, 'dollar': FiDollarSign, 'book': FiBook,
  'refresh': FiRefreshCw, 'users': FiUsers, 'activity': FiActivity, 
  'help': FiHelpCircle, 'close': FiX, 'trash': FiTrash2, 'message': FiMessageCircle,
  'school': MdSchool, 'colored-message': MdMessage, 'map': FiMapPin,
  'phone': FiPhone, 'mail': FiMail, 'calendar': FiCalendar, 'award': FiAward,
  'star': FiStar
};

const SafeIcon = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || FiHelpCircle;
  return <IconComponent {...props} />;
};

// Format message content
const formatMessage = (content) => {
  return content
    .split('\n')
    .map((line, index) => {
      // Handle headers (lines starting with **)
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-bold text-sm text-white mb-1 mt-2 first:mt-0">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      // Handle section headers (lines ending with :)
      else if (line.endsWith(':') && !line.startsWith('•') && !line.startsWith('*')) {
        return (
          <div key={index} className="font-semibold text-blue-300 mt-2 mb-1 text-xs">
            {line}
          </div>
        );
      }
      // Handle bullet points
      else if (line.startsWith('•')) {
        return (
          <div key={index} className="flex items-start ml-1 mb-0.5">
            <span className="text-blue-300 mr-1 text-xs">•</span>
            <span className="text-gray-100 text-xs">{line.substring(1).trim()}</span>
          </div>
        );
      }
      // Handle numbered lists
      else if (/^\d+\./.test(line)) {
        return (
          <div key={index} className="flex items-start ml-1 mb-0.5">
            <span className="text-green-300 mr-1 text-xs font-semibold">
              {line.match(/^\d+/)[0]}.
            </span>
            <span className="text-gray-100 text-xs">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      // Handle italic text
      else if (line.startsWith('*') && line.endsWith('*')) {
        return (
          <div key={index} className="text-gray-300 italic text-xs mt-1">
            {line.replace(/\*/g, '')}
          </div>
        );
      }
      // Handle regular lines
      else if (line.trim()) {
        return (
          <div key={index} className="text-gray-100 text-xs mb-1">
            {line}
          </div>
        );
      }
      // Handle empty lines
      else {
        return <div key={index} className="h-2" />;
      }
    });
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const router = useRouter();

  const categories = {
    general: {
      name: "Overview",
      icon: 'school',
      content: `🏫 NYARIBU SECONDARY SCHOOL

**A Public Day School**

Quick Facts:
• Established: 1985
• Location: Kiganjo, Nyeri
• Students: 400+
• Staff: 30+

School Type:
• Public Day School
• Mixed (Boys & Girls)
• 8-4-4 Curriculum

Contact:
• Phone: +254 720 123 456
• Email: info@nyaribusecondary.sc.ke
• Address: P.O. Box 123-10100

Hours:
• Mon-Fri: 7:30 AM - 5:00 PM
• Sat: 8:00 AM - 1:00 PM

Learn more by selecting other categories!`,
      links: [
        { label: 'About', path: '/pages/AboutUs' },
        { label: 'Contact', path: '/pages/contact' }
      ]
    },
    admissions: {
      name: "Admissions",
      icon: 'file',
      content: `📋 ADMISSIONS

Requirements:
• KCPE: 250+ Marks
• Age: 13-16 years
• Good conduct

Documents:
1. KCPE certificate
2. Birth certificate
3. School reports
4. Passport photos
5. Medical report

Steps:
1. Get form
2. Submit docs
3. Assessment
4. Interview
5. Admission

Transfer Students:
• Forms 2 & 3
• Good record
• Limited spaces`,
      links: [
        { label: 'Admissions', path: '/pages/admissions' },
        { label: 'Apply', path: '/apply' }
      ]
    },
    fees: {
      name: "Fees",
      icon: 'dollar',
      content: `💰 FEES 2024

Day School Fees (Term):
• Tuition: KES 12,000
• Activities: KES 2,000
• Total: KES 14,000

Optional:
• Lunch: KES 4,500
• Transport: Varies

Payment:
• Bank Transfer
• M-Pesa: 123456
• Cash
• Installment plans

Scholarships:
• Academic
• Sports
• Needy

Affordable quality education!`,
      links: [
        { label: 'Fees', path: '/pages/fees' },
        { label: 'Payment', path: '/payment' }
      ]
    },
    academics: {
      name: "Academics",
      icon: 'book',
      content: `📚 ACADEMICS

Curriculum: 8-4-4 System

Form 1 & 2 (Core):
• English • Kiswahili
• Mathematics • Sciences
• Humanities • Business
• Computer Studies
• Life Skills

Streams (Form 3/4):
1. Sciences
2. Humanities
3. Business

Features:
• Computer Lab
• Science Labs
• Library
• Career Guidance
• Remedial Classes

Exams:
• CATs • Term
• Mock • KCSE

Quality education for all!`,
      links: [
        { label: 'Academics', path: '/pages/academics' },
        { label: 'Subjects', path: '/subjects' }
      ]
    },
    facilities: {
      name: "Facilities",
      icon: 'users',
      content: `🏫 SCHOOL FACILITIES

Classrooms:
• 16 modern classrooms
• Well-lit & ventilated
• Smart boards available

Laboratories:
• Science labs
• Computer lab
• Library

Sports:
• Football field
• Basketball court
• Volleyball court
• Athletics track

Other:
• Administration block
• Staff rooms
• Parking area
• Playground`,
      links: [
        { label: 'Facilities', path: '/facilities' },
        { label: 'Gallery', path: '/pages/gallery' }
      ]
    },
    activities: {
      name: "Activities",
      icon: 'activity',
      content: `⚽ ACTIVITIES

Sports:
• Football
• Basketball
• Volleyball
• Athletics
• Table Tennis

Clubs:
1. Science Club
2. Drama Club
3. Music Club
4. Environmental Club
5. Debate Club

Competitions:
• Music Festivals
• Sports Days
• Science Fairs
• Academic Contests

Leadership:
• Student Council
• Class Prefects
• Club Leaders
• Peer Counselors`,
      links: [
        { label: 'Sports', path: '/pages/sports' },
        { label: 'Clubs', path: '/clubs' }
      ]
    },
    achievements: {
      name: "Achievements",
      icon: 'award',
      content: `🏆 ACHIEVEMENTS

Academic:
• 2023 KCSE: B-
• 85% University placement
• Consistent improvement
• Subject awards

Sports:
• County champions (Football)
• Regional athletics medals
• Basketball trophies
• Sportsmanship awards

Talent:
• Music festival winners
• Drama competition finalists
• Art exhibition participants

Community:
• Cleanest school award
• Environmental champions
• Community service awards`,
      links: [
        { label: 'Results', path: '/results' },
        { label: 'Achievements', path: '/achievements' }
      ]
    },
    contact: {
      name: "Contact",
      icon: 'phone',
      content: `📞 CONTACT US

Administration:
• Principal: Mr. Mwangi
• Deputy Principal (Academics)
• Deputy Principal (Administration)
• Bursar: Mrs. Njeri

Contacts:
• Phone: +254 720 123 456
• Email: info@nyaribusecondary.sc.ke
• Admissions: admissions@nyaribusecondary.sc.ke

Address:
Nyaribu Secondary School
Kiganjo, Nyeri County
P.O. Box 123-10100

Office Hours:
• Monday-Friday: 8:00 AM - 5:00 PM
• Saturday: 8:00 AM - 1:00 PM`,
      links: [
        { label: 'Contact', path: '/pages/contact' },
        { label: 'Staff', path: '/pages/staff' }
      ]
    }
  };

  useEffect(() => {
    const chatData = localStorage.getItem('nyaribu_chat');
    if (chatData) {
      const { messages: savedMessages, timestamp } = JSON.parse(chatData);
      const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000);
      
      if (timestamp > fourHoursAgo) {
        setMessages(savedMessages);
      } else {
        localStorage.removeItem('nyaribu_chat');
        setMessages([getWelcomeMessage()]);
      }
    } else {
      setMessages([getWelcomeMessage()]);
    }
  }, []);

  const getWelcomeMessage = () => ({
    id: 1,
    role: 'assistant',
    content: `🎓 WELCOME TO NYARIBU SECONDARY SCHOOL!

Hello! I'm Nyari, your assistant.

**SOARING FOR EXCELLENCE** ✨

About Our School:
• Public Day School (Mixed)
• Established: 1985
• Location: Kiganjo, Nyeri
• Students: 400+ | Teachers: 30+
• 8-4-4 Curriculum System

Choose a category below to learn more! 👇`,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    if (messages.length > 0) {
      const chatData = {
        messages: messages,
        timestamp: Date.now()
      };
      localStorage.setItem('nyaribu_chat', JSON.stringify(chatData));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typedMessage]);

  const typeMessage = (message, onComplete) => {
    setIsTyping(true);
    setTypedMessage('');
    let index = 0;
    
    const typingInterval = setInterval(() => {
      if (index < message.length) {
        setTypedMessage(prev => prev + message[index]);
        index++;
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        onComplete();
        setTimeout(() => setShowCategories(true), 300);
      }
    }, 15);
  };

  const handleCategoryClick = (categoryKey) => {
    const category = categories[categoryKey];
    
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: `Selected: ${category.name}`,
      timestamp: new Date().toISOString()
    };

    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      links: category.links,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);
    setShowCategories(false);

    typeMessage(category.content, () => {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: category.content, links: category.links }
          : msg
      ));
      setIsLoading(false);
    });
  };

  const clearChat = () => {
    localStorage.removeItem('nyaribu_chat');
    setMessages([getWelcomeMessage()]);
    setShowCategories(true);
  };

  const handleLinkClick = (path) => {
    router.push(path);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full p-4 shadow-lg transition-all"
          aria-label="Open chat assistant"
        >
          <SafeIcon name="colored-message" className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-lg shadow-xl w-[95vw] sm:w-[500px] h-[85vh] sm:h-[600px] max-w-[500px] flex flex-col border border-white/10">
          {/* Header with logo */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white">
                  <img 
                    src="/logo.jpg" 
                    alt="Nyaribu Secondary School Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Nyaribu Secondary School</h3>
                  <p className="text-blue-200 text-sm">Soaring for Excellence</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={clearChat}
                  className="text-white/80 hover:text-white transition p-1.5 hover:bg-white/10 rounded"
                  title="Clear chat"
                  aria-label="Clear chat"
                >
                  <SafeIcon name="trash" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition p-1.5 hover:bg-white/10 rounded"
                  aria-label="Close chat"
                >
                  <SafeIcon name="close" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container - WIDER TYPING AREA */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-800/50"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              .flex-1::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[95%] w-full rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                      : 'bg-slate-700/80 text-white rounded-bl-none'
                  }`}
                >
                  {message.role === 'assistant' && isTyping && message.id === messages[messages.length - 1]?.id ? (
                    <div className="text-sm leading-relaxed text-white w-full">
                      {formatMessage(typedMessage)}
                    </div>
                  ) : (
                    <div className="text-sm leading-relaxed text-white w-full">
                      {formatMessage(message.content)}
                    </div>
                  )}
                  
                  {/* Links Section */}
                  {message.links && message.role === 'assistant' && !isTyping && (
                    <div className="mt-3 pt-2 border-t border-white/20 w-full">
                      <p className="text-xs text-blue-300 mb-2 font-medium flex items-center gap-1">
                        <SafeIcon name="star" className="w-3 h-3" />
                        Learn More:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {message.links.map((link, index) => (
                          <button
                            key={index}
                            onClick={() => handleLinkClick(link.path)}
                            className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2.5 py-1.5 rounded transition-all font-medium"
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator - WIDER */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700/80 text-white rounded-lg rounded-bl-none px-4 py-3 w-full max-w-[95%]">
                  <div className="flex space-x-2 items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-300">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Categories Section - WIDER */}
          {showCategories && (
            <div className="border-t border-white/10 bg-slate-700/80 p-4">
              <div className="w-full">
                <p className="text-xs text-blue-300 font-medium mb-2 flex items-center gap-1">
                  <SafeIcon name="help" className="w-3 h-3" />
                  What would you like to know?
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  {Object.entries(categories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => handleCategoryClick(key)}
                      className="flex flex-col items-center justify-center space-y-1 px-2 py-3 rounded text-xs font-medium transition-all text-gray-300 hover:bg-slate-600/80 hover:text-white border border-white/10 w-full"
                      aria-label={`Learn about ${category.name}`}
                    >
                      <SafeIcon name={category.icon} className="w-4 h-4" />
                      <span className="truncate w-full text-center">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}