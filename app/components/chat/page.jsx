// components/ChatBot.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiHome, FiFileText, FiDollarSign, FiBook, FiRefreshCw, 
  FiUsers, FiActivity, FiHelpCircle, FiX, FiTrash2, FiMessageCircle 
} from 'react-icons/fi';
import { MdMessage, MdSchool } from 'react-icons/md';

const iconMap = {
  'home': FiHome, 'file': FiFileText, 'dollar': FiDollarSign, 'book': FiBook,
  'refresh': FiRefreshCw, 'users': FiUsers, 'activity': FiActivity, 
  'help': FiHelpCircle, 'close': FiX, 'trash': FiTrash2, 'message': FiMessageCircle,
  'school': MdSchool, 'colored-message': MdMessage
};

const SafeIcon = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || FiHelpCircle;
  return <IconComponent {...props} />;
};

// Format message content to handle markdown-like syntax
const formatMessage = (content) => {
  return content
    .split('\n')
    .map((line, index) => {
      // Handle headers (lines starting with **)
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-bold text-lg text-white mb-2 mt-3 first:mt-0">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      // Handle section headers (lines ending with :)
      else if (line.endsWith(':') && !line.startsWith('•') && !line.startsWith('*')) {
        return (
          <div key={index} className="font-semibold text-purple-300 mt-3 mb-2">
            {line}
          </div>
        );
      }
      // Handle bullet points
      else if (line.startsWith('•')) {
        return (
          <div key={index} className="flex items-start ml-2 mb-1">
            <span className="text-blue-300 mr-2 mt-1">•</span>
            <span className="text-gray-100">{line.substring(1).trim()}</span>
          </div>
        );
      }
      // Handle numbered lists
      else if (/^\d+\./.test(line)) {
        return (
          <div key={index} className="flex items-start ml-2 mb-1">
            <span className="text-green-300 mr-2 mt-1 font-semibold">
              {line.match(/^\d+/)[0]}.
            </span>
            <span className="text-gray-100">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      // Handle italic text (lines starting with *)
      else if (line.startsWith('*') && line.endsWith('*')) {
        return (
          <div key={index} className="text-gray-300 italic text-sm mt-2">
            {line.replace(/\*/g, '')}
          </div>
        );
      }
      // Handle regular lines
      else if (line.trim()) {
        return (
          <div key={index} className="text-gray-100 mb-2">
            {line}
          </div>
        );
      }
      // Handle empty lines
      else {
        return <div key={index} className="h-3" />;
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
      name: "General Info",
      icon: 'school',
      content: `🏫 KATWANYAA HIGH SCHOOL

Quick Overview:
• Name: African Inland Church Katwanyaa Secondary School
• Type: Public County School (Mixed Day & Boarding)
• Founded: 1976 | Location: Tala, Machakos County
• Students: 1,200+ | Teachers: 45+
• Curriculum: CBC & 8-4-4 Implementation

Contact Info:
• Phone: (254) 723-000000
• Email: info@katwanyaa.ac.ke
• Address: P.O. Box 123-90100, Tala

School Hours:
• Monday-Friday: 7:30 AM - 4:00 PM
• Saturday: 8:00 AM - 1:00 PM

Learn more about specific areas by selecting other categories!`,
      links: [
        { label: 'About School', path: '/about' },
        { label: 'Contact Us', path: '/contact' },
        { label: 'Visit Campus', path: '/visit' }
      ]
    },
    admissions: {
      name: "Admissions",
      icon: 'file',
      content: `📋 ADMISSIONS PROCESS

Form 1 Requirements:
• KCPE Score: 250+ Marks
• Age: 13-15 years
• Good conduct from primary school
• Medical fitness certificate

Required Documents:
1. Original KCPE certificate
2. Birth certificate
3. School reports
4. 4 passport photos
5. Medical report

Application Steps:
1. Get application forms
2. Submit completed forms
3. Entrance exam & interview
4. Receive admission letter
5. Complete registration

Transfer Students:
• Available for Forms 2 & 3
• Must have good academic record
• Limited spaces available

Contact admissions for more details!`,
      links: [
        { label: 'Admissions', path: '/admissions' },
        { label: 'Apply Now', path: '/apply' },
        { label: 'Requirements', path: '/requirements' }
      ]
    },
    fees: {
      name: "Fees & Payments",
      icon: 'dollar',
      content: `💰 FEE STRUCTURE

Boarding Students (Per Term):
• Tuition: KES 25,000
• Boarding: KES 15,000
• Activities: KES 5,000
• Total: KES 45,000

Day Scholars (Per Term):
• Tuition: KES 18,000
• Optional lunch: KES 3,000
• Total: KES 18,000-21,000

Payment Options:
• Cash at school office
• M-Pesa (Paybill: 123456)
• Bank transfer
• Installment plans available

Scholarships:
• Academic excellence
• Sports talents
• Special needs
• Vulnerable students

Financial assistance available for qualifying students!`,
      links: [
        { label: 'Fee Structure', path: '/fees' },
        { label: 'Payment Methods', path: '/payment' },
        { label: 'Scholarships', path: '/scholarships' }
      ]
    },
    transfers: {
      name: "Transfers",
      icon: 'refresh',
      content: `🔄 STUDENT TRANSFERS

Eligibility:
• Forms 2 & 3 only
• Good academic performance
• Clean discipline record
• Available spaces

Required Documents:
• Transfer certificate
• Academic transcripts
• Birth certificate
• Recent school reports
• Conduct certificate

Process:
1. Check space availability
2. Submit application
3. Entrance assessment
4. Interview
5. Registration

Transfer Windows:
• Term 1: January
• Term 2: May
• Limited Term 3 transfers

Contact school office for transfer inquiries!`,
      links: [
        { label: 'Transfer Info', path: '/transfers' },
        { label: 'Admissions', path: '/admissions' }
      ]
    },
    cbc: {
      name: "CBC Program",
      icon: 'book',
      content: `🔄 CBC PROGRAM

Junior Secondary (Grades 7-9):
• 12 core learning areas
• Integrated subjects
• Practical skills focus
• Continuous assessment

Core Competencies:
• Communication
• Collaboration
• Critical thinking
• Creativity
• Digital literacy

Learning Approach:
• Student-centered
• Project-based
• Technology integration
• Talent development

Assessment:
• Portfolio-based
• Practical demonstrations
• Project work
• Progress tracking

Preparing students for the future!`,
      links: [
        { label: 'CBC Program', path: '/cbc' },
        { label: 'Curriculum', path: '/curriculum' }
      ]
    },
    boarding: {
      name: "Boarding",
      icon: 'users',
      content: `🏠 BOARDING LIFE

Accommodation:
• Separate hostels for boys & girls
• 4-bed rooms with storage
• Common recreation areas
• 24/7 security

Daily Schedule:
• 5:30 AM: Wake up
• 6:00 AM: Breakfast
• 7:30 AM-4:00 PM: Classes
• 4:30 PM-6:00 PM: Activities
• 7:00 PM-9:00 PM: Study
• 10:00 PM: Lights out

Facilities:
• Dining hall
• Common rooms
• Sports facilities
• Study areas
• Sick bay

Safe and nurturing environment!`,
      links: [
        { label: 'Boarding Life', path: '/boarding' },
        { label: 'Facilities', path: '/facilities' }
      ]
    },
    extracurricular: {
      name: "Activities",
      icon: 'activity',
      content: `⚽ ACTIVITIES & SPORTS

Sports:
• Basketball
• Football
• Volleyball
• Athletics
• Tennis

Clubs:
• Science Club
• Drama Club
• Music Club
• Environmental Club
• Debate Club

Competitions:
• Sports tournaments
• Music festivals
• Drama competitions
• Science fairs

Leadership:
• Student council
• Prefect system
• Club leadership
• Peer mentoring

Developing well-rounded students!`,
      links: [
        { label: 'Sports', path: '/sports' },
        { label: 'Clubs', path: '/clubs' },
        { label: 'Activities', path: '/activities' }
      ]
    }
  };

  useEffect(() => {
    const chatData = localStorage.getItem('katwanyaa_chat');
    if (chatData) {
      const { messages: savedMessages, timestamp } = JSON.parse(chatData);
      const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000);
      
      if (timestamp > fourHoursAgo) {
        setMessages(savedMessages);
      } else {
        localStorage.removeItem('katwanyaa_chat');
        setMessages([getWelcomeMessage()]);
      }
    } else {
      setMessages([getWelcomeMessage()]);
    }
  }, []);

  const getWelcomeMessage = () => ({
    id: 1,
    role: 'assistant',
    content: `🎓 WELCOME TO KATWANYAA HIGH SCHOOL!

Hello! I'm Kattie, your assistant for AIC Katwanyaa Secondary School in Tala, Machakos County.

Quick Facts:
• Founded: 1976 | Sponsor: African Inland Church
• Type: Public County School (Mixed Day & Boarding)  
• Students: 1,000+ | Curriculum: CBC Implementation

Choose a category below to learn more about our school! 👇`,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    if (messages.length > 0) {
      const chatData = {
        messages: messages,
        timestamp: Date.now()
      };
      localStorage.setItem('katwanyaa_chat', JSON.stringify(chatData));
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
        setTimeout(() => setShowCategories(true), 500);
      }
    }, 20);
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
    localStorage.removeItem('katwanyaa_chat');
    setMessages([getWelcomeMessage()]);
    setShowCategories(true);
  };

  const handleLinkClick = (path) => {
    router.push(path);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white rounded-full p-4 md:p-5 shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-3xl animate-pulse"
        >
          <div className="relative">
            <SafeIcon name="colored-message" className="w-7 h-7 md:w-8 md:h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 rounded-2xl shadow-2xl w-[95vw] h-[90vh] md:w-[450px] md:h-[700px] flex flex-col border-0 overflow-hidden border border-white/10 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white p-4 md:p-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <SafeIcon name="school" className="text-white text-lg md:text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-white">Kattie Assistant</h3>
                  <p className="text-pink-100 text-sm">Katwanyaa High School</p>
                </div>
              </div>
              <div className="flex space-x-2 md:space-x-3">
                <button
                  onClick={clearChat}
                  className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-full"
                  title="Clear chat"
                >
                  <SafeIcon name="trash" className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-full"
                >
                  <SafeIcon name="close" className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </div>

          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 md:space-y-5 bg-slate-800/50 backdrop-blur-sm"
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
                  className={`max-w-[90%] md:max-w-[85%] rounded-2xl px-4 py-3 md:px-5 md:py-4 backdrop-blur-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-lg'
                      : 'bg-slate-700/70 text-white rounded-bl-none shadow-md border border-white/10'
                  }`}
                >
                  {message.role === 'assistant' && isTyping && message.id === messages[messages.length - 1]?.id ? (
                    <div className="text-sm leading-relaxed font-medium text-white">
                      {formatMessage(typedMessage)}
                    </div>
                  ) : (
                    <div className="text-sm leading-relaxed font-medium text-white">
                      {formatMessage(message.content)}
                    </div>
                  )}
                  
                  {message.links && message.role === 'assistant' && !isTyping && (
                    <div className="mt-4 pt-3 border-t border-white/20">
                      <p className="text-xs text-gray-300 mb-2 font-semibold">Learn More:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.links.map((link, index) => (
                          <button
                            key={index}
                            onClick={() => handleLinkClick(link.path)}
                            className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className={`text-xs mt-3 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'} font-medium`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700/70 text-white rounded-2xl rounded-bl-none px-4 py-3 md:px-5 md:py-4 shadow-md border border-white/10 backdrop-blur-sm">
                  <div className="flex space-x-3 items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-300 font-semibold">Kattie is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showCategories && (
            <div className="border-t border-white/10 bg-slate-700/80 p-4 backdrop-blur-sm">
              <div>
                <p className="text-xs text-gray-300 font-semibold mb-3 flex items-center gap-2">
                  <SafeIcon name="help" className="w-3 h-3" />
                  What would you like to know about?
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(categories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => handleCategoryClick(key)}
                      className="flex items-center space-x-2 px-3 py-3 rounded-lg text-sm font-semibold transition-all backdrop-blur-sm text-gray-300 hover:bg-slate-600/80 hover:text-white border border-white/10 hover:border-purple-400 hover:shadow-md"
                    >
                      <SafeIcon name={category.icon} className="w-4 h-4" />
                      <span>{category.name}</span>
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