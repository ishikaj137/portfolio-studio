import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message);
      } else {
        navigate(from, { replace: true });
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message);
      }
    } catch {
      setErrorMsg("Failed to initiate Google sign in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 overflow-hidden relative selection:bg-red-200">
      {/* BEGIN: Background Elements */}
      {/* Left Side Elements */}
      <div className="absolute left-8 top-8 hidden lg:block z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-200 border-2 border-black rounded-lg relative overflow-hidden pixel-border">
            <div className="absolute inset-0 flex items-center justify-center text-xl">🤖</div>
          </div>
          <h1 className="text-4xl tracking-widest text-gray-800">BOTWAY</h1>
        </div>
        <div className="inline-block border-2 border-black px-4 py-2 bg-white rounded-full text-xs pixel-border">
          AI CHATBOT PLATFORM ❤️
        </div>
      </div>

      <div className="absolute left-16 bottom-16 hidden lg:flex items-end gap-4 z-0">
        <div className="relative">
          <div className="bg-[#fcf8ee] border-4 border-black p-4 rounded-xl text-center pixel-window max-w-[200px] mb-8 relative">
            <p className="text-xs leading-relaxed mb-2">GREAT THINGS</p>
            <p className="text-xs text-red-500 leading-relaxed mb-2">TAKE TIME!</p>
            <p className="text-xs text-red-500">❤️</p>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[15px] border-t-black border-r-[10px] border-r-transparent"></div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[12px] border-t-[#fcf8ee] border-r-[8px] border-r-transparent"></div>
          </div>
          <div className="text-6xl text-green-500 relative z-10 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
            🤖💻
          </div>
        </div>
        <div className="text-4xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">🪴</div>
        <div className="text-4xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">☕</div>
      </div>

      {/* Right Side Elements */}
      <div className="absolute right-16 top-16 hidden lg:block text-5xl text-orange-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
        🌅
      </div>

      <div className="absolute right-16 bottom-16 hidden lg:block z-0">
        <div className="bg-yellow-200 border-2 border-black p-4 mb-8 transform rotate-3 pixel-window w-40 text-center relative">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-black mx-auto -mt-6 mb-2 absolute left-1/2 -translate-x-1/2 top-0 shadow-[1px_1px_0_#000]"></div>
          <p className="text-[10px] leading-tight mb-2">AI POWERED<br />FUTURE</p>
          <p className="text-xs">🙂</p>
        </div>
        <div className="text-6xl text-gray-300 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] relative z-10">
          🖥️
        </div>
      </div>

      {/* Decorative Clouds/Stars */}
      <div className="absolute top-32 left-1/4 text-2xl text-blue-200 drop-shadow-[1px_1px_0_#000] hidden lg:block">☁️</div>
      <div className="absolute bottom-1/3 right-1/4 text-2xl text-blue-200 drop-shadow-[1px_1px_0_#000] hidden lg:block">☁️</div>
      <div className="absolute top-1/4 right-1/3 text-yellow-400 text-xl hidden lg:block">✨</div>
      <div className="absolute bottom-1/4 left-1/3 text-yellow-400 text-xl hidden lg:block">✨</div>
      {/* END: Background Elements */}

      {/* BEGIN: Main Login Window */}
      <main className="w-full max-w-2xl bg-[#e8f0ec] border-4 border-black rounded-xl overflow-hidden pixel-window relative z-20 flex flex-col max-h-[90vh]">
        {/* Window Title Bar */}
        <header className="bg-[#c2dacd] border-b-4 border-black px-4 py-3 flex justify-between items-center select-none">
          <div className="flex items-center gap-2 text-xs">
            <span>⋮</span> BOTWAY LOGIN
          </div>
          <div className="flex gap-2">
            <button aria-label="Minimize" className="w-6 h-6 border-2 border-black bg-white flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 pixel-border focus:outline-none">_</button>
            <button aria-label="Maximize" className="w-6 h-6 border-2 border-black bg-white flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 pixel-border focus:outline-none">□</button>
            <button aria-label="Close" className="w-6 h-6 border-2 border-black bg-red-400 text-white flex items-center justify-center hover:bg-red-500 active:bg-red-600 pixel-border focus:outline-none">×</button>
          </div>
        </header>

        {/* Login Form Area */}
        <div className="flex-1 bg-[#fcf8ee] p-8 flex flex-col items-center overflow-y-auto">
          {/* Mascot / Logo */}
          <div className="mb-6 relative">
            <div className="w-24 h-24 bg-green-200 border-4 border-black rounded-2xl flex items-center justify-center overflow-hidden pixel-window mx-auto">
              <div className="text-5xl animate-pulse">🤖</div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h2 className="text-2xl mb-3 tracking-wide">WELCOME BACK!</h2>
            <p className="text-[10px] text-gray-700">❤️ Sign in to your Botway account ❤️</p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="w-full max-w-md mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 text-[10px] rounded pixel-border flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form className="w-full max-w-md flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-[10px] mb-2 uppercase" htmlFor="email">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">👤</span>
                <input
                  id="email"
                  className="w-full pl-10 pr-4 py-3 text-[10px] pixel-input rounded-none"
                  placeholder="you@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] mb-2 uppercase" htmlFor="password">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔒</span>
                <input
                  id="password"
                  className="w-full pl-10 pr-10 py-3 text-[10px] pixel-input rounded-none"
                  placeholder="••••••••••"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex justify-between items-center text-[9px] mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-2 border-black rounded-none checked:bg-black focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="group-hover:underline">Remember me</span>
              </label>
              <a className="text-[#0d9488] hover:underline hover:text-teal-700" href="#forgot">Forgot password?</a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs tracking-wider border-2 border-black rounded-lg mt-2 flex items-center justify-center gap-2 pixel-btn-red text-black focus:outline-none transition-transform disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{loading ? "AUTHENTICATING..." : "LOGIN"}</span>
              <span>→</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-1 opacity-50">
              <div className="h-px bg-black flex-1 border-b border-dotted border-black"></div>
              <span className="text-[10px]">OR</span>
              <div className="h-px bg-black flex-1 border-b border-dotted border-black"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 text-[10px] bg-white border-2 border-black rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 active:bg-gray-100 pixel-border focus:outline-none cursor-pointer"
            >
              <span className="text-sm">🇬</span>
              <span>CONTINUE WITH GOOGLE</span>
            </button>

            {/* Link to Signup */}
            <div className="text-center text-[9px] mt-2">
              <span>Don't have an account? </span>
              <Link to="/signup" className="text-[#0d9488] hover:underline font-bold">
                SIGN UP HERE
              </Link>
            </div>
          </form>
        </div>
      </main>
      {/* END: Main Login Window */}

      {/* Footer Banner */}
      <footer className="absolute bottom-4 w-full flex flex-col items-center gap-2 z-10 pointer-events-none">
        <div className="bg-[#fcf8ee] border-2 border-black px-6 py-2 rounded-full text-[9px] pixel-border flex items-center gap-4 pointer-events-auto">
          <span>🚀 Build smarter chatbots.</span>
          <span>•</span>
          <span>Deliver better experiences. ❤️</span>
        </div>
        <div className="text-[8px] text-gray-500">
          © 2024 Botway. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
