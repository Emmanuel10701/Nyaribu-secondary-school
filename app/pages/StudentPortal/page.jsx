'use client';
import { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiUsers,
  FiStar,
  FiChevronRight,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiUser,
  FiCheck
} from 'react-icons/fi';
import { IoPeopleOutline, IoRibbonOutline } from 'react-icons/io5';
import { GiGraduateCap } from 'react-icons/gi';
import Image from 'next/image';

const ModernStaffLeadership = () => {
  const [staff, setStaff] = useState([]);
  const [featuredStaff, setFeaturedStaff] = useState(null);
  const [deputyPrincipal, setDeputyPrincipal] = useState(null);
  const [randomStaff, setRandomStaff] = useState(null);
  const [randomBOM, setRandomBOM] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch staff data from API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/staff');
        const data = await response.json();
        
        if (data.success && data.staff && Array.isArray(data.staff)) {
          setStaff(data.staff);
          
          // Find Principal (look for role or position containing "Principal")
          const principal = data.staff.find(s => 
            (s.role && s.role.toLowerCase().includes('principal')) ||
            (s.position && s.position.toLowerCase().includes('principal'))
          ) || data.staff[0]; // Fallback to first staff if no principal found
          
          setFeaturedStaff(principal);
          
          // Find Deputy Principal
          const deputy = data.staff.find(s => 
            (s.role && s.role.toLowerCase().includes('deputy')) ||
            (s.position && s.position.toLowerCase().includes('deputy'))
          ) || data.staff.find(s => 
            s.role && s.role.toLowerCase().includes('administration') && 
            s.id !== principal?.id
          );
          
          setDeputyPrincipal(deputy);
          
          // Find Teaching Staff (excluding principal and deputy)
          const teachingStaff = data.staff.filter(s => 
            (s.role && (s.role.toLowerCase().includes('teacher') || 
                       s.role.toLowerCase().includes('teaching'))) &&
            s.id !== principal?.id && 
            s.id !== deputy?.id
          );
          
          // Random Teaching Staff
          if (teachingStaff.length > 0) {
            const randomIndex = Math.floor(Math.random() * teachingStaff.length);
            setRandomStaff(teachingStaff[randomIndex]);
          } else {
            // Fallback to any staff member (excluding principal and deputy)
            const otherStaff = data.staff.filter(s => 
              s.id !== principal?.id && 
              s.id !== deputy?.id
            );
            if (otherStaff.length > 0) {
              const randomIndex = Math.floor(Math.random() * otherStaff.length);
              setRandomStaff(otherStaff[randomIndex]);
            }
          }
          
          // Find BOM Members (Board of Management)
          const bomMembers = data.staff.filter(s => 
            (s.role && s.role.toLowerCase().includes('bom')) ||
            (s.department && s.department.toLowerCase().includes('bom'))
          );
          
          // Random BOM Member
          if (bomMembers.length > 0) {
            const randomBomIndex = Math.floor(Math.random() * bomMembers.length);
            setRandomBOM(bomMembers[randomBomIndex]);
          } else {
            // If no BOM members, use Support Staff or any other staff
            const supportStaff = data.staff.filter(s => 
              s.role && s.role.toLowerCase().includes('support') &&
              s.id !== principal?.id && 
              s.id !== deputy?.id &&
              s.id !== randomStaff?.id
            );
            
            if (supportStaff.length > 0) {
              const randomSupportIndex = Math.floor(Math.random() * supportStaff.length);
              setRandomBOM(supportStaff[randomSupportIndex]);
            } else {
              // Fallback to any remaining staff
              const remainingStaff = data.staff.filter(s => 
                s.id !== principal?.id && 
                s.id !== deputy?.id &&
                s.id !== randomStaff?.id
              );
              
              if (remainingStaff.length > 0) {
                const randomRemainingIndex = Math.floor(Math.random() * remainingStaff.length);
                setRandomBOM(remainingStaff[randomRemainingIndex]);
              }
            }
          }
          
        } else {
          throw new Error('Invalid staff data format');
        }
      } catch (err) {
        console.error('Error fetching staff:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStaff();
  }, []);

  // Handle subcard click
  const handleStaffClick = (staffMember) => {
    if (staffMember) {
      setFeaturedStaff(staffMember);
    }
  };

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone;
  };

  // Get role color
  const getRoleColor = (role) => {
    if (!role) return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    
    const roleLower = role.toLowerCase();
    if (roleLower.includes('principal')) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    if (roleLower.includes('deputy')) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (roleLower.includes('teacher') || roleLower.includes('teaching')) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (roleLower.includes('bom')) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    if (roleLower.includes('support')) return 'bg-gradient-to-r from-gray-500 to-gray-700';
    if (roleLower.includes('administration')) return 'bg-gradient-to-r from-blue-500 to-purple-500';
    return 'bg-gradient-to-r from-indigo-500 to-purple-500';
  };

  // Get role title for display
  const getRoleTitle = (staffMember) => {
    if (staffMember.position) return staffMember.position;
    if (staffMember.role) return staffMember.role;
    return 'Staff Member';
  };

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leadership team...</p>
        </div>
      </div>
    );
  }

  if (error && !featuredStaff) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to load staff data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-shadow"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!featuredStaff) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">No staff data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-6">
            <IoPeopleOutline className="text-blue-600" />
            <span className="text-blue-700 font-bold text-sm uppercase tracking-widest">
              Leadership Team
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">School Leadership</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Committed professionals dedicated to academic excellence, student development, and community engagement
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Featured Hero Card */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[680px]">
            
            {/* Image Section */}
            <div className="relative h-64 lg:h-72 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/20 z-10"></div>
              {featuredStaff.image ? (
                <img
                  src={featuredStaff.image.startsWith('/') ? featuredStaff.image : `/${featuredStaff.image}`}
                  alt={featuredStaff.name}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <GiGraduateCap className="text-8xl mx-auto opacity-50" />
                    <p className="mt-4 text-xl font-bold">{featuredStaff.name}</p>
                    <p className="mt-2 text-sm opacity-90">{getRoleTitle(featuredStaff)}</p>
                  </div>
                </div>
              )}
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <span className={`px-4 py-2 ${getRoleColor(featuredStaff.role)} text-white text-xs font-bold uppercase tracking-widest rounded-full inline-block mb-3`}>
                  {getRoleTitle(featuredStaff)}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white">{featuredStaff.name}</h2>
                <div className="flex items-center gap-3 mt-2 text-white/90">
                  <span className="flex items-center gap-1 text-sm">
                    <FiMapPin className="text-xs" />
                    {featuredStaff.department || 'Administration'}
                  </span>
                  {featuredStaff.phone && (
                    <>
                      <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                      <span className="flex items-center gap-1 text-sm">
                        <FiPhone className="text-xs" />
                        {formatPhone(featuredStaff.phone)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-grow p-6 md:p-8 -mt-4 bg-white relative rounded-t-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.03)] z-30">
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                
                {/* Left Column: Bio & Details */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <FiUser className="text-blue-500" /> Professional Biography
                      </h4>
                      <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                        {featuredStaff.bio || `${featuredStaff.name} is a dedicated member of our school's leadership team with a passion for education and student development.`}
                      </p>
                    </div>

                    {featuredStaff.quote && (
                      <div className="relative p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 rounded-r-2xl">
                        <div className="absolute top-4 right-4 text-blue-200">
                          <FiAward className="text-3xl" />
                        </div>
                        <p className="relative z-10 text-slate-700 italic font-medium leading-relaxed">
                          "{featuredStaff.quote}"
                        </p>
                      </div>
                    )}

                    {featuredStaff.expertise && featuredStaff.expertise.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <FiStar className="text-yellow-500" /> Areas of Expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {featuredStaff.expertise.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Responsibilities & Contact */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-6">
                    {featuredStaff.responsibilities && featuredStaff.responsibilities.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <FiBriefcase className="text-green-500" /> Key Responsibilities
                        </h4>
                        <ul className="space-y-3">
                          {featuredStaff.responsibilities.slice(0, 5).map((item, i) => (
                            <li key={i} className="text-sm text-slate-700 font-medium flex items-start gap-3">
                              <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <IoRibbonOutline className="text-amber-500" /> Notable Achievements
                      </h4>
                      <ul className="space-y-3">
                        {(featuredStaff.achievements && featuredStaff.achievements.length > 0) ? (
                          featuredStaff.achievements.slice(0, 3).map((item, i) => (
                            <li key={i} className="text-sm text-slate-700 font-medium flex items-start gap-3">
                              <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-slate-500 italic">Contributing to educational excellence</li>
                        )}
                      </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900 mb-4">Contact Information</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FiMail className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Email Address</p>
                            <a 
                              href={`mailto:${featuredStaff.email}`}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm break-all"
                            >
                              {featuredStaff.email}
                            </a>
                          </div>
                        </div>
                        
                        {featuredStaff.phone && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                              <FiPhone className="text-green-600 text-sm" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Phone Number</p>
                              <a 
                                href={`tel:${featuredStaff.phone}`}
                                className="text-slate-900 hover:text-blue-600 font-medium text-sm"
                              >
                                {formatPhone(featuredStaff.phone)}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Sub-Card Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Deputy Principal Card */}
            {deputyPrincipal && (
              <button
                onClick={() => handleStaffClick(deputyPrincipal)}
                className={`w-full group relative bg-white rounded-2xl p-6 shadow-lg border-2 ${
                  featuredStaff?.id === deputyPrincipal.id ? 'border-blue-500' : 'border-slate-100'
                } hover:border-blue-300 hover:shadow-xl transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                    {deputyPrincipal.image ? (
                      <img
                        src={deputyPrincipal.image.startsWith('/') ? deputyPrincipal.image : `/${deputyPrincipal.image}`}
                        alt={deputyPrincipal.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <FiUser className="text-white text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Deputy Principal
                      </span>
                      {featuredStaff?.id === deputyPrincipal.id && (
                        <span className="flex items-center gap-1 text-blue-600 text-xs font-bold">
                          <FiCheck className="text-xs" /> Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate text-lg">
                      {deputyPrincipal.name}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 truncate">
                      {deputyPrincipal.department || 'Administration'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-blue-600 mt-3 font-bold tracking-tighter">
                      View Full Profile <FiChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Random Teaching Staff Card */}
            {randomStaff && (
              <button
                onClick={() => handleStaffClick(randomStaff)}
                className={`w-full group relative bg-white rounded-2xl p-6 shadow-lg border-2 ${
                  featuredStaff?.id === randomStaff.id ? 'border-green-500' : 'border-slate-100'
                } hover:border-green-300 hover:shadow-xl transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                    {randomStaff.image ? (
                      <img
                        src={randomStaff.image.startsWith('/') ? randomStaff.image : `/${randomStaff.image}`}
                        alt={randomStaff.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <FiBookOpen className="text-white text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {randomStaff.role || 'Teaching Staff'}
                      </span>
                      {featuredStaff?.id === randomStaff.id && (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                          <FiCheck className="text-xs" /> Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors truncate text-lg">
                      {randomStaff.name}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 truncate">
                      {randomStaff.position || randomStaff.department}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-3 font-bold tracking-tighter">
                      View Profile <FiChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Random BOM/Support Staff Card */}
            {randomBOM && (
              <button
                onClick={() => handleStaffClick(randomBOM)}
                className={`w-full group relative bg-white rounded-2xl p-6 shadow-lg border-2 ${
                  featuredStaff?.id === randomBOM.id ? 'border-amber-500' : 'border-slate-100'
                } hover:border-amber-300 hover:shadow-xl transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                    {randomBOM.image ? (
                      <img
                        src={randomBOM.image.startsWith('/') ? randomBOM.image : `/${randomBOM.image}`}
                        alt={randomBOM.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <FiShield className="text-white text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {randomBOM.role?.toLowerCase().includes('support') ? 'Support Staff' : 'Staff Member'}
                      </span>
                      {featuredStaff?.id === randomBOM.id && (
                        <span className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                          <FiCheck className="text-xs" /> Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate text-lg">
                      {randomBOM.name}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 truncate">
                      {randomBOM.position || randomBOM.department}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-3 font-bold tracking-tighter">
                      View Details <FiChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            )}

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <IoPeopleOutline className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-90 mb-1">Staff Overview</p>
                  <p className="text-2xl font-black">{staff.length} Team Members</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Leadership</span>
                  <span className="font-bold">
                    {staff.filter(s => 
                      s.role?.toLowerCase().includes('principal') || 
                      s.position?.toLowerCase().includes('principal') ||
                      s.role?.toLowerCase().includes('deputy')
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Teaching Staff</span>
                  <span className="font-bold">
                    {staff.filter(s => 
                      s.role?.toLowerCase().includes('teacher') || 
                      s.role?.toLowerCase().includes('teaching')
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Support Staff</span>
                  <span className="font-bold">
                    {staff.filter(s => 
                      s.role?.toLowerCase().includes('support')
                    ).length}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <button 
                  onClick={() => window.location.href = '/staff'}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  View Complete Staff Directory <FiChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernStaffLeadership;