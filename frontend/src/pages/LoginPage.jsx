import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, ArrowRight } from "lucide-react";
import adminLogo from "../assets/admin_logo.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4002";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/app");
        }
      } else {
        alert(data.error || "Login failed");
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
        </div>

        {/* Login Card (Always centered) */}
        <div className="glass-panel neon-ring w-full rounded-3xl p-10 shadow-2xl fade-in-up delay-1">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight text-black">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-black">
              Sign in to access the secure steganography tool
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-black" htmlFor="username">
                Username or Email
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
                  className="w-full rounded-xl border border-violet-200 bg-white/60 p-3 pl-10 text-sm text-black placeholder-gray-400 shadow-inner outline-none transition-all focus:border-violet-400/50 focus:bg-white focus:ring-1 focus:ring-violet-400/50"
                  placeholder="Enter username or email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black" htmlFor="password">
                Password
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
                  title="Must be at least 6 characters including at least one letter, one number, and one symbol (@$!%*#?&)"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="group mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-4 text-sm font-black text-white shadow-xl shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-black">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-violet-600 transition-colors hover:text-purple-500">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
