'use client';
import { useState } from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiLinkedin,
  FiTwitter,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiArrowRight,
  FiUser,
  FiExternalLink,
  FiStar,
  FiMapPin,
  FiGlobe
} from 'react-icons/fi';
import { IoPeopleOutline, IoStarOutline, IoRibbonOutline, IoClose } from 'react-icons/io5';
import { GiGraduateCap, GiTeacher, GiDuration, GiOfficeChair } from 'react-icons/gi';
import Image from 'next/image';

const ModernLeadershipSection = () => {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Complete Sample Data - No dependencies
  const sampleStaff = [
    {
      id: 1,
      name: "Dr. Peter Mwangi Karanja",
      role: "Principal & Chief Executive",
      department: "School Administration",
      qualification: "Ph.D Educational Leadership, M.Ed Administration, B.Ed Arts",
      experience: "25 years",
      specialization: "Strategic Planning & Institutional Management",
      email: "principal@nyaribusecondary.sc.ke",
      phone: "+254 712 345 678",
      bio: "With over two decades of educational leadership experience, Dr. Mwangi has transformed Nyaribu Secondary into a center of academic excellence. His visionary leadership focuses on holistic student development, modern teaching methodologies, and community engagement.",
      achievements: [
        "Improved KCSE Performance by 28% over 5 years",
        "Led construction of modern science laboratories",
        "Implemented digital learning platform across school",
        "Established international school partnerships"
      ],
      image: "/images/staff/principal.jpg",
      social: {
        linkedin: "https://linkedin.com/in/petermwangi",
        twitter: "https://twitter.com/pmwangi_edu"
      },
      office: "Administration Block, Room 101",
      joiningYear: "2005"
    },
    {
      id: 2,
      name: "Mrs. Jane Wambui Kamau",
      role: "Deputy Principal - Academics",
      department: "Academic Administration",
      qualification: "M.Sc Curriculum Development, B.Ed Sciences, Dip. Educational Technology",
      experience: "18 years",
      specialization: "Curriculum Design & Academic Excellence",
      email: "deputy.academics@nyaribusecondary.sc.ke",
      phone: "+254 723 456 789",
      bio: "Mrs. Kamau oversees all academic programs with a focus on innovative teaching methods and curriculum development. She has spearheaded the integration of technology in classrooms and established mentorship programs for both teachers and students.",
      achievements: [
        "Developed school-wide digital curriculum framework",
        "Increased university admission rate by 35%",
        "Trained 60+ teachers in modern pedagogy",
        "Led STEM education initiatives"
      ],
      image: "/images/staff/deputy-academic.jpg",
      social: {
        linkedin: "https://linkedin.com/in/janewambui",
        twitter: "https://twitter.com/jwambui_edu"
      },
      office: "Academic Block, Room 201",
      joiningYear: "2010"
    },
    {
      id: 3,
      name: "Mr. David Kimani Njoroge",
      role: "Deputy Principal - Administration",
      department: "Administration & Finance",
      qualification: "M.A Public Administration, B.Ed Humanities, CPA(K)",
      experience: "15 years",
      specialization: "Administrative Management & Resource Optimization",
      email: "deputy.admin@nyaribusecondary.sc.ke",
      phone: "+254 734 567 890",
      bio: "Mr. Njoroge manages school operations, finances, and infrastructure development. His efficient administrative systems have streamlined school processes and enhanced resource allocation for optimal educational outcomes.",
      achievements: [
        "Modernized school administrative systems",
        "Secured funding for ICT infrastructure",
        "Improved staff welfare programs",
        "Enhanced parent-school communication"
      ],
      image: "/images/staff/deputy-admin.jpg",
      social: {
        linkedin: "https://linkedin.com/in/davidkimani",
        twitter: "https://twitter.com/dkimani_admin"
      },
      office: "Administration Block, Room 102",
      joiningYear: "2012"
    },
    {
      id: 4,
      name: "Prof. Sarah Achieng Omondi",
      role: "Head of Science Department",
      department: "Sciences",
      qualification: "Ph.D Chemistry, M.Sc Physics, B.Ed Sciences",
      experience: "22 years",
      specialization: "Science Education & Research Methodology",
      email: "head.science@nyaribusecondary.sc.ke",
      phone: "+254 745 678 901",
      bio: "Professor Omondi leads the science department with a research-focused approach. She has established modern laboratories and mentored students to national science competition victories.",
      achievements: [
        "Established 3 modern science laboratories",
        "Produced 15 national science fair winners",
        "Published research in educational journals",
        "Developed science mentorship program"
      ],
      image: "/images/staff/head-science.jpg",
      social: {
        linkedin: "https://linkedin.com/in/sarahachieng",
        twitter: "https://twitter.com/sachieng_sci"
      },
      office: "Science Block, Room 301",
      joiningYear: "2008"
    },
    {
      id: 5,
      name: "Mr. James Omondi Otieno",
      role: "Head of Mathematics Department",
      department: "Mathematics",
      qualification: "M.Sc Mathematics, B.Ed Mathematics, Dip. Statistics",
      experience: "16 years",
      specialization: "Mathematical Problem Solving & Olympiad Training",
      email: "head.maths@nyaribusecondary.sc.ke",
      phone: "+254 756 789 012",
      bio: "Mr. Otieno specializes in making mathematics accessible and engaging. His innovative teaching methods have significantly improved student performance in national examinations.",
      achievements: [
        "Improved math performance by 40%",
        "Coached 8 national math olympiad winners",
        "Developed interactive math curriculum",
        "Trained teachers in modern math pedagogy"
      ],
      image: "/images/staff/head-maths.jpg",
      social: {
        linkedin: "https://linkedin.com/in/jamesomondi"
      },
      office: "Mathematics Wing, Room 401",
      joiningYear: "2011"
    },
    {
      id: 6,
      name: "Mrs. Grace Akinyi Odhiambo",
      role: "Head of Languages Department",
      department: "Languages",
      qualification: "M.A Linguistics, B.Ed Languages, Dip. French",
      experience: "14 years",
      specialization: "Language Acquisition & Communication Skills",
      email: "head.languages@nyaribusecondary.sc.ke",
      phone: "+254 767 890 123",
      bio: "Mrs. Odhiambo fosters linguistic excellence through immersive language programs. She has introduced French and German language options and established language exchange programs.",
      achievements: [
        "Introduced French and German programs",
        "Established language exchange partnerships",
        "Improved national language scores by 45%",
        "Published language teaching materials"
      ],
      image: "/images/staff/head-languages.jpg",
      social: {
        linkedin: "https://linkedin.com/in/graceakinyi"
      },
      office: "Languages Wing, Room 501",
      joiningYear: "2013"
    }
  ];

  const schoolInfo = {
    name: "Nyaribu Secondary School",
    staffCount: 68,
    established: 1980,
    location: "Nyamira County, Kenya"
  };

  // Filter staff based on active tab
  const filteredStaff = sampleStaff.filter(member => {
    if (activeTab === 'all') return true;
    if (activeTab === 'principal') return member.role?.includes('Principal');
    if (activeTab === 'deputy') return member.role?.includes('Deputy');
    if (activeTab === 'heads') return member.role?.includes('Head');
    return true;
  });

  // Calculate stats
  const totalExperience = sampleStaff.reduce((sum, member) => 
    sum + parseInt(member.experience?.split(' ')[0] || 0), 0
  );
  
  const advancedDegrees = sampleStaff.filter(m => 
    m.qualification?.includes('Ph.D') || 
    m.qualification?.includes('Prof.') ||
    m.qualification?.includes('M.Sc') ||
    m.qualification?.includes('M.A')
  ).length;

  const getRoleColor = (role) => {
    if (role?.includes('Principal')) return {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      text: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    if (role?.includes('Deputy')) return {
      bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
      text: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    if (role?.includes('Head')) return {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
      text: 'text-green-600',
      badge: 'bg-green-100 text-green-800 border-green-200'
    };
    return {
      bg: 'bg-gradient-to-r from-gray-500 to-gray-700',
      text: 'text-gray-600',
      badge: 'bg-gray-100 text-gray-800 border-gray-200'
    };
  };

  const getRoleIcon = (role) => {
    if (role?.includes('Principal')) return <GiGraduateCap className="text-xl" />;
    if (role?.includes('Deputy')) return <IoPeopleOutline className="text-xl" />;
    if (role?.includes('Head')) return <FiBriefcase className="text-xl" />;
    return <GiTeacher className="text-xl" />;
  };

  const handleViewAll = () => {
    // Navigate to full staff directory
    window.location.href = '/pages/staff';
  };

  return (
    <>
      {/* Main Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200 mb-6">
              <IoPeopleOutline className="text-purple-600" />
              <span className="text-purple-700 font-medium text-sm md:text-base">Meet Our Leaders</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
              School <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Leadership Team</span>
            </h2>
            
            <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto px-4">
              Guided by experienced professionals committed to academic excellence and holistic student development
            </p>
          </div>

          {/* Tabs for Filtering */}
          <div className="mb-10 md:mb-12 overflow-x-auto">
            <div className="flex space-x-2 md:space-x-4 min-w-max md:min-w-0 md:justify-center px-4 md:px-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium text-sm md:text-base transition-all whitespace-nowrap ${
                  activeTab === 'all' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                All Leaders
              </button>
              <button
                onClick={() => setActiveTab('principal')}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium text-sm md:text-base transition-all whitespace-nowrap ${
                  activeTab === 'principal' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                }`}
              >
                Principal
              </button>
              <button
                onClick={() => setActiveTab('deputy')}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium text-sm md:text-base transition-all whitespace-nowrap ${
                  activeTab === 'deputy' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
                }`}
              >
                Deputy Principals
              </button>
              <button
                onClick={() => setActiveTab('heads')}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium text-sm md:text-base transition-all whitespace-nowrap ${
                  activeTab === 'heads' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-white text-green-700 hover:bg-green-50 border border-green-200'
                }`}
              >
                Department Heads
              </button>
            </div>
          </div>

          {/* Leadership Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            {filteredStaff.map((member, index) => {
              const roleColor = getRoleColor(member.role);
              
              return (
                <div 
                  key={member.id}
                  className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  onClick={() => setSelectedStaff(member)}
                >
                  {/* Card Content */}
                  <div className="p-5 md:p-6">
                    {/* Header with Image and Basic Info */}
                    <div className="flex items-start gap-4 md:gap-6 mb-4 md:mb-6">
                      {/* Profile Image */}
                      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={member.image || `/images/staff/staff-${index + 1}.jpg`}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 80px, 96px"
                        />
                        {/* Experience Badge */}
                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                          <div className="bg-blue-600 text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs font-bold">
                            {member.experience?.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                      
                      {/* Basic Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                          {member.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {getRoleIcon(member.role)}
                          <span className={`text-sm md:text-base font-semibold ${roleColor.text}`}>
                            {member.role?.split(' - ')[0]?.split(' (')[0]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${roleColor.badge} border`}>
                            {member.department}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Specialization & Qualification */}
                    <div className="space-y-3 mb-4 md:mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FiAward className="text-green-600 text-sm" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Specialization</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{member.specialization}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FiBookOpen className="text-blue-600 text-sm" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Qualification</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{member.qualification.split(',')[0]}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Bio */}
                    <div className="mb-4 md:mb-6">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {member.bio.substring(0, 120)}...
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button 
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${member.email}`;
                        }}
                      >
                        <FiMail className="text-sm" />
                        <span>Contact</span>
                      </button>
                      
                      <button 
                        className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStaff(member);
                        }}
                      >
                        <span className="hidden sm:inline">Profile</span>
                        <FiExternalLink className="sm:ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="mb-12 md:mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <IoPeopleOutline className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-blue-600">{sampleStaff.length}</div>
                    <div className="text-sm text-gray-600">Leadership Team</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Senior administrators guiding school vision</p>
              </div>
              
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <GiDuration className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-purple-600">{totalExperience}+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Combined educational expertise</p>
              </div>
              
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <GiGraduateCap className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-green-600">{advancedDegrees}</div>
                    <div className="text-sm text-gray-600">Advanced Degrees</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Masters, PhDs & Professional Qualifications</p>
              </div>
              
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <GiTeacher className="text-orange-600 text-lg" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-orange-600">{schoolInfo.staffCount}</div>
                    <div className="text-sm text-gray-600">Total Staff</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Teaching & support staff members</p>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center">
            <button
              onClick={handleViewAll}
              className="group inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl md:rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 text-base md:text-lg shadow-lg"
            >
              Explore Complete Staff Directory
              <FiArrowRight className="ml-3 text-lg group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-gray-500 text-sm md:text-base mt-4">
              Meet all {schoolInfo.staffCount} dedicated education professionals at {schoolInfo.name}
            </p>
          </div>
        </div>
      </section>

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedStaff(null)}
        >
          <div 
            className="bg-white rounded-2xl md:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden">
                  <Image
                    src={selectedStaff.image}
                    alt={selectedStaff.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 64px, 80px"
                  />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900">{selectedStaff.name}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{selectedStaff.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 md:p-8">
              <div className="md:flex md:gap-8">
                {/* Left Column - Contact & Basic Info */}
                <div className="md:w-1/3 mb-8 md:mb-0">
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FiUser className="text-blue-600" />
                        Contact Information
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <FiMail className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <a 
                              href={`mailto:${selectedStaff.email}`}
                              className="text-blue-600 hover:text-blue-700 font-medium break-all"
                            >
                              {selectedStaff.email}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                            <FiPhone className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <a 
                              href={`tel:${selectedStaff.phone}`}
                              className="text-gray-900 hover:text-blue-600 font-medium"
                            >
                              {selectedStaff.phone}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <FiMapPin className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Office Location</p>
                            <p className="text-gray-900 font-medium">{selectedStaff.office}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <GiDuration className="text-purple-600" />
                        Professional Timeline
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Experience</span>
                          <span className="font-semibold text-gray-900">{selectedStaff.experience}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Joined School</span>
                          <span className="font-semibold text-gray-900">{selectedStaff.joiningYear}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Department</span>
                          <span className="font-semibold text-gray-900">{selectedStaff.department}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Social Links */}
                    {(selectedStaff.social?.linkedin || selectedStaff.social?.twitter) && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <FiGlobe className="text-green-600" />
                          Connect Online
                        </h4>
                        <div className="flex gap-3">
                          {selectedStaff.social.linkedin && (
                            <a 
                              href={selectedStaff.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                              <FiLinkedin className="text-lg" />
                              LinkedIn
                            </a>
                          )}
                          {selectedStaff.social.twitter && (
                            <a 
                              href={selectedStaff.social.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                              <FiTwitter className="text-lg" />
                              Twitter
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Column - Detailed Information */}
                <div className="md:w-2/3">
                  {/* Professional Biography */}
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Professional Biography</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedStaff.bio}
                    </p>
                  </div>
                  
                  {/* Qualifications & Specialization */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-2xl p-5">
                      <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FiBookOpen className="text-blue-600" />
                        Academic Qualifications
                      </h5>
                      <p className="text-gray-700">{selectedStaff.qualification}</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-2xl p-5">
                      <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FiAward className="text-green-600" />
                        Area of Specialization
                      </h5>
                      <p className="text-gray-700">{selectedStaff.specialization}</p>
                    </div>
                  </div>
                  
                  {/* Key Achievements */}
                  {selectedStaff.achievements && (
                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <IoRibbonOutline className="text-yellow-600" />
                        Key Achievements
                      </h4>
                      <div className="space-y-3">
                        {selectedStaff.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                            <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FiStar className="text-yellow-600 text-xs" />
                            </div>
                            <p className="text-gray-700">{achievement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                      onClick={() => window.location.href = `mailto:${selectedStaff.email}`}
                    >
                      <FiMail />
                      Send Message
                    </button>
                    <button 
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                      onClick={handleViewAll}
                    >
                      <IoPeopleOutline />
                      View All Staff
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernLeadershipSection;