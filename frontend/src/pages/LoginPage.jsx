import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, ArrowRight } from "lucide-react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login logic: admin / Adm1n!
    if (username === "admin" && password === "Adm1n!") {
      navigate("/admin");
    } else {
      navigate("/app"); // Default goes to the project site
    }
  };

  return (
    <div className="relative z-10 flex min-h-[80vh] items-center justify-center px-4">
      <div className="glass-panel neon-ring w-full max-w-md rounded-2xl p-8 fade-in-up">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Stego Shield
          </h1>
          <p className="mt-2 text-sm text-black">
            Sign in to access the secure steganography tool
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-black" htmlFor="username">
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
                className="w-full rounded-xl border border-violet-200 bg-white/60 p-3 pl-10 text-sm text-black placeholder-gray-400 shadow-inner outline-none transition-all focus:border-violet-400/50 focus:bg-white focus:ring-1 focus:ring-violet-400/50"
                placeholder="Enter username (admin for dashboard)"
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
                className="w-full rounded-xl border border-violet-200 bg-white/60 p-3 pl-10 text-sm text-black placeholder-gray-400 shadow-inner outline-none transition-all focus:border-violet-400/50 focus:bg-white focus:ring-1 focus:ring-violet-400/50"
                placeholder="••••••••"
                minLength={6}
                maxLength={6}
                pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6}"
                title="Must be 6 characters including at least one letter, one number, and one symbol (@$!%*#?&)"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 p-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/40"
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
  );
}

export default LoginPage;
