import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaChevronDown, FaUserShield, FaBell } from "react-icons/fa";

// Import Auth Controllers & LocalStorage Helpers
import { signOut } from "../../controllers/auth.controller";
import { getUserDetailsInLocalStorage } from "../../helpers/userDetails";

export default function AdminNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Retrieve current logged-in user details from localStorage
  const user = getUserDetailsInLocalStorage();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Updated Logout Handler using auth.controller
  const handleLogout = () => {
    signOut(); // Clears cookies and localStorage
    navigate("/admin/login");
  };

  return (
    <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Title Area */}
      <div>
        <h2 className="font-serif font-bold text-lg text-[var(--color-text)]">
          Admin Portal
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
          <FaBell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full hover:bg-[var(--color-background)] transition-colors cursor-pointer"
          >
            {/* Profile Avatar with Active Status Badge */}
            <div className="relative">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                alt="Admin Profile"
                className="w-9 h-9 rounded-full object-cover border border-[var(--color-border)]"
              />
              {/* Active Status Indicator */}
              <span 
                className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" 
                title="Active Now"
              ></span>
            </div>

            {/* Dynamic User Text */}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-[var(--color-text)]">
                {user?.username || user?.name || "Admin Manager"}
              </p>
              <p className="text-[10px] text-[var(--color-text-secondary)] capitalize">
                {user?.role || "Administrator"}
              </p>
            </div>

            <FaChevronDown size={11} className="text-[var(--color-text-secondary)]" />
          </button>

          {/* Logout Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-[var(--color-border)]">
                <p className="text-xs font-bold text-[var(--color-text)] truncate">
                  {user?.username || "Administrator"}
                </p>
                <p className="text-[10px] text-[var(--color-text-secondary)] truncate">
                  {user?.email || "admin@kithula.com"}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active Session
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FaSignOutAlt size={13} />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}