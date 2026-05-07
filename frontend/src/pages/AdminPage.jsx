import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import adminLogo from "../assets/admin_logo.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4002";

export default function AdminPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalUsers: 0,
    imagesEncoded: 0,
    failedAttempts: 0,
    users: [],
    recentActivity: []
  });

  const fetchStats = () => {
    fetch(`${API_BASE}/api/admin/stats`)
      .then(res => res.json())
      .then(stats => {
        setData(stats);
      })
      .catch(err => console.error("Error fetching stats:", err));
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const token = localStorage.getItem("token");

    if (!token || user?.role !== "admin") {
      navigate("/");
      return;
    }

    fetchStats();
  }, [navigate]);

  const handleDelete = async (username) => {
    if (!window.confirm(`Are you sure you want to delete ${username}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${username}`, { method: "DELETE" });
      if (res.ok) fetchStats();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleRoleChange = async (username, newRole) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${username}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) fetchStats();
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const stats = [
    {
      title: 'Total Users',
      value: data.totalUsers.toLocaleString(),
      icon: '👥',
    },
    {
      title: 'Images Encrypted',
      value: data.imagesEncoded.toLocaleString(),
      icon: '🖼️',
    },
    {
      title: 'Security Alerts',
      value: data.failedAttempts.toLocaleString(),
      icon: '🔐',
    },
    {
      title: 'System Status',
      value: 'Online',
      icon: '🟢',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-white">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img src={adminLogo} alt="Logo" className="h-16 w-16 object-contain drop-shadow-md" />
            <div>
              <h1 className="text-4xl font-bold text-purple-800">
                StegoShield Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor users and secret image activities
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button 
              onClick={() => navigate("/encode")}
              className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-2xl shadow-lg transition-all"
            >
              New Encoding
            </button>

            <button 
              onClick={handleLogout}
              className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-2xl shadow-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{item.title}</p>
                  <h2 className="text-3xl font-bold text-purple-800 mt-2">
                    {item.value}
                  </h2>
                </div>

                <div className="text-5xl">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - User Management */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-800">
                User Management
              </h2>

              <input
                type="text"
                placeholder="Search user..."
                className="border border-gray-300 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-400 text-xs uppercase font-black">
                    <th className="py-3 px-2">Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {data.users.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-purple-50 transition-all"
                    >
                      <td className="py-4 px-2 font-bold text-purple-900">{user.username}</td>
                      <td className="text-gray-600">{user.email}</td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.username !== 'admin' && (
                          <>
                            <button 
                              onClick={() => handleRoleChange(user.username, user.role === 'admin' ? 'user' : 'admin')}
                              className="text-xs font-bold text-violet-600 hover:underline"
                            >
                              {user.role === 'admin' ? 'Demote' : 'Make Admin'}
                            </button>
                            <button 
                              onClick={() => handleDelete(user.username)}
                              className="text-xs font-bold text-rose-600 hover:underline"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {user.username === 'admin' && (
                          <span className="text-xs text-gray-400 italic">Master Account</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                  {data.users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-gray-400">No users found in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-6">
              Dashboard Features
            </h2>

            <div className="space-y-4">
              <div className="bg-purple-100 p-4 rounded-2xl border-l-4 border-purple-600">
                <h3 className="font-bold text-purple-800">
                  Hide Secret Message
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Encrypt text inside images securely using AES-256.
                </p>
              </div>

              <div className="bg-pink-100 p-4 rounded-2xl border-l-4 border-pink-600">
                <h3 className="font-bold text-pink-700">
                  Decode Hidden Message
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Extract secret messages with a secure decryption key.
                </p>
              </div>

              <div className="bg-indigo-100 p-4 rounded-2xl border-l-4 border-indigo-600">
                <h3 className="font-bold text-indigo-700">
                  Share Encrypted Image
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Send secured images through cloud-generated links.
                </p>
              </div>

              <div className="bg-green-100 p-4 rounded-2xl border-l-4 border-green-600">
                <h3 className="font-bold text-green-700">
                  User Analytics
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Track active users and overall system health.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-500 text-sm font-medium">
          © 2026 StegoShield Secure Administrative Dashboard
        </div>
      </div>
    </div>
  );
}
