import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen relative overflow-x-hidden font-vt text-xl antialiased selection:bg-[#4dc0b5] selection:text-white bg-[#f7f1e3]">
      {/* Background Grid */}
      <div className="bg-grid absolute inset-0 z-0 pointer-events-none"></div>

      <main className="max-w-[1600px] mx-auto min-h-screen relative p-6 md:p-8 flex flex-col justify-between z-10">
        {/* BEGIN: Header Section */}
        <header className="flex flex-wrap justify-between items-center mb-8 gap-4 relative z-10">
          {/* Logo Container */}
          <Link to="/" className="pixel-border bg-[#f7f1e3] px-6 py-4 flex items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
            {/* Robot Icon */}
            <div className="w-14 h-14 bg-[#4dc0b5] rounded-lg border-2 border-[#1b4b5a] relative flex items-center justify-center">
              <div className="absolute -top-3 w-3 h-3 bg-[#ef5753] rounded-full border-2 border-[#1b4b5a]"></div>
              <div className="w-9 h-5 bg-[#1b4b5a] rounded-md flex justify-around items-center px-1">
                <div className="w-2 h-2 bg-[#38c172] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#38c172] rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="font-pixel text-4xl sm:text-5xl md:text-6xl text-[#1b4b5a] pixel-text-shadow-red tracking-widest uppercase">
              Botway
            </h1>
          </Link>

          {/* Navigation & Action Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="pixel-border bg-white px-4 py-2 hidden sm:flex items-center gap-2 transform rotate-1">
              <span className="font-pixel text-xs uppercase text-[#1b4b5a]">AI Chatbot Platform</span>
              <span className="text-[#ef5753] text-xl">♥</span>
            </div>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="pixel-btn-green font-pixel text-xs px-6 py-3 border-2 border-[#1b4b5a] rounded-lg flex items-center gap-2 text-black hover:brightness-105 active:translate-y-0.5"
              >
                <span>DASHBOARD</span>
                <span>→</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="pixel-btn-red font-pixel text-xs px-6 py-3 border-2 border-[#1b4b5a] rounded-lg flex items-center gap-2 text-black hover:brightness-105 active:translate-y-0.5"
                >
                  <span>LOGIN</span>
                  <span>→</span>
                </Link>
                <Link
                  to="/signup"
                  className="pixel-btn-green font-pixel text-xs px-6 py-3 border-2 border-[#1b4b5a] rounded-lg hidden sm:flex items-center gap-2 text-black hover:brightness-105 active:translate-y-0.5"
                >
                  <span>GET STARTED</span>
                  <span>✨</span>
                </Link>
              </div>
            )}
          </div>
        </header>
        {/* END: Header Section */}

        {/* BEGIN: Main Content Area */}
        <div className="flex-1 relative z-10 flex flex-col lg:flex-row gap-8 mt-4 items-start">
          {/* Left Column: Typography & Info Box */}
          <div className="w-full lg:w-[45%] flex flex-col gap-6">
            {/* Headline */}
            <div className="flex flex-col gap-1">
              <h2 className="font-pixel text-5xl sm:text-6xl md:text-7xl text-[#1b4b5a] uppercase tracking-wide leading-tight">
                Coming
              </h2>
              <h2 className="font-pixel text-5xl sm:text-6xl md:text-7xl text-[#ef5753] uppercase tracking-wide leading-tight">
                Soon
              </h2>
            </div>

            {/* Info Box */}
            <div className="pixel-border bg-white p-6 relative mt-2">
              <div className="flex items-start gap-4">
                <div className="text-4xl transform -rotate-12">🚀</div>
                <div>
                  <h3 className="text-2xl text-[#4dc0b5] font-bold mb-2 uppercase tracking-wide">
                    We're building something awesome!
                  </h3>
                  <p className="text-xl text-[#1b4b5a] mb-4 leading-relaxed">
                    Botway is your all-in-one platform to create, customize and deploy AI chatbots for your business.
                  </p>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#ef5753] text-xl">♥</span>
                    <div className="flex-1 h-4 border-2 border-[#1b4b5a] flex rounded-sm overflow-hidden">
                      <div className="w-1/6 bg-[#4dc0b5]"></div>
                      <div className="w-1/6 border-l-2 border-[#1b4b5a] bg-[#4dc0b5] opacity-80"></div>
                      <div className="w-1/6 border-l-2 border-[#1b4b5a] bg-[#4dc0b5] opacity-60"></div>
                      <div className="w-1/6 border-l-2 border-[#1b4b5a] bg-[#fff3cd]"></div>
                      <div className="w-1/6 border-l-2 border-[#1b4b5a] bg-[#f6993f]"></div>
                      <div className="w-1/6 border-l-2 border-[#1b4b5a] bg-[#ef5753]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                to="/signup"
                className="pixel-btn-red font-pixel text-xs px-8 py-4 border-2 border-[#1b4b5a] rounded-lg text-black hover:brightness-105 flex items-center gap-3 active:translate-y-0.5"
              >
                <span>CREATE FREE ACCOUNT</span>
                <span>→</span>
              </Link>
              <Link
                to="/login"
                className="pixel-border bg-white font-pixel text-xs px-6 py-4 rounded-lg text-[#1b4b5a] hover:bg-gray-100 flex items-center gap-2 active:translate-y-0.5"
              >
                <span>SIGN IN</span>
                <span>🤖</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Computer & Character Illustration Area */}
          <div className="w-full lg:w-[55%] relative min-h-[480px]">
            {/* Terminal Window on Retro Computer Frame */}
            <div className="bg-[#1b4b5a] pixel-border p-5 text-[#38c172] font-pixel text-xs flex flex-col gap-3 rounded-lg shadow-xl w-full max-w-lg mx-auto lg:ml-auto">
              <div className="flex justify-between items-center border-b-2 border-[#38c172] pb-2 text-[10px]">
                <span>BOTWAY OS v1.0.0</span>
                <span className="animate-pulse">● LIVE</span>
              </div>
              <p>&gt; INITIALIZING BOTWAY...</p>
              <p>&gt; CONNECTING SUPABASE POSTGRESQL... [OK]</p>
              <p>&gt; LOADING AI SYSTEM PROMPT ENGINE... [OK]</p>
              <p>&gt; READY FOR DEPLOYMENT...</p>

              <div className="mt-2 w-full h-4 border-2 border-[#38c172] p-[2px]">
                <div className="bg-[#38c172] h-full w-[85%] animate-pulse"></div>
              </div>

              <div className="flex justify-center my-3">
                {/* Robot face in terminal */}
                <div className="w-14 h-10 border-2 border-[#38c172] rounded-sm flex items-center justify-around px-2 relative bg-black/40">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-[#38c172]"></div>
                  <div className="w-2 h-2 bg-[#38c172] rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-[#38c172] rounded-full animate-ping"></div>
                  <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#38c172]"></div>
                </div>
              </div>
            </div>

            {/* Sticky Notes & Floating Badges */}
            <div className="hidden sm:block absolute top-[10%] left-[5%] bg-[#fff3cd] border-2 border-[#1b4b5a] p-3 text-center text-sm font-bold shadow-md transform -rotate-6 z-30 font-vt">
              AI<br />POWERED<br />FUTURE<br />:)
            </div>

            <div className="hidden sm:block absolute bottom-[5%] left-[5%] bg-[#ffb8c6] border-2 border-[#1b4b5a] p-3 text-center text-sm font-bold shadow-md transform rotate-3 z-30 font-vt">
              SMARTER<br />CHATBOTS<br />BETTER<br />BUSINESSES ❤️
            </div>

            {/* Speech Bubble */}
            <div className="hidden md:block absolute top-[-5%] right-[5%] bg-white pixel-border p-4 text-center z-30 font-vt">
              <p className="font-bold mb-1">GREAT THINGS<br />TAKE TIME!</p>
              <span className="text-[#ef5753] text-xl">♥</span>
              <div className="absolute -bottom-4 left-4 w-4 h-4 bg-white border-b-4 border-l-4 border-[#1b4b5a] transform -rotate-45"></div>
            </div>
          </div>
        </div>
        {/* END: Main Content Area */}

        {/* BEGIN: Feature Grid Section */}
        <div className="pixel-border bg-white mt-12 p-6 z-10 relative w-full lg:w-[70%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x-2 divide-dashed divide-[#1b4b5a]">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center px-3 pt-4 sm:pt-0">
              <div className="w-12 h-12 bg-[#4dc0b5] rounded-lg border-2 border-[#1b4b5a] mb-3 flex items-center justify-center text-2xl shadow-[2px_2px_0px_#1b4b5a]">
                🤖
              </div>
              <h4 className="font-bold text-base uppercase tracking-wide mb-1 text-[#1b4b5a]">AI Chatbots</h4>
              <p className="text-base leading-tight text-gray-700">Smart conversations that convert</p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center px-3 pt-4 sm:pt-0">
              <div className="w-12 h-12 bg-[#f6993f] rounded-lg border-2 border-[#1b4b5a] mb-3 flex items-center justify-center text-2xl shadow-[2px_2px_0px_#1b4b5a]">
                🎨
              </div>
              <h4 className="font-bold text-base uppercase tracking-wide mb-1 text-[#1b4b5a]">Fully Customizable</h4>
              <p className="text-base leading-tight text-gray-700">Design the perfect bot for your brand</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center px-3 pt-4 sm:pt-0">
              <div className="w-12 h-12 bg-[#38c172] rounded-lg border-2 border-[#1b4b5a] mb-3 flex items-center justify-center text-2xl shadow-[2px_2px_0px_#1b4b5a]">
                🚀
              </div>
              <h4 className="font-bold text-base uppercase tracking-wide mb-1 text-[#1b4b5a]">Easy to Deploy</h4>
              <p className="text-base leading-tight text-gray-700">Launch anywhere in just a few clicks</p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center px-3 pt-4 sm:pt-0">
              <div className="w-12 h-12 bg-[#ef5753] rounded-lg border-2 border-[#1b4b5a] mb-3 flex items-center justify-center text-2xl shadow-[2px_2px_0px_#1b4b5a]">
                🛡️
              </div>
              <h4 className="font-bold text-base uppercase tracking-wide mb-1 text-[#1b4b5a]">Secure & Reliable</h4>
              <p className="text-base leading-tight text-gray-700">Multi-tenant RLS data protection</p>
            </div>
          </div>
        </div>
        {/* END: Feature Grid Section */}

        {/* Footer */}
        <footer className="mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-[#1b4b5a] border-t-2 border-[#1b4b5a]/20">
          <p>© 2024 Botway. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0 font-pixel text-[10px]">
            <Link to="/login" className="hover:underline">LOGIN</Link>
            <span>•</span>
            <Link to="/signup" className="hover:underline">SIGNUP</Link>
          </div>
        </footer>
      </main>
    </div>
  );
};
