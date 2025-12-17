'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiAward, 
  FiStar, 
  FiBook, 
  FiTarget, 
  FiUsers,
  FiCalendar,
  FiGlobe,
  FiLinkedin,
  FiTwitter,
  FiArrowLeft,
  FiShare2,
  FiMessageCircle,
  FiVideo,
  FiClock,
  FiUserCheck,
  FiShield,
  FiTrendingUp,
  FiBookOpen,
  FiDownload,
  FiPrinter,
  FiBookmark
} from 'react-icons/fi';
import { 
  FaGraduationCap, 
  FaChalkboardTeacher, 
  FaUniversity, 
  FaCertificate,
  FaMedal,
  FaTrophy,
  FaHeart,
  FaHandsHelping
} from 'react-icons/fa';

// ==========================================
// 1. MODERN CONFIGURATION
// ==========================================

const SOCIAL_LINKS = [
  { name: 'LinkedIn', icon: <FiLinkedin />, color: 'bg-blue-600' },
  { name: 'Twitter', icon: <FiTwitter />, color: 'bg-sky-500' },
  { name: 'Website', icon: <FiGlobe />, color: 'bg-emerald-500' },
  { name: 'Publications', icon: <FiBookOpen />, color: 'bg-purple-500' }
];

// ==========================================
// 2. MODERN SUB-COMPONENTS
// ==========================================

const StatCard = ({ icon, value, label, color = 'blue', trend }) => (
  <div className="bg-white rounded-2xl border border-gray-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group hover:border-blue-200">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color === 'blue' ? 'bg-blue-50 group-hover:bg-blue-100' : color === 'emerald' ? 'bg-emerald-50 group-hover:bg-emerald-100' : 'bg-slate-50 group-hover:bg-slate-100'} transition-colors`}>
        <div className="text-xl text-blue-600">
          {icon}
        </div>
      </div>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const Badge = ({ children, color = 'blue', icon, className = '' }) => {
  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200',
    emerald: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200',
    orange: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-orange-200',
    purple: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-200',
    amber: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200'
  };
  
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${colorClasses[color] || colorClasses.blue} ${className}`}>
      {icon && <span className="mr-2 text-lg">{icon}</span>}
      {children}
    </span>
  );
};

