import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import EncodePage from "./pages/EncodePage";
import DecodePage from "./pages/DecodePage";

function App() {
  return (
    <Router>
      <div className="relative overflow-x-hidden min-h-screen">
        <div className="grid-overlay absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true" />
        <div
          className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-400/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <Routes>
          {/* Authentication */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<CreateAccountPage />} />
          
          {/* Main project website after login */}
          <Route path="/app" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/encode" element={<EncodePage />} />
          <Route path="/decode" element={<DecodePage />} />
          
          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
