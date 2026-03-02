import React, { useState } from 'react';
import Dashboard from './Dashboard';
import CodeItDashboard from './CodeIt/Dashboard.jsx';
import WebsiteSelector from './WebsiteSelector';
import AuraDashboard from './Aura/AuraDashBoard.jsx';

import './index.css';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import JournalsDashboard from './Helix_Open_Access_Journals/JournalsDashboard.jsx';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPin = import.meta.env.VITE_ADMIN_PIN || '1234';
    if (pin === correctPin) {
      setIsAuthenticated(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPin('');
    }
  };

  const handleWebsiteSelect = (websiteId) => {
    setSelectedWebsite(websiteId);
  };

  if (!isAuthenticated) {
    return (
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-slate-900 font-sans selection:bg-purple-500/30">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black z-0"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Glass Card */}
        <div className="relative z-10 w-full max-w-md p-10 mx-4 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">

          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Admin Portal</h2>
            <p className="mt-3 text-slate-400 font-medium">Enter your PIN to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative group">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className={`w-full px-8 py-5 text-center text-3xl font-bold tracking-[0.8em] text-white placeholder-slate-600 bg-black/20 border-2 rounded-2xl outline-none hover:bg-black/30 hover:border-white/10 focus:border-blue-500 focus:bg-black/40 transition-all duration-300 ${error ? 'border-red-500/50 animate-shake' : 'border-white/5'}`}
                placeholder="••••"
                maxLength={4}
                autoFocus
                style={{ textSecurity: 'disc', WebkitTextSecurity: 'disc' }}
              />
              {error && (
                <div className="absolute -bottom-6 left-0 w-full text-center text-red-400 text-sm font-medium animate-bounce">
                  Incorrect PIN, try again.
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={pin.length < 4}
              className="group relative w-full px-6 py-4 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Unlock Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium tracking-wide uppercase">
            <ShieldCheck size={14} className="text-emerald-500" />
            Secure Connection • Peptides Knowledge Park
          </div>
        </div>
      </div>
    );
  }

  // New Logic for Website Selection
  if (!selectedWebsite) {
    return <WebsiteSelector onSelect={handleWebsiteSelect} />;
  }

  if (selectedWebsite === 'CodeIt') {
    return <CodeItDashboard onBack={() => setSelectedWebsite(null)} />;
  }
if (selectedWebsite === 'Aura') {
  return <AuraDashboard onBack={() => setSelectedWebsite(null)} />;
}

  if (selectedWebsite === 'Journals') {
    return <JournalsDashboard onBack={() => setSelectedWebsite(null)} />;
  }
  return <Dashboard selectedWebsite={selectedWebsite} onBack={() => setSelectedWebsite(null)} />;

}
export default App;
