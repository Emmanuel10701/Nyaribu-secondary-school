'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck,
  Key,
  Cpu,
  Database,
  Shield,
  AlertCircle,
  Users,
  Building,
  Server,
  Network,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('high');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);




  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms && !isForgotMode) {
      alert("Verification Required: Please accept the Terms of Access before proceeding.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (isForgotMode) setIsForgotMode(false);
    }, 1500);
  };

  const securityFeatures = [
    { icon: <Shield className="w-4 h-4" />, label: "Military-Grade Encryption", color: "emerald" },
    { icon: <Cpu className="w-4 h-4" />, label: "AI Threat Detection", color: "blue" },
    { icon: <Database className="w-4 h-4" />, label: "Zero-Knowledge Proof", color: "purple" },
    { icon: <Network className="w-4 h-4" />, label: "Distributed Authentication", color: "orange" },
  ];

  const systemMetrics = [
    { label: "Active Sessions", value: "342", icon: <Users className="w-4 h-4" /> },
    { label: "Server Uptime", value: "99.98%", icon: <Server className="w-4 h-4" /> },
    { label: "Threats Blocked", value: "1.2K", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4 font-sans">
      {/* Modern Glass Container */}
      <div className="max-w-6xl w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-white/40 overflow-hidden flex flex-col md:flex-row min-h-[720px]">
        
        {/* Left Panel: Cyberpunk Security Interface */}
        <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 relative overflow-hidden p-10 flex-col justify-between">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(90deg, #fff 1px, transparent 1px),
                              linear-gradient(180deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>

          <div className="relative z-10">
         

   {/* Title */}
<h1 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
  Nyaribu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-white">Admin Portal</span>
</h1>


            {/* Security Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {securityFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="group p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-${feature.color}-500/20 mb-3`}>
                    <div className={`text-${feature.color}-400`}>
                      {feature.icon}
                    </div>
                  </div>
                  <p className="text-xs font-bold text-white tracking-tight">{feature.label}</p>
                </div>
              ))}
            </div>

            {/* System Metrics */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></div>
                <h3 className="text-lg font-bold text-white">Live System Metrics</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="text-blue-300">{metric.icon}</div>
                      <div className="text-2xl font-black text-white">{metric.value}</div>
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Status */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-300">Security Level</span>
              </div>
              <div className="flex gap-1">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSecurityLevel(level)}
                    className={`px-2 py-1 text-[10px] font-bold uppercase rounded-lg transition-all ${
                      securityLevel === level 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Panel: Login Interface */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          {/* Mobile Header */}
          <div className="md:hidden flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <ShieldCheck className="text-white w-8 h-8" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
                <Key className="w-3 h-3 text-white" />
              </div>
            </div>
          <h2 className="text-2xl font-black text-slate-900">Nyaribu Admin Portal</h2>
         <p className="text-sm text-slate-500 mt-2">Secure Admin Access</p>

          </div>

          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-12 text-center md:text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  {isForgotMode ? "Access Recovery" : "Secure Authentication"}
                </h2>
              </div>
              <p className="text-slate-600 font-medium text-base leading-relaxed">
                {isForgotMode 
                  ? "Provide your registered email to receive a quantum-encrypted recovery token." 
                  : "Authenticate with your administrative credentials to access the control nexus."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Field */}
              <div className="group">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Workstation Email</label>
                </div>
                <div className="relative">
                  <input 
                    type="email"
                    required
                    placeholder="admin@nyaribusecondary.sc.ke"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 font-medium text-slate-900 placeholder-slate-400"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                </div>
              </div>

              {/* Password Field */}
              {!isForgotMode && (
                <div className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-500" />
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                    </div>
                    <button 
                      type="button"
                      onClick={() => (router.push('/pages/forgotpassword'))}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                    >
                      <Key className="w-3 h-3" />
                      forgot password
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your  password"
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 font-medium text-slate-900 placeholder-slate-400"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
                    >
                      {showPassword ? 
                        <EyeOff className="w-5 h-5" /> : 
                        <Eye className="w-5 h-5" />
                      }
                    </button>
                  </div>
                </div>
              )}

              {/* Security Options */}
              {!isForgotMode && (
                <div className="space-y-6">
                  {/* Terms */}
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative flex-shrink-0">
                        <input 
                          type="checkbox" 
                          required
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-blue-300 bg-white checked:border-blue-600 checked:bg-blue-600 focus:outline-none transition-all" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 mb-1">
                          Security & Compliance Acknowledgement
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          I understand this session is monitored, encrypted, and recorded for security auditing in compliance with institutional policies.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* 2FA Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-500">Require code from authenticator app</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        twoFactorEnabled ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="group relative w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Initializing...</span>
                    </>
                  ) : (
                    <>
                      <span>{isForgotMode ? "Request  Login Acess" : "Access Admin Portal"}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>

              {/* Back to Login */}
              {isForgotMode && (
                <button 
                  type="button"
                  onClick={() => setIsForgotMode(false)}
                  className="w-full text-center text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors py-3"
                >
                  ← Return to authentication
                </button>
              )}
            </form>

            {/* Security Footer */}
            <div className="mt-16 pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <p className="text-xs text-slate-500 font-medium">
                    Data Center: • CDN: Global
                  </p>
                </div>
                <div className="flex gap-6">
                  <a href="/pages/TermsandPrivacy" className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors">
                    Security Protocol
                  </a>
                  <a href="#" className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors">
                    Compliance
                  </a>
                </div>
              </div>
     
            </div>
          </div>
        </div>
      </div>

      {/* Floating Security Elements */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse z-50"></div>
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 backdrop-blur-md rounded-full border border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">Security: Maximum</span>
        </div>
      </div>
    </div>
  );
}