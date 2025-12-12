'use client';
import React, { useState, useEffect } from 'react';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiHeart,
  FiCheckCircle,
  FiHome,
  FiBook,
  FiUser,
  FiCalendar,
  FiImage,
  FiUserCheck,
  FiBookOpen,
  FiHelpCircle,
  FiGlobe,
  FiLock,
  FiEye,
  FiDownload
} from 'react-icons/fi';
import {
  IoLogoWhatsapp,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoYoutube,
  IoLogoLinkedin
} from 'react-icons/io5';
import { motion } from 'framer-motion';

export default function ModernFooter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const currentYear = new Date().getFullYear();

  // Floating animation data
  const [floatingItems, setFloatingItems] = useState([
    { id: 1, icon: '📚', x: 10, y: 20, delay: 0 },
    { id: 2, icon: '✏️', x: 25, y: 60, delay: 0.5 },
    { id: 3, icon: '📖', x: 80, y: 40, delay: 1 },
    { id: 4, icon: '🎓', x: 65, y: 15, delay: 1.5 },
    { id: 5, icon: '📝', x: 40, y: 80, delay: 2 },
    { id: 6, icon: '🔬', x: 90, y: 70, delay: 2.5 }
  ]);

  const quickLinks = [
    { name: 'About Us', href: '/pages/AboutUs', icon: FiHome, color: 'text-blue-500' },
    { name: 'Academics', href: '/pages/academics', icon: FiBook, color: 'text-green-500' },
    { name: 'Admissions', href: '/pages/admissions', icon: FiUserCheck, color: 'text-purple-500' },
    { name: 'Assignments', href: '/pages/assignments', icon: FiBookOpen, color: 'text-orange-500' },
    { name: 'Staff', href: '/pages/staff', icon: FiUser, color: 'text-pink-500' },
    { name: 'Contact', href: '/pages/contact', icon: FiPhone, color: 'text-cyan-500' },
    { name: 'Gallery', href: '/pages/gallery', icon: FiImage, color: 'text-red-500' },
    { name: 'News & Events', href: '/pages/eventsandnews', icon: FiCalendar, color: 'text-yellow-500' },
  ];

  const resources = [
    { name: 'Student Support', href: '/support', icon: FiHelpCircle, color: 'text-blue-400' },
    { name: 'School Policies', href: '/policies', icon: FiLock, color: 'text-green-400' },
    { name: 'Library Resources', href: '/library', icon: FiBookOpen, color: 'text-purple-400' },
    { name: 'Alumni Network', href: '/alumni', icon: FiGlobe, color: 'text-orange-400' },
    { name: 'Career Guidance', href: '/career', icon: FiUserCheck, color: 'text-pink-400' },
  ];

  const socialLinks = [
    {
      icon: IoLogoFacebook,
      href: 'https://facebook.com/nyaribuhighschool',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/20',
      label: 'Facebook'
    },
    {
      icon: IoLogoTwitter,
      href: 'https://twitter.com/nyaribuhigh',
      color: 'text-sky-500',
      bgColor: 'bg-sky-500/20',
      label: 'Twitter'
    },
    {
      icon: IoLogoInstagram,
      href: 'https://instagram.com/nyaribuhighschool',
      color: 'text-pink-600',
      bgColor: 'bg-pink-500/20',
      label: 'Instagram'
    },
    {
      icon: IoLogoYoutube,
      href: 'https://youtube.com/nyaribuhighschool',
      color: 'text-red-600',
      bgColor: 'bg-red-500/20',
      label: 'YouTube'
    },
    {
      icon: IoLogoLinkedin,
      href: 'https://linkedin.com/school/nyaribuhighschool',
      color: 'text-blue-700',
      bgColor: 'bg-blue-600/20',
      label: 'LinkedIn'
    },
    {
      icon: IoLogoWhatsapp,
      href: 'https://wa.me/254720123456',
      color: 'text-green-600',
      bgColor: 'bg-green-500/20',
      label: 'WhatsApp'
    },
  ];

  const contactInfo = [
    {
      icon: FiMapPin,
      text: 'Kiganjo, Nyeri County, Kenya',
      href: 'https://maps.google.com/?q=-0.416667,36.950000',
      detail: 'Along Nyeri-Nairobi Highway',
      color: 'text-blue-400'
    },
    {
      icon: FiPhone,
      text: '+254 720 123 456',
      href: 'tel:+254720123456',
      detail: 'Office Line',
      color: 'text-green-400'
    },
    {
      icon: FiPhone,
      text: '+254 734 567 890',
      href: 'tel:+254734567890',
      detail: 'Admissions Office',
      color: 'text-purple-400'
    },
    {
      icon: FiMail,
      text: 'info@nyaribuhigh.sc.ke',
      href: 'mailto:info@nyaribuhigh.sc.ke',
      detail: 'General Inquiries',
      color: 'text-orange-400'
    },
    {
      icon: FiMail,
      text: 'admissions@nyaribuhigh.sc.ke',
      href: 'mailto:admissions@nyaribuhigh.sc.ke',
      detail: 'Admissions',
      color: 'text-pink-400'
    },
    {
      icon: FiClock,
      text: 'Mon - Fri: 7:30 AM - 5:00 PM',
      href: '#',
      detail: 'Sat: 8:00 AM - 1:00 PM',
      color: 'text-cyan-400'
    }
  ];

  const achievements = [
    { text: 'Top Performing School in Nyeri County', color: 'text-blue-300' },
    { text: 'Excellence in Science & Mathematics', color: 'text-green-300' },
    { text: '95% University Placement Rate', color: 'text-purple-300' },
    { text: 'Sports Excellence Award 2023', color: 'text-orange-300' },
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowSuccess(true);
      setEmail('');
      setTimeout(() => setShowSuccess(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      
      {/* Floating Educational Items Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute text-2xl opacity-10"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          
         {/* School Information */}
<div className="space-y-6"> {/* was space-y-4 */}
  <div className="flex items-center gap-4"> {/* was gap-3 */}
    <div className="w-14 h-14 rounded-lg overflow-hidden"> {/* was w-10 h-10 */}
      <img 
        src="/logo.jpg" 
        alt="Nyaribu High School Logo" 
        className="w-full h-full object-cover"
      />
    </div>
    <div>
      <h3 className="text-xl font-bold">Nyaribu Secondary  School</h3> {/* was text-lg */}
      <p className="text-blue-300 text-base">Soaring for Excellence</p> {/* was text-sm */}
    </div>
  </div>

  <p className="text-gray-300 text-base leading-relaxed"> {/* was text-sm */}
    A premier learning institution in Nyeri County, dedicated to academic excellence, 
    holistic development, and nurturing future leaders through quality education.
  </p>

  <div className="space-y-3"> {/* was space-y-2 */}
    {contactInfo.slice(0, 4).map((item, index) => {
      const ItemIcon = item.icon;
      return (
        <a
          key={index}
          href={item.href}
          className="flex items-start gap-4 text-gray-300 hover:text-white transition-colors text-base group" 
        >
          <ItemIcon className={`${item.color} mt-1 flex-shrink-0`} /> 
          <div>
            <span>{item.text}</span>
            {item.detail && (
              <p className="text-sm text-gray-400">{item.detail}</p> 
            )}
          </div>
        </a>
      );
    })}
  </div>
</div>


          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-300">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a 
                    key={index} 
                    href={link.href} 
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm p-2 rounded hover:bg-white/5"
                  >
                    <Icon className={`${link.color} flex-shrink-0`} />
                    <span>{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-300">Resources</h4>
            <div className="space-y-2">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <a
                    key={index}
                    href={resource.href}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm p-2 rounded hover:bg-white/5"
                  >
                    <Icon className={`${resource.color} flex-shrink-0`} />
                    <span>{resource.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Achievements */}
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-purple-300">Recent Achievements</h4>
              {achievements.map((achievement, index) => (
                <div key={index} className={`text-xs ${achievement.color} flex items-center gap-1`}>
                  <FiCheckCircle className="flex-shrink-0" />
                  <span>{achievement.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-300">Stay Updated</h4>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
              <p className="text-gray-300 text-sm mb-4">
                Subscribe to receive updates on academic events and important announcements.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-300 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-all hover:opacity-90"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                </button>
              </form>
              {showSuccess && (
                <div className="mt-3 bg-green-500/20 border border-green-500/30 rounded-lg p-2">
                  <div className="text-green-300 text-xs flex items-center gap-1">
                    <FiCheckCircle />
                    Successfully subscribed!
                  </div>
                </div>
              )}
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-blue-300">Connect With Us</h5>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, index) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${social.bgColor} ${social.color} hover:opacity-90 transition-opacity`}
                      aria-label={social.label}
                    >
                      <SocialIcon className="text-lg" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-lg p-3 border border-blue-400/30">
              <h5 className="text-sm font-medium mb-2">Emergency Contact</h5>
              <a
                href="tel:+254720123456"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-3 py-2 rounded-lg text-sm font-medium w-full justify-center hover:bg-blue-50 transition-colors"
              >
                <FiPhone />
                +254 720 123 456
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-300 text-sm text-center md:text-left">
              <p>© {currentYear} Nyaribu High School, Kiganjo, Nyeri. All rights reserved.</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <button 
                onClick={() => setShowSitemap(true)} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sitemap
              </button>
              <button 
                onClick={() => setShowPrivacy(true)} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Terms & Privacy
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            <p>Accredited by the Ministry of Education • KNEC Centre Code: 12345678</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span>Educating with passion and</span>
              <FiHeart className="text-red-400" />
              <span>since 1975</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowPrivacy(false)} 
            aria-hidden="true" 
          />
          <div className="relative bg-white text-gray-900 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiLock className="text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Privacy Policy & Terms of Service</h2>
                    <p className="text-blue-100 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPrivacy(false)} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiEye className="text-blue-500" />
                  Privacy Commitment
                </h3>
                <p className="text-gray-700 text-sm">
                  At Nyaribu High School, we are committed to protecting the privacy and security 
                  of all personal information collected from students, parents, staff, and visitors. 
                  This policy outlines our practices regarding data collection, usage, and protection 
                  in compliance with the Data Protection Act, 2019.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiDownload className="text-green-500" />
                  Information Collection & Usage
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Collected Information</h4>
                    <ul className="space-y-1 text-blue-800">
                      <li>• Student academic and personal records</li>
                      <li>• Parent/guardian contact information</li>
                      <li>• Staff employment and qualification data</li>
                      <li>• Medical information for emergency purposes</li>
                      <li>• Financial information for fee payment</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Purpose of Collection</h4>
                    <ul className="space-y-1 text-green-800">
                      <li>• Academic administration and reporting</li>
                      <li>• Student safety and welfare monitoring</li>
                      <li>• Communication with parents and guardians</li>
                      <li>• Compliance with educational regulations</li>
                      <li>• School improvement and planning</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Data Protection Measures</h3>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg">🔐</div>
                      <div className="font-medium text-purple-800">Encrypted Storage</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg">🛡️</div>
                      <div className="font-medium text-purple-800">Access Control</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg">📊</div>
                      <div className="font-medium text-purple-800">Regular Audits</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded">
                      <div className="text-lg">👨‍🏫</div>
                      <div className="font-medium text-purple-800">Staff Training</div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h3>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                      <p className="text-sm opacity-90">Email: dpo@nyaribuhigh.sc.ke</p>
                      <p className="text-sm opacity-90">Phone: +254 720 123 456</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">General Inquiries</h4>
                      <p className="text-sm opacity-90">Email: info@nyaribuhigh.sc.ke</p>
                      <p className="text-sm opacity-90">Phone: +254 734 567 890</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-sm opacity-90">
                      Nyaribu High School, Kiganjo, Nyeri County, Kenya
                    </p>
                  </div>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  onClick={() => setShowPrivacy(false)} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  I Understand & Accept
                </button>
                <button 
                  onClick={() => setShowPrivacy(false)} 
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Close Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Sitemap Modal */}
      {showSitemap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowSitemap(false)} 
            aria-hidden="true" 
          />
          <div className="relative bg-white text-gray-900 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FiGlobe className="text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Complete Site Navigation</h2>
                    <p className="text-blue-100 text-sm">Explore all sections of our website</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSitemap(false)} 
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2">Main Sections</h3>
                  <div className="space-y-2">
                    {quickLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        className="flex items-center gap-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                        onClick={() => setShowSitemap(false)}
                      >
                        <link.icon className={link.color} />
                        <span>{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2">Resources</h3>
                  <div className="space-y-2">
                    {resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.href}
                        className="flex items-center gap-2 p-2 rounded hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors"
                        onClick={() => setShowSitemap(false)}
                      >
                        <resource.icon className={resource.color} />
                        <span>{resource.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2">Contact & Support</h3>
                  <div className="space-y-2">
                    {contactInfo.slice(0, 4).map((item, index) => (
                      <div key={index} className="p-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <item.icon className={item.color} />
                          <span className="font-medium">{item.text}</span>
                        </div>
                        {item.detail && (
                          <p className="text-xs text-gray-500 ml-6">{item.detail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setShowSitemap(false)} 
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Close Sitemap
                  </button>
                  <a
                    href="/pages/contact"
                    onClick={() => setShowSitemap(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}