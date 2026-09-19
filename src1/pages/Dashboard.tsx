import React from "react";
import { useAuth } from "../auth/useAuth";

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      {/* Header Bar */}
      <header className="w-full max-w-4xl bg-[#c2dacd] border-4 border-black px-6 py-4 rounded-xl pixel-window flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <span className="text-sm font-bold tracking-wider">BOTWAY DASHBOARD</span>
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-[10px] bg-red-400 border-2 border-black rounded pixel-border hover:bg-red-500 active:translate-y-0.5 cursor-pointer"
        >
          LOGOUT
        </button>
      </header>

      {/* Main Content Window */}
      <main className="w-full max-w-4xl bg-[#e8f0ec] border-4 border-black rounded-xl pixel-window overflow-hidden">
        <div className="bg-[#c2dacd] border-b-4 border-black px-4 py-2 text-xs flex justify-between items-center">
          <span>WORKSPACE OVERVIEW</span>
          <span>● ONLINE</span>
        </div>
        <div className="p-8 bg-[#fcf8ee] flex flex-col gap-6">
          <div className="bg-white border-2 border-black p-6 rounded pixel-border">
            <h3 className="text-xs mb-4 text-gray-500 uppercase">Authenticated Session</h3>
            <div className="flex flex-col gap-3 text-xs">
              <p><strong>USER ID:</strong> <span className="font-mono text-[10px] text-gray-600">{user?.id}</span></p>
              <p><strong>EMAIL:</strong> <span className="text-teal-700">{user?.email}</span></p>
              <p><strong>FULL NAME:</strong> <span>{user?.user_metadata?.full_name || "N/A"}</span></p>
              <p><strong>STATUS:</strong> <span className="text-green-600 font-bold">AUTHENTICATED ✅</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-100 border-2 border-black p-6 rounded pixel-border text-center">
              <div className="text-4xl mb-2">💬</div>
              <h4 className="text-xs mb-2">AI CHATBOTS</h4>
              <p className="text-[10px] text-gray-600">Coming soon in next phase!</p>
            </div>

            <div className="bg-yellow-100 border-2 border-black p-6 rounded pixel-border text-center">
              <div className="text-4xl mb-2">📚</div>
              <h4 className="text-xs mb-2">KNOWLEDGE BASES</h4>
              <p className="text-[10px] text-gray-600">RAG pipeline integration soon!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
