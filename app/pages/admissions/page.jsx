'use client';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
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
  FiLayers,
  FiPlus,
  FiX,
  FiFilter,
  FiSearch,
  FiRotateCw,
  FiEdit3,
  FiTrash2,
  FiMessageCircle,
  FiAlertTriangle,
  FiSave,
  FiImage,
  FiUpload
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
import { useRouter } from 'next/navigation';
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




// Modern Card Component for Admission Paths
const AdmissionPathCard = ({ path, onApply, index }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md">
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={path.image}
          alt={path.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${path.color}`}>
            {path.deadline === 'Rolling Admission' ? 'Open' : 'Limited'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Icon */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${path.color} bg-opacity-10`}>
            {path.icon({ className: `text-lg ${path.color.split('from-')[1].split('to-')[0].replace('-500', '-600')}` })}
          </div>
          <h3 className="font-bold text-gray-900 text-lg">{path.title}</h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {path.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {path.features.slice(0, 2).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
              <FiCheckCircle className="text-green-500 flex-shrink-0" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
          {path.features.length > 2 && (
            <div className="text-xs text-blue-600 font-medium">
              +{path.features.length - 2} more features
            </div>
          )}
        </div>

        {/* Deadline and Apply Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiCalendar className="text-gray-400" />
            <span>{path.deadline}</span>
          </div>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ feature, onLearnMore }) => {
  const FeatureIcon = feature.icon;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Icon Header */}
      <div className={`p-4 bg-gradient-to-r ${feature.color} bg-opacity-10`}>
        <div className="flex items-center justify-between">
          <div className="p-2 bg-white rounded-lg shadow-xs">
            <FeatureIcon className={`text-xl ${feature.color.split('from-')[1].split('to-')[0].replace('-500', '-600')}`} />
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-white/80 rounded-full text-gray-700">
            Featured
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {feature.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="font-bold text-gray-900">{feature.stats.students}</div>
            <div className="text-xs text-gray-500">Students</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="font-bold text-gray-900">{feature.stats.success}</div>
            <div className="text-xs text-gray-500">Success</div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {feature.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
              <FiCheckCircle className="text-green-500 flex-shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onLearnMore}
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

// Stats Card Component
const StatCard = ({ stat }) => {
  const StatIcon = stat.icon;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">{stat.label}</p>
          <p className="text-lg font-bold text-gray-900">{stat.number}</p>
        </div>
        <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-10`}>
          <StatIcon className={`text-lg ${stat.color.split('from-')[1].split('to-')[0].replace('-500', '-600')}`} />
        </div>
      </div>
      <p className="text-xs text-gray-500">{stat.sublabel}</p>
    </div>
  );
};

// Subject Card Component for CBC
const SubjectCard = ({ subject, index }) => {
  const SubjectIcon = subject.icon;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
          <SubjectIcon className="text-white text-lg" />
        </div>
        <h4 className="font-bold text-gray-900">{subject.name}</h4>
      </div>
      <p className="text-gray-600 text-sm">{subject.description}</p>
    </div>
  );
};

// Fee Structure Card
const FeeCard = ({ feeType, fees, icon: Icon, color }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className="text-2xl text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{feeType}</h3>
          <p className="text-gray-500 text-sm">Per Year (3 Terms)</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {fees.map((fee, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div>
              <p className="font-medium text-gray-700">{fee.category}</p>
              <p className="text-gray-500 text-xs">{fee.details.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">KSh {fee.amount}</p>
              <p className="text-gray-500 text-xs">KSh {fee.term} per term</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-500">Total Annual Fees</p>
          <p className="font-bold text-gray-900 text-xl">
            KSh {fees.reduce((sum, fee) => sum + parseInt(fee.amount.replace(',', '')), 0).toLocaleString()}
          </p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Download Details
        </button>
      </div>
    </div>
  );
};

// Process Step Component
const ProcessStep = ({ step, index }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
            <div className="flex items-center gap-2 text-blue-600">
              <FiClock className="text-lg" />
              <span className="font-medium text-sm">{step.duration}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-4">{step.description}</p>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Requirements:</p>
            {step.requirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <FiCheckCircle className="text-green-500 flex-shrink-0" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Commitment Card
const CommitmentCard = ({ commitment, index }) => {
  const CommitmentIcon = commitment.icon;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
          <CommitmentIcon className="text-white text-2xl" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-3">{commitment.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{commitment.description}</p>
      </div>
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ faq, index, openFaq, setOpenFaq }) => {
  const isOpen = openFaq === index;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 overflow-hidden transition-all duration-300 hover:shadow-sm">
      <button
        onClick={() => setOpenFaq(isOpen ? null : index)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
      >
        <h3 className="font-semibold text-gray-900 pr-4 text-sm md:text-base">{faq.question}</h3>
        <FiChevronDown 
          className={`text-blue-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

// Application Form Modal
const ApplicationFormModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    currentGrade: '',
    admissionPath: '',
    preferredStartDate: new Date().toISOString().split('T')[0],
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Application submitted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


const router = useRouter();


  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!open) return null;

  return (
    <ModernModal open={true} onClose={onClose}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <IoRocketOutline className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Start Your Application</h2>
              <p className="text-blue-100 opacity-90 text-sm">
                Join Nyaribu Secondary School
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
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Student Name *
              </label>
              <input
                type="text"
                required
                value={formData.studentName}
                onChange={(e) => updateField('studentName', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm"
                placeholder="Enter student full name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Parent/Guardian Name *
              </label>
              <input
                type="text"
                required
                value={formData.parentName}
                onChange={(e) => updateField('parentName', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm"
                placeholder="Enter parent/guardian name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Current Grade *
              </label>
              <select
                required
                value={formData.currentGrade}
                onChange={(e) => updateField('currentGrade', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm cursor-pointer"
              >
                <option value="">Select current grade</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Transfer">Transfer Student</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Admission Path *
              </label>
              <select
                required
                value={formData.admissionPath}
                onChange={(e) => updateField('admissionPath', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm cursor-pointer"
              >
                <option value="">Select admission path</option>
                <option value="Grade 7 Placement">Grade 7 Placement</option>
                <option value="Transfer Students">Transfer Students</option>
                <option value="International Students">International Students</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Preferred Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.preferredStartDate}
                onChange={(e) => updateField('preferredStartDate', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => updateField('message', e.target.value)}
              rows="3"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm resize-none"
              placeholder="Any additional information or questions..."
            />
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50"
          >
            <span className="text-sm">Cancel</span>
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm">Processing...</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span className="text-sm">Submit Application</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModernModal>
  );
};

export default function ComprehensiveAdmissions() {
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);

  // Data for the page
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
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'
    },
    {
      title: 'Transfer Students',
      icon: FiArrowRight,
      description: 'Seamless transfer from other schools with credit recognition',
      features: ['Credit Transfer', 'Placement Assessment', 'Records Review', 'Orientation Program'],
      deadline: 'Rolling Admission',
      color: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w-800&q=80'
    },
    {
      title: 'International Students',
      icon: IoEarthOutline,
      description: 'Global education with Kenyan CBC integration',
      features: ['Visa Assistance', 'CBC Adaptation', 'Hostel Accommodation', 'Cultural Integration'],
      deadline: '2024-04-15',
      color: 'from-green-500 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?w-800&q=80'
    }
  ];

  const innovativeFeatures = [
    {
      icon: IoRocketOutline,
      title: 'Future-Ready Curriculum',
      description: 'CBC integrated with 21st century skills and digital literacy',
      features: ['AI & Coding Basics', 'Financial Literacy', 'Environmental Studies', 'Global Citizenship'],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      color: 'from-blue-500 to-cyan-500',
      stats: { students: '500+', success: '95%' }
    },
    {
      icon: IoAccessibilityOutline,
      title: 'Personalized Learning',
      description: 'Tailored educational paths based on individual strengths and interests',
      features: ['Learning Style Assessment', 'Customized Projects', 'Mentorship Programs', 'Talent Development'],
      image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
      color: 'from-purple-500 to-pink-500',
      stats: { students: '100%', success: '98%' }
    },
    {
      icon: IoBuildOutline,
      title: 'Skill-Based Education',
      description: 'Focus on practical competencies and real-world application',
      features: ['Entrepreneurship Projects', 'Community Service', 'Internship Programs', 'Leadership Training'],
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
      color: 'from-green-500 to-emerald-500',
      stats: { students: '300+', success: '90%' }
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

  // CBC Structure Data
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

  // Fee Structure Data
  const feeStructure = {
    boarding: [
      { category: 'Tuition Fee', amount: '30,000', term: '10,000', details: ['CBC curriculum', 'Digital learning', 'Practical subjects'] },
      { category: 'Boarding Fee', amount: '30,000', term: '10,000', details: ['Accommodation', 'Full meals', 'Laundry', 'Utilities'] },
      { category: 'Development Fee', amount: '6,000', term: '2,000', details: ['Facilities', 'Sports equipment', 'Library'] },
      { category: 'Activity Fee', amount: '9,000', term: '3,000', details: ['Clubs', 'Educational trips', 'Sports'] }
    ],
    day: [
      { category: 'Tuition Fee', amount: '30,000', term: '10,000', details: ['CBC curriculum', 'Digital learning', 'Practical subjects'] },
      { category: 'Lunch Program', amount: '9,000', term: '3,000', details: ['Balanced meals', 'Fruit breaks', 'Special diets'] },
      { category: 'Development Fee', amount: '6,000', term: '2,000', details: ['Facilities', 'Sports equipment', 'Library'] },
      { category: 'Activity Fee', amount: '9,000', term: '3,000', details: ['Clubs', 'Educational trips', 'Sports'] }
    ]
  };

  // Transfer Process Data
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

  // Our Commitment Data
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

  // FAQ Data
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

  const handleApply = (path) => {
    setShowApplicationForm(true);
  };

  const handleLearnMore = (feature) => {
    toast.success(`Learn more about ${feature.title}`);
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Data refreshed successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <IoRocketOutline className="text-white text-lg w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                  Admissions Portal
                </h1>
                <p className="text-gray-600 mt-1">Nyaribu Secondary School - Join Our Community</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <button
              onClick={refreshData}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-xs border border-gray-200 font-medium disabled:opacity-50 text-sm md:text-base"
            >
              <FiRotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => router.push('/apply-for-admission')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-200 shadow-lg font-medium text-sm md:text-base"
            >
              <FiPlus className="w-4 h-4" />
              Start Application
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {dynamicStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search admission paths or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
              >
                <option value="all">All Programs</option>
                <option value="grade7">Grade 7 Placement</option>
                <option value="transfer">Transfer Students</option>
                <option value="international">International</option>
              </select>
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="inline-flex items-center gap-2 px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700"
              >
                <FiFilter className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 overflow-hidden mb-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <TabIcon className="text-lg" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xs border border-gray-200/60 p-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Welcome to Nyaribu Secondary School Admissions
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                  Where tradition meets innovation in education. We are committed to nurturing 
                  well-rounded individuals through our comprehensive CBC curriculum, state-of-the-art 
                  facilities, and dedicated faculty.
                </p>
              </div>

              {/* Admission Paths */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Your Admission Path</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {admissionPaths.map((path, index) => (
                    <AdmissionPathCard
                      key={path.title}
                      path={path}
                      index={index}
                      onApply={() => handleApply(path)}
                    />
                  ))}
                </div>
              </div>

              {/* Innovative Features */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Our Innovative Features</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {innovativeFeatures.map((feature, index) => (
                    <FeatureCard
                      key={feature.title}
                      feature={feature}
                      onLearnMore={() => handleLearnMore(feature)}
                    />
                  ))}
                </div>
              </div>

              {/* Key Features Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Nyaribu Secondary?</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  ].map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="text-2xl text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CBC Curriculum Tab */}
          {activeTab === 'cbc' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  CBC Curriculum Structure
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Our comprehensive CBC program focuses on developing 7 core competencies through engaging learning areas.
                </p>
              </div>

              {/* Core Subjects */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Core Learning Areas</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cbcStructure.coreSubjects.map((subject, index) => (
                    <SubjectCard key={index} subject={subject} index={index} />
                  ))}
                </div>
              </div>

              {/* Optional Subjects */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Pre-Technical & Pre-Career Subjects</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cbcStructure.optionalSubjects.map((subject, index) => (
                    <SubjectCard key={index} subject={subject} index={index} />
                  ))}
                </div>
              </div>

              {/* Competencies */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">7 Core Competencies</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cbcStructure.competencies.map((competency, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{competency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fee Structure Tab */}
          {activeTab === 'fees' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Transparent Fee Structure
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  We believe in providing quality education at an affordable cost with flexible payment options.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <FeeCard
                  feeType="Boarding School"
                  fees={feeStructure.boarding}
                  icon={IoBookOutline}
                  color="bg-blue-50"
                />
                <FeeCard
                  feeType="Day School"
                  fees={feeStructure.day}
                  icon={FiHome}
                  color="bg-green-50"
                />
              </div>

              {/* Financial Support */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex items-start gap-4">
                  <FiAward className="text-2xl text-amber-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3">Financial Support Available</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Scholarships:</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-500" />
                            Academic Excellence
                          </li>
                          <li className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-500" />
                            Sports & Arts Talent
                          </li>
                          <li className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-500" />
                            Leadership Potential
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Payment Plans:</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-500" />
                            Installment payments
                          </li>
                          <li className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-500" />
                            Sibling discounts
                          </li>
                          <li className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-500" />
                            Early payment discount
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transfer Process Tab */}
          {activeTab === 'transfer' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Smooth Transfer Process
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  We ensure a seamless transition for transfer students with comprehensive support at every step.
                </p>
              </div>

              <div className="space-y-6">
                {transferProcess.map((step, index) => (
                  <ProcessStep key={index} step={step} index={index} />
                ))}
              </div>

              {/* Additional Information */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Additional Support for Transfer Students</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Academic Support:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-blue-500" />
                        CBC adaptation guidance
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-blue-500" />
                        Extra tuition sessions
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-blue-500" />
                        Study skills workshops
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Social Integration:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-blue-500" />
                        Buddy system
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-blue-500" />
                        Orientation events
                      </li>
                      <li className="flex items-center gap-2">
                        <FiCheckCircle className="text-blue-500" />
                        Club participation
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Our Commitment Tab */}
          {activeTab === 'commitment' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Our Commitment to Your Child's Success
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  We are dedicated to providing an environment where every student can thrive and reach their full potential.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ourCommitment.map((commitment, index) => (
                  <CommitmentCard key={index} commitment={commitment} index={index} />
                ))}
              </div>

              {/* Mission Statement */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 text-center">
                <FiHeart className="text-3xl text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Promise to You</h3>
                <p className="text-gray-600 italic max-w-3xl mx-auto">
                  "We are committed to providing a nurturing environment where every student 
                  can discover their potential, develop essential competencies, and build 
                  a foundation for lifelong success. Together, we shape futures."
                </p>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Find answers to common questions about admissions, curriculum, fees, and more.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    faq={faq}
                    index={index}
                    openFaq={openFaq}
                    setOpenFaq={setOpenFaq}
                  />
                ))}
              </div>

              {/* Contact Support */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Still have questions?</h3>
                    <p className="text-gray-600">Our admissions team is here to help you.</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                      <a href="tel:+254712345678" className="flex items-center gap-2">
                        <FiPhone />
                        Call Us
                      </a>
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                      <a href="mailto:admissions@nyaribu.ac.ke" className="flex items-center gap-2">
                        <FiMail />
                        Email Us
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Join our community dedicated to nurturing future leaders through quality CBC education, 
            personalized attention, and a commitment to holistic development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowApplicationForm(true)}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Start Your Application
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
              Download Brochure
            </button>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      <ApplicationFormModal
        open={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        onSuccess={() => {
          // Handle success
        }}
      />
    </div>
  );
}