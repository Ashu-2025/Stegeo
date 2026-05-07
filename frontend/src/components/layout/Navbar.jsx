import { Menu, Shield, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import adminLogo from "../../assets/admin_logo.png";

const navItems = [
  { href: "#about", label: "About", isAnchor: true },
  { href: "#features", label: "Features", isAnchor: true },
  { href: "#workflow", label: "How It Works", isAnchor: true },
  { href: "#stack", label: "Tech Stack", isAnchor: true },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/app";
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#4c1d95]/20 bg-[#4c1d95] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to={isLoggedIn ? (user?.role === "admin" ? "/admin" : "/dashboard") : "/"} className="flex items-center gap-3 text-white">
          <div className="h-10 w-10 overflow-hidden rounded-xl border border-cyan-300/20 bg-white p-1">
            <img src={adminLogo} alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
              Stego Shield
            </p>
            <p className="text-sm text-slate-300">Hide Secret Messages Inside Image</p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            item.isAnchor ? (
              <a
                key={item.href}
                href={isHomePage ? item.href : `/app${item.href}`}
                className="text-sm text-slate-300 transition hover:text-cyan-200"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm text-slate-300 transition hover:text-cyan-200"
              >
                {item.label}
              </Link>
            )
          ))}
          {isLoggedIn && (
            <Link
              to={user?.role === "admin" ? "/admin" : "/dashboard"}
              className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
            </Link>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm font-semibold text-teal-400 transition-colors hover:bg-teal-500/20"
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-xl border border-white/10 p-2 text-slate-200 md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-[#4c1d95]/20 bg-[#4c1d95] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              item.isAnchor ? (
                <a
                  key={item.href}
                  href={isHomePage ? item.href : `/app${item.href}`}
                  className="text-sm text-slate-300 transition hover:text-cyan-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm text-slate-300 transition hover:text-cyan-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
                )
              ))
            }
            {isLoggedIn && (
              <Link
                to={user?.role === "admin" ? "/admin" : "/dashboard"}
                className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                onClick={() => setIsOpen(false)}
              >
                {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/"
                className="flex items-center justify-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm font-semibold text-teal-400 transition-colors hover:bg-teal-500/20"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
