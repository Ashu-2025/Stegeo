import { useNavigate } from "react-router-dom";
import { ShieldAlert, Users, Image as ImageIcon, Settings, LogOut, Activity, Globe } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import logo from "../assets/logo.png";

function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const goToWebsite = () => {
    navigate("/app");
  };

  const stats = [
    { name: "Total Users", value: "1,204", icon: Users, change: "+12%", changeType: "positive" },
    { name: "Images Encoded", value: "8,430", icon: ImageIcon, change: "+24%", changeType: "positive" },
    { name: "Failed Attempts", value: "24", icon: ShieldAlert, change: "-4%", changeType: "negative" },
    { name: "System Load", value: "34%", icon: Activity, change: "+2%", changeType: "neutral" },
  ];

  return (
    <>
      <Navbar />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="StegoShield Logo" className="h-12 w-12 rounded-lg object-cover shadow-lg shadow-violet-500/20" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-black">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-sm text-black">
                Overview of StegoShield system metrics and activity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={goToWebsite}
              className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-500/20"
            >
              <Globe className="h-4 w-4" />
              <span>Project Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-panel fade-in-up rounded-2xl p-6" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black/60">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-black">{stat.value}</p>
                </div>
                <div className="rounded-full bg-violet-500/10 p-3">
                  <stat.icon className="h-6 w-6 text-violet-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-emerald-600' : 
                  stat.changeType === 'negative' ? 'text-rose-600' : 'text-black/60'
                }`}>
                  {stat.change}
                </span>
                <span className="ml-2 text-sm text-black/40">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Table */}
        <div className="glass-panel fade-in-up delay-4 overflow-hidden rounded-2xl">
          <div className="border-b border-violet-500/10 p-6">
            <h2 className="text-lg font-semibold text-black">Recent Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-violet-50 text-black/60">
                <tr>
                  <th className="px-6 py-4 font-medium">Event</th>
                  <th className="px-6 py-4 font-medium">User / IP</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-100">
                {[
                  { event: "Image Encoded", user: "192.168.1.104", status: "Success", time: "2 mins ago" },
                  { event: "Admin Login", user: "admin", status: "Success", time: "15 mins ago" },
                  { event: "Image Decoded", user: "10.0.0.45", status: "Failed", time: "1 hour ago" },
                  { event: "New User Registered", user: "john_doe", status: "Success", time: "3 hours ago" },
                  { event: "System Backup", user: "System", status: "Success", time: "12 hours ago" },
                ].map((row, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-violet-50">
                    <td className="px-6 py-4 font-medium text-black">{row.event}</td>
                    <td className="px-6 py-4 text-black/80">{row.user}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-black/60">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