const FeatureCard = ({ title, description, icon, color = 'blue' }) => (
  <div className="bg-white rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
    <div className={`w-14 h-14 rounded-2xl ${color === 'blue' ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-emerald-50 group-hover:bg-emerald-100'} flex items-center justify-center mb-4 transition-colors`}>
      <div className="text-2xl text-blue-600">
        {icon}
      </div>
    </div>
    <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const TimelineItem = ({ year, title, description, icon, isLast = false }) => (
  <div className="flex group">
    <div className="flex flex-col items-center mr-6">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      {!isLast && <div className="flex-1 w-0.5 bg-gradient-to-b from-blue-200 to-transparent mt-4"></div>}
    </div>
    <div className="flex-1 pb-8">
      <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-2">
        {year}
      </div>
      <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const SkillBar = ({ skill, level, color = 'blue' }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold text-gray-700">{skill}</span>
      <span className="text-sm text-gray-500">{level}%</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'} transition-all duration-1000`}
        style={{ width: `${level}%` }}
      />
    </div>
  </div>
);

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================

export default function StaffProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id, slug } = params;
  
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with actual API call
  const mockStaffData = {
    id: id || '1',
    name: 'Dr. Sarah Johnson',
    position: 'Senior Mathematics Teacher & Department Head',
    department: 'Mathematics',
    email: 'sarah.johnson@nyaribu.edu',
    phone: '+1 (555) 123-4567',
    image: '/images/staff/sarah-johnson.jpg',
    bio: 'A dedicated educator with over 12 years of experience in mathematics education. Passionate about making complex concepts accessible and engaging for all students. Committed to innovative teaching methods and student success.',
    expertise: ['Advanced Calculus', 'Statistics', 'Curriculum Development', 'Educational Technology', 'Student Assessment'],
    responsibilities: ['Department Leadership', 'Curriculum Design', 'Teacher Training', 'Student Mentorship', 'Academic Planning'],
    achievements: [
      'National Teacher of the Year 2022',
      'Excellence in STEM Education Award 2021',
      'Published 3 research papers in educational journals',
      'Developed award-winning math curriculum'
    ],
    education: [
      { degree: 'Ph.D. in Mathematics Education', institution: 'Stanford University', year: '2015' },
      { degree: 'M.Sc. in Applied Mathematics', institution: 'MIT', year: '2010' },
      { degree: 'B.Sc. in Mathematics', institution: 'Harvard University', year: '2008' }
    ],
    experience: [
      { position: 'Department Head', institution: 'Nyaribu School', duration: '2018-Present' },
      { position: 'Senior Mathematics Teacher', institution: 'Nyaribu School', duration: '2015-2018' },
      { position: 'Mathematics Instructor', institution: 'Tech Academy', duration: '2012-2015' },
      { position: 'Teaching Assistant', institution: 'Stanford University', duration: '2010-2012' }
    ],
    publications: [
      'Innovative Approaches to Teaching Calculus in High School, Journal of Mathematics Education, 2023',
      'The Impact of Technology on Student Engagement in Mathematics, Educational Technology Review, 2021',
      'Building Mathematical Confidence Through Project-Based Learning, Mathematics Teacher Journal, 2020'
    ],
    certifications: [
      'National Board Certified Teacher',
      'Google Certified Educator Level 2',
      'Advanced Placement Mathematics Certification',
      'STEM Education Specialist'
    ],
    skills: [
      { name: 'Curriculum Design', level: 95 },
      { name: 'Student Engagement', level: 92 },
      { name: 'Educational Technology', level: 88 },
      { name: 'Data Analysis', level: 85 },
      { name: 'Teacher Training', level: 90 }
    ],
    officeHours: 'Monday-Friday: 8:00 AM - 4:00 PM | Thursday: 4:00 PM - 6:00 PM',
    location: 'Academic Building, Room 304',
    joinDate: '2015',
    availability: 'Available for parent meetings by appointment',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    twitter: 'https://twitter.com/sarahj_edu',
    website: 'https://sarahjohnson.edu',
    quote: 'Mathematics is not about numbers, equations, or algorithms: it is about understanding. - William Paul Thurston'
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        // In production, use this:
        // const response = await fetch(`/api/staff/${id}`);
        // const data = await response.json();
        
        // For now, use mock data with delay
        setTimeout(() => {
          setStaff(mockStaffData);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.error('Error fetching staff data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchStaffData();
    }
  }, [id]);

  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${staff?.name} - Nyaribu School`,
          text: `Meet ${staff?.name}, ${staff?.position} at Nyaribu School`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Generate structured data for SEO
  const structuredData = staff ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": staff.name,
    "jobTitle": staff.position,
    "worksFor": {
      "@type": "EducationalOrganization",
      "name": "Nyaribu School",
      "url": "https://nyaribu.edu"
    },
    "description": staff.bio,
    "email": staff.email,
    "telephone": staff.phone,
    "image": staff.image,
    "alumniOf": staff.education?.map(edu => ({
      "@type": "EducationalOrganization",
      "name": edu.institution
    })),
    "knowsAbout": staff.expertise,
    "award": staff.achievements,
    "memberOf": staff.department,
    "url": typeof window !== 'undefined' ? window.location.href : ''
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiUsers className="text-3xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Staff Member Not Found</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We couldn't find the staff member you're looking for.
          </p>
          <button 
            onClick={() => router.push('/pages/staff')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg w-full hover:shadow-xl transition-shadow"
          >
            Back to Staff Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Add structured data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-gray-900">
        
        {/* Back Navigation Bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center">
            <button
              onClick={() => router.push('/pages/staff')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Directory</span>
            </button>
            <div className="ml-auto flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="Share profile"
              >
                <FiShare2 size={20} />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="Print profile"
              >
                <FiPrinter size={20} />
              </button>
              <button
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="Bookmark"
              >
                <FiBookmark size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-8">
          
          {/* Modern Hero Section */}
          <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700"></div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            <div className="relative p-6 sm:p-8 lg:p-12 text-white">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Profile Image with Modern Frame */}
                <div className="relative">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl">
                    <Image
                      src={staff.image}
                      alt={`Professional portrait of ${staff.name}`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
                      onError={(e) => {
                        e.target.src = '/images/default-staff.jpg';
                      }}
                    />
                  </div>
                  {/* Online Status Indicator */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                      {staff.name}
                    </h1>
                    <Badge color="blue" icon="🏆" className="mx-auto lg:mx-0 w-fit bg-white/20 backdrop-blur-sm border-white/30">
                      {staff.department}
                    </Badge>
                  </div>
                  
                  <p className="text-xl sm:text-2xl font-semibold text-blue-100 mb-4">
                    {staff.position}
                  </p>
                  
                  <p className="text-blue-100/90 leading-relaxed max-w-3xl mb-6 text-lg">
                    {staff.bio}
                  </p>

                  {/* Quote */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
                    <p className="italic text-white/90">"{staff.quote}"</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <FiCalendar className="text-blue-200" />
                      <span className="font-semibold">Joined {staff.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <FiMapPin className="text-blue-200" />
                      <span className="font-semibold">{staff.location}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <FiClock className="text-blue-200" />
                      <span className="font-semibold">Available Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Contact & Stats */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Contact Card */}
              <div className="bg-white rounded-2xl border border-gray-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="text-blue-600 text-xl" />
                  </div>
                  Contact & Connect
                </h3>
                
                <div className="space-y-4">
                  {staff.email && (
                    <a 
                      href={`mailto:${staff.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group border border-gray-100 hover:border-blue-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiMail className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-semibold text-gray-900 truncate">{staff.email}</div>
                      </div>
                      <FiArrowLeft className="transform rotate-180 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </a>
                  )}
                  
                  {staff.phone && (
                    <a 
                      href={`tel:${staff.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors group border border-gray-100 hover:border-emerald-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiPhone className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-semibold text-gray-900">{staff.phone}</div>
                      </div>
                      <FiArrowLeft className="transform rotate-180 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </a>
                  )}
                  
                  <div className="p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <FiMapPin className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">Office</div>
                        <div className="font-semibold text-gray-900">{staff.location}</div>
                        <div className="text-xs text-gray-500 mt-1">{staff.officeHours}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Connect Professionally</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <a href={staff.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                      <FiLinkedin /> LinkedIn
                    </a>
                    <a href={staff.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition-colors">
                      <FiTwitter /> Twitter
                    </a>
                    <a href={staff.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors">
                      <FiGlobe /> Website
                    </a>
                    <button className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors">
                      <FiDownload /> CV
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Card */}
              <div className="bg-white rounded-2xl border border-gray-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Professional Impact</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Teaching Experience</span>
                      <span className="font-bold text-gray-900">12+ Years</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-3/4 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Student Success Rate</span>
                      <span className="font-bold text-green-600">96%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 w-[96%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Parent Satisfaction</span>
                      <span className="font-bold text-amber-600">4.9/5</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 w-[98%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Innovation Index</span>
                      <span className="font-bold text-purple-600">92%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 w-[92%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Schedule Interaction</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                    <FiMessageCircle size={20} /> Book Consultation
                  </button>
                  <button className="w-full flex items-center justify-center gap-3 bg-white text-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors border-2 border-blue-600">
                    <FiVideo size={20} /> Virtual Meeting
                  </button>
                  <button className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-colors">
                    <FiCalendar size={20} /> View Calendar
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Tab Navigation - Modern Design */}
              <div className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden shadow-lg">
                <div className="flex overflow-x-auto border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50">
                  {[
                    { id: 'overview', label: 'Overview', icon: <FiUserCheck /> },
                    { id: 'expertise', label: 'Expertise', icon: <FiStar /> },
                    { id: 'experience', label: 'Experience', icon: <FaUniversity /> },
                    { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
                    { id: 'achievements', label: 'Achievements', icon: <FaTrophy /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                          : 'text-gray-600 hover:text-blue-500 hover:bg-white/50'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-6">Professional Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FeatureCard
                            title="Teaching Philosophy"
                            description="Believes in creating an inclusive learning environment where every student can discover their mathematical potential through practical applications and collaborative problem-solving."
                            icon={<FaChalkboardTeacher />}
                            color="blue"
                          />
                          <FeatureCard
                            title="Innovation Approach"
                            description="Integrates cutting-edge technology with traditional teaching methods to create dynamic, interactive learning experiences that prepare students for the digital age."
                            icon={<FiTrendingUp />}
                            color="emerald"
                          />
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FiTarget className="text-blue-600 text-xl" />
                          </div>
                          Core Competencies
                        </h4>
                        <div className="space-y-6">
                          {staff.skills.map((skill, index) => (
                            <SkillBar
                              key={index}
                              skill={skill.name}
                              level={skill.level}
                              color={index % 2 === 0 ? 'blue' : 'emerald'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'expertise' && (
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-6">Areas of Expertise</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {staff.expertise.map((skill, index) => (
                            <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-2xl border border-gray-200 hover:border-blue-300 transition-colors group hover:shadow-lg">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <FiStar className="text-white" />
                                </div>
                                <h5 className="font-bold text-gray-900 text-lg">{skill}</h5>
                              </div>
                              <p className="text-gray-600 text-sm">Extensive experience and proven results in this area with multiple successful implementations.</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-6">Professional Certifications</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {staff.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 hover:border-emerald-300 transition-colors">
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <FaCertificate className="text-white text-xl" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900">{cert}</div>
                                <div className="text-sm text-gray-600">Nationally Recognized</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'experience' && (
                    <div className="space-y-8">
                      <h4 className="text-2xl font-bold text-gray-900 mb-6">Professional Timeline</h4>
                      <div className="space-y-8">
                        {staff.experience.map((exp, index) => (
                          <TimelineItem
                            key={index}
                            year={exp.duration}
                            title={exp.position}
                            description={`At ${exp.institution}. Led initiatives in curriculum development, student mentorship, and academic excellence programs.`}
                            icon={<FaUniversity />}
                            isLast={index === staff.experience.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'education' && (
                    <div className="space-y-8">
                      <h4 className="text-2xl font-bold text-gray-900 mb-6">Academic Background</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {staff.education.map((edu, index) => (
                          <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:border-blue-300 transition-colors group hover:shadow-lg">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <FaGraduationCap className="text-white text-2xl" />
                            </div>
                            <h5 className="font-bold text-gray-900 text-lg mb-2">{edu.degree}</h5>
                            <p className="text-gray-700 mb-2">{edu.institution}</p>
                            <div className="inline-block px-3 py-1 bg-white text-blue-600 text-sm font-semibold rounded-full">
                              {edu.year}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'achievements' && (
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-6">Awards & Recognition</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {staff.achievements.map((achievement, index) => (
                            <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 hover:border-amber-300 transition-colors group">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <FaMedal className="text-white text-2xl" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-900 text-lg mb-2">{achievement}</h5>
                                  <p className="text-gray-600 text-sm">Recognized for outstanding contributions to education and student development.</p>
                                  <div className="mt-3 text-sm text-amber-600 font-semibold">
                                    🏆 National Level Achievement
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Publications */}
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-6">Research & Publications</h4>
                        <div className="space-y-4">
                          {staff.publications.map((pub, index) => (
                            <div key={index} className="flex items-start gap-4 p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:border-purple-300 transition-colors group">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FiBookOpen className="text-white text-xl" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">{pub}</div>
                                <div className="text-sm text-gray-600 mt-2">Peer-reviewed publication in international educational journal</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">Ready to Connect?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Schedule a consultation or meeting to discuss educational opportunities and collaborations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                    Book Appointment
                  </button>
                  <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200/50 pt-8 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center text-gray-600">
              <p className="mb-2">© {new Date().getFullYear()} Nyaribu School. All rights reserved.</p>
              <p className="text-sm">This profile is optimized for search engines and professional networking.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}