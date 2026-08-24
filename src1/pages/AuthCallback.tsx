import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase client automatically parses tokens from URL hash / query parameters
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard", { replace: true });
      } else {
        // Fallback check after 1.5s
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (retrySession) {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/login", { replace: true });
          }
        }, 1500);
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcf8ee] p-8">
      <div className="bg-[#e8f0ec] border-4 border-black p-8 rounded-xl pixel-window text-center max-w-sm">
        <div className="text-5xl mb-4 animate-bounce">🤖</div>
        <h3 className="text-xs mb-2 tracking-wide font-bold">AUTHENTICATING...</h3>
        <p className="text-[10px] text-gray-600">Connecting your Google Account ✨</p>
      </div>
    </div>
  );
};
