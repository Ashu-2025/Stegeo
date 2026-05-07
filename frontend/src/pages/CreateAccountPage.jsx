import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, Mail, ArrowRight } from "lucide-react";
import adminLogo from "../assets/admin_logo.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4002";

function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate("/");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 lg:px-8">
      {/* Container that centers the card but allows logo to sit on left */}
      <div className="relative flex w-full max-w-md flex-col items-center justify-center gap-12">
        
        {/* Logo Section (Absolute on desktop to keep card centered) */}
        <div className="flex flex-col items-center justify-center fade-in-up lg:absolute lg:right-[calc(100%+4rem)] lg:w-96">
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-violet-500/20 blur-3xl"></div>
            <img 
              src={adminLogo} 
              alt="StegoShield Logo" 
              className="relative h-48 w-48 object-contain drop-shadow-[0_0_30px_rgba(124,58,237,0.4)] lg:h-96 lg:w-96" 
            />
          </div>
          <div className="mt-8 text-center hidden lg:block w-full">
            <h2 className="text-4xl font-black text-purple-900 uppercase tracking-widest">Stego Shield</h2>
            <p className="mt-4 text-lg text-black/60 font-medium">Join the most secure image steganography network</p>
          </div>
        </div>

        {/* Register Card (Always centered) */}
        <div className="glass-panel neon-ring w-full rounded-3xl p-10 shadow-2xl fade-in-up delay-1">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black tracking-tight text-black">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-black/60">
              Join Stego Shield to securely hide your data
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-black" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-violet-600" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-violet-200 bg-white/60 p-4 pl-12 text-sm text-black placeholder-gray-400 shadow-inner outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-black" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-violet-600" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-violet-200 bg-white/60 p-4 pl-12 text-sm text-black placeholder-gray-400 shadow-inner outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-400"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-black" htmlFor="password">
                Security Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-violet-600" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-violet-200 bg-white/60 p-4 pl-12 text-sm text-black placeholder-gray-400 shadow-inner outline-none transition-all focus:border-violet-400 focus:bg-white focus:ring-1 focus:ring-violet-400"
                  placeholder="••••••••"
                  minLength={6}
                  maxLength={32}
                  pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}"
                  title="Must be at least 6 characters"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="group mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-4 text-sm font-black text-white shadow-xl shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Join Network</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-black/60">
            Already have an account?{" "}
            <Link to="/" className="font-bold text-violet-600 transition-colors hover:text-purple-500 underline decoration-violet-200 underline-offset-4">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountPage;
