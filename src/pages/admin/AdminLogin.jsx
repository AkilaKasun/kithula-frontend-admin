import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import { signIn } from "../../controllers/auth.controller";
import logo from "../../assets/kithula_logo.jpg";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your username/email and password.");
      return;
    }

    try {
      setLoading(true);

      // 1. Authenticate with backend and save tokens
      await signIn(identifier.trim(), password);

      // 2. Navigate to Dashboard cleanly after submit event
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.response?.data?.error ||
            err?.response?.data?.detail ||
            err?.message ||
            "Invalid credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      {/* LEFT SIDE: Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--color-primary-dark)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1200"
          alt="Highland Forest"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[var(--color-accent)] bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              Admin Governance
            </span>
          </div>

          <div className="space-y-4 max-w-lg">
            <h1 className="text-5xl font-serif font-light leading-tight">
              Pure Highland <br />
              <span className="italic font-serif text-[var(--color-accent)] font-normal">
                Craft & Management.
              </span>
            </h1>
            <p className="text-sm text-white/80 leading-relaxed font-light">
              Welcome to the Kithula Administrator Portal. Oversee inventory, manage product catalogs, and track orders across Sri Lanka.
            </p>
          </div>

          <div className="text-xs text-white/60 tracking-wider uppercase font-medium">
            © {new Date().getFullYear()} KITHULA. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-[var(--color-surface)] p-8 sm:p-10 rounded-3xl border border-[var(--color-border)] shadow-xl space-y-8">
          
          <div className="text-center space-y-3">
            <img
              src={logo}
              alt="Kithula Logo"
              className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-[var(--color-accent)] shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/150?text=KITHULA";
              }}
            />
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-primary)] tracking-wide">
                Admin Portal Login
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Enter your credentials to sign in
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3.5 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5 text-left">
              <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">
                Username or Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-[var(--color-text-secondary)]">
                  <FaUser size={14} />
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Username or admin@kithula.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-[var(--color-text-secondary)]">
                  <FaLock size={14} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-xs uppercase tracking-wider font-semibold rounded-full transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] disabled:opacity-60 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <FaArrowRight size={12} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}