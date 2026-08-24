import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcf8ee] p-8">
        <div className="bg-[#e8f0ec] border-4 border-black p-8 rounded-xl pixel-window text-center max-w-sm">
          <div className="text-4xl mb-4 animate-bounce">🤖</div>
          <p className="text-xs">LOADING SESSION...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
