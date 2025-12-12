'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiClock, 
  FiSend,
  FiCheckCircle,
  FiUser,
  FiBook,
  FiCalendar,
  FiNavigation,
  FiStar,
  FiAward,
  FiShare2,
  FiMessageCircle,
  FiHeart,
  FiVideo,
  FiPlay
} from 'react-icons/fi';
import { 
  IoLogoWhatsapp,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoYoutube,
  IoSparkles,
  IoClose,
  IoRocketOutline
} from 'react-icons/io5';

// Dynamically import the map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('../../components/mapcomponent/page'), {
  ssr: false,
  loading: () => (
    <div className="h-80 bg-slate-700/50 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
      <div className="text-gray-400 text-sm">Loading map...</div>
    </div>
  )
});

export default function ModernContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    studentGrade: '',
    inquiryType: 'general',
    contactMethod: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [activeDepartment, setActiveDepartment] = useState(null);

  const contactInfo = [
    {
      icon: FiMapPin,
      title: 'Visit Our Campus',
      details: ['Kiganjo, Nyeri County, Kenya', 'Near Nyeri Town'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-slate-700/30 backdrop-blur-sm',
      link: 'https://maps.google.com/?q=-0.4167,36.9500',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      details: ['+254 720 123 456', '+254 721 987 654'],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-slate-700/30 backdrop-blur-sm',
      link: 'tel:+254720123456',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      icon: FiMail,
      title: 'Email Us',
      details: ['admissions@nyaribusecondary.sc.ke', 'info@nyaribusecondary.sc.ke'],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-slate-700/30 backdrop-blur-sm',
      link: 'mailto:admissions@nyaribusecondary.sc.ke',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      icon: FiClock,
      title: 'Office Hours',
      details: ['Mon - Fri: 7:00 AM - 5:30 PM', 'Sat: 8:00 AM - 1:00 PM'],
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-slate-700/30 backdrop-blur-sm',
      link: null,
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500'
    }
  ];

  const departments = [
    {
      id: 'admissions',
      name: 'Admissions Office',
      email: 'admissions@nyaribusecondary.sc.ke',
      phone: '+254 720 123 456',
      description: 'For enrollment and application inquiries',
      icon: FiUser,
      color: 'from-blue-500 to-cyan-500',
      head: 'Mrs. Wanjiru Mwangi',
      hours: 'Mon-Fri: 8:00 AM - 4:00 PM'
    },
    {
      id: 'academics',
      name: 'Academic Office',
      email: 'academics@nyaribusecondary.sc.ke',
      phone: '+254 721 234 567',
      description: 'Curriculum and academic programs',
      icon: FiBook,
      color: 'from-purple-500 to-pink-500',
      head: 'Dr. Samuel Kariuki',
      hours: 'Mon-Fri: 7:30 AM - 3:30 PM'
    },
    {
      id: 'student-affairs',
      name: 'Student Affairs',
      email: 'studentaffairs@nyaribusecondary.sc.ke',
      phone: '+254 722 345 678',
      description: 'Student welfare and activities',
      icon: FiAward,
      color: 'from-green-500 to-emerald-500',
      head: 'Mr. James Gitonga',
      hours: 'Mon-Fri: 8:00 AM - 4:30 PM'
    },
    {
      id: 'sports',
      name: 'Sports Department',
      email: 'sports@nyaribusecondary.sc.ke',
      phone: '+254 723 456 789',
      description: 'Athletics and sports programs',
      icon: FiStar,
      color: 'from-yellow-500 to-amber-500',
      head: 'Coach Peter Maina',
      hours: 'Mon-Sat: 6:00 AM - 6:00 PM'
    }
  ];

  const socialMedia = [
    {
      icon: IoLogoWhatsapp,
      name: 'WhatsApp',
      link: 'https://wa.me/254720123456',
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      hover: 'hover:from-green-600 hover:to-emerald-700',
      description: 'Quick Support',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: IoLogoInstagram,
      name: 'Instagram',
      link: 'https://instagram.com/nyaribusecondary',
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
      hover: 'hover:from-pink-600 hover:to-rose-700',
      description: 'Visual Stories',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: IoLogoFacebook,
      name: 'Facebook',
      link: 'https://facebook.com/nyaribusecondary',
      color: 'bg-gradient-to-br from-blue-600 to-indigo-700',
      hover: 'hover:from-blue-700 hover:to-indigo-800',
      description: 'Community',
      gradient: 'from-blue-600 to-indigo-700'
    },
    {
      icon: IoLogoTwitter,
      name: 'Twitter',
      link: 'https://twitter.com/nyaribusecondary',
      color: 'bg-gradient-to-br from-sky-500 to-blue-600',
      hover: 'hover:from-sky-600 hover:to-blue-700',
      description: 'Quick Updates',
      gradient: 'from-sky-500 to-blue-600'
    },
    {
      icon: IoLogoYoutube,
      name: 'YouTube',
      link: 'https://youtube.com/nyaribusecondary',
      color: 'bg-gradient-to-br from-red-500 to-rose-700',
      hover: 'hover:from-red-600 hover:to-rose-800',
      description: 'Videos & Events',
      gradient: 'from-red-500 to-rose-700'
    }
  ];

  const quickActions = [
    {
      icon: FiUser,
      title: 'Apply for Admission',
      description: 'Start your application process',
      link: '/apply-for-admissions',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FiCalendar,
      title: 'View Events Calendar',
      description: 'See upcoming school events',
      link: '/events',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FiBook,
      title: 'Explore Programs',
      description: 'Discover academic offerings',
      link: '/academics',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FiVideo,
      title: 'Virtual Tour',
      description: 'Take a campus tour online',
      link: '/tour',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showNotification('Please fill in all required fields', 'error');
        setIsSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API
      const apiData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        subject: formData.subject,
        message: formData.message,
        contactMethod: formData.contactMethod,
        studentGrade: formData.studentGrade,
        inquiryType: formData.inquiryType
      };

      // Send data to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification(result.message || 'Message sent successfully! We will get back to you soon.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          studentGrade: '',
          inquiryType: 'general',
          contactMethod: 'email'
        });
      } else {
        showNotification(result.error || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDepartmentModal = (dept) => {
    setActiveDepartment(dept);
  };

  const closeDepartmentModal = () => {
    setActiveDepartment(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white pt-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
      </div>

      {/* Hero Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-900/30 rounded-full px-3 py-1.5 mb-5 border border-blue-400/30 backdrop-blur-sm"
          >
            <IoRocketOutline className="text-blue-300 text-sm" />
            <span className="text-xs font-medium text-blue-200">Soaring for Excellence</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold mb-5 bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent"
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed"
          >
            Connect with our dedicated team. We're here to help you with admissions, programs, 
            and everything about campus life at Nyaribu Secondary School.
          </motion.p>
        </div>
      </section>

      {/* Contact Cards & Map Section */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-24">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 space-y-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link || '#'}
                  target={item.link ? '_blank' : '_self'}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`block p-5 rounded-lg ${item.bgColor} border border-slate-600 hover:border-blue-500/50 transition-all duration-300 group backdrop-blur-sm`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-lg ${item.gradient} text-white group-hover:scale-105 transition-transform duration-300`}>
                      <item.icon className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                        {item.title}
                      </h3>
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-blue-100 mb-1 text-sm leading-relaxed">{detail}</p>
                      ))}
                    </div>
                  </div>
                </motion.a>
              ))}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-5 text-white backdrop-blur-sm border border-blue-400/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <FiNavigation className="text-base" />
                  </div>
                  <h3 className="text-base font-bold">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <motion.a
                      key={index}
                      href={action.link}
                      whileHover={{ x: 4, scale: 1.01 }}
                      className="flex items-center gap-3 hover:bg-white/10 p-3 rounded-lg transition-all border border-white/10 group"
                    >
                      <div className={`p-2 rounded-md bg-gradient-to-r ${action.color} text-white group-hover:scale-105 transition-transform`}>
                        <action.icon className="text-sm" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{action.title}</h4>
                        <p className="text-blue-100 text-xs">{action.description}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Map & Contact Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Enhanced Map Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-slate-700/30 rounded-lg shadow-lg p-5 border border-slate-600 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <FiMapPin className="text-white text-base" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Find Our Campus</h2>
                    <p className="text-blue-100 text-xs">Located in Kiganjo, near Nyeri town</p>
                  </div>
                </div>
                
                <div className="mb-4 bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                  <p className="text-blue-100 text-xs leading-relaxed">
                    Our campus is strategically located in Kiganjo, Nyeri County, easily accessible from Nyeri town 
                    via the Thika-Nyeri Highway with ample parking space available for visitors.
                  </p>
                </div>
                
                <div className="h-80">
                  <MapWithNoSSR />
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-blue-100">
                    <FiMapPin className="text-blue-400 text-sm flex-shrink-0" />
                    <span className="text-xs">Kiganjo, Nyeri County, Kenya (Near Nyeri Town)</span>
                  </div>
                  <motion.a
                    href="https://maps.google.com/?q=-0.4167,36.9500"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md font-medium hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap border border-blue-400/30 backdrop-blur-sm text-sm"
                  >
                    <FiNavigation className="text-sm" />
                    Get Directions
                  </motion.a>
                </div>
              </motion.div>

              {/* Enhanced Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-700/30 rounded-lg shadow-lg p-5 border border-slate-600 backdrop-blur-sm"
              >
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 bg-blue-900/30 rounded-full px-3 py-1.5 mb-3 border border-blue-400/30">
                    <FiMessageCircle className="text-blue-400 text-sm" />
                    <span className="text-xs font-medium">Send us a message</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Let's Start a Conversation</h2>
                  <p className="text-blue-100 text-sm">We'll get back to you within 24 hours</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-blue-100 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm hover:border-slate-500 text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-100 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm hover:border-slate-500 text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-blue-100 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm hover:border-slate-500 text-sm"
                        placeholder="+254 720 123 456"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-100 mb-2">
                        Student Grade
                      </label>
                      <select
                        name="studentGrade"
                        value={formData.studentGrade}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm hover:border-slate-500 text-sm"
                      >
                        <option value="" className="bg-slate-800">Select grade</option>
                        <option value="form1" className="bg-slate-800">Form 1</option>
                        <option value="form2" className="bg-slate-800">Form 2</option>
                        <option value="form3" className="bg-slate-800">Form 3</option>
                        <option value="form4" className="bg-slate-800">Form 4</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-blue-100 mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm hover:border-slate-500 text-sm"
                      >
                        <option value="general" className="bg-slate-800">General Inquiry</option>
                        <option value="admissions" className="bg-slate-800">Admissions</option>
                        <option value="academics" className="bg-slate-800">Academics</option>
                        <option value="sports" className="bg-slate-800">Sports</option>
                        <option value="facilities" className="bg-slate-800">Facilities</option>
                        <option value="other" className="bg-slate-800">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-100 mb-2">
                        Preferred Contact Method *
                      </label>
                      <select
                        name="contactMethod"
                        value={formData.contactMethod}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm hover:border-slate-500 text-sm"
                      >
                        <option value="email" className="bg-slate-800">Email</option>
                        <option value="phone" className="bg-slate-800">Phone Call</option>
                        <option value="whatsapp" className="bg-slate-800">WhatsApp</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-blue-100 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm hover:border-slate-500 text-sm"
                      placeholder="Brief subject of your message"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-blue-100 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all resize-none backdrop-blur-sm hover:border-slate-500 text-sm"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <div className="flex justify-center pt-3">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full max-w-md bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-blue-400/30 backdrop-blur-sm text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <FiSend className="text-sm" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments & Social Media Section */}
      <section className="py-12 bg-slate-800/30 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Contact Specific Departments
            </h2>
            <p className="text-blue-100 text-sm max-w-2xl mx-auto">
              Reach out to the right team for your specific needs. Our dedicated departments are here to assist you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => openDepartmentModal(dept)}
                className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${dept.color} text-white group-hover:scale-105 transition-transform`}>
                    <dept.icon className="text-base" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text">
                    {dept.name}
                  </h3>
                </div>
                <p className="text-blue-100 mb-3 text-xs leading-relaxed">{dept.description}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-300 text-xs group/item">
                    <FiMail className="text-xs flex-shrink-0 group-hover/item:scale-105 transition-transform" />
                    <span className="break-all">{dept.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-green-300 text-xs group/item">
                    <FiPhone className="text-xs flex-shrink-0 group-hover/item:scale-105 transition-transform" />
                    <span>{dept.phone}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Modernized Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-1.5 bg-blue-900/30 rounded-full px-3 py-1.5 mb-4 border border-blue-400/30">
              <IoSparkles className="text-yellow-400 text-sm" />
              <span className="text-xs font-medium">Join Our Community</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Connect With Us
            </h3>
            <p className="text-blue-100 mb-8 text-sm max-w-2xl mx-auto">
              Stay updated with the latest news, events, and achievements from Nyaribu Secondary School
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {socialMedia.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className={`${social.color} ${social.hover} text-white p-3 rounded-lg transition-all duration-300 group flex flex-col items-center min-w-[100px] backdrop-blur-sm border border-white/20`}
                >
                  <social.icon className="text-base mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-xs mb-0.5">{social.name}</span>
                  <span className="text-xs opacity-80">{social.description}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Department Detail Modal */}
      <AnimatePresence>
        {activeDepartment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closeDepartmentModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur-md rounded-lg p-5 max-w-md w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${activeDepartment.color} text-white`}>
                    <activeDepartment.icon className="text-base" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{activeDepartment.name}</h3>
                </div>
                <button
                  onClick={closeDepartmentModal}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <IoClose className="text-lg text-white/80 hover:text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">Department Head</h4>
                    <p className="text-blue-100 text-sm">{activeDepartment.head}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">Office Hours</h4>
                    <p className="text-blue-100 text-sm">{activeDepartment.hours}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium text-sm mb-1">Description</h4>
                  <p className="text-blue-100 text-sm leading-relaxed">{activeDepartment.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href={`mailto:${activeDepartment.email}`}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg text-center font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1.5 text-sm"
                  >
                    <FiMail className="text-sm" />
                    Send Email
                  </a>
                  <a
                    href={`tel:${activeDepartment.phone}`}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg text-center font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1.5 text-sm"
                  >
                    <FiPhone className="text-sm" />
                    Call Now
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className={`${toastType === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'} text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 backdrop-blur-sm border ${toastType === 'success' ? 'border-green-400/30' : 'border-red-400/30'}`}>
              {toastType === 'success' ? (
                <FiCheckCircle className="text-sm" />
              ) : (
                <IoClose className="text-sm" />
              )}
              <span className="font-medium text-sm">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}