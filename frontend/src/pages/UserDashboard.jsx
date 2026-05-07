import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Image as ImageIcon, LogOut, Activity, Globe, Zap, Clock, Users, ArrowRight, Shield, Database } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import adminLogo from "../assets/admin_logo.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4002";

function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    imagesEncoded: 0,
    recentActivity: []
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/");
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    fetch(`${API_BASE}/api/user/stats?username=${userData.username}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching user stats:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 blur opacity-30"></div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl overflow-hidden">
                <img src={adminLogo} alt="User Logo" className="h-full w-full object-contain" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-black">
                Hello, <span className="text-violet-600">{user.username}</span>!
              </h1>
              <p className="mt-1 text-base text-black/50">
                You've secured <span className="font-semibold text-black">{stats.imagesEncoded} secret messages</span> so far.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/encode")}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-violet-500/20 transition-all hover:scale-105 hover:bg-violet-500 active:scale-95"
            >
              <Zap className="h-4 w-4" />
              <span>Secure New Image</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Main Stats Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="glass-panel p-6 rounded-3xl border border-white/40 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 transition-transform group-hover:scale-125 duration-500">
                  <ImageIcon size={80} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-black/40">Encrypted Images</p>
                <p className="mt-2 text-4xl font-black text-black">{stats.imagesEncoded}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <Activity size={12} />
                  <span>LIVE TRACKING</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/40 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 transition-transform group-hover:scale-125 duration-500">
                  <Users size={80} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-black/40">Network Members</p>
                <p className="mt-2 text-4xl font-black text-black">{stats.totalUsers}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-violet-600">
                  <Globe size={12} />
                  <span>GLOBAL COMMUNITY</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/40 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 transition-transform group-hover:scale-125 duration-500">
                  <Shield size={80} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-black/40">Encryption</p>
                <p className="mt-2 text-4xl font-black text-black">AES</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600">
                  <ShieldCheck size={12} />
                  <span>MILITARY GRADE</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="glass-panel p-8 rounded-3xl border border-white/40 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-600 p-2 text-white">
                    <Clock size={20} />
                  </div>
                  <h2 className="text-xl font-black text-black">Your Activity Timeline</h2>
                </div>
                <span className="text-xs font-bold text-black/40 uppercase tracking-widest">Last 10 Actions</span>
              </div>
              
              {stats.recentActivity.length > 0 ? (
                <div className="space-y-6">
                  {stats.recentActivity.map((activity, idx) => (
                    <div key={idx} className="group flex items-center justify-between rounded-2xl border border-transparent p-3 transition-all hover:border-violet-100 hover:bg-violet-50/30">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          activity.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          <Activity className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-black">{activity.event}</p>
                          <p className="text-sm text-black/40">{new Date(activity.time).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wider ${
                          activity.status === 'Success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                        }`}>
                          {activity.status}
                        </span>
                        <ArrowRight className="h-4 w-4 text-black/10 transition-transform group-hover:translate-x-1 group-hover:text-violet-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-violet-50 p-6">
                    <ImageIcon size={40} className="text-violet-200" />
                  </div>
                  <h3 className="text-lg font-bold text-black">Your vault is empty</h3>
                  <p className="mt-2 max-w-xs text-sm text-black/40">Start hiding secret messages in images to see your activity timeline grow.</p>
                  <button 
                    onClick={() => navigate("/encode")}
                    className="mt-6 font-bold text-violet-600 hover:underline"
                  >
                    Encrypted your first image &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Quick Actions Card */}
            <div className="rounded-3xl bg-black p-8 text-white shadow-2xl">
              <h3 className="text-xl font-black italic">Quick Actions</h3>
              <p className="mt-2 text-sm text-white/50">Rapid access to steganography tools</p>
              
              <div className="mt-8 space-y-4">
                <button 
                  onClick={() => navigate("/encode")}
                  className="flex w-full items-center justify-between rounded-2xl bg-white/10 p-4 transition-all hover:bg-white/20"
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className="text-violet-400" />
                    <span className="font-bold">Encode Image</span>
                  </div>
                  <ArrowRight size={16} />
                </button>
                
                <button 
                  onClick={() => navigate("/decode")}
                  className="flex w-full items-center justify-between rounded-2xl bg-white/10 p-4 transition-all hover:bg-white/20"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="text-cyan-400" />
                    <span className="font-bold">Decode Image</span>
                  </div>
                  <ArrowRight size={16} />
                </button>

                <button 
                  onClick={() => navigate("/app")}
                  className="flex w-full items-center justify-between rounded-2xl bg-white/10 p-4 transition-all hover:bg-white/20"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="text-emerald-400" />
                    <span className="font-bold">Public Explorer</span>
                  </div>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Security Status Card */}
            <div className="glass-panel p-8 rounded-3xl border border-white/40 shadow-sm bg-gradient-to-br from-violet-50 to-white">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500 p-2 text-white shadow-lg shadow-emerald-200">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-lg font-black text-black">Security Status</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex justify-between text-xs font-bold uppercase">
                    <span className="text-black/40">Vault Strength</span>
                    <span className="text-emerald-600">Optimal</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100">
                    <div className="h-full w-[94%] bg-emerald-500"></div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <Database size={18} className="mt-1 text-violet-600" />
                  <div>
                    <p className="text-sm font-bold text-black">Local Storage DB</p>
                    <p className="text-xs text-black/40">Your data is stored securely in the system vault.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default UserDashboard;
