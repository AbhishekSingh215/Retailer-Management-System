import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  BarChart3,
  Tags,
  Users,
  User,
  Mail
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5143/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store JWT token securely
        localStorage.setItem('token', data.token);

        // Success! Redirect to dashboard using React Router
        setTimeout(() => {
          setIsLoading(false);
          navigate('/dashboard');
        }, 500);
      } else {
        setIsLoading(false);
        setError(data.message || 'Invalid credentials. Please try again or contact your administrator.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Network error. Unable to reach the authentication server.');
      console.error('Login error:', err);
    }
  };

  const features = [
    { icon: <Store className="w-[18px] h-[18px] text-indigo-500 dark:text-indigo-300" />, text: "Enterprise POS Management" },
    { icon: <Tags className="w-[18px] h-[18px] text-indigo-500 dark:text-indigo-300" />, text: "Real-time Inventory Tracking" },
    { icon: <BarChart3 className="w-[18px] h-[18px] text-indigo-500 dark:text-indigo-300" />, text: "Advanced Analytics & Reports" },
    { icon: <Users className="w-[18px] h-[18px] text-indigo-500 dark:text-indigo-300" />, text: "Role-Based Access Control" },
  ];

  return (
    // Extremely deep premium background
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050608] text-gray-900 dark:text-[#F3F4F6] font-sans selection:bg-indigo-500/30 p-4 sm:p-6 overflow-y-auto relative z-0 transition-colors duration-300">

      {/* Theme Toggle in absolute top right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Immersive Page-Level Ambient Lighting */}
      <div
        className="fixed top-0 left-0 w-[100%] h-[100%] pointer-events-none mix-blend-screen opacity-70"
        style={{ background: 'radial-gradient(circle at 20% 0%, rgba(99, 102, 241, 0.06) 0%, transparent 60%)' }}
      ></div>
      <div
        className="fixed bottom-0 right-0 w-[100%] h-[100%] pointer-events-none mix-blend-screen opacity-70"
        style={{ background: 'radial-gradient(circle at 80% 100%, rgba(168, 85, 247, 0.04) 0%, transparent 60%)' }}
      ></div>

      {/* Main Container - The Ultimate Glass & Depth Treatment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1040px] flex flex-col md:flex-row bg-white dark:bg-[#08090E] border border-gray-200 dark:border-white/[0.05] rounded-[24px] shadow-2xl dark:shadow-[0_0_40px_rgba(99,102,241,0.03),0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden relative z-10 dark:backdrop-blur-sm transition-colors duration-300"
      >

        {/* Left Section: Branding & Atmospheric Depth */}
        <div className="hidden md:flex flex-col w-[45%] p-8 lg:p-10 relative overflow-hidden border-r border-gray-200 dark:border-white/[0.04] bg-gray-50 dark:bg-[#090A0F] dark:shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] transition-colors duration-300">

          {/* Deep Cinematic Base */}
          <div className="absolute inset-0 bg-white dark:bg-gradient-to-br dark:from-[#10121C] dark:via-[#090A0F] dark:to-[#050608] pointer-events-none transition-colors duration-300"></div>

          {/* Premium "White Shadow" Top Highlight (Increased intensity) */}
          <div className="absolute top-0 left-0 w-full h-[50%] hidden dark:block bg-gradient-to-b from-white/[0.12] to-transparent pointer-events-none mix-blend-overlay"></div>
          {/* Crisp glowing top edge line (Increased intensity) */}
          <div className="absolute top-0 left-[5%] w-[90%] h-[1px] hidden dark:block bg-gradient-to-r from-transparent via-white/[0.5] to-transparent pointer-events-none opacity-90"></div>

          {/* Majestic Ambient Lighting Layers */}
          <div
            className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] pointer-events-none mix-blend-screen hidden dark:block"
            style={{ background: 'radial-gradient(circle at 35% 25%, rgba(99, 102, 241, 0.09) 0%, transparent 60%)' }}
          ></div>
          <div
            className="absolute top-[10%] right-[-30%] w-[150%] h-[150%] pointer-events-none mix-blend-screen hidden dark:block"
            style={{ background: 'radial-gradient(circle at 65% 50%, rgba(168, 85, 247, 0.07) 0%, transparent 65%)' }}
          ></div>

          {/* Ultra-subtle Enterprise Grid Texture */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none dark:block hidden"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          ></div>

          {/* Top: Logo */}
          <div className="relative z-10 flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-11 h-11 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-[12px] shadow-sm dark:shadow-[0_4px_15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] dark:backdrop-blur-md">
              <Store className="w-[22px] h-[22px] text-indigo-600 dark:text-indigo-400 dark:drop-shadow-[0_0_8px_rgba(129,140,248,0.4)]" />
            </div>
            <span className="text-[22px] font-bold tracking-tight text-gray-900 dark:text-white dark:drop-shadow-sm">RSOFT</span>
          </div>

          {/* Middle: Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <h1 className="text-[32px] lg:text-[38px] font-extrabold leading-[1.1] text-gray-900 dark:text-white mb-4 tracking-tight dark:drop-shadow-sm">
              Modern Retail <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-200 dark:via-indigo-400 dark:to-purple-400 font-bold dark:drop-shadow-[0_0_20px_rgba(129,140,248,0.2)]">
                Enterprise System
              </span>
            </h1>
            <p className="text-gray-500 dark:text-[#8F94A3] mb-8 text-[15px] leading-relaxed max-w-[320px] font-medium dark:drop-shadow-sm">
              Engineered for high-performance retail operations. Fast, reliable, and secure.
            </p>

            <div className="space-y-4">
              {features.map((item, index) => (
                <div key={index} className="flex items-center gap-4 text-[14px] font-semibold text-gray-700 dark:text-[#E2E8F0]">
                  <div className="flex items-center justify-center w-[42px] h-[42px] bg-white dark:bg-white/[0.02] rounded-[12px] border border-gray-100 dark:border-white/[0.05] shadow-sm dark:shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)] dark:backdrop-blur-md transition-colors dark:hover:bg-white/[0.04]">
                    {item.icon}
                  </div>
                  <span className="dark:drop-shadow-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Version / Security */}
          <div className="relative z-10 flex items-center justify-between text-[13px] text-gray-400 dark:text-[#8F94A3] mt-10 pt-6 border-t border-gray-200 dark:border-white/[0.04] font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-[16px] h-[16px] text-emerald-500 dark:text-emerald-400 dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
              <span>Secure Login</span>
            </div>
            <span>v2.0.4-beta</span>
          </div>
        </div>

        {/* Right Section: Login Form - Made Darker for Higher Contrast */}
        <div className="flex-1 flex flex-col justify-center p-8 sm:p-10 lg:p-12 bg-white dark:bg-[#06070A] relative z-10 transition-colors duration-300">

          {/* Right Panel Premium Top Highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] hidden dark:block bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none"></div>

          {/* Mobile Header (Hidden on Desktop) */}
          <div className="md:hidden flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-white/[0.04]">
            <div className="flex items-center justify-center w-11 h-11 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-[12px] shadow-sm dark:shadow-[0_4px_15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <Store className="w-[22px] h-[22px] text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-[22px] font-bold text-gray-900 dark:text-white tracking-tight">RSOFT</span>
          </div>

          <div className="w-full max-w-[360px] mx-auto">
            <div className="mb-8">
              <h2 className="text-[26px] font-bold text-gray-900 dark:text-white mb-2 tracking-tight dark:drop-shadow-sm">Sign in</h2>
              <p className="text-[14px] text-gray-500 dark:text-[#8F94A3] font-medium">Welcome back. Please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  className="p-3.5 bg-red-50 dark:bg-red-500/[0.06] border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3 text-[13px] text-red-600 dark:text-red-400 shadow-sm"
                >
                  <div className="mt-0.5 font-bold">•</div>
                  <p className="font-medium leading-snug">{error}</p>
                </motion.div>
              )}

              {/* Username Input */}
              <div className="space-y-1.5">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-2 text-left">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 dark:text-[#6B7280]" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3 border-[1.5px] border-gray-300 dark:border-white/[0.05] rounded-xl text-gray-900 dark:text-white bg-white dark:bg-[#050608] placeholder-gray-400 dark:placeholder-[#4B5563] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-md dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-2 text-left">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-[#6B7280]" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-11 py-3 border-[1.5px] border-gray-300 dark:border-white/[0.05] rounded-xl text-gray-900 dark:text-white bg-white dark:bg-[#050608] placeholder-gray-400 dark:placeholder-[#4B5563] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-md dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-[#6B7280] hover:text-gray-600 dark:hover:text-[#9CA3AF] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-white dark:bg-[#0A0B10] border-gray-300 dark:border-white/[0.1] rounded text-indigo-600 dark:text-indigo-500 focus:ring-[2px] focus:ring-indigo-500/40 focus:ring-offset-white dark:focus:ring-offset-[#06070A] cursor-pointer dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
                  />
                </div>
                <label htmlFor="remember" className="ml-2.5 text-[13px] font-medium text-gray-600 dark:text-[#8F94A3] cursor-pointer select-none transition-colors hover:text-gray-900 dark:hover:text-[#D1D5DB]">
                  Remember for 30 days
                </label>
              </div>

              {/* Submit Button - The Ultimate Premium CTA */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 relative group overflow-hidden rounded-xl disabled:opacity-70 disabled:cursor-not-allowed shadow-md dark:shadow-none"
              >
                {/* Animated Luxurious Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 dark:from-indigo-600 dark:via-[#6D28D9] dark:to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Crisp Inner White Highlight */}
                <div className="absolute inset-0 rounded-xl border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] pointer-events-none"></div>

                {/* Content */}
                <div className="relative flex items-center justify-center gap-2 px-5 py-3.5 text-white text-[14px] font-semibold dark:shadow-[0_4px_15px_rgba(99,102,241,0.4)]">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-[18px] h-[18px] animate-spin text-white" />
                      <span className="opacity-90 tracking-wide">Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wide">Sign in</span>
                      <ArrowRight className="w-[18px] h-[18px] opacity-90 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
