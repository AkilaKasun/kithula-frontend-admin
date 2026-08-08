import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartLine, FaBoxOpen, FaShoppingBag, FaStore } from "react-icons/fa";

export default function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FaChartLine size={16} /> },
    { label: "Products", path: "/admin/products", icon: <FaBoxOpen size={16} /> },
    { label: "Orders", path: "/admin/orders", icon: <FaShoppingBag size={16} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold tracking-wider text-[var(--color-primary)]">
              KITHULA
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                isActive(item.path)
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Back to Live Store Link */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <FaStore size={14} />
          <span>View Live Shop</span>
        </Link>
      </div>
    </aside>
  );
}