'use client';
import { motion } from 'framer-motion';
import { 
  FiTarget, 
  FiEye, 
  FiAward, 
  FiUsers, 
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiZap
} from 'react-icons/fi';
import { 
  IoRocketOutline,
  IoPeopleOutline,
  IoStatsChartOutline,
  IoSparklesOutline,
  IoLeafOutline,
  IoLibraryOutline
} from 'react-icons/io5';
import { 
  MdOutlineScience,
  MdOutlineSportsSoccer,
  MdOutlineSchool
} from 'react-icons/md';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('../../components/mapcomponent/page'), {
  ssr: false,
  loading: () => (
    <div className="h-80 rounded-xl bg-gradient-to-br from-slate-700/50 to-blue-900/50 animate-pulse flex items-center justify-center">
      <div className="text-gray-400 text-sm">Loading map...</div>
    </div>
  )
});

// Import local images
const campusImage = '/images/campus-main.jpg';
const principalImage = '/images/principal.jpg';
const academicDirectorImage = '/images/academic-director.jpg';
const innovationDirectorImage = '/images/innovation-director.jpg';

export default function AboutUsPage() {
  const router = useRouter();
  
  const schoolStats = [
    { value: '20+', label: 'Years of Excellence', icon: FiAward, color: 'from-yellow-500 to-orange-500' },
    { value: '1,500+', label: 'Students Enrolled', icon: FiUsers, color: 'from-blue-500 to-cyan-500' },
    { value: '96%', label: 'University Admission', icon: IoStatsChartOutline, color: 'from-green-500 to-emerald-500' },
    { value: '65+', label: 'Qualified Staff', icon: IoPeopleOutline, color: 'from-purple-500 to-pink-500' }
  ];

  const values = [
    {
      icon: FiZap,
      title: 'Digital Innovation',
      description: 'State-of-the-art tech labs, coding clubs, and AI integration in curriculum.'
    },
    {
      icon: MdOutlineScience,
      title: 'STEM Excellence',
      description: 'Advanced science labs and robotics programs for future innovators.'
    },
    {
      icon: IoLeafOutline,
      title: 'Eco-Conscious',
      description: 'Green campus with solar energy, recycling programs, and environmental clubs.'
    },
    {
      icon: MdOutlineSportsSoccer,
      title: 'Sports Excellence',
      description: 'Modern sports facilities and championship-winning athletic programs.'
    }
  ];

  const leadershipTeam = [
    {
      name: 'Dr. Samuel Kariuki',
      role: 'Principal & CEO',
      image: principalImage,
      experience: '18+ years in educational leadership',
      quote: 'We don\'t just teach students, we architect future leaders and innovators.',
      expertise: ['EdTech Integration', 'Strategic Planning', 'Student Mentorship']
    },
    {
      name: 'Ms. Wanjiru Mwangi',
      role: 'Academic Director',
      image: academicDirectorImage,
      experience: '15+ years curriculum development',
      quote: 'Every student has a unique brilliance waiting to be discovered and nurtured.',
      expertise: ['Curriculum Design', 'Research Methods', 'Academic Innovation']
    },
    {
      name: 'Mr. James Gitonga',
      role: 'Director of Innovation',
      image: innovationDirectorImage,
      experience: '12+ years tech education',
      quote: 'Technology is the canvas, innovation is the brush, students are the artists.',
      expertise: ['Digital Learning', 'Robotics', 'AI Education']
    }
  ];

  const facilities = [
    { name: 'Smart Classrooms', icon: FiZap, color: 'text-blue-400' },
    { name: 'Science Labs', icon: MdOutlineScience, color: 'text-emerald-400' },
    { name: 'Digital Library', icon: IoLibraryOutline, color: 'text-violet-400' },
    { name: 'Sports Complex', icon: MdOutlineSportsSoccer, color: 'text-orange-400' },
    { name: 'Arts Center', icon: IoSparklesOutline, color: 'text-pink-400' },
    { name: 'Eco-Garden', icon: IoLeafOutline, color: 'text-green-400' }
  ];

  const locationInfo = {
    address: 'Kiganjo, Nyeri County, Kenya (Near Nyeri Town)',
    coordinates: '-0.4167, 36.9500',
    phone: '+254 720 123 456',
    email: 'admissions@nyaribusecondary.sc.ke',
    hours: 'Mon - Fri: 7:00 AM - 5:30 PM | Sat: 8:00 AM - 1:00 PM',
    website: 'www.nyaribusecondary.sc.ke'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 overflow-hidden pt-20">
      {/* Light Animated Background */}
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
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 text-white overflow-hidden">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-900/30 backdrop-blur-sm rounded-full border border-blue-400/30 mb-5">
                <IoRocketOutline className="text-blue-300 text-sm" />
                <span className="text-xs font-medium text-blue-200">Soaring for Excellence</span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-5 leading-tight">
                About
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                  Nyaribu Secondary
                </span>
              </h1>
              
              <p className="text-base text-gray-300 mb-7 leading-relaxed">
                A premier institution in Kiganjo, Nyeri, where innovation meets tradition. 
                We empower students to reach new heights through cutting-edge education, 
                character development, and holistic growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md font-medium hover:shadow-lg transition-all text-sm"
                >
                  Schedule a Visit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 bg-transparent border border-gray-600 text-gray-300 rounded-md font-medium hover:bg-white/5 transition-all text-sm"
                >
                  View Prospectus
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-[320px] sm:h-[350px] lg:h-[380px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={campusImage}
                  alt="Nyaribu Secondary School Campus"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
                
                {/* Floating Stats */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-800/70 backdrop-blur-md rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">20+</div>
                      <div className="text-xs text-gray-300">Years</div>
                    </div>
                    <div className="h-6 w-px bg-gray-600"></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">1,500+</div>
                      <div className="text-xs text-gray-300">Students</div>
                    </div>
                    <div className="h-6 w-px bg-gray-600"></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">96%</div>
                      <div className="text-xs text-gray-300">Success</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm border border-blue-400/30 flex items-center justify-center">
                <MdOutlineSchool className="text-blue-300 text-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* School Stats */}
      <section className="relative py-12">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {schoolStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-r ${stat.color} mb-3`}>
                  <stat.icon className="text-white text-base" />
                </div>
                <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-300 text-xs font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-12 bg-slate-800/30 backdrop-blur-sm">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-6 border border-slate-600 hover:border-blue-500/50 transition-all"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md mb-4">
                <FiTarget className="text-white text-sm" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                To provide transformative education that equips students with 21st-century skills, 
                fosters innovation, and builds character, preparing them to excel in a rapidly evolving world.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-6 border border-slate-600 hover:border-purple-500/50 transition-all"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md mb-4">
                <FiEye className="text-white text-sm" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Our Vision</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                To be East Africa's leading secondary school in academic excellence and innovation, 
                producing globally competitive graduates who are ethical leaders and catalysts for change.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative py-12">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-3">Our Core Values</h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              The foundation upon which we build character and shape futures
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-5 border border-slate-600 hover:border-blue-500/50 transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md mb-3">
                  <value.icon className="text-white text-xs" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-300 text-xs leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Preview */}
      <section className="relative py-12 bg-slate-800/30 backdrop-blur-sm">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-3">Our Facilities</h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Modern infrastructure designed to inspire learning and innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {facilities.map((facility, index) => (
              <motion.div
                key={facility.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group p-3 bg-slate-700/30 backdrop-blur-sm rounded-md border border-slate-600 hover:border-blue-500/50 transition-all duration-300 text-center"
              >
                <div className={`inline-flex items-center justify-center w-7 h-7 ${facility.color} mb-2`}>
                  <facility.icon className="text-base" />
                </div>
                <div className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                  {facility.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="relative py-12">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-3">Leadership Team</h2>
            <p className="text-gray-400 text-sm">
              Meet the dedicated professionals guiding our institution
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {leadershipTeam.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-5 border border-slate-600 hover:border-blue-500/50 transition-all duration-300 text-center"
              >
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-md overflow-hidden">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{leader.name}</h3>
                <p className="text-blue-300 font-medium text-sm mb-1.5">{leader.role}</p>
                <p className="text-gray-400 text-xs mb-3">{leader.experience}</p>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {leader.expertise.map((skill, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-blue-900/30 text-xs text-blue-300 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <blockquote className="text-gray-300 italic text-xs border-l-2 border-blue-500 pl-2 py-1">
                  "{leader.quote}"
                </blockquote>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="relative py-12 bg-slate-800/30 backdrop-blur-sm">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold text-white mb-5">Visit Our Campus</h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-gray-300 p-3 bg-slate-700/30 backdrop-blur-sm rounded-md border border-slate-600">
                  <FiMapPin className="text-red-400 text-sm mt-0.5" />
                  <span className="text-sm">{locationInfo.address}</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300 p-3 bg-slate-700/30 backdrop-blur-sm rounded-md border border-slate-600">
                  <FiPhone className="text-green-400 text-sm mt-0.5" />
                  <span className="text-sm">{locationInfo.phone}</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300 p-3 bg-slate-700/30 backdrop-blur-sm rounded-md border border-slate-600">
                  <FiMail className="text-yellow-400 text-sm mt-0.5" />
                  <span className="text-sm">{locationInfo.email}</span>
                </div>
                <div className="flex items-start gap-3 text-gray-300 p-3 bg-slate-700/30 backdrop-blur-sm rounded-md border border-slate-600">
                  <FiClock className="text-purple-400 text-sm mt-0.5" />
                  <span className="text-sm">{locationInfo.hours}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md font-medium hover:shadow-lg transition-all text-sm"
                >
                  Get Directions
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 bg-transparent border border-gray-600 text-gray-300 rounded-md font-medium hover:bg-white/5 transition-all text-sm"
                >
                  Contact Admissions
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-5 border border-slate-600"
            >
              <h3 className="text-lg font-bold text-white mb-4">Our Location</h3>
              
              <div className="h-80">
                <MapComponent />
              </div>
              
              <div className="mt-4 p-3 bg-slate-800/50 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white mb-1 text-sm">Quick Facts</h4>
                    <p className="text-xs text-gray-300">• 15 minutes from Nyeri Town</p>
                    <p className="text-xs text-gray-300">• Accessible via Thika-Nyeri Highway</p>
                    <p className="text-xs text-gray-300">• Secure, serene environment</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">NY</div>
                    <div className="text-xs text-gray-400 mt-0.5">Nyeri</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-12">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="relative p-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl border border-blue-500/30 text-center">
              <h2 className="text-2xl font-bold text-white mb-5">
                Ready to Soar with Excellence?
              </h2>
              <p className="text-base text-gray-300 mb-7 max-w-2xl mx-auto">
                Join Nyaribu Secondary School and embark on a transformative educational journey 
                that prepares you for success in the 21st century.
              </p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/apply-for-admissions")}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md font-bold hover:shadow-lg transition-all text-sm"
                >
                  Apply Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}