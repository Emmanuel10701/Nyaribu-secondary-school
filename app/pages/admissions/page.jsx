'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiCalendar, 
  FiFileText, 
  FiCheckCircle,
  FiArrowRight,
  FiClock,
  FiAward,
  FiUsers,
  FiBook,
  FiHome,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDownload,
  FiStar,
  FiHelpCircle,
  FiPlay,
  FiShare2,
  FiChevronDown,
  FiBarChart2,
  FiHeart,
  FiTarget,
  FiGlobe,
  FiBookOpen,
  FiCpu,
  FiMusic,
  FiActivity,
  FiZap,
  FiTrendingUp,
  FiEye,
  FiLayers
} from 'react-icons/fi';
import { 
  IoSchoolOutline,
  IoDocumentsOutline,
  IoSpeedometerOutline,
  IoPeopleOutline,
  IoLibraryOutline,
  IoStatsChartOutline,
  IoRocketOutline,
  IoEarthOutline,
  IoBookOutline,
  IoCalculatorOutline,
  IoSparkles,
  IoAccessibilityOutline,
  IoBuildOutline
} from 'react-icons/io5';
import Image from 'next/image';

export default function ComprehensiveAdmissions() {
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Online images
  const onlineImages = {
    campus: "https://images.unsplash.com/photo-1562774053-701939374585",
    students: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    scienceLab: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
    library: "https://images.unsplash.com/photo-1589998059171-988d887df646",
    sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    arts: "https://images.unsplash.com/photo-1547036967-23d11aacaee0",
    boarding: "https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0",
    classroom: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a",
    cbc: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    innovation: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56",
    community: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f"
  };

  const dynamicStats = [
    { 
      icon: IoPeopleOutline, 
      number: '98%', 
      label: 'Success Rate', 
      sublabel: 'CBC Transition',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: FiTrendingUp, 
      number: '150+', 
      label: 'Annual', 
      sublabel: 'Transfer Students',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: IoSparkles, 
      number: '12:1', 
      label: 'Personalized', 
      sublabel: 'Student-Teacher Ratio',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: FiZap, 
      number: '100%', 
      label: 'Digital', 
      sublabel: 'Classroom Integration',
      color: 'from-orange-500 to-red-500'
    },
  ];

  const admissionPaths = [
    {
      title: 'Grade 7 Placement',
      icon: FiBookOpen,
      description: 'Join our Junior Secondary program under CBC curriculum',
      features: ['CBC Competency Based', 'Practical Skills', 'Digital Literacy', 'Talent Development'],
      deadline: '2024-05-30',
      color: 'from-blue-500 to-cyan-500',
      image: onlineImages.cbc
    },
    {
      title: 'Transfer Students',
      icon: FiArrowRight,
      description: 'Seamless transfer from other schools with credit recognition',
      features: ['Credit Transfer', 'Placement Assessment', 'Records Review', 'Orientation Program'],
      deadline: 'Rolling Admission',
      color: 'from-purple-500 to-pink-500',
      image: onlineImages.classroom
    },
    {
      title: 'International Students',
      icon: IoEarthOutline,
      description: 'Global education with Kenyan CBC integration',
      features: ['Visa Assistance', 'CBC Adaptation', 'Hostel Accommodation', 'Cultural Integration'],
      deadline: '2024-04-15',
      color: 'from-green-500 to-emerald-500',
      image: onlineImages.boarding
    }
  ];

  const innovativeFeatures = [
    {
      icon: IoRocketOutline,
      title: 'Future-Ready Curriculum',
      description: 'CBC integrated with 21st century skills and digital literacy',
      features: ['AI & Coding Basics', 'Financial Literacy', 'Environmental Studies', 'Global Citizenship'],
      image: onlineImages.innovation,
      color: 'from-blue-500 to-cyan-500',
      stats: { students: '500+', success: '95%' }
    },
    {
      icon: IoAccessibilityOutline,
      title: 'Personalized Learning',
      description: 'Tailored educational paths based on individual strengths and interests',
      features: ['Learning Style Assessment', 'Customized Projects', 'Mentorship Programs', 'Talent Development'],
      image: onlineImages.classroom,
      color: 'from-purple-500 to-pink-500',
      stats: { students: '100%', success: '98%' }
    },
    {
      icon: IoBuildOutline,
      title: 'Skill-Based Education',
      description: 'Focus on practical competencies and real-world application',
      features: ['Entrepreneurship Projects', 'Community Service', 'Internship Programs', 'Leadership Training'],
      image: onlineImages.community,
      color: 'from-green-500 to-emerald-500',
      stats: { students: '300+', success: '90%' }
    }
  ];

  const admissionHighlights = [
    {
      icon: FiBookOpen,
      title: 'CBC Excellence',
      description: 'Full implementation of Competency Based Curriculum with modern enhancements',
      metrics: '7 Core Competencies + Digital Skills'
    },
    {
      icon: FiUsers,
      title: 'Community Focus',
      description: 'Strong parent-teacher collaboration and community engagement programs',
      metrics: '95% Parent Satisfaction'
    },
    {
      icon: FiLayers,
      title: 'Seamless Transfers',
      description: 'Smooth transition process with credit recognition and orientation programs',
      metrics: '150+ Successful Transfers'
    },
    {
      icon: FiEye,
      title: 'Transparent Process',
      description: 'Clear admission criteria, fees, and continuous communication',
      metrics: '100% Process Clarity'
    }
  ];

  // CBC Subjects and Structure
  const cbcStructure = {
    coreSubjects: [
      { name: 'English', icon: FiBook, description: 'Language skills and communication' },
      { name: 'Kiswahili', icon: FiBook, description: 'National language and culture' },
      { name: 'Mathematics', icon: IoCalculatorOutline, description: 'Problem solving and logic' },
      { name: 'Integrated Science', icon: FiCpu, description: 'Practical science applications' },
      { name: 'Social Studies', icon: FiGlobe, description: 'Community and citizenship' },
      { name: 'Religious Education', icon: FiHeart, description: 'Moral values and ethics' }
    ],
    optionalSubjects: [
      { name: 'Business Studies', icon: FiBarChart2, description: 'Entrepreneurship skills' },
      { name: 'Agriculture', icon: FiActivity, description: 'Food security and technology' },
      { name: 'Sports & Physical Education', icon: FiActivity, description: 'Health and fitness' },
      { name: 'Performing Arts', icon: FiMusic, description: 'Creative expression' },
      { name: 'Visual Arts', icon: FiTarget, description: 'Artistic development' },
      { name: 'Home Science', icon: FiHome, description: 'Life skills and nutrition' }
    ],
    competencies: [
      'Communication and Collaboration',
      'Critical Thinking and Problem Solving',
      'Creativity and Imagination',
      'Citizenship',
      'Learning to Learn',
      'Self-Efficacy',
      'Digital Literacy'
    ]
  };

  const feeStructure = {
    boarding: [
      { category: 'Tuition Fee', amount: '30,000', term: '10,000', details: ['CBC curriculum', 'Digital learning', 'Practical subjects', 'Learning materials'] },
      { category: 'Boarding Fee', amount: '30,000', term: '10,000', details: ['Accommodation', 'Full meals', 'Laundry', 'Utilities'] },
      { category: 'Development Fee', amount: '6,000', term: '2,000', details: ['Facilities', 'Sports equipment', 'Library', 'Technology'] },
      { category: 'Activity Fee', amount: '9,000', term: '3,000', details: ['Clubs', 'Educational trips', 'Sports', 'Cultural events'] }
    ],
    day: [
      { category: 'Tuition Fee', amount: '30,000', term: '10,000', details: ['CBC curriculum', 'Digital learning', 'Practical subjects', 'Learning materials'] },
      { category: 'Lunch Program', amount: '9,000', term: '3,000', details: ['Balanced meals', 'Fruit breaks', 'Special diets', 'Nutrition'] },
      { category: 'Development Fee', amount: '6,000', term: '2,000', details: ['Facilities', 'Sports equipment', 'Library', 'Technology'] },
      { category: 'Activity Fee', amount: '9,000', term: '3,000', details: ['Clubs', 'Educational trips', 'Sports', 'Cultural events'] }
    ]
  };

  const transferProcess = [
    {
      step: 1,
      title: 'Application Submission',
      description: 'Submit transfer documents and academic records',
      duration: '2-3 days',
      requirements: ['Current school report', 'Birth certificate', 'Transfer letter']
    },
    {
      step: 2,
      title: 'Assessment & Placement',
      description: 'Academic assessment for proper grade placement',
      duration: '1 week',
      requirements: ['Placement tests', 'Subject evaluation', 'Skill assessment']
    },
    {
      step: 3,
      title: 'Credit Evaluation',
      description: 'Review and transfer of completed coursework',
      duration: '3-5 days',
      requirements: ['Transcript analysis', 'CBC competency mapping', 'Credit approval']
    },
    {
      step: 4,
      title: 'Admission & Orientation',
      description: 'Final admission and student orientation program',
      duration: '1 week',
      requirements: ['Parent meeting', 'Student orientation', 'Resource distribution']
    }
  ];

  const ourCommitment = [
    {
      icon: FiHeart,
      title: 'Holistic Development',
      description: 'Nurturing academic, social, emotional, and physical growth through CBC competencies'
    },
    {
      icon: FiTarget,
      title: 'Future Readiness',
      description: 'Preparing students for 21st century challenges with practical skills and digital literacy'
    },
    {
      icon: FiUsers,
      title: 'Individual Attention',
      description: 'Small class sizes and personalized learning paths for every student'
    },
    {
      icon: IoRocketOutline,
      title: 'Innovation Focus',
      description: 'Integrating technology and innovative teaching methods in CBC delivery'
    }
  ];

  const interactiveElements = [
    {
      type: 'virtual-tour',
      title: 'Interactive Campus Tour',
      description: 'Explore our facilities in 360° virtual reality',
      icon: FiEye,
      action: 'Start Tour',
      image: onlineImages.campus
    },
    {
      type: 'success-calculator',
      title: 'Success Probability Calculator',
      description: 'Calculate your child\'s potential with our AI-powered tool',
      icon: FiBarChart2,
      action: 'Calculate Now',
      image: onlineImages.classroom
    },
    {
      type: 'placement-test',
      title: 'Online Placement Test',
      description: 'Take our interactive assessment for proper grade placement',
      icon: FiTrendingUp,
      action: 'Start Test',
      image: onlineImages.scienceLab
    }
  ];

  const valueProposition = [
    {
      category: 'Academic Excellence',
      points: [
        'CBC curriculum with STEM enhancement',
        'Digital literacy and coding integration',
        'Project-based learning approach',
        'Continuous assessment and feedback'
      ],
      icon: FiAward
    },
    {
      category: 'Holistic Development',
      points: [
        'Sports and arts programs',
        'Leadership and character building',
        'Community service initiatives',
        'Mental health and wellness support'
      ],
      icon: FiHeart
    },
    {
      category: 'Future Preparation',
      points: [
        'Career guidance from Form 1',
        'University placement preparation',
        'Entrepreneurship skills development',
        'Global citizenship education'
      ],
      icon: FiTarget
    }
  ];

  const faqs = [
    {
      question: 'How does CBC curriculum benefit my child?',
      answer: 'CBC focuses on developing competencies rather than just content knowledge. It emphasizes practical skills, critical thinking, creativity, and digital literacy - preparing students for real-world challenges and future careers.'
    },
    {
      question: 'What support is available for transfer students?',
      answer: 'We provide comprehensive support including academic assessment, credit transfer, orientation programs, and personalized learning plans to ensure smooth transition and academic success.'
    },
    {
      question: 'Are there scholarships available?',
      answer: 'Yes, we offer merit-based scholarships, talent scholarships in sports and arts, and need-based financial aid. Contact our admissions office for eligibility criteria and application details.'
    },
    {
      question: 'How are CBC competencies assessed?',
      answer: 'We use continuous assessment tools including projects, practical demonstrations, portfolios, and observations to evaluate competency development across all learning areas.'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBook },
    { id: 'cbc', label: 'CBC Curriculum', icon: FiBookOpen },
    { id: 'fees', label: 'Fee Structure', icon: IoCalculatorOutline },
    { id: 'transfer', label: 'Transfers', icon: FiArrowRight },
    { id: 'commitment', label: 'Our Commitment', icon: FiHeart },
    { id: 'faq', label: 'FAQ', icon: FiHelpCircle },
  ];

  // safe current feature icon reference
  const currentFeatureData = innovativeFeatures[currentFeature] || innovativeFeatures[0];
  const CurrentFeatureIcon = currentFeatureData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-white rounded"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, delay: Math.random() * 2, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section with Interactive Elements */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              {/* Animated Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full px-4 py-2 border border-white/20 backdrop-blur-sm"
                >
                  <IoSparkles className="text-yellow-300" />
                  <span className="text-sm font-medium">CBC Excellence Center</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-4 py-2 border border-white/20 backdrop-blur-sm"
                >
                  <FiTrendingUp className="text-green-300" />
                  <span className="text-sm font-medium">98% Success Rate</span>
                </motion.div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-6xl lg:text-7xl font-bold leading-tight mb-6"
              >
                Shape Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
                  Future With Us
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-white/80 mb-8 leading-relaxed"
              >
                Where <span className="text-blue-300 font-semibold">Competency-Based Education</span> meets 
                <span className="text-green-300 font-semibold"> Innovation</span> and 
                <span className="text-purple-300 font-semibold"> Personalized Learning</span>. 
                We're not just preparing students for exams; we're preparing them for life.
              </motion.p>

              {/* Interactive CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 text-lg backdrop-blur-sm"
                >
                  <FiZap className="text-xl" />
                  Start Smart Application
                  <FiArrowRight className="text-xl" />
                </motion.button>

                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold border border-white/20 flex items-center justify-center gap-3 text-lg backdrop-blur-sm"
                >
                  <FiPlay className="text-xl" />
                  Live Virtual Tour
                </motion.button>
              </motion.div>

              {/* Enhanced Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {dynamicStats.map((stat, index) => {
                  const StatIcon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      whileHover={{ 
                        y: -5,
                        scale: 1.05,
                        background: `linear-gradient(135deg, ${stat.color.split('from-')[1].split('to-')[0]}, ${stat.color.split('to-')[1]})`
                      }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 cursor-pointer group transition-all duration-300"
                    >
                      <div className="relative mb-3">
                        <StatIcon className="text-2xl text-white mx-auto group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <motion.span 
                          className="text-2xl font-bold text-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                        >
                          {stat.number}
                        </motion.span>
                      </div>
                      <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                      <p className="text-white/60 text-xs">{stat.sublabel}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right Content - Interactive Feature Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main Interactive Card */}
              <motion.div
                whileHover={{ y: -10, rotateY: 5 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 relative overflow-hidden group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Feature Carousel */}
                <div className="relative rounded-2xl overflow-hidden bg-black mb-6 h-64">
                  <Image
                    src={innovativeFeatures[currentFeature].image}
                    alt={innovativeFeatures[currentFeature].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Feature Indicator */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${innovativeFeatures[currentFeature].color} text-white backdrop-blur-sm`}>
                      Featured
                    </div>
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-4 left-4">
                    <div className="flex gap-4 text-white text-sm">
                      <div>
                        <div className="font-bold">{innovativeFeatures[currentFeature].stats.students}</div>
                        <div className="text-white/70 text-xs">Students</div>
                      </div>
                      <div>
                        <div className="font-bold">{innovativeFeatures[currentFeature].stats.success}</div>
                        <div className="text-white/70 text-xs">Success</div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Dots */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {innovativeFeatures.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentFeature(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentFeature === index ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Feature Content */}
                <div className="text-center mb-6">
                  <CurrentFeatureIcon className="text-3xl text-white mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {innovativeFeatures[currentFeature].title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {innovativeFeatures[currentFeature].description}
                  </p>
                </div>

                {/* Feature Points Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {innovativeFeatures[currentFeature].features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 text-white/80 text-xs bg-white/5 rounded-xl p-2"
                    >
                      <FiCheckCircle className="text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Learn More
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>

              {/* Floating Interactive Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-2xl shadow-2xl cursor-pointer"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div className="text-white text-center">
                  <FiZap className="text-xl mx-auto mb-1" />
                  <div className="font-bold text-sm">AI Powered</div>
                  <div className="text-xs">Admissions</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-xl shadow-2xl cursor-pointer"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <div className="text-white text-center">
                  <FiTrendingUp className="text-lg mx-auto mb-1" />
                  <div className="font-bold text-xs">98%</div>
                  <div className="text-xs">Success</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-white/60 flex flex-col items-center gap-2">
            <span className="text-sm">Discover More Features</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FiChevronDown className="text-xl" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-20 z-40 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400 bg-blue-400/10'
                      : 'border-transparent text-white/60 hover:text-white'
                  }`}
                >
                  <TabIcon className="text-lg" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-16"
              >
                {/* Welcome Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-center max-w-4xl mx-auto"
                >
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Welcome to Nyaribu secondary School Admissions
                  </h2>
                  <p className="text-xl text-white/70 leading-relaxed">
                    Where tradition meets innovation in education. We are committed to nurturing 
                    well-rounded individuals through our comprehensive CBC curriculum, state-of-the-art 
                    facilities, and dedicated faculty.
                  </p>
                </motion.div>

                {/* Admission Paths Grid */}
                <div>
                  <h3 className="text-3xl font-bold text-white mb-12 text-center">
                    Choose Your Admission Path
                  </h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    {admissionPaths.map((path, index) => {
                      const PathIcon = path.icon;
                      return (
                        <motion.div
                          key={path.title}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 }}
                          whileHover={{ y: -10, scale: 1.02 }}
                          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 group cursor-pointer"
                        >
                          <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                            <Image
                              src={path.image}
                              alt={path.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                            <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-r ${path.color} rounded-xl flex items-center justify-center`}>
                              <PathIcon className="text-white text-xl" />
                            </div>
                          </div>
                          
                          <h4 className="text-2xl font-bold text-white mb-4">{path.title}</h4>
                          <p className="text-white/70 mb-6 leading-relaxed">{path.description}</p>
                          
                          <div className="space-y-3 mb-6">
                            {path.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-white/80">
                                <FiCheckCircle className="text-green-400 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-white/20">
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <FiClock />
                              <span>Deadline: {path.deadline}</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold text-sm"
                            >
                              Apply Now
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Features Section */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/20">
                  <h3 className="text-3xl font-bold text-white mb-12 text-center">
                    Why Choose  Nyaribu secondary?
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      {
                        icon: IoRocketOutline,
                        title: 'Modern CBC',
                        description: 'Competency-Based Curriculum with digital integration'
                      },
                      {
                        icon: FiUsers,
                        title: 'Expert Faculty',
                        description: 'Qualified teachers with CBC training'
                      },
                      {
                        icon: FiCpu,
                        title: 'Tech-Enabled',
                        description: 'Digital classrooms and computer labs'
                      },
                      {
                        icon: FiHeart,
                        title: 'Holistic Care',
                        description: 'Academic and emotional support'
                      }
                    ].map((feature, index) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center group"
                        >
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <FeatureIcon className="text-2xl text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                          <p className="text-white/70 text-sm">{feature.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Facts */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { number: '98%', label: 'Student Satisfaction' },
                    { number: '12:1', label: 'Student-Teacher Ratio' },
                    { number: '100+', label: 'Transfer Students/Yr' },
                    { number: '7', label: 'Core Competencies' }
                  ].map((fact, index) => (
                    <motion.div
                      key={fact.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20"
                    >
                      <div className="text-3xl font-bold text-white mb-2">{fact.number}</div>
                      <div className="text-white/70 text-sm">{fact.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-8 border border-blue-400/30">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Ready to Start Your Journey?
                    </h3>
                    <p className="text-white/70 mb-6 text-lg">
                      Join our community of learners and discover your potential with our comprehensive CBC program.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg"
                      >
                        Begin Application
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors"
                      >
                        Download Brochure
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* CBC Curriculum Tab */}
            {activeTab === 'cbc' && (
              <motion.div
                key="cbc"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-16"
              >
                {/* Core Subjects */}
                <div>
                  <h2 className="text-4xl font-bold text-white mb-12 text-center">
                    CBC Core Learning Areas
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cbcStructure.coreSubjects.map((subject, index) => {
                      const SubjectIcon = subject.icon;
                      return (
                        <motion.div
                          key={subject.name}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center group"
                        >
                          <SubjectIcon className="text-3xl text-blue-400 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-white mb-3">{subject.name}</h3>
                          <p className="text-white/70 text-sm">{subject.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Subjects */}
                <div>
                  <h2 className="text-4xl font-bold text-white mb-12 text-center">
                    Pre-Technical & Pre-Career Subjects
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cbcStructure.optionalSubjects.map((subject, index) => {
                      const SubjectIcon = subject.icon;
                      return (
                        <motion.div
                          key={subject.name}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center group"
                        >
                          <SubjectIcon className="text-3xl text-green-400 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-white mb-3">{subject.name}</h3>
                          <p className="text-white/70 text-sm">{subject.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Competencies */}
                <div>
                  <h2 className="text-4xl font-bold text-white mb-12 text-center">
                    7 Core Competencies
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cbcStructure.competencies.map((competency, index) => (
                      <motion.div
                        key={competency}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-4 border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="text-white font-semibold text-sm">{competency}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Fee Structure Tab */}
            {activeTab === 'fees' && (
              <motion.div
                key="fees"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-4xl font-bold text-white mb-12 text-center">
                  Affordable Fee Structure
                </h2>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  {/* Boarding Fees */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-blue-400/30"
                  >
                    <div className="text-center mb-6">
                      <IoBookOutline className="text-4xl text-blue-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">Boarding School</h3>
                      <div className="text-3xl font-bold text-blue-400 mb-2">KSh 75,000</div>
                      <p className="text-white/60">Per Year (3 Terms)</p>
                    </div>
                    <div className="space-y-4">
                      {feeStructure.boarding.map((fee, index) => (
                        <div key={fee.category} className="flex justify-between items-center text-white/80">
                          <span className="text-sm">{fee.category}</span>
                          <span className="font-semibold">KSh {fee.amount}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Day School Fees */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-green-400/30"
                  >
                    <div className="text-center mb-6">
                      <FiHome className="text-4xl text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">Day School</h3>
                      <div className="text-3xl font-bold text-green-400 mb-2">KSh 54,000</div>
                      <p className="text-white/60">Per Year (3 Terms)</p>
                    </div>
                    <div className="space-y-4">
                      {feeStructure.day.map((fee, index) => (
                        <div key={fee.category} className="flex justify-between items-center text-white/80">
                          <span className="text-sm">{fee.category}</span>
                          <span className="font-semibold">KSh {fee.amount}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Additional Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-yellow-500/10 border border-yellow-400/30 rounded-3xl p-6"
                >
                  <h4 className="text-yellow-300 font-bold mb-3 flex items-center gap-2">
                    <FiAward className="text-yellow-400" />
                    Financial Support Available
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-yellow-200 text-sm">
                    <div>
                      <p className="font-semibold mb-2">Scholarships:</p>
                      <ul className="space-y-1">
                        <li>• Academic Excellence</li>
                        <li>• Sports & Arts Talent</li>
                        <li>• Leadership Potential</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Payment Plans:</p>
                      <ul className="space-y-1">
                        <li>• Installment payments</li>
                        <li>• Sibling discounts</li>
                        <li>• Early payment discount</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Transfer Process Tab */}
            {activeTab === 'transfer' && (
              <motion.div
                key="transfer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-4xl font-bold text-white mb-12 text-center">
                  Smooth Transfer Process
                </h2>

                <div className="space-y-8">
                  {transferProcess.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
                    >
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-white mb-2 lg:mb-0">{step.title}</h3>
                            <div className="flex items-center gap-2 text-blue-300">
                              <FiClock className="text-lg" />
                              <span className="font-semibold">{step.duration}</span>
                            </div>
                          </div>
                          <p className="text-white/70 mb-6">{step.description}</p>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {step.requirements.map((req, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-white/80 text-sm bg-white/5 rounded-xl p-3">
                                <FiCheckCircle className="text-green-400 flex-shrink-0" />
                                {req}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Our Commitment Tab */}
            {activeTab === 'commitment' && (
              <motion.div
                key="commitment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto"
              >
                <h2 className="text-4xl font-bold text-white mb-12 text-center">
                  Our Commitment to Building Your Future
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {ourCommitment.map((commitment, index) => {
                    const CommitmentIcon = commitment.icon;
                    return (
                      <motion.div
                        key={commitment.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center group"
                      >
                        <CommitmentIcon className="text-4xl text-blue-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-2xl font-bold text-white mb-4">{commitment.title}</h3>
                        <p className="text-white/70 leading-relaxed">{commitment.description}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mission Statement */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="mt-16 text-center"
                >
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-8 border border-blue-400/30">
                    <h3 className="text-2xl font-bold text-white mb-6">Our Promise to You</h3>
                    <p className="text-xl text-white/80 leading-relaxed italic">
                      "We are committed to providing a nurturing environment where every student 
                      can discover their potential, develop essential competencies, and build 
                      a foundation for lifelong success. Together, we shape futures."
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <motion.div
                key="faq"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-4xl font-bold text-white mb-12 text-center">
                  Frequently Asked Questions
                </h2>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden group"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                        <FiChevronDown 
                          className={`text-blue-400 transition-transform duration-300 ${
                            openFaq === index ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 text-white/70 leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Experience Modern Education
            </h2>
            <p className="text-xl text-white/60">
              Interactive tools and features that make admissions seamless and engaging
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {interactiveElements.map((element, index) => {
              const ElementIcon = element.icon;
              return (
                <motion.div
                  key={element.type}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 group cursor-pointer"
                >
                  <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={element.image}
                      alt={element.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                    <div className="absolute top-4 right-4">
                      <ElementIcon className="text-2xl text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{element.title}</h3>
                  <p className="text-white/70 mb-4 text-sm">{element.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm"
                  >
                    {element.action}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our Program?
            </h2>
            <p className="text-xl text-white/60">
              Comprehensive education that prepares students for success in life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {valueProposition.map((proposition, index) => {
              const PropositionIcon = proposition.icon;
              return (
                <motion.div
                  key={proposition.category}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 group"
                >
                  <PropositionIcon className="text-4xl text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-bold text-white mb-6">{proposition.category}</h3>
                  <ul className="space-y-3">
                    {proposition.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-white/80">
                        <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Admission Highlights */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {admissionHighlights.map((highlight, index) => {
              const HighlightIcon = highlight.icon;
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <HighlightIcon className="text-2xl text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{highlight.title}</h3>
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">{highlight.description}</p>
                  <div className="text-blue-300 font-semibold text-sm">{highlight.metrics}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Begin the Journey?
            </h2>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Join our community dedicated to nurturing future leaders through quality CBC education, 
              personalized attention, and a commitment to holistic development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
              >
                Start Your Application
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors"
              >
                Schedule Campus Visit
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}