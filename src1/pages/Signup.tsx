import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export const Signup: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification state
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signUp, verifyOtp, resendOtp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Handle resend countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const { user, session, error } = await signUp(email, password, fullName);
      if (error) {
        setErrorMsg(error.message);
      } else if (user && !session) {
        // Email OTP sent! Transition to OTP verification step
        setStep("otp");
        setSuccessMsg(`We sent a 6-digit OTP code to ${email}`);
        setResendCooldown(30);
      } else {
        // Immediate session without confirmation
        navigate("/dashboard", { replace: true });
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrorMsg("Please enter the 6-digit OTP code");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const { session, error } = await verifyOtp(email, otp.trim(), "signup");
      if (error) {
        setErrorMsg(error.message);
      } else if (session) {
        navigate("/dashboard", { replace: true });
      }
    } catch {
      setErrorMsg("Failed to verify OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    const { error } = await resendOtp(email, "signup");
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(`New OTP sent to ${email}`);
      setResendCooldown(30);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 overflow-hidden relative selection:bg-green-200">
      {/* Background Elements */}
      <div className="absolute left-8 top-8 hidden lg:block z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-200 border-2 border-black rounded-lg relative overflow-hidden pixel-border">
            <div className="absolute inset-0 flex items-center justify-center text-xl">🤖</div>
          </div>
          <h1 className="text-4xl tracking-widest text-gray-800">BOTWAY</h1>
        </div>
        <div className="inline-block border-2 border-black px-4 py-2 bg-white rounded-full text-xs pixel-border">
          JOIN THE REVOLUTION ✨
        </div>
      </div>

      <main className="w-full max-w-2xl bg-[#e8f0ec] border-4 border-black rounded-xl overflow-hidden pixel-window relative z-20 flex flex-col max-h-[90vh]">
        {/* Window Title Bar */}
        <header className="bg-[#c2dacd] border-b-4 border-black px-4 py-3 flex justify-between items-center select-none">
          <div className="flex items-center gap-2 text-xs">
            <span>⋮</span> {step === "signup" ? "CREATE ACCOUNT" : "VERIFY EMAIL OTP"}
          </div>
          <div className="flex gap-2">
            <span className="w-6 h-6 border-2 border-black bg-white flex items-center justify-center pixel-border text-xs">_</span>
            <span className="w-6 h-6 border-2 border-black bg-white flex items-center justify-center pixel-border text-xs">□</span>
            <span className="w-6 h-6 border-2 border-black bg-red-400 text-white flex items-center justify-center pixel-border text-xs">×</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 bg-[#fcf8ee] p-8 flex flex-col items-center overflow-y-auto">
          {step === "signup" ? (
            <>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-200 border-4 border-black rounded-2xl flex items-center justify-center overflow-hidden pixel-window mx-auto mb-4">
                  <div className="text-4xl">🚀</div>
                </div>
                <h2 className="text-2xl mb-2 tracking-wide">START BUILDING</h2>
                <p className="text-[10px] text-gray-700">Create your Botway workspace</p>
              </div>

              {errorMsg && (
                <div className="w-full max-w-md mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 text-[10px] rounded pixel-border flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form className="w-full max-w-md flex flex-col gap-4" onSubmit={handleSignupSubmit}>
                <div>
                  <label className="block text-[10px] mb-2 uppercase" htmlFor="fullName">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">✨</span>
                    <input
                      id="fullName"
                      className="w-full pl-10 pr-4 py-3 text-[10px] pixel-input rounded-none"
                      placeholder="Jayesh M"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

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
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-xs tracking-wider border-2 border-black rounded-lg mt-2 flex items-center justify-center gap-2 pixel-btn-green text-black focus:outline-none transition-transform disabled:opacity-60 cursor-pointer"
                >
                  <span>{loading ? "SENDING OTP..." : "CREATE ACCOUNT"}</span>
                  <span>→</span>
                </button>

                <div className="flex items-center gap-4 my-1 opacity-50">
                  <div className="h-px bg-black flex-1 border-b border-dotted border-black"></div>
                  <span className="text-[10px]">OR</span>
                  <div className="h-px bg-black flex-1 border-b border-dotted border-black"></div>
                </div>

                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="w-full py-3 text-[10px] bg-white border-2 border-black rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 active:bg-gray-100 pixel-border focus:outline-none cursor-pointer"
                >
                  <span className="text-sm">🇬</span>
                  <span>CONTINUE WITH GOOGLE</span>
                </button>

                <div className="text-center text-[9px] mt-2">
                  <span>Already have an account? </span>
                  <Link to="/login" className="text-[#0d9488] hover:underline font-bold">
                    LOGIN HERE
                  </Link>
                </div>
              </form>
            </>
          ) : (
            /* OTP VERIFICATION STEP */
            <div className="w-full max-w-md flex flex-col items-center">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-yellow-200 border-4 border-black rounded-2xl flex items-center justify-center overflow-hidden pixel-window mx-auto mb-4">
                  <div className="text-4xl animate-bounce">✉️</div>
                </div>
                <h2 className="text-xl mb-2 tracking-wide">ENTER 6-DIGIT OTP</h2>
                <p className="text-[10px] text-gray-700 leading-relaxed">
                  We emailed a confirmation code to:
                  <br />
                  <strong className="text-teal-700 text-xs">{email}</strong>
                </p>
              </div>

              {errorMsg && (
                <div className="w-full mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 text-[10px] rounded pixel-border flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="w-full mb-4 p-3 bg-green-100 border-2 border-green-600 text-green-800 text-[10px] rounded pixel-border flex items-center gap-2">
                  <span>✨</span>
                  <span>{successMsg}</span>
                </div>
              )}

              <form className="w-full flex flex-col gap-5" onSubmit={handleOtpSubmit}>
                <div>
                  <label className="block text-[10px] mb-2 uppercase text-center" htmlFor="otp">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength={10}
                    placeholder="123456"
                    autoFocus
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\s+/g, ""))}
                    className="w-full py-4 text-center text-lg tracking-[0.4em] font-mono pixel-input rounded-none uppercase font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-xs tracking-wider border-2 border-black rounded-lg flex items-center justify-center gap-2 pixel-btn-green text-black focus:outline-none transition-transform disabled:opacity-60 cursor-pointer"
                >
                  <span>{loading ? "VERIFYING..." : "VERIFY & ENTER WORKSPACE"}</span>
                  <span>→</span>
                </button>

                <div className="flex justify-between items-center text-[9px] mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("signup");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-gray-500 hover:text-black hover:underline cursor-pointer"
                  >
                    ← Change Email
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0}
                    onClick={handleResendCode}
                    className="text-[#0d9488] hover:underline font-bold disabled:text-gray-400 disabled:no-underline cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
